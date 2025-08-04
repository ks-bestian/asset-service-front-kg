<script setup>
import { defineProps, defineEmits, ref, onMounted, computed } from 'vue';
import Dialog from 'primevue/dialog'
import { useStore } from '@/store';
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
const props = defineProps({
    dialog: Boolean,
    videoMnlId: String
})

const emit = defineEmits(['close'])
const store = useStore();
const visible = ref(props.dialog)
const obj = ref([])

const currentVideo = computed(() => {
    return `http://localhost:8081/mnul/video/${props.videoMnlId}`
})

const fnGetVideoMnl = () => {
    let params = {mnlId: props.videoMnlId}
    store.API_LIST('mnul/video/detail', params).then((data) => {
        obj.value = data.data.data
    }).catch(({message}) => {
        console.log(message)
    })
}

onMounted(() => {
    fnGetVideoMnl();
})
</script>

<template>
    <Dialog v-model:visible="visible" modal :style="{ width: '62vw', minHeight: '25vh' }" @hide="emit('close')">
        <template #header>
            <div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
                <h2 class="popup_tit">{{ obj.fileNm }}</h2>
            </div>
        </template>

        <div class="flex item-center gap-4 mb-4">
            <div class="popup_body">
                <video controls width="100%" :src="currentVideo" style="border-radius: 1rem;"></video>
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