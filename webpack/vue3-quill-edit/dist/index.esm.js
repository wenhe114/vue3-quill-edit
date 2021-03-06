import Quill$1 from 'quill';
import { defineComponent, onBeforeUnmount, ref, onMounted, watch, openBlock, createElementBlock, renderSlot, createElementVNode, normalizeStyle } from 'vue';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

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

var script = defineComponent({
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
        handlers: {
            type: Object,
            require: false,
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
        height: {
            type: String,
            required: false,
            default: 'auto'
        }
    },
    emits: [
        "blur",
        "focus",
        "update:value",
        "change",
        "ready",
        "selectionChange",
        "editorChange"
    ],
    setup(props, { emit }) {
        onBeforeUnmount(() => {
            quill = null;
        });
        let quill;
        let options;
        let _content = "";
        const editor = ref();
        let height = props.height;
        onMounted(() => {
            init();
        });
        function init() {
            if (!editor.value)
                return;
            options = composeOptions();
            console.log(options);
            // Register modules
            if (props.modules) {
                if (Array.isArray(props.modules)) {
                    for (const module of props.modules) {
                        Quill$1.register(`modules/${module.name}`, module.module);
                    }
                }
                else {
                    Quill$1.register(`modules/${props.modules.name}`, props.modules.module);
                }
            }
            quill = new Quill$1(editor.value, options);
            const toolbar = quill.getModule("toolbar");
            // toolbar.addHandler("image", ()=>{
            //   console.log(11212);
            // });
            if (props.handlers) {
                if (typeof props.handlers === "object") {
                    for (const key in props.handlers) {
                        if (Object.prototype.hasOwnProperty.call(props.handlers, key)) {
                            toolbar.addHandler(key, props.handlers[key]);
                        }
                    }
                }
            }
            // Remove editor class when theme changes
            if (props.theme !== "bubble")
                editor.value.classList.remove("ql-bubble");
            if (props.theme !== "snow")
                editor.value.classList.remove("ql-snow");
            console.log(props.value);
            if (props.value || props.content) {
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
                const text = quill ? quill.getText() : "";
                if (html === "<p><br></p>")
                    html = "";
                _content = html;
                emit("update:value", _content);
                emit("change", { html, text, quill });
            });
            quill.on("selection-change", (range, oldRange, source) => {
                if (!range) {
                    emit("blur", quill);
                }
                else {
                    emit("focus", quill);
                }
                emit("selectionChange", { range, oldRange, source });
            });
            // ???????????????????????????
            quill.on("editor-change", (...args) => {
                if (args[0] === "text-change")
                    emit("editorChange", {
                        name: args[0],
                        delta: args[1],
                        oldContents: args[2],
                        source: args[3],
                    });
                if (args[0] === "selection-change")
                    emit("editorChange", {
                        name: args[0],
                        range: args[1],
                        oldRange: args[2],
                        source: args[3],
                    });
            });
            quill.getModule("toolbar")
                ? quill
                    .getModule("toolbar")
                    .container.addEventListener("mousedown", (e) => {
                    e.preventDefault();
                })
                : "";
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
                        modulesOption[props.modules.name] = props.modules.options
                            ? props.modules.options
                            : {};
                    }
                    return modulesOption;
                })();
                Object.assign(clientOptions.modules, modules);
            }
            return Object.assign({}, props.globalOptions, props.options, clientOptions);
        }
        watch(() => props.value, (newVal, oldVal) => {
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
        watch(() => props.enable, (newValue) => {
            if (quill)
                quill.enable(newValue);
        });
        // ??????quill??????
        function setContent(index = null, html, source = 'api') {
            if (!quill)
                return;
            if (index) {
                quill.clipboard.dangerouslyPasteHTML(index, html, source);
            }
            else {
                quill.clipboard.dangerouslyPasteHTML(html, source);
            }
        }
        return {
            editor,
            setContent,
            height
        };
    },
});

const _hoisted_1 = { class: "quill-editor" };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("div", _hoisted_1, [
    renderSlot(_ctx.$slots, "toolbar"),
    createElementVNode("div", {
      ref: "editor",
      style: normalizeStyle([{"overflow":"auto","min-height":"100px"}, {height:_ctx.height}])
    }, null, 4 /* STYLE */)
  ]))
}

script.render = render;
script.__file = "webpack/vue3-quill-edit/src/index.vue";

/*
* Vue-Quill-Editor index.js
* Author: surmon@foxmail.com
* Github: https://github.com/surmon-china/vue-quill-editor
*/
const Quill = window.Quill || Quill$1;
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

export { Quill, VueQuillEditor as default, install, script as vue3Quill };
