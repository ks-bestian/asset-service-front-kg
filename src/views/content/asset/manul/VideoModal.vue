<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider';

const props = defineProps({
    dialog: Boolean
})
const emit = defineEmits(['close'])
const visible = ref(props.dialog)



</script>

<template>
    <Dialog v-model:visible="visible" modal :style="{ width: '62vw', minHeight: '25vh' }" @hide="emit('close')">
        <template #header>
            <div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
                <h2 class="popup_tit">{{ '카메라 저장 영상 mp4 변환 메뉴얼 [00:25:36]' }}</h2>
            </div>
        </template>

        <div class="flex item-center gap-4 mb-4">
            <div class="popup_body">
                <video controls width="100%" src="http://localhost:8080/mnul/preview"
                    poster="`@/assets/images/content/cannonposter.png`" style="border-radius: 1rem;"></video>

                <div class="popup_footer">
                    <div class="btn_group">
                        <button type="button" class="v_btn btn_outline_primary btn_md"
                            @click="emit('close')">{{ '닫기' }}</button>
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