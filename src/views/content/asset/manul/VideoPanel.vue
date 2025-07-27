<script setup>
import { ref, defineEmits, defineProps, onMounted } from 'vue'
import Panel from 'primevue/panel';
import Button from 'primevue/button';
import VideoBookmarkPanel from '@/views/content/asset/manul/VideoBookmarkPanel.vue'
import Testform from '../mng/testform.vue';
import { formSchemas } from '@/schemas/AssetSchemas';
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
const fields = ref(formSchemas.mnulVo.fields)
const emit = defineEmits(['delManual'])
const props = defineProps({
    id: String,
    index: Number,
    detailDatas: Object,
    type: String
})

const fnDelManual = () => {
    emit('delManual', props.id)
}

</script>

<template>
    <Panel header="Header" class="mb_3">
        <template #header>
            <div style="display: flex; align-items: center;" class="text_bold text_xl p_2">
                <Button icon="pi pi-trash" rounded class="mr_3 text_white" variant="outlined"
                    @click="fnDelManual"></Button>
                <span class="text_white" style=" font-size: 1.5rem;">{{ t('10733') + props.index }}</span>
            </div>
        </template>

        <div class="content_section mt_3">
            <div class="v_table">
                <Testform :fields="fields" :type="props.type" :detailDatas="props.detailDatas"/>
            </div>
            <!-- <VideoBookmarkPanel /> -->
        </div>
    </Panel>
</template>

<style>
.v_table .form_control {
    width: 100%;
}

.p-panel-header {
    text-shadow: 0 0 0.05rem #fff !important;
    padding: 17px !important;
    border-top-left-radius: 5px !important;
    border-top-right-radius: 5px !important;
    background-color: #0094D3 !important;
    height: 4.5rem;
}
</style>