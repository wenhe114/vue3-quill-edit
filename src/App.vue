<template>
  <div>
    <vue-3-quill :toolbar="'full'" v-model:value="content" @change="onEditorChange($event)"/>
    <div @click="updateQuillContent">更改quill内容</div>
    <div @click="getContent">获取内容</div>
    <!-- <VueQuillEditor/> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
// import {vue3Quill} from "@webpack/vue3-quill-edit/dist/index.js";
import {vue3Quill} from "@webpack/vue3-quill-edit/index";
// import {vue3Quill} from "vue3-quill-edit";
export default defineComponent({
  components: {
    vue3Quill,
  },
  data() {
    return {
      toolbars: [
        [{ header: 1 }, { header: 2 }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
      ],
    };
  },
  setup() {
    const content = ref(
    '<p>121212121</p>'
    );
    let i=1
    function updateQuillContent() {
      i++
      content.value = '<p>121212121wwwwwww11</p>'+i;
    }

    watch(()=>content.value,()=>{
      console.log("content.value",content.value);
      
    },{deep:true})
    function onEditorChange({ quill, html, text }:any) {
        console.log('editor change!', quill, html, text)
      }

    function getContent(){
      console.log(content.value);
      
    }
    return {
      content,
      updateQuillContent,
      onEditorChange,
      getContent
    };
  },
});
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
