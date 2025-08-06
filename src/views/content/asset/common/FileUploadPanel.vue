
<style scoped>
/* PrimeVue에서 자동으로 렌더링되는 미리보기 이미지 숨김 */
.p-fileupload-file-thumbnail {
  display: none !important;
}

::v-deep(.p-fileupload-file-thumbnail) {
  display: none !important;
}
</style>
<template>
    <div class="card">
        <Toast />
        <FileUpload ref="fileUploader" :auto="false" :multiple="true" :customUpload="true" :files="defaultFiles" :maxFileSize="1000000000" @remove="onRemove" >
          <template #file="{ file }">
            <div class="custom-file-item flex align-items-center gap-3">
              <i class="pi pi-file-pdf text-2xl text-primary" v-if="file.name.endsWith('.pdf')"></i>
              <i class="pi pi-image text-2xl text-green-500" v-else-if="/\.(png|jpg|jpeg|gif)$/i.test(file.name)"></i>
              <i class="pi pi-file text-2xl text-gray-500" v-else></i>

              <div class="flex flex-column">
                <span class="file-name">{{ file.name }}</span>
                <small class="file-size text-color-secondary">
                  {{ (file.size / 1024).toFixed(1) }} KB
                </small>
              </div>
            </div>
          </template>
            <template #empty>
                <span>Drag and drop files to here to upload.</span>
            </template>
        </FileUpload>
    </div>
</template>

<script setup>
import FileUpload from 'primevue/fileupload';
import { ref, defineExpose, defineProps, onMounted } from 'vue'
import { useToast } from "primevue/usetoast";
const toast = useToast();
const props = defineProps({
  uploadedFilesFromDB: {
    type: Array,
    default: () => []
  },
  fieldName: {
    type: String
  },
  setSelfRef: {
    type: Function,
  },
});
const fileUploader =ref(null);
const deletedFileList =ref([]);

function getMimeType(extn) {
  const map = {
    pdf: 'application/pdf',
    mp4: 'video/mp4',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif'
  };
  return map[extn.toLowerCase()] || 'application/octet-stream';
}
const defaultFiles = ref([]);

onMounted(() => {
  if (Array.isArray(props.uploadedFilesFromDB)) {
    defaultFiles.value = props.uploadedFilesFromDB.map(file => ({
      name: file.orgnlFileNm,
      size: file.fileSz,
      type: getMimeType(file.fileExtn),
      fileNm: file.fileNm,
      status: 'uploaded'
    }));
  }

  if (props.setSelfRef && typeof props.setSelfRef === 'function') {
    props.setSelfRef(props.fieldName, {
      getUploadSummary
    });
  }
});

const onRemove = (event) => {
  const removedFile = event.file;

  if (removedFile.status === 'uploaded') {
    // 기존 파일 삭제로 간주 → 서버에 delYn 보내거나 파일명 보내기
    deletedFileList.value.push(removedFile.fileNm); 
  }
};

const onAdvancedUpload = () => {
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};

const getUploadSummary = () => {
  const uploadFiles = fileUploader.value?.files || [];

  const existingFiles = uploadFiles.filter(f => f.status === 'uploaded').map(f => f.fileNm); // 서버에서 유지할 파일명 리스트
  const newFiles = uploadFiles.filter(f => f.status === 'queued'); 

  return {
    newFiles,       // 새로 업로드할 파일들(파일객체 리스트[])
    existingFiles,  // 그대로 유지할 파일들(파일아이디 리스트[])
    deletedFiles: deletedFileList.value // 제거한 기존 파일들(파일아이디 리스트[])
  };
};

defineExpose({
  getUploadSummary
});
</script>


