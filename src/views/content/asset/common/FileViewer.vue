<script setup>
import FileViewForm from "./FileViewForm.vue";
import { defineProps } from "vue";

const props = defineProps(['fileNm', 'pdfFileId', 'type']);

</script>

<template>
        <FileViewForm :fileNm="props.fileNm" :pdfFileId="props.pdfFileId" :type="props.type" v-if="props.fileNm" class="main_info mt_1"  />
        <div class="no_data" v-else>
            <i class="v_ico ico_error"></i>
            <span class="text_msg">No Document</span>
        </div>
</template>

<style scoped>
.main_info {
    height: 100%;
}
</style>