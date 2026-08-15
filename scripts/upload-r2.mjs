// 零依赖 S3 上传脚本（AWS SigV4 签名），目标：Cloudflare R2 桶 goddb-media
// 用法：node scripts/upload-r2.mjs <本地文件> <对象key>
// 凭证读取自仓库根目录 .env.r2.local（R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY），勿硬编码
import { createHash, createHmac } from 'node:crypto'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ENDPOINT_HOST = '383b25c66f358e7b0fa040dfb1837e1d.r2.cloudflarestorage.com'
const BUCKET = 'goddb-media'
const REGION = 'auto'
const SERVICE = 's3'

function loadCredentials() {
  const file = join(process.cwd(), '.env.r2.local')
  if (!existsSync(file)) throw new Error('缺少凭证文件 .env.r2.local（R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY）')
  const kv = {}
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (!line || line.startsWith('#') || !line.includes('=')) continue
    const [k, ...rest] = line.split('=')
    kv[k.trim()] = rest.join('=').trim()
  }
  if (!kv.R2_ACCESS_KEY_ID || !kv.R2_SECRET_ACCESS_KEY) throw new Error('.env.r2.local 缺少 R2_ACCESS_KEY_ID 或 R2_SECRET_ACCESS_KEY')
  return kv
}

const creds = loadCredentials()

const sha256hex = (data) => createHash('sha256').update(data).digest('hex')
const hmac = (key, data) => createHmac('sha256', key).update(data).digest()
const signingKey = (dateStr) => ['AWS4' + creds.R2_SECRET_ACCESS_KEY, dateStr, REGION, SERVICE, 'aws4_request'].reduce(hmac)

async function putObject(key, filePath) {
  const body = readFileSync(filePath)
  const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '')
  const dateStr = amzDate.slice(0, 8)
  const payloadHash = sha256hex(body)
  const canonicalUri = '/' + [BUCKET, ...key.split('/')].map(encodeURIComponent).join('/')
  const signedHeaders = 'host;x-amz-content-sha256;x-amz-date'
  const canonicalHeaders = `host:${ENDPOINT_HOST}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`
  const canonicalRequest = ['PUT', canonicalUri, '', canonicalHeaders, signedHeaders, payloadHash].join('\n')
  const credentialScope = `${dateStr}/${REGION}/${SERVICE}/aws4_request`
  const stringToSign = ['AWS4-HMAC-SHA256', amzDate, credentialScope, sha256hex(canonicalRequest)].join('\n')
  const signature = hmac(signingKey(dateStr), stringToSign).toString('hex')
  const authorization = `AWS4-HMAC-SHA256 Credential=${creds.R2_ACCESS_KEY_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

  const res = await fetch(`https://${ENDPOINT_HOST}${canonicalUri}`, {
    method: 'PUT',
    headers: {
      'x-amz-content-sha256': payloadHash,
      'x-amz-date': amzDate,
      authorization,
      'content-type': 'image/png',
    },
    body,
  })
  return { key, status: res.status, etag: res.headers.get('etag') }
}

const [fileArg, keyArg] = process.argv.slice(2)

async function main() {
  if (!fileArg || !keyArg) {
    console.error('用法：node scripts/upload-r2.mjs <本地文件路径> <对象key>')
    console.error('示例：node scripts/upload-r2.mjs ./screenshot.png images/essays/demo/screenshot.png')
    process.exit(2)
  }
  const { status, etag } = await putObject(keyArg, fileArg)
  const ok = status >= 200 && status < 300
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${status}  ${keyArg}  ${etag ?? ''}`)
  process.exit(ok ? 0 : 1)
}

main().catch((err) => { console.error(err.message); process.exit(1) })
