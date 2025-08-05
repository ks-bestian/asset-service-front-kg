<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import Dialog from 'primevue/dialog';
import FileViewer from "@/views/content/asset/common/FileViewer.vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
const props = defineProps({
    dialog: Boolean,
    fileObj: Object,
    type: String
});

const visible = ref(props.dialog)
const emit = defineEmits(['close'])

function joinPath(...segments) {
  return segments
    .map(s => s.replace(/^\/+|\/+$/g, '')) // 앞뒤 슬래시 제거
    .filter(Boolean)
    .join('/');
}

/** File download */
const fnFilePath = (file) => {
    return joinPath(file.filePath, `${file.fileNm}.${file.fileExtn}`);
}

const fnFileNm = (file) => {
    return file.orgnlFileNm + '.' + file.fileExtn;
}
</script>

<template>
    <Dialog v-model:visible="visible" modal :style="{ width: '60vw', height: '100vh' }" @hide="emit('close')">
        <template #header>
            <div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
                <h2 class="popup_tit text_center">{{ props.fileObj.mnlNm }} </h2>
            </div>
        </template>

        <FileViewer :file-nm="fnFileNm(props.fileObj)" :pdf-file-id="fnFilePath(props.fileObj)" style="height: 83vh; flex-grow: 1;" :type="props.type"/>
    </Dialog>
</template>

<style scoped>

</style>