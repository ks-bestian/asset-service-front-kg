<script setup>
import { ref, onMounted, defineEmits, defineProps } from "vue";
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
const confirm = useConfirm();
const props = defineProps(['childYn'])
const store = useStore();
const list = ref([])
const searchType = ref('grpNm')
const searchNm = ref('')
const selectList = ref({useYn: 'Y'})
const emit = defineEmits(['grpCd']);
const newYn = ref(true);
const listCnt = ref(null);
const selectedProduct = ref(null);

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

const fnDetail = (e) => {
    newYn.value = false;
    selectList.value = e.data
    emit('grpCd', e.data.grpCode);
}

const fnSearch = () => {
    let params = { lang: localStorage.getItem('languageType') };
    if (searchType.value == 'grpCd') {
        params.grpCode = searchNm.value;
    } else if (searchType.value == 'grpNm') {
        params.grpCodeNm = searchNm.value;
    }
    const api = '/admin/grpCode'

    store.API_LIST(api, params).then((data) => {
        list.value = data.data.data
        selectList.value.grpCode = list.value[0].grpCode + 1;
        listCnt.value = list.value.length;

    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

const fnDelete = () => {//In the case of group code, it is impossible to delete if the lower code exists.

    if (props.childYn) {
        const deleteItems = []
        deleteItems.push(selectList.value.grpCode);
        const api = '/admin/grpCode'

        store.API_DELETE(api, deleteItems).then((data) => {
            fnSearch();
            selectList.value = {useYn: 'Y'}
            selectList.value.grpCode = ''
        }).catch(({ message }) => {
            console.log("message : ", message);
        })
    } else {
        alert(t('10517'));
    }

}

const fnSave = () => {

    store.API_SAVE('/admin/grpCode', selectList.value).then((data) => {
        fnSearch();
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

const fnUpdate = () => {

    store.API_UPDATE('/admin/grpCode', selectList.value).then((data) => {
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

const fnInsert = () => {
    if (newYn.value) {
        fnSave();
    } else {
        fnUpdate();
    }
}

const fnNew = () => {
    selectedProduct.value = null;
    newYn.value = true;
    selectList.value = {useYn: 'Y'};
    selectList.value.grpCode = list.value[0].grpCode + 1;
    emit('grpCd', null);
}


const fnExcelDownload = () => {
    // Header designation to include

    const selectedHeaders = ["grpCode", "grpCodeNm", "useYn"];
    const wsCols = [t('10392'), t('10389'), t('10367')];

    const title = t('10392') + t('10084') //'Group code list';


    store.fnExcelDownload(list.value, selectedHeaders, wsCols, title);
};

const fnValidate = () => {
    const { errors } = resolver();
    return Object.keys(errors).length === 0;
}

const resolver = () => {
    const errors = {};
    if (!selectList.value.grpCodeNm1) {
        errors.grpCodeNm1 = [{ message: t('10460') }];
    }
    if (!selectList.value.grpCodeNm2) {
        errors.grpCodeNm2 = [{ message: t('10460') }];
    }
    return {
        errors
    };
};
const fnReset = () => {
    searchNm.value = ''
}
onMounted(() => {
    fnSearch();
});
</script>

<template>
    <Form v-slot="$form" :resolver="resolver">
        <div class="board_search mb_4">
            <div class="search_inner">
                <div class="form_row">
                    <div class="input_item col_12">
                        <select class="form_control" v-model="searchType">
                            <option value="grpNm">{{ t('10389') }}</option><!--Group code name-->
                            <option value="grpCd">{{ t('10392') }}</option><!--Group code ID-->
                        </select>
                        <input type="text" class="form_control" :placeholder="t('10146')" v-model="searchNm"
                            @keydown.enter.prevent="fnSearch">
                    </div>
                </div>
            </div>
            <div class="search_btn">
                <button type="button" class="v_btn btn_primary btn_sm" @click="fnSearch"><i
                        class="v_ico ico_search_white"></i>{{ t('10053') }}</button><!--check-->
                <button type="button" @click="fnReset" class="v_btn btn_outline_primary btn_sm"><i class="v_ico ico_reset_primary"></i><span></span></button>
            </div>
        </div>

        <div class="board_info">
            <div class="left">
                <div class="total_num">{{ t('10104') }} <span class="text_primary">{{ listCnt }}</span></div>
            </div>
            <div class="right">
                <button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnExcelDownload"><i
                        class="v_ico ico_download_secondary"></i><span>{{ t('10055') }}</span></button>
            </div>
        </div>

        <div class="v_table table_list type2" style="height: 40vh;">
            <DataTable :value="list" :rows="10" @row-click="fnDetail" scrollable scroll-height="40vh" row-hover
                dataKey="grpCode" v-model:selection="selectedProduct" selection-mode="single">
                <Column field="grpCode" :header="t('10392')" class="text_center" sortable></Column>
                <Column field="grpCodeNm" :header="t('10389')" class="text_center" sortable></Column>
                <Column field="useYn" :header="t('10367')" class="text_center"></Column>
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
                    <div class="btn_wrap">
                        <button type="button" class="v_btn btn_outline_primary btn_sm" @click="fnNew">{{ t('10353') }}</button>
                        <button type="submit" class="v_btn btn_primary btn_sm" @click="fnRequireSave($event)">{{
                            t('10000') }}</button>
                        <button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnRequireDel" v-if="!newYn">{{
                            t('10173')
                        }}</button>
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
                        <tr v-if="!newYn && selectList.grpCodeNm1">
                            <th scope="row">{{ t('10392') }}</th><!--Group code-->
                            <td>{{ selectList.grpCode }}</td>
                        </tr>
                        <tr>
                            <th scope="row">{{ t('10389') + t('10372') }}<span class="text_red">*</span></th>
                            <!--Group code name (kg)-->
                            <td>
                                <FormField v-slot="$field" name="grpCodeNm1" :initialValue="selectList.grpCodeNm1"
                                    style="flex-grow: 1;">
                                    <InputText v-model="selectList.grpCodeNm1" class="form_control" size="large" maxlength="500"
                                        style="width: 100%; line-height: 1.5;"></InputText>
                                    <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{
                                        $field.error?.message }}</Message>
                                </FormField>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">{{ t('10389') + t('10373') }}<span class="text_red">*</span></th>
                            <!--Group code name (RU)-->
                            <td>
                                <FormField v-slot="$field" name="grpCodeNm2" :initialValue="selectList.grpCodeNm2"
                                    style="flex-grow: 1;">
                                    <InputText v-model="selectList.grpCodeNm2" class="form_control" size="large" maxlength="500"
                                        style="width: 100%; line-height: 1.5;"></InputText>
                                    <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{
                                        $field.error?.message }}</Message>
                                </FormField>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">{{ t('10389') + t('10419') }}</th><!--Group code name (KR)-->
                            <td><input type="text" class="form_control" v-model="selectList.grpCodeNm3" maxlength="500">
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">{{ t('10367') }}<span class="text_red">*</span></th><!--Whether it is used-->
                            <td>
                                <div class="check_area">
                                    <span class="check_item">
                                        <input type="radio" name="inputRadio1" id="radio1" v-model="selectList.useYn"
                                            value="Y">
                                        <label for="radio1">Y</label>
                                    </span>
                                    <span class="check_item">
                                        <input type="radio" name="inputRadio1" id="radio2" v-model="selectList.useYn"
                                            value="N">
                                        <label for="radio2">N</label>
                                    </span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">{{ t('10111') }}</th><!--note-->
                            <td><input type="text" class="form_control" v-model="selectList.rmk" maxlength="900"></td>
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
