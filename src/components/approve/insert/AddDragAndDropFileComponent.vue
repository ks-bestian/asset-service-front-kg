<script setup>

const files = ref([]);
const props= defineProps(['type', 'uploadedFiles'])
const emits = defineEmits(['changeFile', 'deleteFile' , 'deleteDocFile']);
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

/* drag&drop */
import {onMounted, ref} from "vue";

const supportsFileSystemAccessAPI = ref('getAsFileSystemHandle' in DataTransferItem.prototype)
const supportsWebkitGetAsEntry = ref('webkitGetAsEntry' in DataTransferItem.prototype)
const supportsDragAndDropUpload = ref(supportsFileSystemAccessAPI.value || supportsWebkitGetAsEntry.value)

function setupElement(elem, supportsDragAndDropUpload) {
  elem.addEventListener('dragover', eventPreventDefault)
  elem.addEventListener('dragenter', () => changeElementStyle(elem, supportsDragAndDropUpload ? 'enter' : 'leave'))
  elem.addEventListener('dragleave', (e) => !elem.contains(e.fromElement) && changeElementStyle(elem, 'leave'))
  elem.addEventListener('drop', getDropHandler(elem, supportsDragAndDropUpload))
}


function changeElementStyle(elem, event) {
  if (event === "enter") {
    elem.style.outline = 'solid cornflowerblue 3px'
    elem.style.background = 'aliceblue'
  } else {
    elem.style.outline = ''
    elem.style.background = ''
  }
}
function getDropHandler(elem, supportsDragAndDropUpload) {
  return async (e) => {
    eventPreventDefault(e)
    changeElementStyle(elem, 'leave')

    if(supportsDragAndDropUpload) {
      const fileList = [];
      for (const item of e.dataTransfer.items) {
        if (item.kind === 'file' && item.type !== '') {  // Check if the dropped item is a file and not a directory
          const file = item.getAsFile();
          if (/\.(xls|xlsx|ppt|pptx|doc|docx|pdf)$/i.test(file.name)) {
            fileList.push(file);
          }else{
            alert(t('10462'));
            // error alert
          }
        }
      }
      if (fileList.length > 0) {
        addFile(fileList)
        // handleUploads(fileHandles, addFile);
      }
    }
  }
}
async function handleUploads(fileHandlesPromises, uploadFunction) {
  const uploadPromises = []
  for await (const handle of fileHandlesPromises) {
    uploadPromises.push(uploadFunction(handle))
  }
}
function eventPreventDefault(e) {
  e.preventDefault()
}

const addFile = (data)=>{
  const arrayFile = Array.from(data);
  console.log(arrayFile);
  files.value= arrayFile
  emits("changeFile",arrayFile);
}
onMounted(()=>{
  let fileUploadArea = document.querySelector(`#${props.type}`)
  setupElement(fileUploadArea, supportsDragAndDropUpload.value)
})
/* drag&drop */

const getExt = (fileName) => {
  let ext = fileName.split('.').pop();
  switch(ext) {
    case 'docx':
      return 'doc';
    case 'xlsx':
      return 'xls';
    case 'pptx':
      return 'ppt';
    default:
      return ext;
  }
}
const deleteFile = (index)=>{
  emits("deleteFile", index);
}
const deleteDocFile = (fileId)=>{
  emits("deleteDocFile", fileId);
}

</script>

<template>
  <div class="file_add_area" :id="type">
    <div>
      {{t('10504') }}
      <input type="file" class="form_file" :id="type+'file'" multiple @change="addFile($event.target.files)">
    </div>
    <div><label class="v_btn btn_lg btn_outline_secondary" :for="type+'file'">{{ t('10463') }} <i class="v_ico ico_upload_secondary"></i></label> </div>
  </div>
  <template v-if="files">
    <div v-if="files.length >= 1" class="files">
      <div v-for="(f,i) in files" class="file_area">
        <div class="file_name">
          <div>
            {{i+1}}.
          </div>
          <div>
            <template v-if="getExt(f.name) === 'pdf'"><i class="v_ico ico_file_pdf_sm"></i></template>
            <template v-else-if="getExt(f.name) === 'xls'"><i class="v_ico ico_file_xlsx_sm"></i></template>
            <template v-else-if="getExt(f.name) === 'doc'"><i class="v_ico ico_file_doc_sm"></i></template>
            <template v-else-if="getExt(f.name) === 'ppt'"><i class="v_ico ico_file_ppt_sm"></i></template>
            <template v-else-if="getExt(f.name) === 'hwp'"><i class="v_ico ico_file_hwp_sm"></i></template>
          </div>
          <div>
            {{f.name}}
          </div>
        </div>
        <div class="delete_icon">
          <button type="button" @click="deleteFile(i)"><i class="pi pi-times"></i></button>
        </div>
      </div>
    </div>
  </template>
  <template v-if="uploadedFiles">
    <div class="files">
      <div v-for="(f,i) in uploadedFiles" class="file_area">
        <div class="file_name">
          <div>
            {{i+1}}.
          </div>
          <div>
            <template v-if="f.fileExt === 'pdf'"><i class="v_ico ico_file_pdf_sm"></i></template>
            <template v-else-if="f.fileExt === 'xls' || f.fileExt === 'xlsx'"><i class="v_ico ico_file_xlsx_sm"></i></template>
            <template v-else-if="f.fileExt === 'doc' || f.fileExt === 'docx' "><i class="v_ico ico_file_doc_sm"></i></template>
            <template v-else-if="f.fileExt === 'ppt' || f.fileExt === 'pptx'"><i class="v_ico ico_file_ppt_sm"></i></template>
            <template v-else-if="f.fileExt === 'hwp'"><i class="v_ico ico_file_hwp_sm"></i></template>
          </div>
          <div>
            {{f.orgFileNm}}
          </div>
        </div>
        <div class="delete_icon">
          <button type="button" @click="deleteDocFile(f.fileId)"><i class="pi pi-times"></i></button>
        </div>
      </div>
    </div>
  </template>
</template>

<style scoped>

.file_add_area{
  width: 100%;
  min-height: 80px;
  border: 3px #0094d3 dotted;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 1rem;
}
.form_file{
  visibility: hidden;
}
.files{
  display: flex;
  background-color: #F3F5F6;
  flex-direction: column;
  gap: 10px;
  padding: 5px;
}
.file_name{
  display: flex;
  min-height: 20px;
  gap: 1rem;
}
.file_area{
  border-radius: 20px;
  background-color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
}
.delete_icon{
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>