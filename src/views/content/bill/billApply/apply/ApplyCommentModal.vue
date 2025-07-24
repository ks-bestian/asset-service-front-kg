<script setup>
import { useI18n } from 'vue-i18n'
import { ref, defineProps, defineEmits } from 'vue'
import Dialog from 'primevue/dialog';
import { useStore } from '@/store'
import Tag from 'primevue/tag';
import { useConfirm } from "primevue/useconfirm";

const confirm = useConfirm();
const { t } = useI18n()
const props = defineProps({
    dialog: Boolean,
    parentId: Number,
    lawId: Number,
})
const emit = defineEmits(['close'])
const dialog = ref(props.dialog)
const store = useStore()
const comment = ref('')
const userName = ref(( localStorage.getItem("languageType") === 'lng_type_2') ? store.loginInfo.userNmRu : store.loginInfo.userNmKg);

const fnRequire = () => {
    confirm.require({
        rejectProps: {
            severity: 'secondary',
            outlined: true,
            size: 'large'
        },
        acceptProps: {
            size: 'large'
        },
        target: event.currentTarget,
        message: t('10155'),
        accept: () => {
            fnSaveComment();
        },
    });
}

const fnSaveComment = () => {
    const jsonData = {
        parentId: props.parentId,
        content: comment.value,
        lawId: props.lawId,
        createdBy: userName.value
    }

    store.API_SAVE('law/comment', jsonData).then((data) => {
        emit('close')
        
    }).catch(({ message }) => {
        console.log(message)
    })

}

</script>

<template>
    <Dialog v-model:visible="dialog" modal :style="{ width: '32vw', height: '250px' }" @hide="emit('close')">
        <template #header>
            <div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
                <h2 class="popup_tit">{{ t('10629') }}</h2>
            </div>
        </template>
        <div class="flex items-center gap-4 mb-4">
            <div class="popup_inner">
                <div class="popup_body" style="padding-bottom: 0;">

                    <div class="popup_cont">
                        <div class="form_col type4 mb_2">
                            <div class="form_row">
                                <div class="input_item" style="max-width: 100%;">
                                    <Tag severity="secondary" class="tagClass" rounded>{{ t('10629') }}</Tag>
                                    <div class="input_group">
                                        <textarea class="form_control" v-model="comment" maxlength="800"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="popup_footer" style="padding-top: 1.5rem;">
                        <div class="btn_group">
                            <button type="submit" class="v_btn btn_primary btn_md" @click="fnRequire">{{ t('10000') }}</button>
                            <button type="button" class="v_btn btn_outline_neutral btn_md" @click="$emit('close')">{{ t('10153') }}</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    </Dialog>
</template>

<style scoped>
.tagClass {
    font-size: 14px;
    padding: 10px;
    font-weight: 500;
    margin-right: 30px;
    min-width: 110px;
}
</style>