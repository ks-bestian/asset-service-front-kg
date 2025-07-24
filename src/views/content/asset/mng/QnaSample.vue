<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Textarea from 'primevue/textarea';

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
                                    <FloatLabel class="mb_3" variant="on">
                                        <InputText id="title_label" class="form_control full text_xl" />
                                        <label for="title_label" class="text_lg">제목</label>
                                    </FloatLabel>

                                    <FloatLabel variant="on">
                                        <Textarea v-model="value" rows="5" style="width: 100%;" class="text_lg"></Textarea>
                                        <label for="content_label" class="text_lg">내용</label>
                                    </FloatLabel>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div class="popup_footer">
                        <div class="btn_group">
                            <button type="button" class="v_btn btn_outline_primary btn_md" @click="emit('close')">{{
                                '저장'
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


<style scoped></style>