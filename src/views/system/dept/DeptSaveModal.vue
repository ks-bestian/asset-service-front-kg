<script setup>
import { ref, defineEmits, defineProps, onMounted, watch } from "vue";
import { useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import Dialog from 'primevue/dialog';
import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { FormField } from '@primevue/forms';
import { useI18n } from 'vue-i18n'
import Tag from 'primevue/tag';

const { t } = useI18n()
const confirm = useConfirm();
const store = useStore()
const emit = defineEmits(['close']);
const checkTop = ref(false);
const detail = ref({});
const props = defineProps({
    deptCd: String,
    dialog: Boolean
})
const visible = ref(props.dialog)

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
            fnSave();
        },
    });
}

const fnSave = () => {

    store.API_SAVE('admin/dept', detail.value).then((data) => {
        emit('close')
    }).catch(({ message }) => {
        console.log(message)
    })
    emit('close')
}

const fnCheckTop = () => {
    if (detail.value.uprDeptCd !== '') { //The upper part of the office

        if (checkTop.value) {
            detail.value.uprDeptCd = '0'
        } else if (!checkTop.value) {
            detail.value.uprDeptCd = (props.deptCd == undefined) ? 0 : props.deptCd
        }
    } else { //No top book

        checkTop.value = true
    }
}

const fnValidate = () => {
    const { errors } = resolver();
    return Object.keys(errors).length === 0;
}

const resolver = () => {
    const errors = {};
    if (!detail.value.deptCd) {
        errors.deptCd = [{ message: t('10460') }];
    }
    if (!detail.value.deptNm1) {
        errors.deptNm1 = [{ message: t('10460') }];
    }
    if (!detail.value.deptNm2) {
        errors.deptNm2 = [{ message: t('10460') }];
    }
    return {
        errors
    };
};


onMounted(() => {
    if (props.deptCd === undefined) {
        detail.value.uprDeptCd = 0
        checkTop.value = true;
    } else {
        detail.value.uprDeptCd = props.deptCd
    }
    detail.value.useYn = 'Y'
})
</script>

<template>
    <!-- Layer pop -up (department registration) -->
    <Dialog v-model:visible="visible" modal :style="{ width: '45vw', height: '790px' }" @hide="emit('close')">

        <template #header>
            <div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
                <h2 class="popup_tit">{{ t('10374') }}</h2><!--Department registration-->
            </div>
        </template>
        <Form v-slot="$form" :resolver="resolver">
            <div class="flex items-center gap-4 mb-4">
                <div class="popup_inner">
                    <div class="popup_body">
                        <div class="popup_cont">
                            <div class="form_col type4 mb_2">
                                <div class="form_row">
                                    <div class="input_item col_6" style="margin-right: 3rem;">
                                        
                                        <label class="form_label">{{ t('10368') }}<span
                                                class="text_red">*</span></label><!--Upper department code-->
                                        <div class="input_group">
                                            <span>{{ detail.uprDeptCd }}</span>
                                            <div style="display: flex; position: absolute; right: 50%;">
                                                <div class="check_area">
                                                    <span class="check_item">
                                                        <input type="checkbox" id="inputCheck3_1" :checked="checkTop"
                                                            v-model="checkTop" @change="fnCheckTop">
                                                        <label for="inputCheck3_1"></label>
                                                    </span>
                                                </div>
                                                <label>{{ t('10375') }} &nbsp;</label><!--Top department-->
                                            </div>
                                        </div>
                                    </div>

                                    <div class="input_item col_6">
                                        <label class="form_label">{{ t('10290') }}</label><!--order-->
                                        <div class="input_group">
                                            <input type="number" class="form_control" min="0" v-model="detail.ord"
                                                style="max-width: 5vw;">
                                        </div>
                                    </div>
                                </div>

                                <div class="form_row">
                                    <div class="input_item col_6" style="margin-right: 3rem;">
                                        <!-- <Tag severity="secondary" :value="t('10366')"></Tag> -->
                                        <label class="form_label" style="margin-right: 1rem;">{{ t('10366') }}<span class="text_red">*</span></label>
                                                <!--Department code-->
                                        <div class="input_group">
                                            <!-- <input type="text" class="form_control" v-model="detail.deptCd"> -->
                                            <FormField v-slot="$field" name="deptCd" initialValue=""
                                                style="flex-grow: 1;">
                                                <InputText type="text" v-model="detail.deptCd" class="form_control"
                                                    size="large" style="width: 100%" />
                                                <Message v-if="$field?.invalid" severity="error" size="large"
                                                    variant="simple">
                                                    {{ $field.error?.message }}</Message>
                                            </FormField>
                                        </div>
                                    </div>
                                    <div class="input_item col_6">
                                        <label class="form_label">{{ t('10367') }}<span
                                                class="text_red">*</span></label><!--Whether it is used-->
                                        <div class="check_area">
                                            <span class="check_item">
                                                <input type="radio" name="inputRadio1" id="useY" v-model="detail.useYn"
                                                    value="Y">
                                                <label for="useY">Y</label>
                                            </span>
                                            <span class="check_item">
                                                <input type="radio" name="inputRadio1" id="useN" v-model="detail.useYn"
                                                    value="N">
                                                <label for="useN">N</label>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div class="input_item">
                                    <label class="form_label">{{ t('10369') }}<span class="text_red">*</span></label>
                                    <FormField v-slot="$field" name="deptNm1" initialValue="" style="flex-grow: 1;">
                                        <InputText type="text" v-model="detail.deptNm1" class="form_control"
                                            size="large" style="width: 100%" />
                                        <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">
                                            {{
                                                $field.error?.message }}</Message>
                                    </FormField>
                                </div>

                                <div class="input_item">
                                    <label class="form_label">{{ t('10370') }}<span class="text_red">*</span></label>
                                    <FormField v-slot="$field" name="deptNm2" initialValue="" style="flex-grow: 1;">
                                        <InputText type="text" v-model="detail.deptNm2" class="form_control"
                                            size="large" style="width: 100%" />
                                        <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">
                                            {{
                                                $field.error?.message }}</Message>
                                    </FormField>
                                </div>

                                <div class="input_item">
                                    <label class="form_label">{{ t('10363') + t('10419') }}</label><!--Department name (Korean)-->
                                    <input type="text" class="form_control" v-model="detail.deptNm3">
                                </div>

                                <div class="input_item">
                                    <label class="form_label">{{ t('10371') + "-" + t('10372') }}</label><!--Department-->
                                    <div class="input_group">
                                        <input type="text" class="form_control" v-model="detail.shrtNm1">
                                    </div>
                                </div>

                                <div class="input_item">
                                    <label class="form_label">{{ t('10371') + "-" + t('10372') }}<br></label><!--Department-->
                                    <div class="input_group">
                                        <input type="text" class="form_control" v-model="detail.shrtNm2">
                                    </div>
                                </div>

                                <div class="input_item">
                                    <label class="form_label">{{ t('10371') + "-" + t('10419') }}<br></label><!--Department-->
                                    <div class="input_group">
                                        <input type="text" class="form_control" v-model="detail.shrtNm3">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="popup_footer">
                            <div class="btn_group">
                                <button type="submit" class="v_btn btn_outline_primary btn_md" @click="fnRequireSave">{{ t('10000') }}</button>
                                <button type="button" class="v_btn btn_primary btn_md" @click="emit('close')">{{ t('10153') }}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Form>
    </Dialog>
</template>

<style scoped>
.form_label {
    min-width: 10vw;
}

.input_item {
    margin-bottom: 1.5rem;
}

span.p-tag.p-component.p-tag-secondary {
    padding: 10px;
    font-size: 1.4rem;
    font-weight: 500;
    margin-right: 15px;
}
</style>