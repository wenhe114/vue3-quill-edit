import path from "path"
import vue from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript2'
import css from "rollup-plugin-css-only"
export default {
    input: path.resolve(__dirname, "../webpack/vue3-quill-edit/index.ts"),
    external: [],
    plugins: [
        css(),
        typescript({
            tsconfig: path.resolve(__dirname, '../tsconfig.json')
        }),
        vue({
            target: 'browser',
            // css: false,
        })
    ],
    output: [
        {
            file: path.resolve(__dirname, "../webpack/vue3-quill-edit/dist/index.js"),
            format: 'umd',
            name:'index'
        },
        {
            file: path.resolve(__dirname, "../webpack/vue3-quill-edit/dist/index.esm.js"), // es6模块
            format: 'es',
        }
    ]
}