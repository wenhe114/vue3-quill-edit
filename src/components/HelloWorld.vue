<template>
  <div id="editor">
    <!-- <VueQuillEditor :content="content"
    :options="editorOption"/> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import Quill from "quill";
// import VueQuillEditor from 'vue-quill-editor'
import "quill/dist/quill.snow.css";
export default defineComponent({
  components:{
    // VueQuillEditor
  },
  setup() {
   const content= '<h2>I am Example</h2>'
   const editorOption={}
    // var quill = new Quill("#editor", {
    //   theme: "snow",
    // });
    return {content,editorOption}
  },
});
</script>
