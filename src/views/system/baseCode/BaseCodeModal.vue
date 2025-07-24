<script setup>
import { ref, defineProps, defineEmits, onMounted } from "vue";
import { useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import Dialog from 'primevue/dialog';
import Tag from 'primevue/tag';
import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { FormField } from '@primevue/forms';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const confirm = useConfirm();
const emit = defineEmits(['close'])
const store = useStore();
const props = defineProps({
    popType: String,
    detail: Object,
    currIs: Boolean,
    codeIdList: Array,
    dialog: Boolean,
    currCodeId: String
})
const codeDetail = ref({ currYn: "N" });
const visible = ref(props.dialog)

const fnRequireDel = (event) => {

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
        message: t('10201'), //'Would you like to delete?',

        accept: () => {
            fnDelete();
        },
    });
}

const fnRequireSave = (event) => {

    if (!fnValidate()) {
        return;
    }

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
        message: t('10155'), //'Would you like to save?',

        accept: () => {
            if (props.popType === 'detail') {
                fnUpdate();
            } else {
                fnSave();
            }
        },
    });
}

const fnSave = () => {

    store.API_SAVE('admin/baseCode', codeDetail.value).then((data) => {
        emit('close')
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

const fnDelete = () => {
    const deleteItems = []
    deleteItems.push(codeDetail.value.codeId)

    store.API_DELETE('/admin/baseCode', deleteItems).then((data) => {
        emit('close')
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

const fnUpdate = () => {
    if (props.currIs && codeDetail.value.currYn === 'Y' && props.detail.currYn === 'N') {
        alert(t('10513'));
        //'The present is present.');

        return;
    }

    store.API_UPDATE('/admin/baseCode', codeDetail.value).then((data) => {
        emit('close')
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

const fnValidate = () => {
    const { errors } = resolver();
    return Object.keys(errors).length === 0;
}

const resolver = () => {
    const errors = {};
    const list = ['codeId', 'codeNm', 'bgDt', 'edDt']

    list.forEach((item) => {
        if (!codeDetail.value[item]) {
            errors[item] = [{ message: t('10460') }];
        }
    })


    if (props.codeIdList.includes(codeDetail.value.codeId) && props.popType === 'new') {
        errors.codeId = [{ message: t('10514') }];//'It is a code that already exists.');

    }

    if (props.currIs && codeDetail.value.currYn === 'Y' && props.currCodeId != codeDetail.value.codeId) {
        errors.currYn = [{ message: t('10513') }];//'The present is present.');

    }

    if (codeDetail.value.bgDt && codeDetail.value.edDt && codeDetail.value.bgDt > codeDetail.value.edDt) {
        errors.bgDt = [{ message: t('10618') }] //The start date should be before the end date.

    }

    return {
        errors
    };
}

onMounted(() => {
    if (props.popType === 'detail') {
        codeDetail.value = { ...props.detail };
    }
})
</script>

<template>
    <Dialog v-model:visible="visible" modal :style="{ width: '50vw', height: '510px' }" @hide="emit('close')">
        <template #header>
            <div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
                <h2 class="popup_tit" v-if="props.popType === 'detail'">{{ t('10515') }}</h2><!--Details-->
                <h2 class="popup_tit" v-else>{{ t('10387') }}</h2><!--Code registration by large-->
            </div>
        </template>
        <Form v-slot="$form" :resolver="resolver">
            <div class="popup_inner">
                <div class="popup_body">
                    <div class="popup_cont">
                        <div class="form_col type4 mb_2">
                            <div class="form_row">
                                <div class="input_item">
                                    <Tag severity="secondary" class="tagClass" rounded>{{ t('10116') }}<span
                                            class="text_red">*</span></Tag><!--Algebraic-->
                                    <input type="text" class="form_control" v-model="codeDetail.codeId" readonly
                                        v-if="props.popType === 'detail'">
                                    <FormField v-slot="$field" name="codeId" initialValue="" v-else>
                                        <InputText type="text" v-model="codeDetail.codeId" maxlength="10"
                                            class="form_control full" size="large" />
                                        <Message v-if="$field?.invalid || props.codeIdList.includes(codeDetail.codeId)"
                                            severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
                                    </FormField>
                                </div>

                                <div class="input_item">
                                    <Tag severity="secondary" class="tagClass" rounded>{{ t('10383') }}<span
                                            class="text_red">*</span></Tag><!--Algebra-->
                                    <FormField v-slot="$field" name="codeNm" initialValue="">
                                        <InputText type="text" v-model="codeDetail.codeNm" maxlength="90"
                                            class="form_control full" size="large" />
                                        <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">
                                            {{ $field.error?.message }}</Message>
                                    </FormField>
                                </div>
                            </div>


                            <div class="form_row">
                                <div class="input_item">
                                    <Tag severity="secondary" class="tagClass" rounded>{{ t('10384') }}<span
                                            class="text_red">*</span></Tag><!--Starting date-->
                                    <FormField v-slot="$field" name="bgDt" initialValue="">
                                        <InputText type="date" v-model="codeDetail.bgDt" class="form_control" size="large">
                                        </InputText>
                                        <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">
                                            {{ $field.error?.message }}</Message>
                                    </FormField>
                                </div>

                                <div class="input_item">
                                    <Tag severity="secondary" class="tagClass" rounded>{{ t('10385') }}<span
                                            class="text_red">*</span></Tag> <!--End date-->
                                    <FormField v-slot="$field" name="edDt" initialValue="">
                                        <InputText type="date" v-model="codeDetail.edDt" class="form_control" size="large">
                                        </InputText>
                                        <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">
                                            {{ $field.error?.message }}</Message>
                                    </FormField>
                                </div>
                            </div>

                            <div class="form_row">
                                <div class="input_item">
                                    <Tag severity="secondary" class="tagClass" rounded>{{ t('10290') }}</Tag><!--order-->
                                    <input type="number" class="form_control" min="0" v-model="codeDetail.ord">
                                </div>

                                <div class="input_item">
                                    <Tag severity="secondary" class="tagClass" rounded>{{ t('10386') }}</Tag><!--Whether it is present-->
                                    <div class="check_area">
                                        <span class="check_item">
                                            <input type="radio" name="inputRadio1" id="useY" v-model="codeDetail.currYn"
                                                value="Y">
                                            <label for="useY">Y</label>
                                        </span>
                                        <span class="check_item">
                                            <input type="radio" name="inputRadio1" id="useN" v-model="codeDetail.currYn"
                                                value="N">
                                            <label for="useN">N</label>
                                        </span>
                                        <FormField v-slot="$field" name="currYn" initialValue="">
                                            <Message severity="error" size="large" variant="simple">
                                                {{ $field.error?.message }}</Message>
                                        </FormField>
                                    </div>
                                </div>
                            </div>

                            <div class="input_item" style="padding-right: 2rem;">
                                <Tag severity="secondary" class="tagClass" rounded>{{ t('10111') }}</Tag> <!--note-->
                                <input type="text" class="form_control" v-model="codeDetail.rmk" maxlength="90">
                            </div>

                            <div style="display: flex; justify-content: center;">
                                <div class="btn_group">
                                    <button type="submit" class="v_btn btn_primary btn_md"
                                        @click="fnRequireSave($event)" v-if="popType === 'detail'">{{ t('10000') }}</button>
                                    <button type="submit" class="v_btn btn_primary btn_md"
                                        @click="fnRequireSave($event)" v-else>{{ t('10000') }}</button>
                                    <button type="button" class="v_btn btn_outline_secondary btn_md"
                                        @click="fnRequireDel($event)" v-if="props.popType === 'detail'">{{ t('10173') }}</button>
                                    <button type="button" class="v_btn btn_outline_primary btn_md"
                                        @click="emit('close')">{{ t('10153') }}</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Form>
    </Dialog>
</template>

<style scoped>
.input_item {
    margin-bottom: 1.5rem;
}

.form_control {
    width: 13vw !important;
}


.tagClass {
    font-size: 14px;
    padding: 10px;
    font-weight: 500;
    margin-right: 10px;
    min-width: 15rem;
    max-width: 15rem;
}

.form_row{
    flex-wrap: wrap;
}
</style>