
/*
* Vue-Quill-Editor index.js
* Author: surmon@foxmail.com
* Github: https://github.com/surmon-china/vue-quill-editor
*/

import _Quill from 'quill'
import vue3Quill from './src/index.vue'

const Quill = (window as any).Quill || _Quill
const install = (Vue:any) => {
  Vue.component(vue3Quill.name, vue3Quill)
}

const VueQuillEditor = { Quill, vue3Quill, install }

export default VueQuillEditor
export { Quill, vue3Quill, install }

// import type { App } from "vue";
// import vue3Quill from "../dist/index";
// declare const install: (app: App, opt: any) => void;
// export { vue3Quill, install };
// declare const _default: {
//     install: (app: App<any>, opt: any) => void;
// };
// export default _default;
