<script setup>
import { ref, onMounted, defineProps, watch, computed, defineEmits } from "vue";
import { useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { FormField } from '@primevue/forms';
import { Form } from '@primevue/forms';
import { useI18n } from 'vue-i18n'

const props = defineProps({
    cmitInfo: { type: Object, default: () => ({}) },
    newYn: Boolean
})
const emit = defineEmits(['reload'])
const { t } = useI18n()
const store = useStore();
const confirm = useConfirm();
const detail = ref({useYn: 'Y'})
const newYn = ref(true)

watch(() => props.newYn, (newval) => {
    if (newval) {
        newYn.value = true;
    } else {
        newYn.value = false;
    }
})


watch(() => props.cmitInfo, (newval, oldval) => {
    if (newval != oldval) {
        detail.value = newval;
        detail.value.useYn ='Y'
        newYn.value = false
    }
})

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
        message: t('10431'),//'Would you like to delete?',

        accept: () => {
            fnDelete();
            newYn.value = true;
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
            if (newYn.value) {
                fnSave();
            } else {
                fnUpdate();
            }
            newYn.value = true;
        },
    });
}

const fnSave = () => {

    detail.value.uprDeptCd = 'CMT'
    store.API_SAVE('admin/dept', detail.value).then((data) => {
        emit('reload')
    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnUpdate = () => {
    store.API_UPDATE('admin/dept', detail.value).then((data) => {
        emit('reload')
    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnDelete = () => {
    const deleteItems = []

    deleteItems.push(detail.value.deptCd)
    store.API_DELETE('admin/dept', deleteItems).then((data) => {
        emit('reload')
        detail.value = { useYn: 'Y' };
    }).catch(({ message }) => {
        console.log(message)
    })
}


const fnValidate = () => {
    const { errors } = resolver();
    return Object.keys(errors).length === 0;
}

const resolver = () => {
    const errors = {};

    const requiredFields = ['deptCd', 'deptNm1', 'deptNm2', 'useYn'];

    for (const item of requiredFields) {
        if (!detail.value[item]) {
            errors[item] = [{ message: t('10460') }];
        }
    }

    return {
        errors
    };
};

</script>


<template>
    <!-- Department information -->
    <Form v-slot="$form" :resolver="resolver">

        <div id="tab_cont1" class="tab_cont">
            <div class="v_table">
                <table>
                    <colgroup>
                        <col style="width: 30%;">
                        <col>
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row">{{ t('10636') }}<span class="text_red">*</span></th><!--Committee-->
                            <td colspan="3" v-if="!newYn">{{ detail.deptCd }}</td>
                            <td colspan="3" v-else>
                                <FormField v-slot="$field" name="deptCd" :initialValue="detail.deptCd"
                                    style="flex-grow: 1;">
                                    <InputText type="text" v-model="detail.deptCd" class="form_control full"
                                        size="large" />
                                    <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{
                                        $field.error?.message }}</Message>
                                </FormField>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">{{ t('10367') }}<span class="text_red">*</span>
                            </th><!--Whether it is used-->
                            <td>
                                <div class="input_item">
                                    <div class="check_area">
                                        <span class="check_item">
                                            <input type="radio" name="inputRadio1" id="inputRadio1_1" checked
                                                v-model="detail.useYn" value="Y">
                                            <label for="inputRadio1_1">Y</label>
                                        </span>
                                        <span class="check_item">
                                            <input type="radio" name="inputRadio1" id="inputRadio1_2"
                                                v-model="detail.useYn" value="N">
                                            <label for="inputRadio1_2">N</label>
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <th scope="row">{{ t('10290') }}</th><!--order-->
                            <td><input type="number" class="form_control" v-model="detail.ord" min="0">
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">{{ t('10135') + t('10372') }}<span class="text_red">*</span>
                            </th><!--Commissioner Click (Kyrgyzu)-->
                            <td colspan="3">
                                <FormField v-slot="$field" name="deptNm1" :initialValue="detail.deptNm1"
                                    style="flex-grow: 1;">
                                    <InputText type="text" v-model="detail.deptNm1" class="form_control full"
                                        size="large" />
                                    <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{
                                        $field.error?.message }}</Message>
                                </FormField>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">{{ t('10135') + t('10373') }}<span class="text_red">*</span>
                            </th><!--Committee clarification (Russian)-->
                            <td colspan="3">
                                <FormField v-slot="$field" name="deptNm2" :initialValue="detail.deptNm2"
                                    style="flex-grow: 1;">
                                    <InputText type="text" v-model="detail.deptNm2" class="form_control full"
                                        size="large" />
                                    <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{
                                        $field.error?.message }}</Message>
                                </FormField>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">{{ t('10135') + t('10419') }}</th>
                            <!--Commissioner Class (Korean)-->
                            <td colspan="3"><input type="text" class="form_control full" v-model="detail.deptNm3"></td>
                        </tr>
                        <tr>
                            <th scope="row">{{ t('10637') + t('10372') }}</th>
                            <td colspan="3"><input type="text" class="form_control full" v-model="detail.shrtNm1"></td>
                        </tr>
                        <tr>
                            <th scope="row">{{ t('10637') + t('10373') }}</th>
                            <td colspan="3"><input type="text" class="form_control full" v-model="detail.shrtNm2"></td>
                        </tr>
                        <tr>
                            <th scope="row">{{ t('10637') + t('10419') }}</th>
                            <td colspan="3"><input type="text" class="form_control full" v-model="detail.shrtNm3"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="btn_group_fixed">
            <button type="button" class="v_btn btn_outline_primary btn_md"
                @click="detail = { useYn: 'Y' }; newYn = true">{{
                    t('10353') }}</button><!--new-->
            <button type="submit" class="v_btn btn_primary btn_md" @click="fnRequireSave" v-if="newYn">{{ t('10000')
                }}</button><!--save-->
            <button type="submit" class="v_btn btn_primary btn_md" @click="fnRequireSave" v-else>{{ t('10157')
                }}</button><!--correction-->
            <button type="button" class="v_btn btn_outline_secondary btn_md" @click="fnRequireDel" v-if="!newYn">{{
                t('10173') }}</button><!--delete-->
        </div>
    </Form>
</template>

<style scoped></style>