import vue3Quill from '../dist/index';
declare const Quill: any;
declare const install: (Vue: any) => void;
declare const VueQuillEditor: {
    Quill: any;
    vue3Quill: import("vue").DefineComponent<{}, {}, any, Record<string, import("@vue/reactivity").ComputedGetter<any> | import("vue").WritableComputedOptions<any>>, import("vue").MethodOptions, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{} & {} & {}> & {}, {}>;
    install: (Vue: any) => void;
};
export default VueQuillEditor;
export { Quill, vue3Quill, install };
