<script setup>
import {ref, computed, onMounted,  watch} from "vue";
import { useI18n } from 'vue-i18n'
import {useStore} from "@/store/index.js";
const { t } = useI18n()
const store = useStore();
const selectFileId = ref();
const selectFilePath = ref();
const selectFileNm = ref();
const props = defineProps(['files', 'officialDocument'])

const file = computed(()=>{
  const baseDocument = props.officialDocument || {};
  const fileList = props.files || [];
  return {
    officialDocuments: baseDocument,
    attachedFiles: fileList
  };
})


const fn_selectFile = (fileId, fileType)=>{
  if(fileType === 'EFT02'){
    set_filePath(file.value.officialDocuments.filePath)
    selectFileId.value = file.value.officialDocuments.fileId;
    selectFileNm.value = file.value.officialDocuments.orgFileNm;
  }else{
    let selected = file.value.attachedFiles.find(f=>{
      return f.fileId === fileId
    })
    if(selected.fileExt === 'pdf' || selected.fileExt === 'PDF' ) set_filePath(selected.orgFileId);
    else set_filePath(selected.pdfFileId)

    selectFileNm.value = selected.orgFileNm;
    selectFileId.value = selected.fileId
  }
}

const createPdfViewerUrl = (fileId) => {
  const fileDownloadUrl = import.meta.env.VITE_FILE_DOWN_URL + '=' + fileId;
  return import.meta.env.VITE_PDF_VIEWER_URL + '=' + fileDownloadUrl;
}

const set_filePath = (path)=>{
  selectFilePath.value = path
}
const fn_downloadFile = (fileId, fileOrgNm)=>{
  store.API_FILE_DOWN(fileId, fileOrgNm);
}
onMounted(()=>{
  if(props.officialDocument) {
    selectFileId.value = props.officialDocument.fileId;
    selectFilePath.value = props.officialDocument.filePath;
    selectFileNm.value = props.officialDocument.orgFileNm;
  }

})

watch(()=> props.officialDocument, ()=>{
  selectFileId.value = props.officialDocument.fileId;
  selectFilePath.value = props.officialDocument.filePath;
  selectFileNm.value = props.officialDocument.orgFileNm;
})
</script>

<template>
  <div class="document_area">
    <div class="document_file_name">
      {{selectFileNm}}
    </div>
    <div class="file_preview">
      <iframe :src="createPdfViewerUrl(selectFilePath)" class="iframe" />
    </div>
    <div class="file_name_area">
      <div class="official_document_file_area">
        <div>
          <!--    Official document file-->
          {{t('10271')}}
        </div>
        <div class="official_document_file_main" v-if="file.officialDocuments">
          <div class="official_document_file"
               :class="{on: selectFileId === file.officialDocuments.fileId}"
               @click="fn_selectFile(file.officialDocuments.fileId, file.officialDocuments.fileType)"
          >
            <div>
              {{file.officialDocuments.orgFileNm}}
            </div>
            <div>
              <button type="button" @click="fn_downloadFile(file.officialDocuments.fileId, file.officialDocuments.orgFileNm)">
                <i class="pi pi-download"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="attach_file_area" v-if="file.attachedFiles">
        <div>
          <!-- attachment-->
          {{t('10257')}}
        </div>
        <template v-for="f in file.attachedFiles" :key="f.fileId">
          <div class="attach_file" :class="{on: selectFileId === f.fileId}" @click="fn_selectFile(f.fileId, f.fileType)">
            <div>
              {{f.orgFileNm}}
            </div>
            <div>
              <button type="button" @click="fn_downloadFile(f.orgFileId, f.orgFileNm)">
                <i class="pi pi-download"></i>
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.document_file_name{
  display: flex;
  align-items: center;
  font-weight: bold;
  height: 30px;
  padding-left: 10px;
}
.file_preview{
  display: flex;
  justify-content: center;
  margin: 10px;
}
.document_area{
  background-color: #EDF4FD;
  border-radius: 1rem;
}
.function_area{
  display: flex;
  justify-content: flex-end;
  background-color: #A8B3BD;
  gap: 15px;
  align-items: center;
  padding: 5px 20px 5px 20px;
}
.icon_style {
  font-size : 2rem ;
  cursor: pointer;
}
.file_name_area{
  background-color: #ffffff;
  display: flex;
  padding: 10px;
  flex-direction: column;
  gap: 1rem;
}

.official_document_file{
  margin-left: 1rem;
  padding: 1rem;
  border: 1px solid #EDF4FD;
  border-radius: 1rem;
  color: #0094d3;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
}
.attach_file{
  margin-left: 1rem;
  padding: 1rem;
  border: 1px solid #EDF4FD;
  border-radius: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
}
.attach_file:hover{
  color: #0094d3;
}
.attach_file_area{
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.on{
  color: #1453AE;
  background-color: #EDF4FD;
  cursor: default;
  font-weight: 600;
}
.official_document_file_area{
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.iframe{
  width: 96%;
  height: 60vh
}
</style>