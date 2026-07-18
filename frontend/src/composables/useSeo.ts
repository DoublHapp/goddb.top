import { watchEffect, type MaybeRefOrGetter, toValue } from 'vue'
import { useLocale } from './useLocale'

const siteUrl = 'https://goddb.top'

const setMeta = (selector: string, attribute: string, value: string) => {
  const element = document.head.querySelector<HTMLMetaElement>(selector)
  if (element) element.setAttribute(attribute, value)
}

export function useSeo(title: MaybeRefOrGetter<string>, description: MaybeRefOrGetter<string>, path: MaybeRefOrGetter<string>) {
  const { locale } = useLocale()

  watchEffect(() => {
    const currentTitle = `${toValue(title)} · DoublHapp`
    const currentDescription = toValue(description)
    const canonical = `${siteUrl}${toValue(path)}`
    document.title = currentTitle
    document.documentElement.lang = locale.value
    setMeta('meta[name="description"]', 'content', currentDescription)
    setMeta('meta[property="og:title"]', 'content', currentTitle)
    setMeta('meta[property="og:description"]', 'content', currentDescription)
    setMeta('meta[property="og:url"]', 'content', canonical)
    setMeta('meta[name="twitter:title"]', 'content', currentTitle)
    setMeta('meta[name="twitter:description"]', 'content', currentDescription)
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', canonical)
  })
}
