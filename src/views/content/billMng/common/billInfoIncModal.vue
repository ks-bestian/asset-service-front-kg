<script setup>
import { ref, defineEmits, defineProps } from "vue";
import { useI18n } from 'vue-i18n'
import BillAllInfoInc from "@/views/content/billMng/common/billAllInfoInc.vue";
import Dialog from 'primevue/dialog';
import 'primeicons/primeicons.css'

const { t } = useI18n()
const props = defineProps({
    billId: String,
    dialog: Boolean
});

const emit = defineEmits(['close'])
const visible = ref(props.dialog);


</script>
<template>

    <Dialog v-model:visible="visible" modal :style="{ width: '70vw', height: '1500px' }" @hide="emit('close')">
        <template #header>
            <div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
                <h2 class="popup_tit">{{ t('10115') }}</h2>
            </div>
        </template>
        <div class="flex items-center gap-4 mb-4">
            <div class="popup_inner">
                <div class="popup_body">
                    <div class="popup_cont">
                        <BillAllInfoInc :billId="props.billId" :open="['0', '1', '2']" />
                        <div class="popup_footer">
                            <div class="btn_group">
                                <button type="button" class="v_btn btn_outline_primary btn_md" @click="emit('close')">{{ t('10153') }}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Dialog>

</template>