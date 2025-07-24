<script setup>
import { useStore } from "@/store";
import { onMounted } from "vue";

/** Variable declaration */
const store = useStore();

const props = defineProps({
    fileList: Array,
})

/** File download */
const fnDownloadFile = (fileId, fileNm) => {
    store.API_FILE_DOWN(fileId, fileNm);
}

/** File download */
const fnPdfViewer = (file) => {
    store.API_PDF_VIEWER(file.pdfFileId);
}

const getFileType = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['pdf', 'ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'hwp', 'jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext)) {
        return ext;
    }
    return 'etc';
}

const getFileIconImgSrc = (file) => {

    const fileType = getFileType(file.orgFileNm);

    if(fileType === 'pdf') {
        return new URL('@/assets/images/common/ico_file_pdf_sm.png', import.meta.url).href;
    }
    if(fileType === 'ppt' || fileType === 'pptx') {
        return new URL('@/assets/images/common/ico_file_ppt_sm.png', import.meta.url).href;
    }
    if(fileType === 'doc' || fileType === 'docx') {
        return new URL('@/assets/images/common/ico_file_word.png', import.meta.url).href;
    }
    if(fileType === 'xls' || fileType === 'xlsx') {
        return new URL('@/assets/images/common/ico_file_xlsx_sm.png', import.meta.url).href;
    }
    if(fileType === 'zip') {
        return new URL('@/assets/images/common/ico_file_zip_sm.png', import.meta.url).href;
    }
    if(fileType === 'hwp') {
        return new URL('@/assets/images/common/ico_file_hwp_sm.png', import.meta.url).href;
    }
    if(fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png' || fileType === 'gif' || fileType === 'bmp') {
        return new URL('@/assets/images/common/ico_file_img_sm.png', import.meta.url).href;
    }
    return new URL('@/assets/images/common/ico_file_etc_sm.png', import.meta.url).href;
}

onMounted(() => {
})
</script>

<template>
    <ul class="file_list" v-for="(file, index) in props.fileList" :key="index">
        <li>
            <span>{{ file.orgFileNm }}</span>
            <div class="file_wrap">
                <a href="javascript:void(0)" class="v_btn" @click="fnDownloadFile(file.orgFileId, file.orgFileNm)"><img :src="getFileIconImgSrc(file)" alt=""></a>
                <a href="javascript:void(0)" class="v_btn" @click="fnPdfViewer(file)" v-if="file.pdfFileId"><img src="@/assets/images/common/ico_file_pdf.png" alt=""></a>
            </div>
        </li>
    </ul>
</template>

<style scoped>
</style>
