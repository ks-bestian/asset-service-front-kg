<script setup>
import { ref, onMounted, defineProps, watch, defineEmits } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";

import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { FormField } from '@primevue/forms';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore();
const props = defineProps(['grpCd'])
const list = ref([])
const selectList = ref({useYn: 'Y'})
const searchType = ref('codeNm')
const searchNm = ref('')
const grpCd = ref('')
const newYn = ref(true);
const emit = defineEmits(['childCd'])
const listCnt = ref(null);
const grpNew = ref(false);
const confirm = useConfirm();
const selectedProduct = ref(null);

const fnRequire = (event) => {
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
        message: t('10201'),// 'Would you like to delete?',

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
        message: t('10155'),//'Would you like to save?',

        accept: () => {
            fnInsert();
        },
    });
}


const fnDelete = () => {

    const deleteItems = [];
    deleteItems.push(selectList.value.codeId);
    store.API_DELETE(`/admin/comCode/${props.grpCd}`, deleteItems).then((data) => {
        fnSearch();
        selectList.value = {useYn: 'Y'}
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

const fnSave = () => {
    store.API_SAVE(`/admin/comCode`, selectList.value).then((data) => {
        fnSearch();
        newYn.value = false;
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

const fnUpdate = () => {
    store.API_UPDATE('/admin/comCode', selectList.value).then((data) => {
        fnSearch();
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

const fnInsert = () => {
    if (newYn.value) {
        if (grpCd.value !== '' && grpCd.value !== null) {
            fnSave();
        } else {
            alert(t('10459'));
            //'Choose a group code.');

        }
    } else {
        fnUpdate();
    }
}

const fnDetail = (e) => {
    newYn.value = false;
    selectList.value = e.data
}

const fnSearch = () => {

    let params = { lang: localStorage.getItem('languageType'), grpCode: grpCd.value };

    if (searchType.value === 'codeId') {
        params.codeId = searchNm.value;
    } else {
        params.codeNm = searchNm.value;
    }

    const api = `/admin/comCode`
    store.API_LIST(api, params).then((data) => {
        list.value = data.data.data
        if (list.value.length > 0) {
            emit('childCd', false)
        } else {
            emit('childCd', true)
        }

        listCnt.value = list.value.length;
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

const fnNew = () => {
    selectedProduct.value = null;
    newYn.value = true;
    selectList.value = {useYn: 'Y'};
    selectList.value.grpCode = grpCd.value;
}

watch(() => props.grpCd, (newVal) => {
    if (props.grpCd == null) {
        grpNew.value = true;
    } else {
        grpNew.value = false;
    }

    grpCd.value = newVal;
    selectList.value = {useYn: 'Y'};
    selectedProduct.value = null;
    fnSearch();
    selectList.value.grpCode = newVal;
})

const fnExcelDownload = () => {
    // Header designation to include

    const selectedHeaders = ["codeId", "codeNm", "useYn"];
    const wsCols = [t('10390'), t('10391'), t('10367')];

    const title = t('10516')//'Code list';


    store.fnExcelDownload(list.value, selectedHeaders, wsCols, title);
};

const fnValidate = () => {
    const { errors } = resolver();
    return Object.keys(errors).length === 0;
}

const resolver = () => {
    const errors = {};
    if (!selectList.value.codeId) {
        errors.codeId = [{ message: t('10460') }];
    }
    if (!selectList.value.codeNm1) {
        errors.codeNm1 = [{ message: t('10460') }];
    }
    if (!selectList.value.codeNm2) {
        errors.codeNm2 = [{ message: t('10460') }];
    }

    return {
        errors
    };
};

const fnReset = () => {
    searchNm.value = ''
}

onMounted(() => {
});
</script>

<template>
    <Form v-slot="$form" :resolver="resolver">

        <div class="board_search mb_4">
            <div class="search_inner">
                <div class="form_row">
                    <div class="input_item col_12">
                        <select class="form_control" v-model="searchType">
                            <option value="codeNm">{{ t('10391') }}</option><!--Code name-->
                            <option value="codeId">{{ t('10390') }}</option><!--Code ID-->
                        </select>
                        <input type="text" class="form_control" :placeholder="t('10146')" @keydown.enter.prevent="fnSearch"
                            v-model="searchNm">
                    </div>
                </div>
            </div>
            <div class="search_btn">
                <button type="button" class="v_btn btn_primary btn_sm" @click="fnSearch"><i
                        class="v_ico ico_search_white"></i>{{ t('10053') }}</button><!--check-->
                <button type="button" @click="fnReset" class="v_btn btn_outline_primary btn_sm"><i
                        class="v_ico ico_reset_primary"></i><span></span></button>
            </div>
        </div>

        <div class="board_info">
            <div class="left">
                <div class="total_num">{{ t('10104') }} <span class="text_primary">{{ listCnt }}</span></div>
            </div>

            <div class="right">
                <button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnExcelDownload"><i
                        class="v_ico ico_download_secondary"></i><span>{{ t('10055') }}</span></button><!--Excel download-->
            </div>
        </div>

        <div class="v_table table_list type2" style="height: 40vh;">
            <DataTable :value="list" :rows="10" @row-click="fnDetail" scrollable empty="no data" scroll-height="40vh"
                row-hover data-key="codeId" v-model:selection="selectedProduct" selection-mode="single">
                <Column field="codeId" :header="t('10390')" class="text_center" style="width: 17%;" sortable></Column><!--Code ID-->
                <Column field="codeNm" :header="t('10391')" class="text_center" sortable></Column><!--Code name-->
                <Column field="ord" :header="t('10290')" class="text_center" style="width: 15%;" sortable></Column>
                <Column field="useYn" :header="t('10367')" class="text_center" style="width: 20%;">
                </Column>
                <template #empty>
                    <div class="no_data">
                        <i class="v_ico ico_error"></i>
                        <span class="text_msg">{{ t('10075') }}</span>
                    </div>
                </template>
            </DataTable>
        </div>

        <div class="board_form">
            <div class="board_info">
                <div class="right">
                    <div class="btn_wrap" v-if="!grpNew">
                        <button type="button" class="v_btn btn_outline_primary btn_sm" @click="fnNew">{{ t('10353') }}</button><!--new-->
                        <button type="submit" class="v_btn btn_primary btn_sm" @click="fnRequireSave">{{ t('10000') }}</button>
                        <button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnRequire" v-if="!newYn">{{ t('10173') }}</button>
                    </div>
                </div>
            </div>

            <div class="v_table">
                <table>
                    <colgroup>
                        <col style="width: 30%;">
                        <col>
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row">{{ t('10392') }}<span class="text_red">*</span></th><!--Group code-->
                            <td>{{ grpCd }}</td>
                            <th scope="row">{{ t('10390') }}<span class="text_red">*</span></th><!--Code ID-->
                            <td v-if="!newYn">
                                {{ selectList.codeId }}
                            </td>
                            <td v-else>
                                <FormField v-slot="$field" name="codeId" initialValue="" style="flex-grow: 1;">
                                    <InputText type="text" v-model="selectList.codeId" class="form_control" size="large" maxlength="9"
                                        style="width: 100%" />
                                    <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{
                                        $field.error?.message }}</Message>
                                </FormField>
                                <!-- <input type="text" class="form_control" v-model="selectList.codeId"> -->
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">{{ t('10391') + t('10372') }}<span class="text_red">*</span></th>
                            <!--Code name (Kyrgyz)-->
                            <td colspan="3">
                                <FormField v-slot="$field" name="codeNm1" :initialValue="selectList.codeNm1"
                                    style="flex-grow: 1;">
                                    <InputText type="text" v-model="selectList.codeNm1" class="form_control" maxlength="90"
                                        size="large" style="width: 100%" />
                                    <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{
                                        $field.error?.message }}</Message>
                                </FormField>
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">{{ t('10391') + t('10373') }}<span class="text_red">*</span></th>
                            <!--Code name (Russian)-->
                            <td colspan="3">
                                <FormField v-slot="$field" name="codeNm2" :initialValue="selectList.codeNm2"
                                    style="flex-grow: 1;">
                                    <InputText type="text" v-model="selectList.codeNm2" class="form_control" maxlength="90"
                                        size="large" style="width: 100%" />
                                    <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{
                                        $field.error?.message }}</Message>
                                </FormField>
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">{{ t('10391') + t('10419') }}</th><!--Code name-->
                            <td colspan="3"><input type="text" class="form_control" v-model="selectList.codeNm3" maxlength="90"></td>
                        </tr>

                        <tr>
                            <th scope="row">{{ t('10367') }}<span class="text_red">*</span></th><!--Whether it is used-->
                            <td>
                                <div class="check_area">
                                    <span class="check_item">
                                        <input type="radio" name="inputRadio1" id="inputRadio1_1"
                                            v-model="selectList.useYn" value="Y">
                                        <label for="inputRadio1_1">Y</label>
                                    </span>
                                    <span class="check_item">
                                        <input type="radio" name="inputRadio1" id="inputRadio1_2"
                                            v-model="selectList.useYn" value="N">
                                        <label for="inputRadio1_2">N</label>
                                    </span>
                                </div>
                            </td>

                            <th scope="row">{{ t('10290') }}</th><!--order-->
                            <td><input type="number" class="form_control" min="0" v-model="selectList.ord"></td>
                        </tr>

                        <tr>
                            <th scope="row">{{ t('10111') }}</th>
                            <td colspan="3"><input type="text" class="form_control" v-model="selectList.rmk" maxlength="900">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </Form>
</template>

<style scoped>
.v_table .form_control {
    width: 100%;
}

.board_form {
    margin-top: 50px;
}

.no_data {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
</style>
