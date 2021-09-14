import path from "path"
import vue from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript2'
import css from "rollup-plugin-css-only"
export default {
    input: path.resolve(__dirname, "../webpack/vue3-quill-edit/index.ts"),
    external: [],
    plugins: [
        vue({
            target: 'browser',
            // css: false,
        }),
        typescript({
            tsconfig:path.resolve(__dirname,'../tsconfig.json')
        }),
        css()
    ],
    output: {
        file: path.resolve(__dirname, "../webpack/vue3-quill-edit/dist/index.js"),
        format: 'cjs'
    }
}