# JavaScript 学习笔记（完整存档）

这份笔记整理 JavaScript 语言基础、浏览器 API、作用域与内存、对象模型以及常见工程技巧。示例默认运行在现代浏览器或支持相应语法的 JavaScript 环境中。

## 一、语言与运行环境

### JavaScript 的组成

前端语境中的 JavaScript 通常分为三部分：

- **ECMAScript**：定义语法、类型、对象、函数、模块等语言标准。
- **DOM**：文档对象模型，用于读取和修改 HTML 文档。
- **BOM**：浏览器对象模型，包括 `window`、`location`、`history`、`navigator` 等浏览器能力。

ECMAScript 不等于完整的浏览器 JavaScript。Node.js 同样实现 ECMAScript，但它没有浏览器提供的 DOM。

### 展开语法

展开语法 `...` 可以展开可迭代对象，也可以把对象自身的可枚举属性复制到新对象中。

```javascript
const numbers = [1, 2, 3]
const moreNumbers = [...numbers, 4]

const user = { name: 'DB', profile: { level: 1 } }
const copiedUser = { ...user }

console.log(moreNumbers)
console.log(copiedUser)
```

数组和对象展开都只完成**浅拷贝**。上例中的 `copiedUser.profile` 与 `user.profile` 仍指向同一个对象。

展开语法与 `Function.prototype.apply()` 都能把一组值作为参数传给函数，但现代代码通常优先使用展开语法：

```javascript
const values = [3, 8, 5]

Math.max(...values)
Math.max.apply(null, values)
```

## 二、DOM 查询与文本

### `document.querySelector()`

`document.querySelector()` 接收 CSS 选择器字符串，返回文档中第一个匹配的元素；没有匹配项时返回 `null`。

```javascript
document.querySelector('div')
document.querySelector('.card')
document.querySelector('#main')
document.querySelector('input[type="text"]')
document.querySelector('section > .card:first-child')
```

需要获取所有匹配元素时使用 `document.querySelectorAll()`，它返回静态的 `NodeList`。

```javascript
const cards = document.querySelectorAll('.card')

cards.forEach((card) => {
  card.classList.add('ready')
})
```

不存在通用的 `getElement()` 方法。传统查询 API 包括 `getElementById()`、`getElementsByClassName()` 和 `getElementsByTagName()`。其中后两者返回动态的 `HTMLCollection`，行为与 `querySelectorAll()` 不完全相同。

### `textContent` 与 `innerText`

二者都能读取或设置文本，但观察角度不同：

| 特性 | `textContent` | `innerText` |
|---|---|---|
| 内容依据 | DOM 树中的文本 | 渲染后的可见文本 |
| 是否考虑 CSS | 否 | 是 |
| 隐藏内容 | 通常包含 | 通常不包含 |
| `<script>`、`<style>` 文本 | 包含 | 通常不包含 |
| 布局计算 | 通常不需要 | 读取时可能触发布局计算 |

```javascript
const box = document.querySelector('.box')

if (box) {
  box.textContent = '纯文本内容'
  console.log(box.innerText)
}
```

设置普通文本时通常优先使用 `textContent`。它不会把字符串解析成 HTML，也因此比直接写入 `innerHTML` 更适合承载不可信文本。

## 三、事件系统

### 事件流

DOM 事件传播包含三个阶段：

1. **捕获阶段**：事件从 `window` 向目标元素传播。
2. **目标阶段**：事件到达目标元素。
3. **冒泡阶段**：事件从目标元素向祖先节点传播。

`addEventListener()` 默认在冒泡阶段调用监听器。第三个参数既可以是布尔值，也可以是选项对象。

```javascript
const parent = document.querySelector('.parent')
const child = document.querySelector('.child')

parent?.addEventListener('click', () => {
  console.log('父元素捕获')
}, { capture: true })

child?.addEventListener('click', () => {
  console.log('目标元素')
})

parent?.addEventListener('click', () => {
  console.log('父元素冒泡')
})
```

点击子元素时，通常依次输出父元素捕获、目标元素、父元素冒泡。

- `event.stopPropagation()` 阻止事件继续沿传播路径传递。
- `event.stopImmediatePropagation()` 还会阻止当前元素上尚未执行的同类监听器。
- `event.preventDefault()` 阻止默认行为，不等于阻止传播。

### 事件监听的三种方式

#### HTML 事件属性

```html
<button onclick="alert('点击了')">按钮</button>
```

这种方式让结构与行为耦合，不适合现代项目。

#### DOM 事件属性

```javascript
const button = document.querySelector('button')

button.onclick = function () {
  alert('点击了')
}
```

同一事件属性只能保存一个处理函数，后续赋值会覆盖之前的函数。

#### `addEventListener()`

```javascript
const button = document.querySelector('button')

button?.addEventListener('click', () => {
  alert('点击了')
})
```

它支持多个监听器、捕获阶段、一次性监听和被动监听，是现代开发的标准方式。

### 事件解绑

DOM 事件属性可以通过赋值 `null` 解绑：

```javascript
const button = document.querySelector('button')

button.onclick = handleClick
button.onclick = null

function handleClick() {
  alert('点击')
}
```

使用 `addEventListener()` 注册的监听器，应通过 `removeEventListener()` 移除。事件类型、函数引用和 `capture` 值必须与注册时一致。

```javascript
const button = document.querySelector('button')

button?.addEventListener('click', handleClick)
button?.removeEventListener('click', handleClick)

function handleClick() {
  alert('点击')
}
```

注册和移除时分别创建两个外观相同的匿名函数并不能解绑，因为它们是不同的函数对象。

需要集中管理多个监听器时，可以使用 `AbortController`：

```javascript
const controller = new AbortController()

window.addEventListener('resize', handleResize, {
  signal: controller.signal,
})

controller.abort()

function handleResize() {
  console.log(window.innerWidth)
}
```

### `mouseover` 与 `mouseenter`

| 事件 | 是否冒泡 | 进入后代元素时父元素是否可能再次触发 |
|---|---|---|
| `mouseover` | 是 | 是 |
| `mouseenter` | 否 | 否 |

`mouseover` 适合依赖冒泡的交互；只关心指针是否进入元素整体区域时，`mouseenter` 往往更直接。对应的移出事件分别是 `mouseout` 和 `mouseleave`。

### 事件委托

事件委托把监听器绑定到共同祖先上，再利用事件冒泡判断实际目标。它适合大量子元素或动态列表。

```html
<ul id="list">
  <li><button data-action="select">苹果</button></li>
  <li><button data-action="select">香蕉</button></li>
</ul>
```

```javascript
const list = document.querySelector('#list')

list?.addEventListener('click', (event) => {
  const target = event.target

  if (!(target instanceof Element)) return

  const button = target.closest('[data-action="select"]')

  if (!button || !list.contains(button)) return

  console.log(button.textContent)
})
```

使用 `closest()` 比只比较 `event.target.tagName` 更稳健，因为点击按钮内部元素时，`event.target` 不一定就是按钮本身。

并非所有事件都会冒泡。例如 `focus` 和 `blur` 不冒泡；需要委托焦点事件时，可以使用会冒泡的 `focusin` 和 `focusout`。

### `load` 与 `DOMContentLoaded`

| 事件 | 触发条件 | 常见用途 |
|---|---|---|
| `DOMContentLoaded` | HTML 已解析，延迟脚本已执行 | 初始化 DOM 交互 |
| `window` 的 `load` | 页面及图片、样式、iframe 等依赖资源已加载 | 读取依赖完整资源的尺寸或状态 |

```javascript
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM 已就绪')
})

window.addEventListener('load', () => {
  console.log('页面资源已就绪')
})
```

使用 `defer` 的经典脚本或默认延迟执行的模块脚本时，通常无需再等待 `DOMContentLoaded` 才能访问文档中位于脚本之前的元素。

## 四、盒模型与尺寸

### 标准盒模型与 `border-box`

默认的 `box-sizing: content-box` 中，声明的 `width` 和 `height` 只表示内容区。元素占用的边框盒宽度还要加上左右内边距和边框。

```css
.content-box {
  box-sizing: content-box;
  width: 200px;
  padding: 10px;
  border: 5px solid;
}
```

该元素的边框盒宽度为 `230px`。

`box-sizing: border-box` 中，声明的宽高包含内容区、内边距和边框。

```css
.border-box {
  box-sizing: border-box;
  width: 200px;
  padding: 10px;
  border: 5px solid;
}
```

该元素的边框盒宽度为 `200px`。`border-box` 常被俗称为“IE 盒模型”，但它是现代 CSS 中正式且常用的盒模型选择，并不等同于让页面进入浏览器怪异模式。

### `clientWidth` 与 `offsetWidth`

| 属性 | 通常包含 | 不包含 |
|---|---|---|
| `clientWidth` | 内容区、内边距 | 边框、外边距、垂直滚动条 |
| `offsetWidth` | 内容区、内边距、边框、垂直滚动条 | 外边距 |

两者返回整数 CSS 像素。若需要带小数的实际几何位置和尺寸，可以使用 `getBoundingClientRect()`。

```javascript
const box = document.querySelector('.box')

if (box instanceof HTMLElement) {
  console.log(box.clientWidth)
  console.log(box.offsetWidth)
  console.log(box.getBoundingClientRect().width)
}
```

## 五、作用域、闭包与提升

### 作用域链

JavaScript 使用词法作用域。函数能访问哪些外部变量，取决于函数**定义的位置**，而不是调用的位置。

查找标识符时，引擎先检查当前词法环境，再逐层检查外层环境，直到全局环境。找不到时会抛出 `ReferenceError`。

```javascript
let value = 1

function outer() {
  let value = 2

  function inner() {
    value = 3
    console.log(value)
  }

  inner()
}

outer()
console.log(value)
```

依次输出 `3` 和 `1`。`inner()` 修改的是离它最近的 `outer()` 局部变量。

块级作用域由 `{}` 配合 `let`、`const` 或 `class` 等声明形成。`var` 不受普通块级作用域限制，而是属于函数作用域或全局作用域。

### 闭包

闭包是函数与其定义时词法环境的组合。只要函数仍可被访问，它就可以继续访问创建时捕获的变量。

```javascript
function createCounter() {
  let count = 0

  return function () {
    count += 1
    return count
  }
}

const counter = createCounter()

console.log(counter())
console.log(counter())
```

闭包常用于：

- 保存跨调用状态。
- 封装不希望直接暴露的数据。
- 为回调捕获上下文。
- 构造工厂函数和高阶函数。

闭包本身不是内存泄漏。只有当仍可达的闭包无意中长期持有不再需要的大对象、DOM 节点或其他资源时，才可能造成额外内存占用。解决问题的关键是移除无用监听器、定时器和引用，而不是回避闭包。

### 变量提升与暂时性死区

“提升”是理解声明实例化过程的一种便捷说法，并不表示源码真的被移动。

- `var` 声明在作用域初始化时创建并赋值为 `undefined`。
- `let`、`const` 和 `class` 声明也在进入作用域时建立绑定，但初始化前处于暂时性死区，访问会抛出 `ReferenceError`。
- 函数声明通常在作用域初始化阶段就完成绑定，因此可以在声明位置之前调用。
- 函数表达式遵循承载它的变量声明规则。

```javascript
console.log(total)
var total = 10
```

第一行输出 `undefined`。

```javascript
greet()

function greet() {
  console.log('hello')
}
```

函数声明可以提前调用。

```javascript
run()

var run = function () {
  console.log('running')
}
```

调用时 `run` 的值还是 `undefined`，因此抛出 `TypeError`。

同一作用域中，函数声明和 `var` 声明同名时，函数绑定会在声明实例化后保留下来，但运行阶段的赋值仍会覆盖它：

```javascript
var action = 10

function action() {
  console.log('action')
}

action()
```

执行到调用处之前，`action = 10` 已经发生，因此 `action()` 抛出 `TypeError`。为了避免这类歧义，应避免同名声明并坚持先声明后使用。

## 六、内存与垃圾回收

### 可达性

JavaScript 引擎自动管理内存。现代垃圾回收器主要根据**可达性**判断对象是否仍需保留：从根集合出发还能访问到的对象是可达对象，无法访问到的对象可以被回收。

常见根包括当前执行栈、全局对象以及宿主环境持有的引用。对象互相引用并不会自动造成泄漏；只要整个对象群无法从根访问，追踪式垃圾回收器就能回收它们。

### 常见算法

- **标记—清除**：从根开始标记可达对象，再回收未标记对象。
- **标记—整理**：标记后移动存活对象，减少内存碎片。
- **复制算法**：把存活对象复制到另一块区域，适合回收存活率低的区域。
- **分代回收**：根据对象生命周期划分代际，对新对象进行更频繁的回收。
- **增量、并发和并行回收**：把工作拆分或分配到其他线程，降低长时间停顿。

V8 的具体实现会随版本演进，不宜简单概括为“新生代只使用某一种算法、老生代只使用某两种算法”。稳定的理解是：现代引擎会组合多种策略，在吞吐量、延迟和内存占用之间权衡。

### 引用计数的缺陷

纯引用计数无法处理不可达的循环引用：

```javascript
function createCycle() {
  const first = {}
  const second = {}

  first.other = second
  second.other = first
}

createCycle()
```

函数结束后，这两个对象彼此仍有引用，但外部已经无法访问它们。纯引用计数看到的计数不为零；现代追踪式垃圾回收则能确认整个对象群不可达并将其回收。

### 常见内存问题

- 不断增长且没有淘汰策略的全局缓存。
- 未清理的定时器、订阅和事件监听器。
- 已移除 DOM 节点仍被 JavaScript 变量持有。
- 闭包意外捕获并长期保留大对象。
- 对象池、队列或集合只增加不删除。

把局部变量赋值为 `null` 并不保证立即回收，也不应机械地用于所有变量。更重要的是让不再需要的对象真正变为不可达，并正确释放宿主资源。

## 七、函数参数与 `this`

### `arguments` 与剩余参数

普通的非箭头函数拥有自己的 `arguments` 类数组对象，它包含调用时传入的全部实参。

```javascript
function inspect(a, b) {
  console.log(arguments[0])
  console.log(arguments.length)
}

inspect(1, 2, 3)
```

箭头函数没有自己的 `arguments`；在箭头函数中读取该名称时，可能沿作用域链取得外层函数的 `arguments`，也可能因不存在绑定而报错。因此不应把它理解成箭头函数中绝对“不能出现”这个标识符。

剩余参数会生成真正的数组，并且可以只收集尚未被前面形参接收的实参：

```javascript
function inspect(first, ...rest) {
  console.log(first)
  console.log(rest)
}

inspect(1, 2, 3)
```

| 特性 | `arguments` | 剩余参数 |
|---|---|---|
| 数据类型 | 类数组对象 | 数组 |
| 收集范围 | 全部实参 | 对应位置起的剩余实参 |
| 箭头函数自身是否提供 | 否 | 支持 |
| 数组方法 | 需先转换或借用 | 直接使用 |

现代代码通常优先使用剩余参数。它并不自动提供“类型安全”；类型约束需要 TypeScript、运行时校验或其他机制。

```javascript
function sum(...values) {
  return values.reduce((total, value) => total + value, 0)
}
```

### 普通函数与箭头函数的 `this`

普通函数的 `this` 通常由调用方式决定：

```javascript
const user = {
  name: 'DB',
  getName() {
    return this.name
  },
}

console.log(user.getName())
```

箭头函数没有自己的 `this`，它从定义位置的外层词法环境取得 `this`。`call()`、`apply()` 和 `bind()` 不能为箭头函数重新绑定 `this`。

```javascript
const user = {
  name: 'DB',
  getName: () => this.name,
}
```

这里的箭头函数不会因为作为 `user.getName()` 调用就获得 `user`。在 ES 模块顶层，`this` 是 `undefined`；在不同脚本环境中，外层 `this` 也可能不同，所以不应笼统断言结果总是 `window` 或总是 `undefined`。

箭头函数还没有自己的 `arguments`、`super` 和 `new.target`，也不能作为构造函数通过 `new` 调用。对象方法、原型方法和需要动态接收者的函数通常使用普通函数；需要保留外层 `this` 的回调适合使用箭头函数。

## 八、原型与继承

### 原型

每个对象都有内部槽 `[[Prototype]]`，它的值是另一个对象或 `null`。推荐用 `Object.getPrototypeOf()` 和 `Object.setPrototypeOf()` 观察或设置原型，而不是依赖历史访问器 `__proto__`。

可构造的普通函数通常拥有 `prototype` 属性。通过 `new Constructor()` 创建实例时，实例的 `[[Prototype]]` 会指向 `Constructor.prototype`。

```javascript
function Person(name) {
  this.name = name
}

Person.prototype.sayHello = function () {
  return `你好，我是${this.name}`
}

const person = new Person('DB')

console.log(person.sayHello())
console.log(Object.getPrototypeOf(person) === Person.prototype)
```

并非每个函数都有可用于构造的 `prototype` 属性。例如箭头函数不可构造，也没有普通构造函数那样的 `prototype`。

### 原型链与属性查找

读取对象属性时，引擎先检查对象自身；若未找到，再沿 `[[Prototype]]` 逐层查找，直到 `null`。这条路径就是原型链。

```text
person → Person.prototype → Object.prototype → null
```

“原型是对象的模板”是一种入门类比，但更准确的表述是：原型是属性查找时的委托对象。实例创建后，修改构造函数原型对象上的方法，实例通常能立即读取到新方法，因为它们共享同一条查找路径。

### 组合式原型继承

构造函数继承通常分为两部分：借用父构造函数初始化实例属性，并把子构造函数的原型连接到父构造函数的原型。

```javascript
function Person(name, age) {
  this.name = name
  this.age = age
}

Person.prototype.sayHello = function () {
  return `你好，我是${this.name}，今年${this.age}岁`
}

function Developer(name, age, language) {
  Person.call(this, name, age)
  this.language = language
}

Developer.prototype = Object.create(Person.prototype)
Object.defineProperty(Developer.prototype, 'constructor', {
  value: Developer,
  writable: true,
  configurable: true,
})

Developer.prototype.saySkill = function () {
  return `主要使用${this.language}`
}

const developer = new Developer('DB', 18, 'JavaScript')

console.log(developer.sayHello())
console.log(developer.saySkill())
```

这里的实例原型链为：

```text
developer → Developer.prototype → Person.prototype → Object.prototype → null
```

### `class` 继承

`class` 提供了更清晰的语法，但实例方法仍通过原型共享。

```javascript
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }

  sayHello() {
    return `你好，我是${this.name}，今年${this.age}岁`
  }
}

class Developer extends Person {
  constructor(name, age, language) {
    super(name, age)
    this.language = language
  }

  saySkill() {
    return `主要使用${this.language}`
  }
}

const developer = new Developer('DB', 18, 'JavaScript')

console.log(developer.sayHello())
console.log(developer.saySkill())
```

派生类构造函数必须在访问 `this` 前调用 `super()`。类并不只是原型写法的文本替换：它还具有严格模式、不可直接调用、方法不可枚举等明确语义。

## 九、浅拷贝与深拷贝

### 浅拷贝

浅拷贝创建新的外层容器，但嵌套对象仍共享引用。

```javascript
const source = {
  name: 'DB',
  profile: { level: 1 },
}

const copy = { ...source }

copy.name = 'New DB'
copy.profile.level = 2

console.log(source.name)
console.log(source.profile.level)
```

常见浅拷贝方式包括：

- 对象展开 `{ ...source }`。
- `Object.assign({}, source)`。
- 数组展开 `[...source]`。
- 数组的 `slice()`、`concat()`。

这些方法在属性描述符、原型、访问器和稀疏数组等细节上并不完全等价，不能简单理解为复制所有对象语义。

### 深拷贝

深拷贝需要为对象图中的嵌套数据建立独立副本，但“所有值都能彻底复制”并不是一个普遍成立的承诺。函数、DOM 节点、弱集合和宿主对象等类型可能无法按预期复制。

现代环境优先考虑 `structuredClone()`：

```javascript
const source = {
  createdAt: new Date(),
  tags: new Set(['JavaScript']),
  profile: { level: 1 },
}

const copy = structuredClone(source)

copy.profile.level = 2

console.log(source.profile.level)
```

它支持循环引用以及多种内建类型，但不能克隆函数，并可能抛出 `DataCloneError`。

`JSON.parse(JSON.stringify(value))` 只适合明确可 JSON 序列化的数据。它会丢失或改变 `undefined`、函数、`Symbol`、`Date`、`Map`、`Set`、`BigInt`、非有限数字和循环引用等内容，因此不应作为通用深拷贝方案。

手写递归函数若只区分数组和普通对象，还会遗漏循环引用、原型、属性描述符、符号键以及大量内建类型。实际项目应先定义需要支持的数据边界，再选择实现。

## 十、防抖与节流

### 防抖

防抖会在连续触发停止一段时间后执行。等待期间再次触发会重新计时。

```javascript
function debounce(fn, delay) {
  let timerId

  return function (...args) {
    const context = this

    clearTimeout(timerId)

    timerId = setTimeout(() => {
      fn.apply(context, args)
    }, delay)
  }
}
```

适合搜索联想、输入校验和窗口尺寸变化后的计算。这个基础版本只实现尾沿调用，没有提供立即执行、取消和刷新能力。

### 节流

节流限制函数在给定时间窗口内最多执行一次。

```javascript
function throttle(fn, interval) {
  let lastTime = 0

  return function (...args) {
    const now = Date.now()

    if (now - lastTime < interval) return

    lastTime = now
    fn.apply(this, args)
  }
}
```

适合滚动、指针移动和拖拽等持续触发的事件。这个基础版本只实现前沿调用，时间窗口末尾的最后一次触发可能不会执行。

| 对比项 | 防抖 | 节流 |
|---|---|---|
| 核心目标 | 等待触发停止 | 限制执行频率 |
| 连续触发结果 | 通常只执行最后一次 | 按间隔持续执行 |
| 常见场景 | 搜索、校验、自动保存 | 滚动、拖拽、进度更新 |

生产代码还应根据需求明确前沿、尾沿、取消、刷新、异常处理和组件卸载清理等行为。

## 十一、严格模式

严格模式由 ECMAScript 5 引入。经典脚本或函数可以通过指令启用：

```javascript
'use strict'

function run() {
  return this
}
```

ES 模块和 `class` 主体默认使用严格模式，无需额外声明。

严格模式的重要差异包括：

- 给未声明标识符赋值会抛出 `ReferenceError`，而不是隐式创建全局属性。
- 普通函数直接调用时，`this` 保持 `undefined`，不会自动替换为全局对象。
- 禁止 `with` 语句。
- 禁止删除普通标识符等无效操作。
- 禁止旧式前导零八进制字面量，现代八进制写法是 `0o10`。
- 函数参数名不能重复。
- `eval` 中声明的变量不会泄漏到外围作用域。
- 某些原本静默失败的赋值会抛出错误。
- 绑定参数与 `arguments` 对应项不会发生旧式联动。

非严格模式下直接调用函数时，`this` 是否为 `window` 只适用于浏览器经典脚本等特定环境；Node.js、ES 模块和其他宿主环境不能套用这一结论。

现代项目通常通过 ES 模块自然获得严格模式。严格模式主要改善错误可见性和语义一致性，但不应笼统宣称它必然提高执行性能。

## 总结

- ECMAScript 定义语言，DOM 和 BOM 由浏览器环境提供。
- DOM 事件包含捕获、目标和冒泡阶段，事件委托依赖可冒泡事件。
- JavaScript 使用词法作用域，闭包保存的是函数可访问的词法环境。
- 现代垃圾回收关注可达性，循环引用本身不等于内存泄漏。
- 普通函数动态接收 `this`，箭头函数从外层捕获 `this`。
- JavaScript 的继承建立在对象的原型委托链上，`class` 提供了更严格、清晰的语法。
- 展开语法只做浅拷贝，通用深拷贝需要明确数据类型边界。
- 防抖等待操作停止，节流限制持续操作的执行频率。
- ES 模块与类默认处于严格模式，现代代码应避免依赖宽松模式的历史行为。
