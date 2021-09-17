# vue3-quill

## 安装
```
npm install --save-dev vue3-quill-edit
```

### 全局使用

```
import vue3Quill from "vue3-quill-edit"

main.ts 中注册组件
app.use(vue3Quill)

App.vue 使用组件
<vue3-quill v-model:value="content"/>
```
### 局部使用
```
import {vue3Quill} from "@xianfe/vue-quill";
app.components("vue3-quill",vue3Quill)
App.vue 使用组件
<vue3-quill v-model:value="content"/>
```

### Api 介绍
 | 成员       | 说明    |  类型  |  默认值|
-|-|-|-|
| v-model:value | 输入框内容  |   Delta | {ops:[]}
| enable        | 是否禁止输入      |   boolean    | true表示可以输入
| placeholder        | 无内容时的提示语      |   string    | ""
| theme | 主题 | "snow", "bubble" | snow
| toolbar | 头部小工具 | String, Array, Object| string的值有essential基础头部，minimal迷你头部，full所以头部 |也可以根据需求自定义头部传入对应格式的对象或者数据
| handlers| 重写头部小工具点击事件 | Object | {}
|modules | modules拓展配置项 |  { name: string; module: any; options?: object }[] | []
| options |  quill其他配置  | QuillOptionsStatic |{}
|height | 组件内容区高度设置 | string | auto

#### 方法

|成员|说明| 参数
-|-|-|
|blur| 失去焦点时触发 | Quill实例
|focus|获取焦点时触发 | Quill实例
|change|内容发送变化时触发| quill, html, text
|selectionChange| 鼠标选择内容变化时 | range, oldRange, source




