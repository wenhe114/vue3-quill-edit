const fs = require("fs")
const path = require("path")

let srcPath = path.resolve(__dirname, "../webpack/vue3-quill-edit/dist/webpack/vue3-quill-edit/index.d.ts")
console.log(srcPath);

const imp = fs.readFileSync(path.resolve(srcPath)).toString()
console.log(imp);
console.log("imp.includes('./src/index.vue')", imp.includes('./src/index.vue'));
if (imp.includes('./src/index.vue')) {
    const newImp = imp.replace('./src/index.vue', '../dist/index')
    console.log("newImp:", newImp);
    fs.writeFileSync(path.resolve(srcPath), newImp)
}

