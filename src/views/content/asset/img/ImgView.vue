<script setup>
import { defineEmits, defineProps, ref, watch } from 'vue'
import Panel from 'primevue/panel';
import Button from 'primevue/button';
import { formSchemas } from '@/schemas/AssetSchemas';
import Testform from '../mng/testform.vue';
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
const fields = ref(formSchemas.installVo.fields)
const detailImgs = ref([]);
const emit = defineEmits(['delInstall']);

const props = defineProps({
    id: String,
    index: Number,
    detailDatas: Object,
    type: String,
})


const fnDelInstall = () => {
    emit('delInstall', props.id)
}

//handling files upload
const handleImgFileUpload = (e) => {
    const addedFiles = Array.from(e.target.files);
    const orgFileNms = detailImgs.value.map(item => item.name);
    const newFiles = addedFiles.filter(file => !orgFileNms.includes(file.name));

    detailImgs.value = [...detailImgs.value, ...newFiles];
    e.target.value = '';
    console.log("detailImgs filename =>", detailImgs.value.name);
}

const fnDelFile = (fileNm) => {
    detailImgs.value = detailImgs.value.filter(file => file.name != fileNm);
}

</script>

<template>
    <Panel header="Header" toggleable class="mb_3">
        <template #header>
            <div style="display: flex; align-items: center;" class="text_bold text_xl p_2">
                <Button icon="pi pi-trash" rounded class="mr_3 text_white" variant="outlined" @click="fnDelInstall"></Button>
                <span class="text_white" style="font-size: 1.5rem;">{{ t('10734') + props.index }}</span>
            </div>
        </template>
        <template #toggleicon="{ collapsed }">
            <i class="pi" :class="collapsed ? 'pi-angle-down' : 'pi-angle-up'"></i>
        </template>

        <div class="content_section mt_3">
            <div class="v_table"> 
                <Testform :fields="fields" :type="props.type" :detailDatas="props.detailDatas"/>
            </div>
        </div>
    </Panel>

</template>

<style>

</style>