<script setup>
import { ref, watch } from "vue"
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import ThumbnailUpload from "@/views/content/asset/equipment/ThumbnailUpload.vue";
const emit = defineEmits(['bzenty']);

const prodTy = ref('')
const companyNm = ref('')
const pdfFiles = ref([])
const detailImgs = ref([])

const bzenty = ref({
    bzentyNm1 : '',
    bzentyNm2 : '',
    bzentyNm3 : '',
    telno : '',
    eml : '', 
    picNm : '',
    useYn : ''
});

const mode = ref('edit');

watch(bzenty, (newVal) => {
    emit('bzenty', newVal); 
}, { deep: true });




</script>

<template>
    <div class="content_section">
        <div class="v_table">
            <table>
                <colgroup>
                    <col style="width: 10%;">
                    <col>
                    <col style="width: 10%;">
                    <col style="width: 40%;">
                </colgroup>
                <tbody>
                    <tr>
                        <th>업체명(영어)</th>
                        <td colspan="3">
                            <template v-if="mode === 'detail'">
                                {{ bzenty.bzentyNm1 }}
                            </template>
                            <template v-else>
                                <InputText type="text" class="form_control col_7" v-model="bzenty.bzentyNm1"></InputText>
                            </template>
                            

                        </td>
                    </tr>
                    <tr>
                        <th>업체명(우즈벡)</th>
                        <td colspan="3">
                            <InputText type="text" class="form_control col_7" v-model="bzenty.bzentyNm2"></InputText>
                        </td>
                    </tr>
                    <tr>
                        <th>업체명(한국어)</th>
                        <td colspan="3">
                            <InputText type="text" class="form_control col_7" v-model="bzenty.bzentyNm3"></InputText>
                        </td>
                    </tr>
                    <tr>
                        <th>전화번호</th>
                        <td>
                            <InputText type="text" class="form_control" v-model="bzenty.telno"></InputText>
                        </td>
                        <th>이메일</th>
                        <td>
                            <InputText type="text" class="form_control" v-model="bzenty.eml"></InputText>
                        </td>
                    </tr>
                    <tr>
                        <th>담당자</th>
                        <td>
                            <InputText type="text" class="form_control" v-model="bzenty.picNm"></InputText>
                        </td>
                        <th>와치앱</th>
                        <td>
                            <InputText type="text" class="form_control" v-model="bzenty.picNm"></InputText>
                        </td>
                    </tr>
                    <tr>
                        <th>사용여부</th>
                        <td colspan="3">
                            <div class="check_area">
                                <span class="check_item">
                                    <input type="radio" name="useYn" id="Y" value="Y" v-model="bzenty.useYn">
                                    <label for="Y">Y</label>
                                </span>
                                <span class="check_item">
                                    <input type="radio" name="useYn" id="N" value="N" v-model="bzenty.useYn">
                                    <label for="N">N</label>
                                </span>
                            </div>
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
.v_table .form_control {
    width: 90%;
}

:deep(.p-fileupload-content .p-progressbar){
    display: none;
}


</style>