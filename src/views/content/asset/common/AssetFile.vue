<script setup>
import { useStore } from "@/store";
import { onMounted, watch, ref } from "vue";

/** Variable declaration */
const store = useStore();

const props = defineProps({
    fileList: Array,
})

const list = ref([])
const typeImg = ref(false)
/** File download */
const fnDownloadFile = (fileId, fileNm) => {
    store.API_FILE_DOWN(fileId, fileNm);
}

/** File download */
const fnPdfViewer = (file) => {
    store.API_PDF_VIEWER(file.fileId);
}

const getFileType = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['pdf', 'ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'hwp', 'jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext)) {
        return ext;
    }
    return 'etc';
}

const getFileIconImgSrc = (file) => {

    const fileType = getFileType(file.orgnlFileNm);

    if (fileType === 'pdf') {
        return new URL('@/assets/images/common/ico_file_pdf_sm.png', import.meta.url).href;
    }
    if (fileType === 'ppt' || fileType === 'pptx') {
        return new URL('@/assets/images/common/ico_file_ppt_sm.png', import.meta.url).href;
    }
    if (fileType === 'doc' || fileType === 'docx') {
        return new URL('@/assets/images/common/ico_file_word.png', import.meta.url).href;
    }
    if (fileType === 'xls' || fileType === 'xlsx') {
        return new URL('@/assets/images/common/ico_file_xlsx_sm.png', import.meta.url).href;
    }
    if (fileType === 'zip') {
        return new URL('@/assets/images/common/ico_file_zip_sm.png', import.meta.url).href;
    }
    if (fileType === 'hwp') {
        return new URL('@/assets/images/common/ico_file_hwp_sm.png', import.meta.url).href;
    }
    if (fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png' || fileType === 'gif' || fileType === 'bmp') {
        typeImg.value = true;
        // return new URL('@/assets/images/common/ico_file_img_sm.png', import.meta.url).href;
    }
    // return new URL('@/assets/images/common/ico_file_etc_sm.png', import.meta.url).href;
}

watch(() => props.fileList, (newval) => {
    if (newval) {
        list.value = [...newval]
    }
}, { immediate: true, deep: true });

onMounted(() => {
})
</script>

<template>
    <ul class="file_list" v-for="(file, index) in list" :key="index">
        <li class="p_1">
            <span>{{ file.fileNm }}</span>
            <a href="javascript:void(0)" class="v_btn" @click="fnImgViewer()"><img
                    :src="getFileIconImgSrc(file)" alt=""></a>
                    <i class="pi pi-image" v-if="typeImg"></i>
            <i class="pi pi-download ml_2" style="cursor: pointer;" @click="fnDownloadFile(file.filePath, file.orgnlFileNm)"></i>
            <a href="javascript:void(0)" class="v_btn" @click="fnPdfViewer(file)" v-if="file.pdfFileId"><img src="@/assets/images/common/ico_file_pdf.png" alt=""></a>
        </li>
    </ul>
</template>

<style scoped></style>
