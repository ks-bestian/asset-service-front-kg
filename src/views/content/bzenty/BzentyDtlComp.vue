<script setup>
import { ref, defineProps } from "vue"
import testform from '@/views/content/asset/mng/testform.vue';
import { formSchemas } from '@/schemas/AssetSchemas';

/*
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
*/

const props = defineProps({
  show: Boolean,
  detailDatas: Object,
  type: String
})

const fields = ref(formSchemas.bzenty.fields);



</script>

<template>
    <testform :fields="fields" v-show="show" :type="type" :detailDatas="props.detailDatas" />


</template>

<style scoped>
.v_table .form_control {
    width: 90%;
}

:deep(.p-fileupload-content .p-progressbar){
    display: none;
}


</style>