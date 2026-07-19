# 1.创建Vue实例

## Vue 3 创建实例

在 Vue 3 中，使用 `createApp` 函数创建应用实例：

```javascript
import { createApp } from 'vue'
import App from './App.vue'

// 创建 Vue 实例
const app = createApp(App)

// 挂载到 DOM
app.mount('#app')
```

## Vue 3 实例的功能

Vue 3 应用实例提供多种方法：

1. **挂载应用**：`app.mount('#app')`
2. **注册全局组件**：`app.component('MyComponent', Component)`
3. **注册全局指令**：`app.directive('focus', {...})`
4. **使用插件**：`app.use(plugin)`
5. **提供全局属性**：`app.provide('key', value)`
6. **配置全局选项**：`app.config.errorHandler = (err) => {...}`

# 2.插值表达式

插值表达式是 Vue 模板中最基础的数据绑定形式，使用双大括号语法 `{{ }}` 将数据渲染到模板中。

## 基本语法

```javascript
<div>{{ expression }}</div>
```

这里的 `expression` 是一个有效的 JavaScript 表达式。

## 详细特性

### 1. 支持的表达式类型

插值表达式可以包含各种 JavaScript 表达式：

```javascript
<!-- 变量引用 -->
<div>{{ message }}</div>

<!-- 数学运算 -->
<div>{{ count + 1 }}</div>

<!-- 三元表达式 -->
<div>{{ isActive ? '激活' : '未激活' }}</div>

<!-- 方法调用 -->
<div>{{ message.split('').reverse().join('') }}</div>

<!-- 访问对象属性 -->
<div>{{ user.name }}</div>

<!-- 数组元素 -->
<div>{{ items[0].text }}</div>
```

### 2. 仅限单个表达式

插值只能包含**单个表达式**，不支持语句或复杂逻辑：

```javascript
<!-- 正确 ✓ -->
<div>{{ isActive ? '激活' : '未激活' }}</div>

<!-- 错误 ✗ - 这是语句，不是表达式 -->
<div>{{ if (isActive) { return '激活' } }}</div>
```



### 3. 输出会被转义

插值表达式中的内容会被自动转义，防止 XSS 攻击：

```javascript
<div>{{ "<script>alert('XSS')</script>" }}</div>
<!-- 实际输出: &lt;script&gt;alert('XSS')&lt;/script&gt; -->
```



### 4. 动态更新

当响应式数据变化时，插值内容会自动更新：

```javascript
<template>
  <div>{{ count }}</div>
  <button @click="count++">增加</button>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>
```

点击按钮时，`count` 增加，插值内容自动更新。

## 常见用法与案例

### 1. 文本插值

```javascript
<p>欢迎，{{ username }}！</p>
```

### 2. 属性拼接

```javascript
<p>你的得分是 {{ score }}/{{ totalScore }}</p>
```

### 3. 条件格式化

```javascript
<p>状态：{{ status === 'active' ? '活跃' : '离线' }}</p>
```

### 4. 数据处理

```javascript
<p>价格：{{ (price * discount).toFixed(2) }} 元</p>
```

## 与其他指令的对比

- **v-text**：功能类似插值，但会替换整个元素内容

  ```javascript
  <span v-text="message"></span>
  <!-- 等同于 -->
  <span>{{ message }}</span>
  ```

- **v-html**：输出真实 HTML，但有安全风险

  ```javascript
  <div v-html="htmlContent"></div>
  ```

- **v-bind**：用于绑定 HTML 属性，而不是内容

  ```javascript
  <img :src="imageUrl" alt="图片">
  ```

## 注意事项

1. **仅在文本内容中使用**：插值不能用在 HTML 属性中，要用 `v-bind`

2. 一次性绑定:使用`v-once`可以实现一次性插值，数据变化不会更新:

   ```javascript
   <span v-once>{{ message }}</span>
   ```

3. **性能考虑**：复杂表达式应移至计算属性或方法中

# 3.指令

Vue 指令是带有 `v-` 前缀的特殊属性，能赋予 HTML 元素特殊行为。以下是 Vue 中的主要指令分类：

## 1. 基础指令

### v-text

替换元素的文本内容，等同于文本插值 `{{ }}`。

### v-html

更新元素的 innerHTML，用于渲染 HTML 内容。

**安全警告：** 容易导致 XSS 攻击，不要用于用户提供的内容。

### v-show

根据表达式的真假值，切换元素的 CSS `display` 属性。

元素始终渲染在 DOM 中，只是切换显示状态，适用于频繁切换的场景。

### v-if / v-else-if / v-else

条件性渲染元素，会根据条件完全销毁或重建元素。

与 `v-show` 不同，元素会从 DOM 中移除，适合不经常变化的条件。

### v-for

基于数组或对象渲染列表，需要提供唯一的 `key` 属性。

还可以遍历对象属性。

## 2. 表单绑定指令

### v-model

在表单元素上创建双向数据绑定，自动选择正确的方法来更新元素。

**修饰符：**

- ```
  .lazy
  ```

  : 在 change 事件后同步，而非 input 事件

- ```
  .number
  ```

  : 自动将输入转为数值类型

- ```
  .trim
  ```

  : 自动去除首尾空格

## 3. 事件处理指令

### v-on (简写 @)

绑定事件监听器，可以接收方法名或内联语句。

**修饰符：**

- ```
  .stop
  ```

  : 阻止事件冒泡

- ```
  .prevent
  ```

  : 阻止默认行为

- ```
  .capture
  ```

  : 使用事件捕获模式

- ```
  .self
  ```

  : 只当事件在该元素本身触发时才触发回调

- ```
  .once
  ```

  : 事件只触发一次

- ```
  .passive
  ```

  : 以`{ passive: true }`模式添加监听器

**按键修饰符：**

```javascript
<input @keyup.enter="submit">
<input @keyup.esc="cancel">
```



## 4. 属性绑定指令

### v-bind (简写 :)

动态绑定 HTML 属性、组件 props 或 CSS 类。

**特殊用法：**

- 绑定 Class
- 绑定 Style

## 5. 其他重要指令

### v-slot (简写 #)

指定具名插槽或接收作用域插槽的 prop。

### v-pre

跳过元素及其子元素的编译过程，用于显示原始 Mustache 标签。

### v-cloak

保持在元素上直到关联组件实例编译结束，配合 CSS 规则使用。

### v-once

只渲染元素和组件一次，后续更新将被忽略。

### v-memo

缓存部分模板，仅当依赖值变化时才重新渲染（Vue 3.2+）。

## 6. 自定义指令

除了内置指令，Vue 还允许开发者注册自定义指令：

### 全局注册

```javascript
// Vue 3
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})
```

### 局部注册

```javascript
<script setup>
// 在组件中定义
const vFocus = {
  mounted(el) {
    el.focus()
  }
}
</script>

<template>
  <input v-focus>
</template>
```

### 指令钩子函数

Vue 3 中的自定义指令有以下钩子：

- `created`: 元素的属性或事件监听器被应用之前调用
- `beforeMount`: 指令第一次绑定到元素时调用
- `mounted`: 元素被插入父 DOM 时调用
- `beforeUpdate`: 元素更新前调用
- `updated`: 元素更新后调用
- `beforeUnmount`: 元素卸载前调用
- `unmounted`: 元素卸载后调用

# 4. v-html

`v-html` 是 Vue 中的一个内置指令，用于更新元素的 `innerHTML`。与普通的文本插值 `{{ }}` 不同，`v-html` 能够渲染 HTML 标签，而不是将其作为纯文本显示。

## 基本语法

```javascript
<div v-html="htmlContent"></div>
```

其中 `htmlContent` 是一个包含 HTML 代码的字符串变量。

## 工作原理

1. **解析内容**：Vue 将绑定的字符串作为 HTML 代码解析
2. **替换内容**：用解析后的 HTML 替换元素的 `innerHTML` 属性
3. **响应式更新**：当数据变化时，元素内容会相应更新

## 示例用法

### 简单示例

```javascript
<template>
  <div v-html="message"></div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('<span style="color: red">这是红色文本</span>')
</script>
```

这会渲染出一个红色的文本，而不是显示原始的 HTML 标签。

## 安全警告

### XSS 风险

**使用 `v-html` 有潜在的安全风险**，特别是用于显示用户生成的内容时。恶意用户可能注入 JavaScript 代码，导致 XSS（跨站脚本）攻击。

示例风险：

```javascript
// 用户提供的恶意内容
const userInput = '<img src="x" onerror="alert(\'XSS攻击\')">'

// 如果直接使用 v-html 渲染，将会执行恶意代码
```

### 安全使用建议

1. **永远不要** 使用 `v-html` 显示不可信的内容（如用户输入）
2. 对必须使用 `v-html` 的内容进行严格的 HTML 净化处理
3. 考虑使用专门的 HTML 净化库，如 DOMPurify

## 实际应用场景

### 1. 富文本编辑器内容展示

当使用富文本编辑器（如 TinyMCE、CKEditor）时，编辑器通常会生成 HTML 内容，需要使用 `v-html` 正确显示。

### 2. 后端 API 返回的格式化内容

后端可能返回已经格式化的 HTML 内容，如邮件正文、通知消息等。

### 3. Markdown 渲染（结合 Markdown 解析库）

## 注意事项

1. **作用域限制**：`v-html` 渲染的内容不在 Vue 模板作用域内，不能包含 Vue 指令
2. **样式隔离**：在使用 Scoped CSS 的组件中，`v-html` 内的元素不会受到组件样式的影响
3. **动态组件**：如果需要动态渲染 Vue 组件，应使用动态组件（`<component :is="...">`）而非 `v-html`
4. **渲染性能**：频繁更新大量 HTML 内容可能影响性能

## 总结

`v-html` 是一个强大的指令，可以渲染 HTML 内容，但必须谨慎使用以避免安全风险。它最适合用于显示可信来源的 HTML 内容，如 CMS 系统、内部管理界面或经过严格过滤的用户生成内容。



# 5.v-if和v-show

Vue 提供了两种方式来控制元素的显示与隐藏：`v-if` 和 `v-show`。虽然它们的最终效果看起来相似，但实现机制和适用场景有显著差异。

## 基本语法

**v-if:**

```javascript
<div v-if="condition">当 condition 为 true 时显示</div>
```

**v-show:**

```javascript
<div v-show="condition">当 condition 为 true 时显示</div>
```



## 核心区别

### 渲染机制

**v-if:**

- **真实的条件渲染**：根据条件决定是否渲染元素
- 当条件为 false 时，元素完全不存在于 DOM 中
- 销毁和重建 DOM 元素及其子组件

**v-show:**

- **基于 CSS 的切换**：始终渲染元素
- 通过切换元素的 CSS `display` 属性控制显示/隐藏
- 元素始终存在于 DOM 中，只是视觉上的隐藏

### 内部实现

**v-if 实现:**

```javascript
// 伪代码展示 v-if 的工作原理
function render() {
  if (condition) {
    return createElement('div', {}, [...children])
  } else {
    return null // 不创建元素
  }
}
```

**v-show 实现:**

```javascript
// 伪代码展示 v-show 的工作原理
function render() {
  return createElement('div', {
    style: {
      display: condition ? 'block' : 'none'
    }
  }, [...children])
}
```

## 性能比较

**v-if:**

- **初始渲染**：如果条件为 false，不会渲染元素，初始加载更快
- **切换成本**：高，涉及 DOM 操作、组件生命周期、事件监听器的销毁和重建
- **适用场景**：切换不频繁的场景

**v-show:**

- **初始渲染**：无论条件是什么，都会渲染元素，初始加载可能较慢
- **切换成本**：低，只是切换 CSS 属性
- **适用场景**：频繁切换的场景

## 生命周期影响

**v-if:**

- 会触发组件的完整生命周期
- 条件为 false 时触发 `beforeDestroy` 和 `destroyed` 钩子
- 条件变为 true 时触发 `beforeCreate`、`created`、`beforeMount` 和 `mounted` 钩子

**v-show:**

- 不会触发组件的生命周期钩子
- 元素始终存在，只是视觉上隐藏，生命周期保持不变

## 与其他指令的结合

### v-if 相关指令

**v-else:**

**v-else-if:**

### v-show 限制

- 不支持 `v-else` 或 `v-else-if`
- 只能单独使用

## 设计考量

### 何时使用 v-if

- 条件很少改变
- 初始条件可能为 false，想避免不必要的渲染
- 有复杂组件树需要条件渲染
- 与 v-for 一起使用（需要注意优先级，避免直接组合）
- 需要使用 v-else/v-else-if 逻辑分支

### 何时使用 v-show

- 需要非常频繁地切换
- 初始渲染成本可接受
- 切换效率是关键考量
- 不需要触发组件生命周期
- 简单 UI 元素的显示/隐藏

## 最佳实践

1. **按需选择**：根据切换频率选择合适的指令
2. **避免嵌套**：减少在 v-if/v-show 元素内部大量嵌套其他条件元素
3. **避免直接结合 v-for**：不要在同一元素上同时使用 v-if 和 v-for
4. **性能优化**：对于复杂组件，如果频繁切换，考虑使用 v-show
5. **初始加载优化**：默认隐藏的大型内容，优先使用 v-if

通过合理选择 v-if 和 v-show，可以在保持应用功能的同时优化性能和用户体验。

# 6.v-on与@

在 Vue 中，`v-on` 指令和 `@` 符号都用于事件绑定，两者完全等价，`@` 是 `v-on:` 的简写形式。

## 基本语法

### 完整语法：v-on

```javascript
<button v-on:click="handleClick">点击</button>
```

### 简写语法：@

```javascript
<button @click="handleClick">点击</button>
```

## 功能详解

`v-on`/`@` 可以监听 DOM 事件，并在事件触发时执行 JavaScript 代码。

### 1. 绑定事件处理方法

```javascript
<template>
  <button @click="handleClick">点击</button>
</template>

<script setup>
function handleClick(event) {
  console.log('按钮被点击了', event)
}
</script>
```

### 2. 内联事件处理

```javascript
<button @click="count++">计数: {{ count }}</button>
```

### 3. 动态事件名

```javascript
<button @[eventName]="handleEvent">动态事件</button>
```



## 事件修饰符

Vue 提供了多种事件修饰符，可以通过链式语法使用：

### 事件传播控制

- `.stop` - 阻止事件冒泡 (等同于 `event.stopPropagation()`)
- `.prevent` - 阻止默认行为 (等同于 `event.preventDefault()`)
- `.capture` - 使用事件捕获模式
- `.self` - 只当事件在该元素本身触发时才触发处理函数
- `.once` - 事件只触发一次
- `.passive` - 以 `{ passive: true }` 模式添加事件监听器

### 按键修饰符

用于键盘事件

常用按键修饰符：

- `.enter`
- `.tab`
- `.delete` (捕获"删除"和"退格"键)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

### 系统修饰键

常用系统修饰键：

- `.ctrl`
- `.alt`
- `.shift`
- `.meta` (Windows 键或 Mac 命令键)

### 鼠标按键修饰符

鼠标按键修饰符：

- `.left` - 左键点击
- `.right` - 右键点击
- `.middle` - 中键点击

## 多个事件处理器

### 多个方法

```javascript
<button @click="one($event), two($event)">多个处理器</button>
```

### 不同事件

```javascript
<input
  @focus="onFocus"
  @blur="onBlur"
  @input="onInput"
>
```

## 事件处理函数中的参数

### 访问原生事件对象

当不传参数时，事件对象会自动作为第一个参数：

```javascript
<button @click="handleClick">点击</button>

function handleClick(event) {
  console.log(event) // 原生 DOM 事件对象
}
```

### 自定义参数 + 事件对象

```javascript
<button @click="handleClick('hello', $event)">带参数</button>

function handleClick(message, event) {
  console.log(message) // 'hello'
  console.log(event) // 原生 DOM 事件对象
}
```

## v-on vs 原生事件监听

### 原生 addEventListener

```javascript
mounted() {
  const button = document.querySelector('button')
  button.addEventListener('click', this.handleClick)
}
```

**区别：**

1. Vue 事件绑定会自动处理方法的 `this` 指向
2. Vue 事件在组件销毁时会自动清理，无需手动移除
3. Vue 提供了丰富的修饰符，简化常见操作

## 最佳实践

1. **使用简写**：优先使用 `@` 简写形式，代码更简洁

2. **利用修饰符**：使用修饰符替代手动处理事件细节

3. **方法与处理分离**：将复杂逻辑放在方法中，保持模板简洁

4. **避免复杂表达式**：模板中的事件处理应保持简单，复杂逻辑放在方法中

   ```javascript
   <!-- 推荐 -->
   <button @click="handleSubmit">提交</button>
   
   <!-- 不推荐 -->
   <button @click="isValid && !isSubmitting ? submitForm() : showError()">提交</button>
   ```

   5.**使用事件委托**：对于列表项等重复元素，考虑在父元素上使用事件委托

通过掌握 `v-on/@` 指令，你可以实现丰富的交互功能，构建响应式的用户界面。

# 7.v-bind与缩写形式：



# 8.v-for与：key



# 9.v-model



# 10.指令修饰符

在 Vue 中，**指令修饰符**是用于扩展指令功能的小标记，写在指令名后面，用点号分隔。例如：`v-on:click.prevent`、`v-model.lazy`。

## 作用

指令修饰符可以让指令拥有更多行为或控制方式，常见于 `v-on`、`v-model`、自定义指令等。

------

### 1. v-on（事件绑定）修饰符

- `.stop`：阻止事件冒泡
- `.prevent`：阻止默认行为
- `.capture`：使用捕获模式
- `.self`：只在事件从自身触发时才执行
- `.once`：事件只触发一次
- `.passive`：使用 passive 监听器

**示例：**

<button v-on:click.stop="doSomething">阻止冒泡</button>

<button v-on:click.prevent="submitForm">阻止默认</button>

<button v-on:click.once="onlyOnce">只触发一次</button>

------

### 2. v-model 修饰符

- `.lazy`：在 `change` 事件后同步数据（默认是 `input`）
- `.number`：自动将输入值转为数字类型
- `.trim`：自动去除首尾空格

**示例：**

<input v-model.lazy="msg">

<input v-model.number="age">

<input v-model.trim="name">

------

### 3. 自定义指令修饰符

自定义指令也可以通过修饰符获取额外信息：

**定义：**

app.directive('focus', {

 mounted(el, binding) {

  if (binding.modifiers.red) {

   el.style.color = 'red'

  }

 }

})

**使用：**

<input v-focus.red>

这里 `.red` 就是修饰符，可以在指令逻辑中通过 `binding.modifiers` 访问。

------

### 4. 多个修饰符

可以同时使用多个修饰符：

<button v-on:click.stop.prevent="doSomething">阻止冒泡和默认</button>

------

## 总结

- 修饰符是点号后的小标记，增强指令功能
- 常见于事件、表单、指令
- 在自定义指令中通过 `binding.modifiers` 获取

# 11.计算属性computed()及其缓存机制

## 1. 计算属性的基本概念

计算属性(computed)是 Vue 提供的一个重要特性，用于声明依赖响应式状态的复杂逻辑。它本质上是一个能够根据依赖的响应式数据计算并返回结果的函数。

```javascript
// Vue 3 Composition API 示例
import { ref, computed } from 'vue';

const count = ref(1);
const plusOne = computed(() => count.value + 1);

console.log(plusOne.value); // 2
count.value++;
console.log(plusOne.value); // 3
```



## 2. 计算属性的缓存机制

计算属性最重要的特性是其**缓存机制**，其工作原理如下：

1. **首次访问计算**：当首次访问计算属性时，Vue 会执行计算函数并缓存结果
2. **依赖追踪**：在执行计算函数期间，Vue 会自动追踪函数内部使用的所有响应式依赖
3. **缓存复用**：后续访问同一计算属性时，如果依赖数据没有变化，Vue 直接返回缓存结果，不会重新计算
4. **依赖更新**：只有当依赖的响应式数据发生变化时，计算属性才会重新计算

## 3. 缓存机制的实现原理

计算属性的缓存机制主要基于以下实现：

```javascript
// 简化的计算属性实现原理
function createComputed(getter) {
  let value;
  let dirty = true; // 脏标记，表示是否需要重新计算

  // 创建一个副作用对象，用于追踪依赖
  const effect = createEffect(getter, {
    lazy: true,
    // 当依赖变化时触发的调度函数
    scheduler: () => {
      if (!dirty) {
        dirty = true;
        // 通知依赖此计算属性的效果更新
        trigger(computed, 'value');
      }
    }
  });

  const computed = {
    get value() {
      if (dirty) {
        // 只有在脏状态时才重新计算
        value = effect();
        dirty = false;
      }
      // 依赖收集
      track(computed, 'value');
      return value;
    }
  };

  return computed;
}
```



## 4. 计算属性vs方法对比

```javascript
// 方法
methods: {
  calculateResult() {
    // 每次调用都会重新执行
    return this.items.filter(item => item.completed).length;
  }
},

// 计算属性
computed: {
  completedCount() {
    // 只有当依赖(this.items)变化时才会重新计算
    return this.items.filter(item => item.completed).length;
  }
}
```

主要区别：

- 方法：每次调用都会执行
- 计算属性：依赖不变时返回缓存值

## 5. 计算属性的优势

1. **性能优化**：避免重复执行复杂计算
2. **代码简洁**：使模板更简洁，不需要内联复杂表达式
3. **依赖追踪**：自动响应依赖变化
4. **可读性**：提高代码可读性和可维护性

## 6. 复杂示例展示缓存价值

```javascript
import { ref, computed } from 'vue';

export default {
  setup() {
    const users = ref([
      { id: 1, name: 'John', age: 25, active: true },
      { id: 2, name: 'Jane', age: 30, active: false },
      // ... 假设有成千上万个用户
    ]);
    
    // 复杂计算属性
    const activeUserStats = computed(() => {
      console.log('计算活跃用户统计...'); // 验证是否重新计算
      
      // 假设这是一个计算复杂度高的操作
      const activeUsers = users.value.filter(u => u.active);
      
      return {
        count: activeUsers.length,
        averageAge: activeUsers.reduce((sum, user) => sum + user.age, 0) / activeUsers.length || 0,
        namesString: activeUsers.map(u => u.name).join(', ')
      };
    });
    
    function toggleUserActive(id) {
      const user = users.value.find(u => u.id === id);
      if (user) user.active = !user.active;
    }
    
    function addUnrelatedData() {
      // 这个操作不影响计算属性的依赖
      unrelatedData.value.push(Math.random());
    }
    
    const unrelatedData = ref([]);
    
    return {
      users,
      activeUserStats, // 多次访问也只会计算一次
      toggleUserActive,
      addUnrelatedData,
      unrelatedData
    };
  }
};
```

在此示例中，即使多次访问 `activeUserStats`，复杂计算也只会执行一次，直到 `users` 数组发生变化。这在处理大数据集或复杂计算时特别有价值。

## 7. 计算属性的最佳实践

1. **保持纯函数特性**：计算函数应该是纯函数，不产生副作用
2. **适当粒度**：将复杂计算拆分为多个计算属性
3. **避免异步操作**：计算属性不应包含异步操作
4. **缓存意识**：了解缓存机制，避免不必要的响应式依赖

计算属性的缓存机制是 Vue 性能优化的重要一环，合理利用可以显著提升应用性能。



## 12.计算属性computed()的完整写法

在 Vue 中，计算属性可以有多种不同的写法，取决于你使用的是 Vue 2 还是 Vue 3，以及使用的是选项式 API 还是组合式 API。

## 1. Vue 3 组合式 API (Composition API)

### 1.1 基本写法

```javascript
import { ref, computed } from 'vue'

export default {
  setup() {
    const count = ref(1)
    
    // 只读计算属性
    const doubleCount = computed(() => count.value * 2)
    
    return {
      count,
      doubleCount
    }
  }
}
```



### 1.2 完整写法（带 getter 和 setter）

```javascript
import { ref, computed } from 'vue'

export default {
  setup() {
    const firstName = ref('John')
    const lastName = ref('Doe')
    
    // 可读可写的计算属性
    const fullName = computed({
      // getter
      get() {
        return firstName.value + ' ' + lastName.value
      },
      // setter
      set(newValue) {
        // 注意：我们这里使用的是解构赋值语法
        const names = newValue.split(' ')
        firstName.value = names[0]
        lastName.value = names[1] || ''
      }
    })
    
    return {
      firstName,
      lastName,
      fullName
    }
  }
}
```



## 2. Vue 3 选项式 API (Options API)

### 2.1 基本写法

```javascript
export default {
  data() {
    return {
      count: 1
    }
  },
  computed: {
    // 只读计算属性
    doubleCount() {
      return this.count * 2
    }
  }
}
```



### 2.2 完整写法（带 getter 和 setter）

```javascript
export default {
  data() {
    return {
      firstName: 'John',
      lastName: 'Doe'
    }
  },
  computed: {
    // 可读可写的计算属性
    fullName: {
      // getter
      get() {
        return this.firstName + ' ' + this.lastName
      },
      // setter
      set(newValue) {
        const names = newValue.split(' ')
        this.firstName = names[0]
        this.lastName = names[1] || ''
      }
    }
  }
}
```



## 3. Vue 2 中的写法

Vue 2 中的写法与 Vue 3 的选项式 API 基本相同。

## 4. 在 <script setup> 中的写法 (Vue 3)

```javascript
<script setup>
import { ref, computed } from 'vue'

const count = ref(1)

// 只读计算属性
const doubleCount = computed(() => count.value * 2)

// 可读可写计算属性
const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  get() {
    return firstName.value + ' ' + lastName.value
  },
  set(newValue) {
    const names = newValue.split(' ')
    firstName.value = names[0]
    lastName.value = names[1] || ''
  }
})

// 测试 setter
function updateFullName() {
  fullName.value = 'Jane Smith' // 会触发 setter
}
</script>
```

计算属性的完整写法提供了对 getter 和 setter 的完全控制，特别是当你需要在计算属性被赋值时执行自定义逻辑时非常有用。

# 13.Vue生命周期四阶段

Vue 组件的生命周期可以分为四个主要阶段：**创建**、**挂载**、**更新**和**销毁**。每个阶段都有对应的生命周期钩子，让开发者能在特定时机执行代码。

## 1. 创建阶段 (Creation)

创建阶段发生在组件实例被创建时，主要关注数据的初始化。

### beforeCreate

```javascript
beforeCreate() {
  console.log('beforeCreate: 实例被创建，但数据观测和事件配置尚未完成')
  console.log(this.count) // undefined，此时无法访问 data 和 methods
}
```

在这个钩子中：

- 组件实例已创建，但还未进行数据观测
- 无法访问 `data`、`computed`、`methods` 和 `watch`
- 适合进行插件初始化等与组件状态无关的操作

### created

```javascript
created() {
  console.log('created: 实例已创建，数据观测和事件配置已完成')
  console.log(this.count) // 能正确访问到 data 中的数据
  // 可以进行API请求
  this.fetchInitialData()
}
```

在这个钩子中：

- 数据观测 (data)、计算属性、方法和侦听器已设置完成
- 可以访问 `data` 中的响应式数据和 `methods` 中的方法
- 组件尚未挂载，无法访问 DOM
- 适合发起初始化数据请求、设置事件监听

## 2. 挂载阶段 (Mounting)

挂载阶段将组件渲染到 DOM 中，使其可见。

### beforeMount

```javascript
beforeMount() {
  console.log('beforeMount: 在挂载之前调用')
  console.log(document.getElementById('app')) // null 或不完整
  // 模板已编译，但还未渲染到页面
}
```

在这个钩子中：

- 模板已编译成渲染函数
- 虚拟 DOM 已创建，但还未挂载到页面
- 无法访问真实 DOM
- 很少使用，因为在此阶段修改数据不会触发重新渲染

### mounted

```javascript
mounted() {
  console.log('mounted: 实例已挂载')
  console.log(document.getElementById('app')) // 已挂载的DOM元素
  // 可以安全地访问DOM
  this.$refs.myInput.focus()
  // 初始化第三方库
  new Chart(this.$refs.chart, {...})
}
```

在这个钩子中：

- 组件已完全挂载到 DOM 中
- 可以安全地访问 DOM 元素（包括 `$refs`）
- 适合进行 DOM 操作、初始化第三方库
- 子组件的 mounted 钩子会先于父组件触发

## 3. 更新阶段 (Updating)

更新阶段发生在数据变化并导致视图更新时。

### beforeUpdate

```javascript
beforeUpdate() {
  console.log('beforeUpdate: 在数据更新之前调用')
  console.log('DOM状态:', document.getElementById('counter').textContent)
  console.log('数据状态:', this.count)
  // DOM还未更新，数据已更新
}
```

在这个钩子中：

- 数据已更新，但 DOM 尚未更新
- 可以在 DOM 更新前访问现有 DOM（如获取滚动位置）
- 适合在更新前访问 DOM 状态
- 此钩子中的数据变化不会触发重新渲染

### updated

```javascript
updated() {
  console.log('updated: 数据已更新')
  console.log('DOM已更新:', document.getElementById('counter').textContent)
  // DOM已与数据同步
  // 谨慎在这里更改状态，可能导致无限循环
}
```

在这个钩子中：

- DOM 已完成更新，与最新数据同步
- 适合执行依赖于更新后 DOM 的操作
- **注意**：应避免在此钩子中修改状态，可能导致无限更新循环
- 如需修改状态，应使用计算属性或侦听器

## 4. 销毁阶段 (Destruction)

销毁阶段发生在组件从 DOM 中移除时。

### beforeDestroy (Vue 2) / beforeUnmount (Vue 3)

```javascript
beforeDestroy() { // Vue 2
  console.log('beforeDestroy: 实例销毁之前调用')
  // 清理定时器、取消网络请求、移除事件监听器
  clearInterval(this.timer)
  window.removeEventListener('resize', this.handleResize)
}

// Vue 3 中使用 beforeUnmount
beforeUnmount() {
  console.log('beforeUnmount: 卸载前调用')
}
```

在这个钩子中：

- 组件实例仍然完全可用
- 可以访问响应式数据和方法
- 适合清理资源（定时器、事件监听器、订阅等）
- 防止内存泄漏的关键位置

### destroyed (Vue 2) / unmounted (Vue 3)

```javascript
destroyed() { // Vue 2
  console.log('destroyed: 实例已销毁')
  // 组件已完全销毁
}

// Vue 3 中使用 unmounted
unmounted() {
  console.log('unmounted: 卸载完成')
}
```

在这个钩子中：

- 组件实例已被销毁
- 所有指令和事件监听器已被移除
- 所有子组件也已销毁
- 组件不再响应数据变化

## 实际应用案例

### 1. 数据初始化与 API 请求

```javascript
created() {
  // 组件创建后获取初始数据
  this.fetchUserData()
},
methods: {
  async fetchUserData() {
    try {
      const response = await fetch('/api/user/profile')
      this.userData = await response.json()
    } catch (error) {
      this.error = error.message
    }
  }
}
```

### 2. DOM 操作与第三方库集成

```javascript
mounted() {
  // 初始化第三方库
  this.chart = new Chart(this.$refs.chartCanvas, {
    type: 'line',
    data: this.chartData
  })
  
  // 设置焦点
  this.$refs.nameInput.focus()
}
```

### 3. 资源清理

```javascript
created() {
  // 设置定时器
  this.timer = setInterval(this.refreshData, 60000)
  
  // 添加全局事件
  window.addEventListener('resize', this.handleResize)
},

beforeDestroy() {
  // 清理定时器
  clearInterval(this.timer)
  
  // 移除事件监听
  window.removeEventListener('resize', this.handleResize)
  
  // 取消未完成的网络请求
  if (this.pendingRequest) {
    this.pendingRequest.cancel()
  }
}
```

### 4. 保存用户状态

```javascript
beforeDestroy() {
  // 保存用户状态到 localStorage
  localStorage.setItem('scrollPosition', window.scrollY)
  localStorage.setItem('formData', JSON.stringify(this.formData))
}
```

## Vue 3 组合式 API 中的生命周期钩子

在 Vue 3 的组合式 API 中，生命周期钩子以函数形式存在：

```javascript
<script setup>
import { onMounted, onBeforeUnmount, onUpdated } from 'vue'

// 创建阶段没有明确的钩子，setup 本身相当于 created
console.log('setup: 组件被创建')

onMounted(() => {
  console.log('组件已挂载')
  // DOM操作
})

onUpdated(() => {
  console.log('组件已更新')
})

onBeforeUnmount(() => {
  console.log('组件即将卸载')
  // 清理资源
})
</script>
```

## Vue 3 的 setup 语法糖执行时机与 this 问题

### setup 的执行时机

在 Vue 3 中，`setup` 函数（包括 `<script setup>` 语法糖）**在组件实例创建之前执行**，介于 Vue 2 的 `beforeCreate` 和 `created` 生命周期钩子之间，但更接近 `beforeCreate`。

具体来说：

- `setup` 是**首先执行**的代码
- 在 `props` 被解析后执行
- 在组件实例创建之前执行
- 在任何生命周期钩子被调用之前执行

### 为什么 setup 内部没有 this

`setup` 内部之所以没有 `this`，主要有以下几个原因：

#### 1. 执行时机问题

`setup` 在组件实例（即 Vue 实例）被完全创建之前执行，此时组件实例尚未完全初始化，所以没有可用的 `this` 引用。

```javascript
// 这是 Vue 3 内部的简化逻辑
function createComponentInstance() {
  // 首先执行 setup
  const setupResult = setup(props)
  
  // 然后才创建组件实例并挂载各种属性
  const instance = {
    props,
    data,
    methods,
    // ...
  }
  
  return instance
}
```

#### 2. 设计理念转变

Vue 3 的组合式 API（Composition API）是为了解决 Vue 2 选项式 API（Options API）中的一些问题而设计的：

- **避免 this 指向不明确**：`this` 在 JavaScript 中可能导致混淆
- **提高类型推导能力**：明确的参数和返回值使得 TypeScript 类型推导更准确
- **提高代码组织能力**：基于功能而非选项组织代码

#### 3. 提高可复用性

没有 `this` 绑定使得 `setup` 中的逻辑更容易提取和重用，可以将相关逻辑封装到独立的组合函数（Composables）中。

```javascript
// 可重用的组合函数
function useCounter() {
  const count = ref(0)
  function increment() { count.value++ }
  return { count, increment }
}

// 在不同组件中使用
const { count, increment } = useCounter()
```

#### 4. 更明确的依赖关系

使用 `ref`、`reactive` 等 API 而不是 `this` 使依赖关系更加明确，解决了 Vue 2 中 `this` 包含太多隐式属性的问题。

```javascript
<script setup>
import { ref, computed, onMounted } from 'vue'

// 明确的依赖
const count = ref(0)
const doubleCount = computed(() => count.value * 2)

onMounted(() => {
  console.log(count.value) // 明确访问 count
})
</script>
```

## 如何访问组件实例

尽管 `setup` 中没有 `this`，Vue 3 仍提供了在必要时访问组件实例的方法：

### 1. getCurrentInstance API

```javascript
import { getCurrentInstance } from 'vue'

const instance = getCurrentInstance()
console.log(instance) // 组件实例
```

**注意**：这主要用于内部开发或特殊场景，官方不推荐在应用代码中依赖它。

### 2. 通过生命周期钩子的参数

某些组合式 API 的生命周期钩子会接收组件实例作为参数：

```javascript
onMounted((instance) => {
  // 在一些钩子中可以访问实例
})
```

## 总结

- `setup` 函数在组件实例创建之前执行，相当于 `beforeCreate` 和 `created` 之间
- `setup` 内部没有 `this` 是有意为之的设计决策，目的是提高代码的可维护性、复用性和类型安全
- 使用组合式 API（`ref`、`reactive`、`computed` 等）可以更清晰地组织和管理组件逻辑
- 若确实需要访问组件实例，可以使用 `getCurrentInstance`，但不推荐依赖它

这种设计改变反映了 Vue 3 的核心理念：更加明确、可组合和类型友好的组件开发方式。



# 14.组件的局部注册与全局注册



# 15.scoped防止样式冲突的原理

Vue 组件中的 `<style scoped>` 是一种隔离组件样式的机制，防止样式在不同组件间相互影响。下面详细解析其工作原理：

## 1. 基本原理

当你在 Vue 组件中使用 `scoped` 属性时，Vue 会：

1. 为组件中的每个 HTML 元素添加一个唯一的自定义属性（形如 `data-v-7ba5bd90`）
2. 在 CSS 选择器末尾添加该属性选择器，使样式只对具有该属性的元素生效

### 转换前（组件代码）：

```javascript
<template>
  <div class="example">Hello</div>
</template>

<style scoped>
.example {
  color: red;
}
</style>
```

### 转换后（编译结果）：

```javascript
<div class="example" data-v-7ba5bd90>Hello</div>

.example[data-v-7ba5bd90] {
  color: red;
}
```

## 2. 技术实现细节

### 属性生成机制

- 每个组件实例会生成一个唯一的哈希 ID
- 该 ID 基于文件内容或组件定义生成，确保唯一性
- 在生产环境中会被缩短以减小体积

### CSS 处理流程

1. Vue 编译器识别 `<style scoped>` 标签
2. 提取其中的样式规则
3. 使用 PostCSS 转换每个选择器，添加属性选择器
4. 将处理后的 CSS 注入到最终的 HTML 中

## 3. 深度选择器

有时你需要让某些样式影响子组件，这时可以使用深度选择器：

### Vue 3 中的深度选择器：`:deep()`

```javascript
/* 影响子组件中的 .child 类 */
.parent :deep(.child) {
  color: blue;
}
```

### Vue 2 中的深度选择器（不推荐在 Vue 3 中使用）：

```javascript
/* 不同写法，同样效果 */
.parent >>> .child { color: blue; }
.parent /deep/ .child { color: blue; }
.parent ::v-deep .child { color: blue; }
```

深度选择器的工作原理是**将属性选择器移至组合选择器的最外层**，例如：

```javascript
/* 转换前 */
.parent :deep(.child) { color: blue; }

/* 转换后 */
.parent[data-v-7ba5bd90] .child { color: blue; }
```

这样就能影响子组件中的元素，而不是仅限于当前组件。

## 4. 样式穿透的限制

即使使用 scoped，某些情况下样式仍可能"泄漏"：

1. **全局样式污染**：在同一 HTML 页面中，所有 CSS 最终都会合并在一起
2. **选择器优先级**：如果外部选择器优先级更高，仍可能覆盖 scoped 样式
3. **动态添加的元素**：如果通过 JavaScript 动态添加元素，可能不会带有 scoped 属性

## 5. scoped 与 CSS Modules 对比

Vue 也支持 CSS Modules，这是另一种样式隔离方案：

### scoped

- **优点**：使用简单，直接在 `<style>` 标签添加属性
- **缺点**：选择器和类名未更改，仅添加属性选择器；调试时可能混淆

### CSS Modules

- **优点**：完全隔离的类名；可编程访问生成的类名

- **缺点**：需要通过 `$style` 或绑定类名；配置略复杂

  ```javascript
  <template>
    <div :class="$style.example">Hello</div>
  </template>
  
  <style module>
  .example {
    color: red;
  }
  </style>
  ```

## 6. 性能考量

scoped 样式的性能影响：

- **编译时开销**：需要额外的 CSS 处理步骤
- **选择器复杂度**：生成的选择器更复杂，可能影响 CSS 解析速度
- **DOM 大小**：每个元素都添加了额外属性，增加了 DOM 大小

在大型应用中，可以考虑使用 CSS 预处理器的命名空间功能结合 scoped 样式。

## 7. 最佳实践

1. **适度使用 scoped**：不需要在每个组件都使用
2. **基础样式全局化**：通用样式放在全局，组件特定样式使用 scoped
3. **避免深度选择器滥用**：过度使用会削弱 scoped 的隔离效果
4. **使用 CSS 预处理器**：结合 SCSS/Less 的嵌套功能，可以更好地组织样式
5. **考虑 CSS 架构**：如 BEM、SMACSS 等方法论，可与 scoped 结合使用

## 8. 示例：完整工作流程

以下是 scoped 样式从编写到渲染的完整流程：

1. **开发者编写组件**：

   ```javascript
   <template>
     <div class="container">
       <h1 class="title">Hello World</h1>
     </div>
   </template>
   
   <style scoped>
   .container {
     padding: 20px;
   }
   .title {
     color: #42b983;
   }
   </style>
   ```

2.**Vue 编译处理**：

- 生成唯一属性标识符 `data-v-abc123`
- 转换 HTML，为每个元素添加该属性
- 转换 CSS，为每个选择器添加属性选择器

3.**编译后的实际代码**：

```javascript
<div class="container" data-v-abc123>
  <h1 class="title" data-v-abc123>Hello World</h1>
</div>

.container[data-v-abc123] {
  padding: 20px;
}
.title[data-v-abc123] {
  color: #42b983;
}
```



4.浏览器渲染：

- CSS 选择器仅匹配具有特定 `data-v` 属性的元素
- 即使其他组件有相同的类名，也不会被这些样式影响

scoped 样式是 Vue 组件化思想的重要体现，通过技术手段确保样式封装，使组件更加独立和可复用。

# 16.一个组件的data必须是一个函数

复用组件

# 17.vue2中的父子组件间的通信



# 18.vue3中的父子组件间的通信

Vue 3 提供了多种机制实现父子组件间的数据传递和交互。下面详细介绍每种通信方式的使用方法、适用场景及注意事项。

## 1. Props (父传子)

Props 是最基本也是最常用的父传子通信方式，用于父组件向子组件传递数据。

### 基本用法

**子组件定义 Props**：

```javascript
<!-- Child.vue -->
<script setup>
// 使用运行时声明
const props = defineProps({
  title: String,
  count: {
    type: Number,
    default: 0,
    required: false
  },
  user: Object
})

// 或使用类型声明 (需要 TypeScript)
defineProps<{
  title: string
  count?: number
  user: { name: string, age: number }
}>()

// 带默认值的类型声明
withDefaults(defineProps<{
  title: string
  count?: number
}>(), {
  count: 0
})
</script>

<template>
  <div>
    <h2>{{ title }}</h2>
    <p>Count: {{ count }}</p>
    <p>User: {{ user?.name }}</p>
  </div>
</template>
```

**父组件传递 Props**：

```javascript
<!-- Parent.vue -->
<script setup>
import { ref } from 'vue'
import Child from './Child.vue'

const pageTitle = ref('Welcome')
const counter = ref(42)
const userData = ref({ name: 'John', age: 30 })
</script>

<template>
  <Child 
    :title="pageTitle" 
    :count="counter"
    :user="userData"
  />
</template>
```

### Props 特性

1. **单向数据流**：父组件可以传递数据给子组件，但子组件不能直接修改 props
2. **响应式**：父组件中 props 来源的更新会传递到子组件
3. **类型验证**：可以指定 props 的类型、默认值、是否必需等

### 注意事项

- 不要在子组件中直接修改 props，这违反单向数据流原则
- 对象和数组是引用类型，即使不能重新赋值 props，仍可修改其内部属性（应避免）
- props 名称在传递时会自动转换为 kebab-case (短横线分隔)：`:userInfo` → `user-info`

## 2. Emits (子传父)

Emits 用于子组件向父组件发送事件和数据。

### 基本用法

**子组件定义并触发事件**：

```javascript
<!-- Child.vue -->
<script setup>
// 声明组件可能触发的事件
const emit = defineEmits(['update', 'delete'])

// 或使用TypeScript类型声明
const emit = defineEmits<{
  (e: 'update', id: number, value: string): void
  (e: 'delete', id: number): void
}>()

function handleUpdate() {
  // 触发事件并传递数据
  emit('update', 123, 'New Value')
}

function handleDelete() {
  emit('delete', 123)
}
</script>

<template>
  <div>
    <button @click="handleUpdate">更新</button>
    <button @click="handleDelete">删除</button>
  </div>
</template>
```

**父组件监听事件**：

```javascript
<!-- Parent.vue -->
<script setup>
import Child from './Child.vue'

function onUpdate(id, value) {
  console.log(`Item ${id} updated to ${value}`)
}

function onDelete(id) {
  console.log(`Item ${id} deleted`)
}
</script>

<template>
  <Child 
    @update="onUpdate" 
    @delete="onDelete"
  />
</template>
```

### 使用验证

可以对事件和参数进行验证：

```javascript
defineEmits({
  submit: (payload) => {
    // 返回 true 或 false 表示验证通过或失败
    if (payload.email && payload.password) {
      return true
    }
    console.warn('Invalid submit event payload!')
    return false
  }
})
```

## 3. v-model (双向绑定)

v-model 提供了简洁的双向绑定语法，本质上是 props + emit 的语法糖。

### 基本用法

**子组件实现 v-model**：

```javascript
<!-- CustomInput.vue -->
<script setup>
// 默认 modelValue prop + update:modelValue 事件
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

function updateValue(e) {
  emit('update:modelValue', e.target.value)
}
</script>

<template>
  <input 
    :value="modelValue" 
    @input="updateValue"
  />
</template>
```

**父组件使用 v-model**：

```javascript
<!-- Parent.vue -->
<script setup>
import { ref } from 'vue'
import CustomInput from './CustomInput.vue'

const username = ref('')
</script>

<template>
  <CustomInput v-model="username" />
  <p>当前输入: {{ username }}</p>
</template>
```

### 多个 v-model 绑定

Vue 3 允许组件有多个 v-model 绑定：

```javascript
<!-- UserForm.vue -->
<script setup>
defineProps({
  firstName: String,
  lastName: String
})

defineEmits(['update:firstName', 'update:lastName'])
</script>

<template>
  <input 
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)" 
  />
  <input 
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)" 
  />
</template>
```

```javascript
<!-- 父组件 -->
<UserForm
  v-model:firstName="first"
  v-model:lastName="last"
/>
```

### v-model 修饰符

可以为 v-model 创建自定义修饰符：

```javascript
<!-- 子组件 -->
<script setup>
const props = defineProps({
  modelValue: String,
  modelModifiers: { default: () => ({}) }
})

const emit = defineEmits(['update:modelValue'])

function emitValue(e) {
  let value = e.target.value
  // 根据修饰符处理值
  if (props.modelModifiers.capitalize) {
    value = value.charAt(0).toUpperCase() + value.slice(1)
  }
  emit('update:modelValue', value)
}
</script>
```

```javascript
<!-- 父组件 -->
<MyInput v-model.capitalize="myText" />
```

## 4. 插槽 (Slots)

插槽允许父组件向子组件传递模板内容，实现组件内容分发。

### 基本插槽

**子组件定义插槽**：

```javascript
<!-- Card.vue -->
<template>
  <div class="card">
    <div class="card-header">
      <slot name="header">默认标题</slot>
    </div>
    <div class="card-body">
      <slot>默认内容</slot>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
```

**父组件使用插槽**：

```javascript
<!-- Parent.vue -->
<template>
  <Card>
    <template #header>
      <h3>自定义标题</h3>
    </template>
    
    <p>这是主体内容</p>
    
    <template #footer>
      <button>确认</button>
      <button>取消</button>
    </template>
  </Card>
</template>
```



### 作用域插槽

当子组件需要向插槽内容提供数据时，使用作用域插槽：

**子组件传递数据**：

```javascript
<!-- UserList.vue -->
<template>
  <ul>
    <li v-for="user in users" :key="user.id">
      <slot :user="user" :index="index">
        {{ user.name }}
      </slot>
    </li>
  </ul>
</template>

<script setup>
defineProps(['users'])
</script>
```

**父组件接收数据**：

```javascript
<!-- Parent.vue -->
<template>
  <UserList :users="userData">
    <template #default="{ user, index }">
      <div class="user-item">
        <span>{{ index + 1 }}. {{ user.name }}</span>
        <small>{{ user.email }}</small>
      </div>
    </template>
  </UserList>
</template>
```



## 5. 透传 Attributes

非显式声明为 props 的 attributes 会自动添加到子组件的根元素上。

### 基本用法

```javascript
<!-- 父组件 -->
<Child class="large" id="unique" data-test="example" />

<!-- 子组件 (Child.vue) -->
<template>
  <div><!-- 这个div会自动接收 class, id 和 data-test 属性 --></div>
</template>
```

### 禁用 Attributes 继承

```javascript
<script>
export default {
  inheritAttrs: false
}
</script>

<!-- 或在 <script setup> 中 -->
<script setup>
defineOptions({
  inheritAttrs: false
})
</script>
```



### 手动控制 Attributes 应用

```javascript
<template>
  <div>
    <div v-bind="$attrs">这里应用透传的属性</div>
    <p>这里不会接收透传属性</p>
  </div>
</template>
```



## 6. 通过模板引用访问子组件

使用 ref 可以在父组件中直接访问子组件的方法和属性。

### 基本用法

**子组件暴露方法/属性**：

```javascript
<!-- Child.vue -->
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}

// 显式暴露给父组件的属性和方法
defineExpose({
  count,
  increment
})
</script>
```

**父组件访问子组件**：

```javascript
<!-- Parent.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import Child from './Child.vue'

const childRef = ref(null)

onMounted(() => {
  // 访问子组件暴露的属性和方法
  console.log(childRef.value.count) 
  childRef.value.increment()
})
</script>

<template>
  <Child ref="childRef" />
  <button @click="childRef?.increment()">
    增加子组件计数
  </button>
</template>
```



## 7. 依赖注入 (Provide/Inject)

适用于深层组件通信，避免 props 逐级传递（"prop 钻取"）。

### 基本用法

**祖先组件提供数据**：

```javascript
<!-- Ancestor.vue -->
<script setup>
import { provide, ref } from 'vue'

const theme = ref('light')
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

// 提供值和方法
provide('theme', theme)
provide('toggleTheme', toggleTheme)
</script>
```

**后代组件注入数据**：

```javascript
<!-- Descendant.vue (可能嵌套多层) -->
<script setup>
import { inject } from 'vue'

// 注入值和方法
const theme = inject('theme')
const toggleTheme = inject('toggleTheme')
</script>

<template>
  <div :class="theme">
    <button @click="toggleTheme">切换主题</button>
  </div>
</template>
```



### 使用符号作为注入名

```javascript
// keys.js
export const themeKey = Symbol('theme')

// 提供
provide(themeKey, theme)

// 注入
const theme = inject(themeKey)
```



### 默认值

```javascript
const theme = inject('theme', 'light') // 如果未提供，使用 'light'

// 使用工厂函数避免创建不必要的对象
const location = inject('location', () => ({ x: 0, y: 0 }))
```



## 8. 状态管理 (Pinia/Vuex)

对于复杂的跨组件通信，建议使用专门的状态管理库如 Pinia。

### Pinia 示例

```javascript
// store/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++
    }
  }
})

// 组合式API风格
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function increment() {
    count.value++
  }
  return { count, increment }
})
```

```javascript
<!-- 任意组件 -->
<script setup>
import { useCounterStore } from '@/store/counter'

const counter = useCounterStore()
</script>

<template>
  <div>{{ counter.count }}</div>
  <button @click="counter.increment">+</button>
</template>
```



## 最佳实践与选择指南

根据不同场景选择合适的通信方式：

1. **简单的父传子数据**：使用 props
2. **子组件向父组件发送事件**：使用 emits
3. **表单元素和用户输入**：使用 v-model
4. **UI 结构和内容分发**：使用插槽
5. **跨多层组件的数据共享**：使用 provide/inject
6. **复杂状态管理和多组件共享**：使用 Pinia
7. **特殊交互需求**：使用模板引用 (ref)

通过合理组合这些通信机制，可以构建出组件关系清晰、数据流向明确的 Vue 应用。

# 19.非父子组件间的通信





# 20.依赖注入provide/inject



# 21.v-model的原理

`v-model` 是 Vue 中实现表单输入和数据双向绑定的核心指令，看似简单，实际上是多个功能的语法糖。下面从基础到深入，详细解析其工作原理。

## 1. 基本原理

`v-model` 本质上是以下两个操作的简写：

1. **单向数据绑定**：使用 `:value` (v-bind) 将数据绑定到表单元素
2. **事件监听**：使用 `@input` (v-on) 监听元素变化并更新数据

### 简单示例

```javascript
<input v-model="message">

<!-- 等价于 -->
<input
  :value="message"
  @input="message = $event.target.value">
```

这表明 `v-model` 实际是一个语法糖，它简化了实现双向绑定的代码。

## 2. 不同表单元素的处理差异

`v-model` 会根据不同的表单元素类型采用不同的属性和事件：

### 文本输入框 (input[type="text"], textarea)

```javascript
<input v-model="text">

<!-- 等价于 -->
<input
  :value="text"
  @input="text = $event.target.value">
```

### 复选框 (checkbox)

```javascript
<input type="checkbox" v-model="checked">

<!-- 等价于 -->
<input
  type="checkbox"
  :checked="checked"
  @change="checked = $event.target.checked">
```

### 单选按钮 (radio)

```javascript
<input type="radio" value="One" v-model="picked">

<!-- 等价于 -->
<input
  type="radio"
  value="One"
  :checked="picked === 'One'"
  @change="picked = $event.target.value">
```

### 选择框 (select)

```javascript
<select v-model="selected">
  <option value="a">A</option>
  <option value="b">B</option>
</select>

<!-- 等价于 -->
<select
  :value="selected"
  @change="selected = $event.target.value">
  <option value="a">A</option>
  <option value="b">B</option>
</select>
```

## 3. 修饰符的实现原理

`v-model` 支持几种修饰符，它们实际上是在事件处理函数中添加了额外逻辑：

### .lazy（在 change 事件后同步）

```javascript
<input v-model.lazy="message">

<!-- 等价于 -->
<input
  :value="message"
  @change="message = $event.target.value">
```

### .number（自动转换为数字）

```javascript
<input v-model.number="age" type="number">

<!-- 等价于 -->
<input
  type="number"
  :value="age"
  @input="age = $event.target.value === '' 
    ? '' 
    : Number($event.target.value) || $event.target.value">
```

### .trim（去除首尾空格）

```javascript
<input v-model.trim="msg">

<!-- 等价于 -->
<input
  :value="msg"
  @input="msg = $event.target.value.trim()">
```

## 4. 组件上的 v-model（Vue 2 vs Vue 3）

### Vue 2 组件上的 v-model

在 Vue 2 中，组件上的 `v-model` 默认使用 `value` prop 和 `input` 事件：

```javascript
<custom-input v-model="searchText">

<!-- 等价于 -->
<custom-input
  :value="searchText"
  @input="searchText = $event">
```

组件内部实现：

```javascript
<script>
export default {
  props: ['value'],
  methods: {
    updateValue(newValue) {
      this.$emit('input', newValue)
    }
  }
}
</script>
```

### Vue 3 组件上的 v-model

Vue 3 中对组件 `v-model` 做了更新，默认使用 `modelValue` prop 和 `update:modelValue` 事件：

```javascript
<custom-input v-model="searchText">

<!-- 等价于 -->
<custom-input
  :modelValue="searchText"
  @update:modelValue="searchText = $event">
```

组件内部实现：

```javascript
<script setup>
defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

function updateValue(newValue) {
  emit('update:modelValue', newValue)
}
</script>
```

## 5. 多个 v-model 绑定（Vue 3 新特性）

Vue 3 允许在同一个组件上使用多个 `v-model` 绑定：

```javascript
<user-form
  v-model:firstName="firstName"
  v-model:lastName="lastName">

<!-- 等价于 -->
<user-form
  :firstName="firstName"
  @update:firstName="firstName = $event"
  :lastName="lastName"
  @update:lastName="lastName = $event">
```

组件内部实现：

```javascript
<script setup>
defineProps({
  firstName: String,
  lastName: String
})
const emit = defineEmits(['update:firstName', 'update:lastName'])

function updateFirstName(value) {
  emit('update:firstName', value)
}

function updateLastName(value) {
  emit('update:lastName', value)
}
</script>
```



## 6. 自定义 v-model 修饰符（Vue 3 新特性）

Vue 3 允许为组件的 `v-model` 创建自定义修饰符：

```javascript
<my-component v-model.capitalize="myText">
```

组件内部实现：

```javascript
<script setup>
const props = defineProps({
  modelValue: String,
  modelModifiers: { default: () => ({}) }
})
const emit = defineEmits(['update:modelValue'])

function emitValue(e) {
  let value = e.target.value
  // 应用修饰符
  if (props.modelModifiers.capitalize) {
    value = value.charAt(0).toUpperCase() + value.slice(1)
  }
  emit('update:modelValue', value)
}
</script>
```

## 7. 源码层面的实现（Vue 3）

Vue 3 在编译阶段会将 `v-model` 转换为相应的 props 和事件处理：

1. **解析阶段**：识别 `v-model` 指令及其参数和修饰符
2. **转换阶段**：根据元素类型生成相应的 props 绑定和事件处理器
3. **代码生成**：将转换后的绑定编译为渲染函数

编译器源码简化示例（伪代码）：

```javascript
// 将 v-model 转换为相应的 props 和事件
function transformVModel(dir, node, context) {
  const { exp, arg, modifiers } = dir
  
  // 确定属性名和事件名
  let propName = arg ? arg : 'modelValue'
  let eventName = `update:${propName}`
  
  // 根据元素类型和修饰符生成代码
  if (node.tagType === ElementTypes.ELEMENT) {
    // 原生元素
    const { tag, props } = node
    
    // 根据元素类型选择适当的属性和事件
    if (tag === 'input') {
      const inputType = findProp(node, 'type')?.value
      if (inputType === 'checkbox') {
        // 复选框处理
        propName = 'checked'
        eventName = 'change'
      }
      // ... 其他类型处理
    }
    
    // 添加属性绑定
    addDirective(node, {
      name: 'bind',
      exp,
      arg: propName
    })
    
    // 添加事件监听
    let eventHandler = exp
    // 应用修饰符
    if (modifiers.includes('trim')) {
      eventHandler = `${exp}.trim()`
    }
    if (modifiers.includes('number')) {
      eventHandler = `_toNumber(${exp})`
    }
    
    addDirective(node, {
      name: 'on',
      arg: eventName,
      exp: eventHandler
    })
  } else {
    // 组件元素处理
    // ...类似逻辑
  }
}
```



## 8. 响应式原理支持

`v-model` 能实现双向绑定，离不开 Vue 的响应式系统支持：

1. **数据响应式**：当绑定的数据变化时，视图会自动更新
2. **事件触发**：用户输入触发事件，更新数据
3. **变更检测**：Vue 检测到数据变化，更新依赖该数据的组件

## 实际应用和最佳实践

1. **表单处理**：使用 `v-model` 简化表单处理

   ```javascript
   <form @submit.prevent="submitForm">
     <input v-model.trim="form.name" placeholder="名称">
     <input v-model.number="form.age" type="number" placeholder="年龄">
     <button type="submit">提交</button>
   </form>
   ```

   

2. **自定义组件**：创建具有 `v-model` 功能的组件

   ```javascript
   <!-- SearchBox.vue -->
   <script setup>
   defineProps(['modelValue'])
   defineEmits(['update:modelValue'])
   </script>
   
   <template>
     <div class="search-box">
       <input
         :value="modelValue"
         @input="$emit('update:modelValue', $event.target.value)"
         placeholder="搜索..."
       >
       <button>搜索</button>
     </div>
   </template>
   ```

   

3. **表单验证**：结合计算属性和侦听器实现验证

   ```javascript
   <script setup>
   import { ref, watch } from 'vue'
   
   const email = ref('')
   const emailError = ref('')
   
   watch(email, (newValue) => {
     const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newValue)
     emailError.value = isValid ? '' : '请输入有效的邮箱地址'
   })
   </script>
   
   <template>
     <div>
       <input v-model="email" placeholder="邮箱">
       <p v-if="emailError" class="error">{{ emailError }}</p>
     </div>
   </template>
   ```

   

理解 `v-model` 的底层原理有助于更好地使用它，尤其是在创建自定义组件和处理复杂表单时。它的设计体现了 Vue 一贯的理念：提供简洁的 API 同时保持灵活性和可扩展性。

# 22.sync修饰符（不推荐，仅作了解）

# 23.ref获取dom和组件

# 24.vue异步更新dom和nextTick

## Vue 异步更新 DOM 的原理

在 Vue 中，当响应式数据发生变化时，视图不会立即更新，而是采用**异步批量更新**策略。这是因为：

1. **性能优化**：如果每次数据变化都立即更新 DOM，在短时间内多次修改同一数据会导致不必要的重复渲染
2. **批量处理**：Vue 将多个数据变化集中到一次 DOM 更新中，减少浏览器重绘和回流

### 异步更新的实现机制

Vue 利用 JavaScript 的事件循环机制：

```javascript
// 伪代码展示 Vue 内部更新机制
function queueUpdate(vm) {
  if (!updatingQueue.includes(vm)) {
    updatingQueue.push(vm)
    
    // 异步执行更新队列
    if (!waiting) {
      waiting = true
      // 将DOM更新放入微任务队列
      Promise.resolve().then(flushUpdates)
    }
  }
}

function flushUpdates() {
  // 执行所有组件的更新
  updatingQueue.forEach(vm => vm._update())
  updatingQueue = []
  waiting = false
}
```



## nextTick 的作用与原理

`nextTick` 是 Vue 提供的一个工具函数，用于在 DOM 更新后执行特定操作。

### 基本用法

在 FirstView.vue 中，我们可以看到典型的 `nextTick` 用法：

```javascript
const handleClick = () => {
  isInputVisible.value = !isInputVisible.value
  if (isInputVisible.value) {
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.focus()
      }
      console.log(inputRef.value)
    })
  }
}
```

这段代码展示了 `nextTick` 的关键应用场景：当修改数据后（切换输入框显示状态），需要等待 DOM 更新完成，才能操作新渲染的元素（设置输入框焦点）。

### 实现原理

`nextTick` 内部使用的是微任务（或在某些环境下使用宏任务），确保回调在当前事件循环的所有同步代码执行完毕后、DOM 更新后执行：

```javascript
// Vue 3 nextTick 简化实现
function nextTick(callback) {
  return Promise.resolve().then(callback || (() => {}))
}
```



## 实际应用场景

1. **操作新渲染的 DOM 元素**

   ```javascript
   <button @click="showList = true">显示列表</button>
   <ul v-if="showList" ref="listRef">
     <li v-for="item in items">{{ item }}</li>
   </ul>
   
   <script setup>
   const showList = ref(false)
   const listRef = ref(null)
   
   function displayList() {
     showList.value = true
     nextTick(() => {
       // 此时列表已渲染完成，可以安全地操作 DOM
       console.log(listRef.value.children.length)
     })
   }
   </script>
   ```

   

2. **获取更新后的 DOM 尺寸**

   ```javascript
   function updateLayout() {
     // 改变影响元素尺寸的数据
     containerStyle.value.width = '500px'
     
     nextTick(() => {
       // 此时 DOM 已更新，可以获取准确尺寸
       const newHeight = containerRef.value.clientHeight
       // 基于新尺寸执行其他操作
     })
   }
   ```

   

3. **在 myCount.vue 中的潜在应用**

   如果要在计数更新后操作 DOM，可以这样使用：

   ```javascript
   const increase = () => {
     count.value++
     nextTick(() => {
       // 此时 DOM 中的计数已更新
       console.log('DOM 已更新，当前显示计数:', countLabel.value.textContent)
     })
   }
   ```

   

## 异步更新和 nextTick 的执行顺序

以下是数据变化到 DOM 更新的完整流程：

1. 数据变化触发 setter

2. 通知依赖该数据的 watcher

3. watcher 被推入异步更新队列

4. 事件循环进入下一个微任务阶段

5. Vue 执行异步更新队列中的 watcher

6. 更新 DOM

7. 执行 nextTick 回调

   ```javascript
   // 执行顺序示例
   count.value++ // 1. 数据变化
   console.log('同步代码') // 2. 同步代码立即执行
   nextTick(() => {
     console.log('DOM 已更新') // 4. 在 DOM 更新后执行
   })
   console.log('更多同步代码') // 3. 继续执行同步代码
   ```

   

## 总结

- Vue 的异步更新机制是性能优化的关键，将多次数据变化合并到一次 DOM 更新
- `nextTick` 提供了在 DOM 更新后执行代码的能力，是处理 DOM 依赖操作的最佳方式
- 在实际开发中，当需要访问或操作最新 DOM 状态时，应当使用 `nextTick`

理解这个机制对于开发高性能 Vue 应用至关重要，尤其是在处理复杂交互和 DOM 操作时。

# 25.自定义指令V-Xxx

# 26.默认插槽slot及其默认值设置

# 27.具名插槽及其简写形式



# 28.作用域插槽

利用slot传值是否是一种变相的父子组件通信？有何区别？明天需手写并探究

# 29.单页应用程序SPA

# 30.Vue的路由插件

# 31.router-link及其两个高亮CSS类

# 32.声明式导航-跳转传参

有多种方式

# 32.路由重定向redirect与404NotFound页面

# 32.路由模式设置

hash和history两种模式的原理

# 33.编程式导航



# 34.组件缓存keep-alive

需要重新仔细看

# 35.防抖实际应用问题：假设设定最后一次请求的等待时间是2s，用户输入信息并等待2s成功发送请求后，前端还未接收到后端返回的数据，此时用户又想发送一次请求，该怎么处理

这是防抖与加载状态管理的典型问题。解决方案如下：

## 处理方法

1. **加入加载状态标记**：使用一个状态变量来跟踪请求是否正在进行中
2. **条件性防抖**：在发送新请求前检查是否有请求正在进行

## 实现代码示例

```javascript
import { ref } from 'vue'

// 加载状态

const isLoading = ref(false)

// 防抖定时器ID

let debounceTimer: number | null = null

// 防抖请求函数

const debounceRequest = async (searchTerm: string) => {

 // 如果已有请求正在进行中

 if (isLoading.value) {

  // 可以选择：取消上一个请求（如果API支持）或者直接返回

  console.log('上一个请求还在进行中...')

  // 选项1：什么都不做，等待上一个请求完成

  return

  

  // 选项2：取消定时器，准备发起新请求

  // if (debounceTimer) {

  //  clearTimeout(debounceTimer)

  // }

 }

 

 // 设置防抖

 if (debounceTimer) {

  clearTimeout(debounceTimer)

 }

 

 debounceTimer = setTimeout(async () => {

  try {

   isLoading.value = true

   // 发送API请求

   const response = await fetch(`/api/search?term=${searchTerm}`)

   const data = await response.json()

   // 处理返回数据

   console.log(data)

  } catch (error) {

   console.error('请求出错:', error)

  } finally {

   isLoading.value = false

  }

 }, 2000)

}
```



## 在模板中使用

```javascript
<template>


 <input 

  type="text" 

  v-model="searchTerm" 

  @input="debounceRequest(searchTerm)" 

  :disabled="isLoading"

 />

  <div v-if="isLoading">正在加载...</div>

</template>
```

这种方法能够:

1. 显示加载状态给用户
2. 防止重复请求
3. 在必要时可以取消旧请求（如果API支持取消操作）

你可以根据具体需求调整这个实现，例如使用 `AbortController` 来取消未完成的请求。



# 36.Vuex

# 37.Vuex中的辅助函数mapSate()

# 38.Vuex中的mapMutations()

# 39.Vuex中的mapActions()

# 40.Vuex中的mapGetters()

# 41.Vuex中的模块划分以及如何访问调用子模块内部数据、方法

# 41.首屏加载优化与路由懒加载

# 42.Vue2和Vue3各自实现响应式的底层原理

## Vue2 响应式原理：Object.defineProperty

Vue2 使用 `Object.defineProperty` 实现响应式，这可以从 1.html 的 Vue2 示例中看出。

### 核心实现步骤

1. **初始化过程**：Vue 实例创建时，会遍历 `data` 对象的所有属性
2. **数据劫持**：使用 `Object.defineProperty` 为每个属性设置 getter/setter
3. **依赖收集**：当模板中使用某个属性时，其 getter 会将当前 Watcher 添加到依赖中
4. **更新通知**：当属性值变化时，setter 会通知相关 Watcher 更新视图

### 代码示例（Vue2 内部实现）

```javascript
// 简化版 Vue2 响应式实现

function observe(obj) {

 if (!obj || typeof obj !== 'object') return;

 

 Object.keys(obj).forEach(key => {

  defineReactive(obj, key, obj[key]);

 });

}

function defineReactive(obj, key, val) {

 // 递归处理嵌套对象

 observe(val);

 

 const dep = new Dep(); // 依赖收集器

 

 Object.defineProperty(obj, key, {

  get() {

   // 依赖收集

   if (Dep.target) {

    dep.depend();

   }

   return val;

  },

  set(newVal) {

   if (val === newVal) return;

   val = newVal;

   // 通知更新

   dep.notify();

  }

 });

}
```



### 局限性

1. **无法检测对象属性的添加或删除**：只能追踪已经存在的属性
2. **无法直接监听数组索引和长度变化**：需要重写数组方法（push, pop等）
3. **需要递归遍历对象的所有属性**：性能成本高
4. **需要额外的 $set 和 $delete 方法**：处理动态添加/删除属性

## Vue3 响应式原理：Proxy

Vue3 使用 ES6 的 `Proxy` 实现响应式，这可以从 vue_project_1 示例中看出，例如 counter.ts 中的 ref 和 computed。

### 核心实现步骤

1. **代理对象**：使用 `Proxy` 创建原始对象的代理
2. **拦截操作**：通过拦截器捕获各种对象操作（读取、设置、删除等）
3. **依赖追踪**：通过 `effect` 系统记录依赖关系
4. **触发更新**：当数据变化时，触发相关 effect 重新执行

### 代码示例（Vue3 内部实现）

```javascript
// 简化版 Vue3 响应式实现

function reactive(target) {

 if (!isObject(target)) return target;

 

 const handler = {

  get(target, key, receiver) {

   const result = Reflect.get(target, key, receiver);

   // 依赖追踪

   track(target, key);

   // 递归处理嵌套对象

   return isObject(result) ? reactive(result) : result;

  },

  set(target, key, value, receiver) {

   const oldValue = target[key];

   const result = Reflect.set(target, key, value, receiver);

   if (hasChanged(value, oldValue)) {

    // 触发更新

    trigger(target, key);

   }

   return result;

  },

  deleteProperty(target, key) {

   const hadKey = hasOwn(target, key);

   const result = Reflect.deleteProperty(target, key);

   if (hadKey && result) {

    // 触发更新

    trigger(target, key);

   }

   return result;

  }

 };

 

 return new Proxy(target, handler);

}
```



### 优势

1. **全方位的拦截**：可以监听属性的添加、删除和数组索引变化
2. **惰性追踪**：按需追踪，不需要递归遍历
3. **性能更好**：代理整个对象而非每个属性
4. **无需特殊 API**：不需要 `$set` 或 `$delete`

## 两者在项目中的体现

### Vue2 项目（1.html）

```javascript
const app = new Vue({

 data: {

  message: 'Hello Vue!',

  items: [...]

 },

 computed: {

  doubleCount() { return this.count * 2 }

 },

 methods: {

  increaseCount() { this.count += 1 }

 }

})
```



### Vue3 项目（vue_project_1）

```javascript
// counter.ts

export const useCounterStore = defineStore('counter', () => {

 const count = ref(0)

 const doubleCount = computed(() => count.value * 2)

 function increment() {

  count.value++

 }

 return { count, doubleCount, increment }

})

// myCount.vue

const count = ref(0)

const increase = () => {

 count.value++

}
```



## 总结对比

| 特性              | Vue2 (Object.defineProperty) | Vue3 (Proxy)               |
| ----------------- | ---------------------------- | -------------------------- |
| 监测属性添加/删除 | 不支持，需使用 $set/$delete  | 原生支持                   |
| 数组索引变化监测  | 不支持，需使用特殊方法       | 原生支持                   |
| 实现复杂度        | 需递归遍历每个属性           | 代理整个对象               |
| 性能              | 较差，初始化开销大           | 更好，惰性追踪             |
| 兼容性            | 更好，IE 支持                | 不支持 IE，需要 polyfill   |
| API 设计          | 选项式 API，this 上下文      | 组合式 API，明确的依赖关系 |

Vue3 的响应式系统不仅性能更好，也使得代码组织更加灵活，体现在 vue_project_1 项目中的 `setup` 语法和 ref/computed 等 API 的使用方式上。

# 43.setup选项及其在生命周期中的执行时机



# 43.reactive()和ref()

# 44.watch()

# 45.组合式API的生命周期函数

# 46.组合式API下的父子组件通信

# 47.defineProps()、defineEmit()编译宏

# 48.模板引用和defineExpose()宏函数

# 49.defineOptions()

# 50.Pinia状态管理

# 51.storeToRefs()保持解构数据的响应式

# 52.Pinia持久化

# 53.husky代码检查工作流？？？



# 54. Vue2和Vue3的diff算法

Diff 算法是虚拟 DOM 框架中的核心技术，用于比较新旧虚拟 DOM 树的差异，从而最小化实际 DOM 操作。Vue2 和 Vue3 在 Diff 算法上有显著区别，下面将详细解析两者的实现原理。

## 一、Vue2 的 Diff 算法

Vue2 采用的是**基于 Snabbdom** 改进的双端比较算法。

### 1. 基本流程

Vue2 的 Diff 算法主要工作在同层级节点间比较，采用"双端四指针"的方式：

```javascript
// Vue2 diff 算法核心逻辑简化示意
function patchVnode(oldVnode, vnode) {
  // 1. 新旧节点完全相同，无需更新
  if (oldVnode === vnode) return;
  
  // 2. 如果都是静态节点，跳过更新
  if (vnode.isStatic && oldVnode.isStatic) return;
  
  // 3. 新节点是文本节点，直接更新文本
  if (vnode.isText) {
    // 更新文本内容
    return;
  }
  
  // 4. 都有子节点，进行子节点比较
  if (oldVnode.children && vnode.children) {
    updateChildren(oldVnode.children, vnode.children);
  }
  // 5. 新节点有子节点，老节点无子节点，清空老节点内容，添加新子节点
  else if (vnode.children) {
    // 添加子节点
  }
  // 6. 老节点有子节点，新节点无子节点，删除所有老子节点
  else if (oldVnode.children) {
    // 删除子节点
  }
}
```



### 2. 双端比较算法

Vue2 的核心 Diff 算法在 `updateChildren` 函数中：

```javascript
function updateChildren(oldCh, newCh) {
  let oldStartIdx = 0;
  let oldEndIdx = oldCh.length - 1;
  let newStartIdx = 0;
  let newEndIdx = newCh.length - 1;
  
  let oldStartVnode = oldCh[oldStartIdx];
  let oldEndVnode = oldCh[oldEndIdx];
  let newStartVnode = newCh[newStartIdx];
  let newEndVnode = newCh[newEndIdx];
  
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 跳过已移动的节点
    if (!oldStartVnode) {
      oldStartVnode = oldCh[++oldStartIdx];
    } else if (!oldEndVnode) {
      oldEndVnode = oldCh[--oldEndIdx];
    }
    // 1. 头头比较
    else if (sameVnode(oldStartVnode, newStartVnode)) {
      patchVnode(oldStartVnode, newStartVnode);
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    } 
    // 2. 尾尾比较
    else if (sameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode);
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    } 
    // 3. 头尾比较
    else if (sameVnode(oldStartVnode, newEndVnode)) {
      // 将旧的头节点移到尾部
      patchVnode(oldStartVnode, newEndVnode);
      // 实际 DOM 操作: 将老头节点移到老尾节点之后
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    } 
    // 4. 尾头比较
    else if (sameVnode(oldEndVnode, newStartVnode)) {
      // 将旧的尾节点移到头部
      patchVnode(oldEndVnode, newStartVnode);
      // 实际 DOM 操作: 将老尾节点移到老头节点之前
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    } 
    // 5. 上述四种策略都失败，通过key映射查找
    else {
      // 创建老节点的key -> index映射表
      if (!keyMap) {
        keyMap = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
      }
      // 在老节点中找与新节点头具有相同key的节点下标
      const idxInOld = keyMap[newStartVnode.key];
      
      if (!idxInOld) {
        // 没找到，创建新节点
      } else {
        const vnodeToMove = oldCh[idxInOld];
        if (vnodeToMove.tag !== newStartVnode.tag) {
          // 标签不同，创建新节点
        } else {
          // 更新节点并移动到正确位置
          patchVnode(vnodeToMove, newStartVnode);
          oldCh[idxInOld] = undefined; // 标记为已处理
          // 移动节点
        }
      }
      newStartVnode = newCh[++newStartIdx];
    }
  }
  
  // 处理剩余节点
  if (oldStartIdx > oldEndIdx) {
    // 老节点都处理完了，但新节点还有，批量创建新节点
    addVnodes(newCh, newStartIdx, newEndIdx);
  } else if (newStartIdx > newEndIdx) {
    // 新节点都处理完了，老节点还有，批量删除老节点
    removeVnodes(oldCh, oldStartIdx, oldEndIdx);
  }
}
```



### 3. Vue2 Diff 算法的特点

- **双端比较**：从两端向中间比较，适应多种常见操作模式
- **只进行同层比较**：不会跨级别比较节点
- **依赖唯一key值**：通过key快速识别节点
- **启发式算法**：通过四种基本模式优先处理最常见的操作
- **时间复杂度**：理想情况O(n)，最坏情况O(n²)

## 二、Vue3 的 Diff 算法

Vue3 对 Diff 算法进行了全面重构，采用了更加高效的方式，主要引入了**快速路径**和**最长递增子序列算法**。

### 1. 基本流程

Vue3 的 Diff 算法整体流程如下：

```javascript
// Vue3 diff 算法核心逻辑简化示意
function patchKeyedChildren(c1, c2, container) {
  // 1. 从头部开始比对
  // 2. 从尾部开始比对
  // 3. 处理剩余的节点
  //   3.1 处理新增节点
  //   3.2 处理删除节点
  //   3.3 处理未知序列
}
```



### 2. 核心优化策略

Vue3 的 Diff 算法相比 Vue2 有几个重要优化点：

#### 2.1 静态提升和标记

```javascript
// 将静态节点提升到render函数外
const hoisted = createVNode("div", null, "静态内容");

// 在渲染函数中直接使用
function render() {
  return hoisted;
}
```



#### 2.2 事件缓存

```javascript
// 事件处理函数缓存
function render(ctx) {
  return createVNode("button", {
    onClick: cache[0] || (cache[0] = e => ctx.onClick(e))
  });
}
```



#### 2.3 分块比较 + 最长递增子序列

Vue3 的核心 Diff 算法：

```javascript
function patchKeyedChildren(c1, c2, container) {
  let i = 0;
  const l2 = c2.length;
  let e1 = c1.length - 1; // 旧节点的尾部索引
  let e2 = l2 - 1; // 新节点的尾部索引
  
  // 1. 从头部开始比较
  while (i <= e1 && i <= e2) {
    const n1 = c1[i];
    const n2 = c2[i];
    if (isSameVNodeType(n1, n2)) {
      patch(n1, n2);
    } else {
      break;
    }
    i++;
  }
  
  // 2. 从尾部开始比较
  while (i <= e1 && i <= e2) {
    const n1 = c1[e1];
    const n2 = c2[e2];
    if (isSameVNodeType(n1, n2)) {
      patch(n1, n2);
    } else {
      break;
    }
    e1--;
    e2--;
  }
  
  // 3. 处理剩余的节点
  if (i > e1) {
    // 3.1 如果旧节点已处理完，但新节点还有，说明需要新增节点
    if (i <= e2) {
      const nextPos = e2 + 1;
      const anchor = nextPos < l2 ? c2[nextPos].el : null;
      while (i <= e2) {
        patch(null, c2[i], container, anchor);
        i++;
      }
    }
  } else if (i > e2) {
    // 3.2 如果新节点已处理完，但旧节点还有，说明需要删除节点
    while (i <= e1) {
      unmount(c1[i]);
      i++;
    }
  } else {
    // 3.3 处理未知序列
    const s1 = i;
    const s2 = i;
    
    // 3.3.1 构建key到新索引的Map
    const keyToNewIndexMap = new Map();
    for (i = s2; i <= e2; i++) {
      const nextChild = c2[i];
      if (nextChild.key != null) {
        keyToNewIndexMap.set(nextChild.key, i);
      }
    }
    
    // 3.3.2 更新和移除旧节点
    let j;
    let patched = 0;
    const toBePatched = e2 - s2 + 1;
    let moved = false;
    let maxNewIndexSoFar = 0;
    const newIndexToOldIndexMap = new Array(toBePatched).fill(0);
    
    for (i = s1; i <= e1; i++) {
      const prevChild = c1[i];
      
      if (patched >= toBePatched) {
        // 如果更新的数量已经达到新节点的数量，说明剩余的旧节点都是多余的
        unmount(prevChild);
        continue;
      }
      
      let newIndex;
      if (prevChild.key != null) {
        // 通过key快速找到新的索引位置
        newIndex = keyToNewIndexMap.get(prevChild.key);
      } else {
        // 没有key，需要遍历查找
        for (j = s2; j <= e2; j++) {
          if (newIndexToOldIndexMap[j - s2] === 0 && 
              isSameVNodeType(prevChild, c2[j])) {
            newIndex = j;
            break;
          }
        }
      }
      
      if (newIndex === undefined) {
        // 在新节点中找不到，需要卸载
        unmount(prevChild);
      } else {
        // 保存旧索引到新索引的映射，加1是为了避开0值（表示未建立映射）
        newIndexToOldIndexMap[newIndex - s2] = i + 1;
        
        // 检测是否需要移动
        if (newIndex >= maxNewIndexSoFar) {
          maxNewIndexSoFar = newIndex;
        } else {
          moved = true;
        }
        
        // 更新节点
        patch(prevChild, c2[newIndex]);
        patched++;
      }
    }
    
    // 3.3.3 移动和挂载新节点
    if (moved) {
      // 计算最长递增子序列
      const increasingNewIndexSequence = getSequence(newIndexToOldIndexMap);
      j = increasingNewIndexSequence.length - 1;
      
      // 从后向前遍历，确保正确的位置引用
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : null;
        
        if (newIndexToOldIndexMap[i] === 0) {
          // 挂载新节点
          patch(null, nextChild, container, anchor);
        } else if (moved) {
          // 移动节点
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild.el, container, anchor);
          } else {
            j--;
          }
        }
      }
    }
  }
}
```



#### 2.4 最长递增子序列算法

Vue3 使用最长递增子序列算法来最小化DOM移动操作：

```javascript
function getSequence(arr) {
  const p = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p[i] = j;
        result.push(i);
        continue;
      }
      
      u = 0;
      v = result.length - 1;
      
      while (u < v) {
        c = (u + v) >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  
  u = result.length;
  v = result[u - 1];
  
  while (u-- > 0) {
    result[u] = v;
    v = p[v];
  }
  
  return result;
}
```



### 3. Vue3 Diff 算法的特点

- **快速路径优化**：优先处理开头和结尾的相同节点
- **最长递增子序列**：最小化DOM移动操作
- **静态提升**：将静态内容提升到render函数外部
- **事件缓存**：缓存事件处理函数避免不必要的更新
- **块级追踪**：只比对带有patchflag的动态节点

## 三、Vue2 与 Vue3 Diff 算法的主要区别

| 特性         | Vue2                 | Vue3                    |
| ------------ | -------------------- | ----------------------- |
| 比较策略     | 双端比较（四指针法） | 快速路径+最长递增子序列 |
| 静态内容处理 | 每次重新渲染         | 静态提升，一次性创建    |
| 事件处理     | 动态绑定             | 缓存事件处理函数        |
| 块追踪       | 不支持               | 支持，只追踪动态内容    |
| 编译优化     | 运行时优化为主       | 更多编译时优化          |
| Fragment支持 | 不原生支持           | 原生支持多根节点        |

## 四、总结

Vue3 的 Diff 算法相比 Vue2 有以下重大改进：

1. **更精准的更新机制**：通过静态标记，只追踪和比对动态内容
2. **更高效的DOM操作**：使用最长递增子序列算法最小化DOM移动
3. **更好的编译时优化**：大量优化从运行时转移到编译时
4. **更快的初次渲染**：静态内容提升和事件缓存
5. **更低的内存占用**：更有效的数据结构和算法

Vue3 的 Diff 算法通过以上优化，显著提升了渲染性能，特别是对于大型应用和动态内容较多的场景，性能提升更为明显。

# 55. h()

Vue 中的 `h()` 函数是核心的 **创建虚拟节点 (VNode)** 的工具函数。它是 Vue 3 版本的 **响应式渲染系统**中的关键一环，用于构建、描述和渲染组件或元素。

### 1. `h()` 函数概述

在 Vue 3 中，`h()` 是 **虚拟 DOM（VNode）创建函数**，负责构建组件的结构（虚拟节点）。它是渲染过程的基础，实际上是 `createVNode` 函数的别名，供开发者直接调用。

简单来说，`h()` 用来 **描述 UI**。它接收 Vue 组件、HTML 标签或其它自定义元素，返回一个虚拟节点（VNode），这些 VNode 在更新时会被 Vue diff 算法处理。

```
const vnode = h('div', { id: 'app' }, 'Hello, Vue!');
```

------

### 2. `h()` 函数的参数

`h()` 函数接收的参数根据用途有所不同，但通常情况下，它会接收 **三个参数**：

1. **第一个参数：标签名或组件对象**

   - 如果是 **HTML 标签**，比如 `'div'`、`'p'`，它会创建一个 **原生 HTML 元素的 VNode**。
   - 如果是 **组件对象**，它会创建该组件的 **VNode**。

2. **第二个参数：属性（props）对象**

   这是一个 **可选的对象**，包含传递给元素或组件的属性。它包括普通 HTML 属性，也可以包含 Vue 组件的 props 数据。对于原生元素（如 `div`），这些就是标准的 HTML 属性；对于组件，通常是 props。

3. **第三个参数：子元素（children）**

   这个参数可以是 **文本节点、其他 VNode，或者一个 VNode 数组**。它表示该节点的内容。

------

### 3. `h()` 函数的返回值：VNode

返回的 **虚拟节点** 是一个 JavaScript 对象，包含了 DOM 节点所需的所有信息。VNode 在 Vue 内部用于高效的 **渲染更新**，通过 diff 算法与现有的虚拟 DOM 树进行对比，来计算出最小的 DOM 更新。

一个简单的 VNode 结构看起来像这样：

```
{
  type: 'div', // VNode 类型（HTML 标签名或组件）
  props: { id: 'app' }, // 节点的 props
  children: ['Hello, Vue!'], // 子元素，文本节点或者其他 VNode
  key: null, // 可选的 key 属性，用于 diff 算法
  el: null, // 真实 DOM 节点（在首次渲染后会被赋值）
  componentInstance: null, // 对应的组件实例（如果是组件的话）
  shapeFlag: 1 // 用于标识该 VNode 的类型（例如，是否为组件、数组等）
}
```

------

### 4. `h()` 的常见用途

#### ✅ 创建原生 DOM 元素

```
const vnode = h('div', { class: 'container' }, 'Hello, Vue!');
```

- 这个调用创建了一个 `div` 元素，带有 `class="container"` 属性，内容为 `'Hello, Vue!'`。

#### ✅ 创建组件 VNode

```
const vnode = h(MyComponent, { msg: 'Hello!' });
```

- 这里 `MyComponent` 是一个 Vue 组件，`msg` 是传递给该组件的 props。

#### ✅ 创建带有子节点的组件

```
const vnode = h(MyComponent, { msg: 'Hello!' }, [
  h('span', {}, 'Child 1'),
  h('span', {}, 'Child 2')
]);
```

- 这将创建 `MyComponent` 组件，并包含两个 `span` 元素作为它的子节点。

#### ✅ 条件渲染和列表渲染

```
const vnode = h('div', {}, [
  condition ? h('p', {}, 'True') : h('p', {}, 'False'),
  h('ul', {}, items.map(item => h('li', {}, item)))
]);
```

- 这里，使用条件渲染创建不同的元素，也可以渲染列表（`items.map`）中的每个元素。

------

### 5. VNode 的重要属性

`h()` 函数返回的 VNode 对象包含了一些重要的属性，主要用于 Vue 在渲染过程中的优化和差异比较（diffing）：

1. **`type`**: 节点类型。它可以是字符串（表示 HTML 标签名），也可以是组件对象（表示 Vue 组件）。
2. **`props`**: 节点的属性。对于原生元素，属性就是 HTML 属性；对于组件，属性是组件的 props。
3. **`children`**: 子节点，可以是字符串（文本节点）或者 VNode 数组（子元素）。
4. **`key`**: 用于列表渲染时标识节点的唯一性，帮助 Vue 做高效的 diff。
5. **`el`**: 对应的真实 DOM 元素，在首次渲染后会被赋值。
6. **`componentInstance`**: 如果是组件 VNode，包含对应的组件实例。
7. **`shapeFlag`**: 用于标识该 VNode 的类型，如组件、元素、文本等。

------

### 6. `h()` 和 `createVNode()` 的关系

实际上，`h()` 只是 Vue 3 中 `createVNode()` 的别名，它们本质上是做一样的事情：

- `h()` 是开发者使用的 **简写方式**。
- `createVNode()` 是 Vue 内部的 **实际实现**。

```
// h() = createVNode()
const vnode = createVNode('div', { id: 'app' }, 'Hello, Vue!');
```

在 Vue 内部，`h()` 会调用 `createVNode()` 来生成最终的虚拟节点。它的简洁性使得开发者能够在模板外轻松地构建组件、动态渲染内容、或者处理高阶组件。

------

### 7. `h()` 和模板语法的关系

Vue 的模板语法是 **基于 `h()` 函数的**。实际上，Vue 内部会将模板编译成 `render` 函数，而这个 `render` 函数使用的就是 `h()` 来创建虚拟节点。

**例如：**

```
<!-- Vue Template -->
<div id="app">
  <p>{{ message }}</p>
</div>
```

在 Vue 编译后，会变成类似以下形式：

```
const render = () => {
  return h('div', { id: 'app' }, [
    h('p', {}, this.message)
  ]);
}
```

------

### 8. `h()` 的性能

`h()` 函数本身非常轻量，它只是创建一个 JavaScript 对象，并没有直接操作 DOM。虚拟节点（VNode）是用于 Vue 内部的 diff 算法和渲染流程的。

通过这种方式，Vue 可以进行 **高效的 UI 更新**，因为它避免了直接操作 DOM 的成本，而是通过虚拟节点进行比较，找出最小的差异，并仅更新需要更新的部分。

------

### 总结

`h()` 是 Vue 3 渲染引擎中的核心函数，它用于创建虚拟节点（VNode）。它的作用是：

1. 描述一个 DOM 元素或者组件实例。
2. 在 Vue 内部用于高效的 UI 渲染和更新。

它通常用于：

- 渲染组件
- 条件渲染
- 列表渲染
- 动态创建节点

总之，`h()` 是 Vue 3 渲染系统中的一个重要工具函数，开发者通过它可以创建灵活和高效的虚拟节点。

# 56. Block Tree

**Block Tree** 是 Vue 3 中虚拟 DOM 的 **优化机制**，用于 **优化组件渲染和更新过程**，尤其是在复杂的组件树中，提高渲染性能。它是 Vue 3 中引入的 **Block-based rendering**（基于块的渲染）概念的一部分。

Block Tree 的目标是将渲染过程中的 DOM 更新任务分成更小的“块”，并将这些“块”标记为一个单独的单位。通过这种方式，Vue 只需要在必要时更新这些块，而不是重新渲染整个组件树，从而大大提高了性能。

### **Block Tree 的基本原理**

#### 1. **虚拟节点的分块**

在 Vue 3 中，组件的 **渲染** 被分割成更细粒度的 **块（Block）**。这些块是包含一系列更新操作的逻辑单元，Vue 将每个渲染的组件、元素、甚至指令，都当作一个块进行管理。

- **每个块**都包含了与它关联的子节点、指令、事件等信息。
- Vue 将组件树拆分成一个个单独的渲染“块”，并且每个块都有自己对应的更新逻辑。

#### 2. **差异化更新**

当组件或数据发生变化时，Vue 3 会比较当前渲染和上一轮渲染的 **Block Tree**，并仅更新发生变化的部分。这样，避免了 **全局的重渲染**，从而减少了性能消耗。

- **Block** 的细粒度更新能够让 Vue 更高效地选择需要更新的部分，而不是从头开始重新渲染。
- 每个 `VNode` 和块都存储它的 **动态子节点**，这些动态子节点可以被标记、比较和更新。

#### 3. **当前块（Current Block）**

`currentBlock` 是 Vue 内部的一个重要概念，它标记了当前正在处理的块。每当 Vue 在渲染时，它都会记录当前的 **block**，并在更新时更新 `currentBlock`。

- Vue 会维护一个 **Block Stack**（块堆栈），它记录了当前正在渲染的块。
- 当某个块被创建（例如，一个组件），它会把该块压入堆栈。
- 一旦该块渲染完成，Vue 会从堆栈中 **弹出** 该块。

通过这种方式，Vue 3 可以灵活地管理多个渲染块，并确保每个块在更新时的独立性和高效性。

#### 4. **嵌套块**

Vue 3 的渲染系统支持嵌套块的概念。例如，如果一个组件内部还有子组件渲染，那么子组件的渲染过程也会形成一个新的块，并且这个子块可以独立于父块进行更新。

- 嵌套块允许 Vue 将组件的渲染逻辑层级化，不同层级的块可以独立更新，而不影响其它层级。

### **Block Tree 在 Vue 3 中的实现**

在 Vue 3 中，Block Tree 实际上是通过 **`Block`** 和 **`VNode`** 对象的协作来实现的。具体来说，`VNode` 会保存每个组件的渲染信息，`Block` 则是由 Vue 内部的渲染算法（包括 `VNode` 和更新函数）来管理的。

1. **`VNode`**：代表虚拟节点的基本单位，它不仅保存了节点本身的信息，还会存储与该节点相关的渲染块。
2. **`Block`**：每个 Block 对应一个渲染“块”，包含该块的 **更新信息**，例如子节点、动态数据、事件绑定等。

当 Vue 渲染组件时，所有相关的 `VNode` 和 `Block` 会被组合成一个树状结构，这个结构的根节点对应着整个组件，子节点对应子组件和 DOM 元素。

### **Block Tree 的优化优势**

1. **精细的更新粒度**：
   - 通过 **Block Tree**，Vue 只更新发生变化的 **块**，而不是整个组件。这样即使组件的某些部分发生了变化，也不需要完全重渲染。
   - 这种 **增量更新** 提高了性能，尤其是在大型应用中，减少了不必要的 DOM 操作。
2. **避免重复渲染**：
   - Vue 3 使用 **block-based diffing** 来避免每次渲染时都比较整个虚拟 DOM 树。每次数据更新时，Vue 仅更新那些发生变化的部分，避免了不必要的渲染。
3. **管理复杂的组件层级**：
   - 在具有深层嵌套和复杂子组件的应用中，Block Tree 允许 Vue 将每个子组件的渲染和更新作为 **独立的块** 进行管理，从而避免了多层组件树之间的相互影响。
4. **更好的支持异步渲染和 Suspense**：
   - 在异步渲染（例如 Suspense）中，Vue 可以动态调整和更新渲染的块，确保界面更平滑地过渡，同时不影响其它部分的渲染。

### **Block Tree 与 Vue 2 的渲染差异**

Vue 2 使用的是 **基于虚拟 DOM 的渲染机制**，它在进行组件更新时，会将整个组件树进行对比和更新。而在 Vue 3 中，**Block Tree** 使得 Vue 3 变得更加 **高效**，通过将渲染过程分割成多个 **可独立更新的块**，避免了 Vue 2 中渲染和 diff 的性能瓶颈。

------

### **Block Tree 的内部结构**

为了更好理解 Block Tree，下面是一些关键概念的详细说明：

#### 1. **`Block`** 和 **`VNode`** 的关系

- **Block**：是渲染的单位，每个 `VNode`（虚拟节点）都可能包含一个或多个 **动态子节点**。Block 是 Vue 3 渲染优化的核心，它通过记录与当前渲染相关的动态子节点和更新信息，来提高性能。
- **VNode**：是一个描述渲染对象的虚拟节点，包含了节点类型、属性、子节点、动态属性等信息。每个 `VNode` 都有可能属于一个 **Block**，并且与该块的更新逻辑密切相关。

#### 2. **更新过程中的 Block 切换**

- 当 Vue 进行更新时，它会根据块的更新状态来决定哪些部分需要重新渲染。比如，如果某个块的动态属性或内容发生变化，Vue 会直接更新该块的 **VNode**。

#### 3. **Block 树的差异化处理**

- 当组件的 DOM 更新时，Vue 通过 **Block Tree** 来 **对比当前块和上一个块**，找到差异并只更新不同的部分，而不是重渲染整个组件树。

------

### **总结**

**Block Tree** 是 Vue 3 中的一种渲染优化机制，旨在通过 **块级更新** 来提升性能，避免全局的重渲染。它通过将渲染任务划分成多个 **渲染块**，并根据需要更新这些块的方式，大幅提高了 Vue 在复杂组件和大型应用中的渲染效率。

主要特点：

1. **渲染粒度更细**，只更新发生变化的部分。
2. **减少不必要的更新**，避免了整体渲染。
3. 支持 **动态更新** 和异步渲染，提高了框架的灵活性和性能。

Block Tree 是 Vue 3 渲染系统的核心优化之一，它通过对组件的渲染和更新进行更精细的控制，提高了大规模应用的渲染性能。
