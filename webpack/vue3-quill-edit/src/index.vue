<template>
  <div class="quill-editor">
    <slot name="toolbar"></slot>
    <div ref="editor"></div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  onBeforeUnmount,
  ref,
  PropType,
  watch,
} from "vue";
import { QuillOptionsStatic, RangeStatic, Sources, Delta } from "quill";
import Quill from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { toolbarOptions, ToolbarOptions } from "../until/options";
export type Module = { name: string; module: any; options?: object };

export default defineComponent({
  name: "vue3Quill",
  props: {
    content: {
      type: String,
    },
    value: {
      type: String,
    },
    contentType: {
      type: String as PropType<"delta" | "html" | "text">,
      default: "delta",
      validator: (value: string) => {
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
      type: String as PropType<"snow" | "bubble" | "">,
      default: "snow",
      validator: (value: string) => {
        return ["snow", "bubble", ""].includes(value);
      },
    },
    toolbar: {
      type: [String, Array, Object],
      required: false,
      validator: (value: string | unknown) => {
        if (typeof value === "string" && value !== "") {
          return value.charAt(0) === "#"
            ? true
            : Object.keys(toolbarOptions).indexOf(value) !== -1;
        }
        return true;
      },
    },
    handlers:{
      type:Object,
      require:false,
    },
    modules: {
      type: Object as PropType<Module | Module[]>,
      required: false,
    },
    options: {
      type: Object as PropType<QuillOptionsStatic>,
      required: false,
    },
    globalOptions: {
      type: Object as PropType<QuillOptionsStatic>,
      required: false,
    },
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
    let quill: Quill | null;
    let options: QuillOptionsStatic;
    let _content: string = "";
    const editor = ref<Element>();
    onMounted(() => {
      init();
    });
    function init() {
      if (!editor.value) return;
      options = composeOptions();
      console.log(options);
      
      // Register modules
      if (props.modules) {
        if (Array.isArray(props.modules)) {
          for (const module of props.modules) {
            Quill.register(`modules/${module.name}`, module.module);
          }
        } else {
          Quill.register(`modules/${props.modules.name}`, props.modules.module);
        }
      }

      quill = new Quill(editor.value, options);
      const toolbar = quill.getModule("toolbar");
       // toolbar.addHandler("image", ()=>{
      //   console.log(11212);

      // });
      if (props.handlers) {
        if (typeof props.handlers === "object") {
          for (const key in props.handlers) {
            if (Object.prototype.hasOwnProperty.call(props.handlers, key)) {
              console.log(key);
              console.log((props.handlers as any)[key]);
              
              toolbar.addHandler(key, () => {
                console.log(11212);
                (props.handlers as any)[key];
              });
            }
          }
        }
      }
      // Remove editor class when theme changes
      if (props.theme !== "bubble") editor.value.classList.remove("ql-bubble");
      if (props.theme !== "snow") editor.value.classList.remove("ql-snow");
      console.log(props.value);
      if (props.value || props.content) {
        quill.clipboard.dangerouslyPasteHTML(
          (props.value as any) || (props.content as any)
        );
      }

      // Disabled editor
      if (!props.enable) {
        quill.enable(true);
      }
      // Set event handlers
      quill.on("text-change", (delta, oldDelta, source) => {
        let html: any = "";
        if (editor.value && editor.value.children) {
          html = editor.value.children[0].innerHTML;
        }

        const text = quill ? quill.getText() : "";
        if (html === "<p><br></p>") html = "";
        _content = html;
        emit("update:value", _content);
        emit("change", { html, text, quill });
      });

      quill.on(
        "selection-change",
        (range: RangeStatic, oldRange: RangeStatic, source: Sources) => {
          if (!range) {
            emit("blur", quill);
          } else {
            emit("focus", quill);
          }
          emit("selectionChange", { range, oldRange, source });
        }
      );

      // 编辑内容发生变化时
      quill.on(
        "editor-change",
        (
          ...args:
            | [
                name: "text-change",
                delta: Delta,
                oldContents: Delta,
                source: Sources
              ]
            | [
                name: "selection-change",
                range: RangeStatic,
                oldRange: RangeStatic,
                source: Sources
              ]
        ) => {
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
        }
      );
      quill.getModule("toolbar")
        ? quill
            .getModule("toolbar")
            .container.addEventListener("mousedown", (e: MouseEvent) => {
              e.preventDefault();
            })
        : "";

      // Emit ready event
      emit("ready", quill);
    }
    function composeOptions(): QuillOptionsStatic {
      const clientOptions: QuillOptionsStatic = {};
      if (props.theme !== "") clientOptions.theme = props.theme;
      if (props.readOnly) clientOptions.readOnly = props.readOnly;
      if (props.placeholder) clientOptions.placeholder = props.placeholder;
      if (props.toolbar && props.toolbar !== "") {
        clientOptions.modules = {
          toolbar: (() => {
            if (typeof props.toolbar === "object") {
              return props.toolbar;
            } else if (typeof props.toolbar === "string") {
              const str = props.toolbar as string;
              return str.charAt(0) === "#"
                ? props.toolbar
                : toolbarOptions[props.toolbar as keyof ToolbarOptions];
            }
            return;
          })(),
        };
      }
     
      if (props.modules) {
        const modules = (() => {
          const modulesOption: { [key: string]: any } = {};
          if (Array.isArray(props.modules)) {
            for (const module of props.modules) {
              modulesOption[module.name] = module.options ? module.options : {};
            }
          } else {
            modulesOption[props.modules.name] = props.modules.options
              ? props.modules.options
              : {};
          }
          return modulesOption;
        })();
        Object.assign(clientOptions.modules, modules);
      }
      return Object.assign(
        {},
        props.globalOptions,
        props.options,
        clientOptions
      );
    }

    watch(
      () => props.value,
      (newVal, oldVal) => {
        if (quill) {
          console.log(quill);
          if (newVal && newVal !== _content) {
            _content = newVal;
            quill.clipboard.dangerouslyPasteHTML(newVal);
          } else if (!newVal) {
            quill.setText("");
          }
        }
      }
    );
    watch(
      () => props.enable,
      (newValue) => {
        if (quill) quill.enable(newValue);
      }
    );

    // 设置quill内容
    function setContent(index: number|null=null, html: string, source: Sources = 'api'){
      if (!quill) return;
      if (index) {
        quill.clipboard.dangerouslyPasteHTML(index,html,source);
      }else{
        quill.clipboard.dangerouslyPasteHTML(html,source);
      }
    }
    return {
      editor,
      setContent
    };
  },
});
</script>
