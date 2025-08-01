<script setup>
import FormDocumentComp from "./FormDocumentComp.vue";
import { defineProps  } from "vue";

const props = defineProps(['fileNm','pdfFileId']);

</script>

<template> 
    <div class="main_info">{{ props.pdfFileId + '??' }}
        <form-document-comp 
            :fileNm="props.fileNm" 
            :pdfFileId="props.pdfFileId" 
            v-if="props.fileNm">
        </form-document-comp>
        <div class="no_data" v-else>
            <i class="v_ico ico_error"></i>
            <span class="text_msg">No Document</span>
        </div>
    </div>
</template>

<style scoped>
.main_info {
    height: 100%;
}
</style>