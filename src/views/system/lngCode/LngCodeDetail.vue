<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import TitleComp from "@/components/TitleComp.vue";

import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { FormField } from '@primevue/forms';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const confirm = useConfirm();
const store = useStore();
const router = useRouter();
const route = useRoute();
const popType = ref(null);
const dataObj = ref({});

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
            fnInsert();
        },
    });
}

const fnInsert = () => {
    if (popType.value === 'detail') {
        fnUpdate();
    } else {
        fnSave();
    }
}

const fnSave = () => {
    store.API_SAVE('/admin/lngCode', dataObj.value).then((data) => {
        router.push({ path: '/main/system/lngCode' })
        dataObj.value.lngTy3 = ''
    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnUpdate = () => {
    dataObj.value.regDt = null;
    store.API_UPDATE('/admin/lngCode', dataObj.value).then((data) => {
        router.push({ path: '/main/system/lngCode' })
    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnDelete = () => {
    const deleteItems = []
    deleteItems.push(dataObj.value.lngId)

    store.API_DELETE('/admin/lngCode', deleteItems).then((data) => {
        router.push({ path: '/main/system/lngCode' })
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
    if (!dataObj.value.lngTy1) {
        errors.lngTy1 = [{ message: t('10460') }];
    }

    if (!dataObj.value.lngTy2) {
        errors.lngTy2 = [{ message:t('10460') }];
    }

    return {
        errors
    };
};

onMounted(() => {
    popType.value = route.query.key;
    dataObj.value = { ...history.state.dataObj };
})
</script>

<template>
    <div class="content_inner">
        <TitleComp />
        <Form v-slot="$form" :resolver="resolver">
            <!-- Main area -->
            <div class="content_section">
                <div class="v_table">
                    <table>
                        <colgroup>
                            <col style="width: 13%;">
                            <col>
                            <col style="width: 13%;">
                            <col style="width: 37%;">
                        </colgroup>
                        <tbody>
                            <tr v-if="popType === 'detail'">
                                <th scope="row">{{ t('10418') }}</th><!--Language code-->
                                <td colspan="3">{{ dataObj.lngId }}</td>
                            </tr>
                            <tr>
                                <th scope="row">{{ t('10610') }}<span class="text_red">*</span></th><!--(Kyrgyz)-->
                                <td colspan="3">
                                    <div class="input_group">
                                        <FormField v-slot="$field" name="lngTy1" :initialValue="dataObj.lngTy1" style="flex-grow: 1;">
                                            <InputText type="text" v-model="dataObj.lngTy1" class="form_control" size="large" maxlength="220"
                                                style="width: 100%" />
                                            <Message v-if="$field?.invalid" severity="error" size="large"
                                                variant="simple">{{ $field.error?.message }}</Message>
                                        </FormField>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <th scope="row">{{ t('10609') }}<span class="text_red">*</span></th><!--(Russian)-->
                                <td colspan="3">
                                    <div class="input_group">
                                        <FormField v-slot="$field" name="lngTy2" :initialValue="dataObj.lngTy2" style="flex-grow: 1;">
                                            <InputText type="text" v-model="dataObj.lngTy2" class="form_control" size="large" maxlength="220"
                                                style="width: 100%" />
                                            <Message v-if="$field?.invalid" severity="error" size="large"
                                                variant="simple">{{ $field.error?.message }}</Message>
                                        </FormField>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <th scope="row">{{ t('10611') }}</th><!--(korean)-->
                                <td colspan="3">
                                    <div class="input_group">
                                        <input type="text" class="form_control" v-model="dataObj.lngTy3" maxlength="220" >
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <th scope="row">{{ t('10111') }}</th><!--note-->
                                <td colspan="3">
                                    <div class="input_group">
                                        <input type="text" class="form_control" v-model="dataObj.rmk" maxlength="220">
                                    </div>
                                </td>
                            </tr>

                            <tr v-if="popType === 'detail'">
                                <th scope="row">{{ t('10100') }}</th><!--Registration date-->
                                <td>
                                    {{ dataObj.regDt ? dataObj.regDt.slice(0, 10) : '' }}
                                </td>
                                <th scope="row">{{ t('10099') }}</th><!--registrant-->
                                <td>
                                    {{ dataObj.regId }}
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
            <div class="btn_group_fixed">
                <a href="javascript:void(0)" class="v_btn btn_outline_primary btn_md"
                    @click="$router.push('/main/system/lngCode')">{{ t('10084') }}</a><!--inventory-->
                <button type="submit" class="v_btn btn_primary btn_md" @click="fnRequireSave">{{ t('10174') }}</button><!--save-->
                <button type="button" class="v_btn btn_outline_secondary btn_md" @click="fnRequireDel"
                    v-if="popType === 'detail'">{{ t('10173') }}</button><!--delete-->
            </div>
            <!-- // Main area -->
        </Form>
    </div>

</template>

<style scoped>
.v_table .form_control {
    width: 100%;
}
</style>