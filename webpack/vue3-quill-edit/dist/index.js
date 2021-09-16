(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('quill'), require('vue'), require('quill/dist/quill.core.css'), require('quill/dist/quill.snow.css'), require('quill/dist/quill.bubble.css')) :
  typeof define === 'function' && define.amd ? define(['exports', 'quill', 'vue', 'quill/dist/quill.core.css', 'quill/dist/quill.snow.css', 'quill/dist/quill.bubble.css'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.index = {}, global.Quill$1, global.vue));
}(this, (function (exports, Quill$1, vue) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var Quill__default = /*#__PURE__*/_interopDefaultLegacy(Quill$1);

  const toolbarOptions = {
      essential: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
          ['blockquote', 'code-block', 'link'],
          [{ color: [] }, 'clean'],
      ],
      minimal: [
          [{ header: 1 }, { header: 2 }],
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
      ],
      full: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ header: 1 }, { header: 2 }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ direction: 'rtl' }],
          [{ size: ['small', false, 'large', 'huge'] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
          ['link', 'video', 'image'],
          ['clean'],
      ],
  };

  var script = vue.defineComponent({
      name: "vue3Quill",
      props: {
          content: {
              type: String,
          },
          value: {
              type: String,
          },
          contentType: {
              type: String,
              default: "delta",
              validator: (value) => {
                  return ["delta", "html", "text"].includes(value);
              },
          },
          enable: {
              type: Boolean,
              default: true,
          },
          readOnly: {
              type: Boolean,
              default: false,
          },
          placeholder: {
              type: String,
              required: false,
          },
          theme: {
              type: String,
              default: "snow",
              validator: (value) => {
                  return ["snow", "bubble", ""].includes(value);
              },
          },
          toolbar: {
              type: [String, Array, Object],
              required: false,
              validator: (value) => {
                  if (typeof value === "string" && value !== "") {
                      return value.charAt(0) === "#"
                          ? true
                          : Object.keys(toolbarOptions).indexOf(value) !== -1;
                  }
                  return true;
              },
          },
          modules: {
              type: Object,
              required: false,
          },
          options: {
              type: Object,
              required: false,
          },
          globalOptions: {
              type: Object,
              required: false,
          },
      },
      emits: ["blur", "focus", "update:value", "change", "ready"],
      setup(props, { emit }) {
          vue.onBeforeUnmount(() => {
              quill = null;
          });
          let quill;
          let options;
          let _content = "";
          const editor = vue.ref();
          vue.onMounted(() => {
              init();
          });
          function init() {
              if (!editor.value)
                  return;
              options = composeOptions();
              // Register modules
              if (props.modules) {
                  if (Array.isArray(props.modules)) {
                      for (const module of props.modules) {
                          Quill__default['default'].register(`modules/${module.name}`, module.module);
                      }
                  }
                  else {
                      Quill__default['default'].register(`modules/${props.modules.name}`, props.modules.module);
                  }
              }
              quill = new Quill__default['default'](editor.value, options);
              // Remove editor class when theme changes
              if (props.theme !== "bubble")
                  editor.value.classList.remove("ql-bubble");
              if (props.theme !== "snow")
                  editor.value.classList.remove("ql-snow");
              console.log(props.value);
              if (props.value || props.content) {
                  console.log(12121);
                  quill.clipboard.dangerouslyPasteHTML(props.value || props.content);
              }
              // Disabled editor
              if (!props.enable) {
                  quill.enable(true);
              }
              // Set event handlers
              quill.on("text-change", (delta, oldDelta, source) => {
                  let html = "";
                  if (editor.value && editor.value.children) {
                      html = editor.value.children[0].innerHTML;
                  }
                  const text = quill ? quill.getText() : '';
                  if (html === "<p><br></p>")
                      html = "";
                  _content = html;
                  emit("update:value", _content);
                  emit("change", { html, text, quill });
              });
              quill.on("selection-change", (range) => {
                  if (!range) {
                      emit("blur", quill);
                  }
                  else {
                      emit("focus", quill);
                  }
              });
              quill
                  .getModule("toolbar") ? quill
                  .getModule("toolbar").container.addEventListener("mousedown", (e) => {
                  e.preventDefault();
              }) : '';
              // Emit ready event
              emit("ready", quill);
          }
          function composeOptions() {
              const clientOptions = {};
              if (props.theme !== "")
                  clientOptions.theme = props.theme;
              if (props.readOnly)
                  clientOptions.readOnly = props.readOnly;
              if (props.placeholder)
                  clientOptions.placeholder = props.placeholder;
              if (props.toolbar && props.toolbar !== "") {
                  clientOptions.modules = {
                      toolbar: (() => {
                          if (typeof props.toolbar === "object") {
                              return props.toolbar;
                          }
                          else if (typeof props.toolbar === "string") {
                              const str = props.toolbar;
                              return str.charAt(0) === "#"
                                  ? props.toolbar
                                  : toolbarOptions[props.toolbar];
                          }
                          return;
                      })(),
                  };
              }
              if (props.modules) {
                  const modules = (() => {
                      const modulesOption = {};
                      if (Array.isArray(props.modules)) {
                          for (const module of props.modules) {
                              modulesOption[module.name] = module.options ? module.options : {};
                          }
                      }
                      else {
                          modulesOption[props.modules.name] = props.modules.options ? props.modules.options : {};
                      }
                      return modulesOption;
                  })();
                  Object.assign(clientOptions.modules, modules);
              }
              return Object.assign({}, props.globalOptions, props.options, clientOptions);
          }
          vue.watch(() => props.value, (newVal, oldVal) => {
              if (quill) {
                  console.log(quill);
                  if (newVal && newVal !== _content) {
                      _content = newVal;
                      quill.clipboard.dangerouslyPasteHTML(newVal);
                  }
                  else if (!newVal) {
                      quill.setText("");
                  }
              }
          });
          vue.watch(() => props.enable, (newValue) => {
              if (quill)
                  quill.enable(newValue);
          });
          return {
              editor,
          };
      },
  });

  const _hoisted_1 = { class: "quill-editor" };
  const _hoisted_2 = { ref: "editor" };

  function render(_ctx, _cache, $props, $setup, $data, $options) {
    return (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
      vue.renderSlot(_ctx.$slots, "toolbar"),
      vue.createElementVNode("div", _hoisted_2, null, 512 /* NEED_PATCH */)
    ]))
  }

  script.render = render;
  script.__file = "webpack/vue3-quill-edit/src/index.vue";

  /*
  * Vue-Quill-Editor index.js
  * Author: surmon@foxmail.com
  * Github: https://github.com/surmon-china/vue-quill-editor
  */
  const Quill = window.Quill || Quill__default['default'];
  const install = (Vue) => {
      Vue.component(script.name, script);
  };
  const VueQuillEditor = { Quill, vue3Quill: script, install };
  // import type { App } from "vue";
  // import vue3Quill from "../dist/index";
  // declare const install: (app: App, opt: any) => void;
  // export { vue3Quill, install };
  // declare const _default: {
  //     install: (app: App<any>, opt: any) => void;
  // };
  // export default _default;

  exports.Quill = Quill;
  exports['default'] = VueQuillEditor;
  exports.install = install;
  exports.vue3Quill = script;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
