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
import { QuillOptionsStatic } from "quill";
import Quill from "quill";
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
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
  emits: ["blur", "focus", "update:value", "change", "ready"],
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
      // Remove editor class when theme changes
      if (props.theme !== "bubble") editor.value.classList.remove("ql-bubble");
      if (props.theme !== "snow") editor.value.classList.remove("ql-snow");
      console.log(props.value);
      if (props.value || props.content) {
        console.log(12121);
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
        let html: any = editor.value?.children[0].innerHTML;
        const text = quill?.getText();
        if (html === "<p><br></p>") html = "";
        _content = html;
        emit("update:value", _content);
        emit("change", { html, text, quill });
      });
      quill.on("selection-change", (range: any) => {
        if (!range) {
          emit("blur", quill);
        } else {
          emit("focus", quill);
        }
      });

      quill
        .getModule("toolbar")
        ?.container.addEventListener("mousedown", (e: MouseEvent) => {
          e.preventDefault();
        });

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
              modulesOption[module.name] = module.options ?? {};
            }
          } else {
            modulesOption[props.modules.name] = props.modules.options ?? {};
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
    return {
      editor,
    };
  },
});
</script>
