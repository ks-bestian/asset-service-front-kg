<script setup>
import { defineProps, defineEmits, ref, onMounted, computed } from 'vue';
import Dialog from 'primevue/dialog'
import { useStore } from '@/store';
import { useI18n } from 'vue-i18n'
import VideoView from './VideoView.vue';

const { t } = useI18n();
const props = defineProps({
    dialog: Boolean,
    videoMnlId: String,
    eqpmntInfo: Object
})

const emit = defineEmits(['close'])
const visible = ref(props.dialog)


onMounted(() => {
})
</script>

<template>
    <Dialog v-model:visible="visible" modal :style="{ width: '62vw', minHeight: '25vh' }" @hide="emit('close')">
        <template #header>
            <div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
                <h2 class="popup_tit">{{ '비디오 메뉴얼' }}</h2>
            </div>
        </template>

        <div class="flex item-center gap-4 mb-4">
            <div class="popup_body">

            <VideoView :eqpmntInfo="props.eqpmntInfo" :mnlId="props.videoMnlId"/>

                <div class="popup_footer">
                    <div class="btn_group">
                        <button type="button" class="v_btn btn_outline_primary btn_md"
                            @click="emit('close')">{{ t('10153') }}</button>
                    </div>
                </div>
            </div>
        </div>
    </Dialog>
</template>


<style>
.p-dialog-header {
    background-color: #0094D3;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
}
</style>