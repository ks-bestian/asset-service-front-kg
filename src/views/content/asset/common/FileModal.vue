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

</script>

<template>
    <Dialog v-model:visible="visible" modal :style="{ width: '60vw', height: '100vh' }" @hide="emit('close')">
        <template #header>
            <div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
                <h2 class="popup_tit text_center">{{ props.fileObj.orgnlFileNm }} </h2>
            </div>
        </template>
        <FileViewer :file-nm="props.fileObj.orgnlFileNm" :pdf-file-id="props.fileObj.filePath" style="height: 83vh; flex-grow: 1;" :type="props.type"/>
    </Dialog>
</template>

<style scoped>

</style>