<script setup>
import { ref, defineProps, defineEmits, onMounted } from 'vue';
import { useStore } from '@/store';
import Dialog from 'primevue/dialog'
import Fieldset from 'primevue/fieldset';
import FaqDtlTab from "@/views/content/asset/faq/FaqDtlTab.vue"

const store = useStore()
const faqList = ref({})

const props = defineProps({
    dialog: Boolean,
    eqpmntId: String
})

const fnDetail = () => {
    let params = { eqpmntId: props.eqpmntId }
    store.API_LIST("faq", params).then((data) => {
        faqList.value = data.data.data;
    }).catch(({ message }) => {
        console.error(message)
    })
}

const emit = defineEmits(['close'])
const visible = ref(props.dialog)

onMounted(() => {
    fnDetail();
})
</script>

<template>

    <Dialog v-model:visible="visible" modal :style="{ width: '50vw', minHeight: '25vh' }" @hide="emit('close')">
        <template #header>
            <div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
                <h2 class="popup_tit">{{ 'FAQ' }}</h2>
            </div>
        </template>

        <div class="flex item-center gap-4 mb-4">
            <div class="popup_inner">
                <div class="popup_body">
                    <div class="popup_cont">

                        <div>
                            <Fieldset legend=" 연락정보" :toggleable="true">
                                <div class="text_lg m_2"><span class="info_text">{{ '담당자' }}</span>{{ '홍길동' }}</div>
                                <div class="text_lg m_2"><span class="info_text">{{ '이메일' }}</span>{{ '' }}</div>
                                <div class="text_lg m_2"><span class="info_text">{{ '전화번호' }}</span>{{ '' }}</div>
                            </Fieldset>
                        </div>
                        <FaqDtlTab :faqList="faqList" />

                    </div>

                    <div class="popup_footer">
                        <div class="btn_group"><!--
                            <button type="button" class="v_btn btn_primary btn_md" @click="emit('close')">{{ '저장'
                                }}</button>
                                -->
                            <button type="button" class="v_btn btn_outline_primary btn_md" @click="emit('close')">{{
                                '닫기'
                                }}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Dialog>
</template>


<style scoped>
.info_text {
    color: #929292;
    font-size: 1.5rem;
    font-weight: 800;
    margin-right: 20px;
    display: inline-block;
    min-width: 5rem;
}
</style>