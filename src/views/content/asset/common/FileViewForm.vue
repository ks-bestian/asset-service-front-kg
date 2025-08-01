<script setup>
import { defineProps, onMounted } from "vue";
import { useStore } from "@/store";

const props = defineProps({
  fileId: String,
  fileNm: String,
  pdfFileId: String, 
  type: String
});
const store = useStore();

onMounted(() => {
  store.getFileView(props.pdfFileId, props.type);
})
</script>

<template> 
  <!-- <div class="main_area" style="display: block;"> -->
    <!-- <div class="document_file_name">
      {{  props.fileNm }}
    </div> -->
    <div class="document_preview_area">
        <iframe class="iframe" :src="store.fileViewUrl" v-if="props.type === 'file'"></iframe>
        <img v-else :src="store.fileViewUrl"></img>
    </div>
  <!-- </div> -->
</template>

<style scoped>
.main_area {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  padding: 1rem;
  border-radius: 2rem;
  justify-content: space-between;
  height: 100%;

  background-color: #EDF4FD;
  border-radius: 1rem;
}
.document_preview_area {
  width: 100%;
  height: inherit;
  background-color: #F6F9FD;
  display: flex;
  justify-content: center;

}
.iframe{
  width: 100%;
  height: 100%;
}
.preview {
  width: 100%;
}
.document_file_name{
  display: flex;
  align-items: center;
  font-weight: bold;
  height: 30px;
  padding-left: 10px;
}
</style>
