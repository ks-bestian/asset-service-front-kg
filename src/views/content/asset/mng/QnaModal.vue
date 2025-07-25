<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import Dialog from 'primevue/dialog'
import Fieldset from 'primevue/fieldset';


const props = defineProps({
    dialog: Boolean,
    eqpmntId: String
})

const emit = defineEmits(['close'])
const visible = ref(props.dialog)
</script>

<template>

    <Dialog v-model:visible="visible" modal :style="{ width: '50vw', minHeight: '25vh' }" @hide="emit('close')">
        <template #header>
            <div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
                <h2 class="popup_tit">{{ 'Question' }}</h2>
            </div>
        </template>

        <div class="flex item-center gap-4 mb-4">
            <div class="popup_inner">
                <div class="popup_body">
                    <div class="popup_cont">
                        <div id="tab_cont2" class="tab_cont">
                            <div class="v_table table_list type2">
                                <div>
                                    <Fieldset legend=" 연락정보" :toggleable="true">
                                        <div class="text_lg m_2"><span class="info_text">{{ '담당자' }}</span>{{ '홍길동' }}</div>
                                        <div class="text_lg m_2"><span class="info_text">{{ '이메일' }}</span>{{ '' }}</div>
                                        <div class="text_lg m_2"><span class="info_text">{{ '전화번호' }}</span>{{ '' }}</div>
                                    </Fieldset>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="popup_footer">
                        <div class="btn_group">
                            <button type="button" class="v_btn btn_primary btn_md" @click="emit('close')">{{ '저장'
                                }}</button>
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