<script setup>
import { ref, onMounted } from "vue";
import Tree from 'primevue/tree';
import DeptUserModal from "@/views/system/dept/DeptUserModal.vue";
import { useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import TitleComp from "@/components/TitleComp.vue";
import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { FormField } from '@primevue/forms';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore();
const confirm = useConfirm();
const selectDept = ref(null)
const nodes = ref();
const dialog = ref(false);
const list = ref([])
const detail = ref({ deptCd: '', uprDeptCd: '0', useYn: 'Y' })
const searchNm = ref('')
const btnYn = ref(false);
const deptCd = ref('')


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
            fnSave();
        },
    });
}

const fnSave = () => {
    const sendData = {
        deptCd: detail.value.deptCd ?? '',
        uprDeptCd: detail.value.uprDeptCd ?? '0',
        deptNm1: detail.value.deptNm1 ?? '',
        deptNm2: detail.value.deptNm2 ?? '',
        deptNm3: detail.value.deptNm3 ?? '',
        useYn: detail.value.useYn ?? '',
        ord: detail.value.ord ?? '',
        shrtNm1: detail.value.shrtNm1 ?? '',
        shrtNm2: detail.value.shrtNm2 ?? '',
        shrtNm3: detail.value.shrtNm3 ?? '',
    };
    if (btnYn.value) {
        store.API_UPDATE('admin/dept', detail.value).then((data) => {
            fnGetData(false);
        }).catch(({ message }) => {
            console.log(message)
        })
    } else {
        store.API_SAVE('admin/dept', sendData).then((data) => {
            fnGetData(false);
        }).catch(({ message }) => {
            console.log(message)
        })
    }
}

const fnDelete = () => {
    const deleteItems = []

    deleteItems.push(detail.value.deptCd)
    store.API_DELETE('admin/dept', deleteItems).then((data) => {
        fnGetData(false);
    }).catch(({ message }) => {
        console.log(message)
    })
    detail.value.useYn = 'Y'

}

const fnNodeSelect = (node) => {
    btnYn.value = true;
    detail.value = node
    deptCd.value = node.key
    fnDetail(node.key);
};

const fnDetail = (key) => {
    let param = { lang: localStorage.getItem('languageType') }

    store.API_LIST(`admin/dept/${key}`, param).then((data) => {
        detail.value = data.data.data;
    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnGetData = (search) => {
    list.value = []
    selectDept.value = null;
    if (searchNm.value == '') {
        search = false;
    }

    let param = {
        lang: localStorage.getItem('languageType'),
        deptNm: searchNm.value,
        searchYn: search
    }

    store.API_LIST('admin/dept/tree', param).then((data) => {
        nodes.value = data.data.data;
        detail.value = {}
        btnYn.value = false;
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

    const requiredFields = ['deptNm1', 'deptNm2', 'deptCd'];

    for (const item of requiredFields) {
        if (!detail.value[item]) {
            errors[item] = [{ message: t('10460') }];
        }
    }

    return {
        errors
    };
};

const fnReset = () => {
    searchNm.value = ''
}

const fnNew = () => {
    btnYn.value = false;
    detail.value = { useYn: 'Y', uprDeptCd: detail.value.deptCd }
}


onMounted(() => {
    fnGetData(false);
});
</script>

<template>
    <div class="content_inner">
        <TitleComp />
        <!-- Main area -->
        <Form v-slot="$form" :resolver="resolver">
            <div class="content_section">
                <div class="content_row department_wrap">
                    <div class="col_6 v_box">
                        <div class="board_search mb_4">
                            <div class="search_inner">
                                <div class="form_row">
                                    <div class="input_item col_12">
                                        <label class="form_label">{{ t('10363') }}</label><!--Department name-->
                                        <input type="text" class="form_control" :placeholder="t('10146')"
                                            v-model="searchNm" @keydown.enter.prevent="fnGetData(true)">
                                    </div>
                                </div>
                            </div>
                            <div class="search_btn">
                                <button type="button" class="v_btn btn_primary btn_sm" @click="fnGetData(true)">
                                    <i class="v_ico ico_search_white"></i>{{ t('10053') }}</button><!--search-->
                                <button type="button" @click="fnReset" class="v_btn btn_outline_primary btn_sm">
                                    <i class="v_ico ico_reset_primary"></i></button>
                            </div>
                        </div>
                        <Tree :value="nodes" v-model:selectionKeys="selectDept" selectionMode="single"
                            @node-select="fnNodeSelect" style="height: 60vh; overflow: auto;"></Tree>
                    </div>
                    <div class="col_6">
                        <div class="tit_header mb_4">
                            <div class="left">
                                <h4 class="v_tit">{{ detail.deptNm }}</h4>
                            </div>
                            <div class="right">
                                <div class="btn_group"></div>
                            </div>
                        </div>

                        <!-- Department information -->
                        <div id="tab_cont1" class="tab_cont">
                            <div class="v_table">
                                <table>
                                    <colgroup>
                                        <col style="width: 30%;">
                                        <col>
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <th scope="row">{{ t('10366') }}<span class="text_red">*</span></th>
                                            <!--Department code-->
                                            <td colspan="3">
                                                <div style="display: flex; align-items: center;" v-if="btnYn">
                                                    {{ detail.deptCd || '' }}
                                                    <button type="button" @click="dialog = true"
                                                        class="v_btn btn_secondary btn_sm" style="margin-left: auto;">{{
                                                        t('10365') }}</button><!--Department-->
                                                </div>
                                                <template v-else>
                                                    <FormField v-slot="$field" name="deptCd"
                                                        :initialValue="detail.deptCd" style="flex-grow: 1;">
                                                        <InputText type="text" v-model="detail.deptCd"
                                                            class="form_control" size="large" style="width: 100%" />
                                                        <Message v-if="$field?.invalid" severity="error" size="large"
                                                            variant="simple">{{ $field.error?.message }}</Message>
                                                    </FormField>
                                                </template>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">{{ t('10368') }}<span class="text_red">*</span>
                                            </th><!--Upper department code-->
                                            <td colspan="3">
                                                <FormField v-if="btnYn" v-slot="$field" name="uprDeptCd"
                                                    :initialValue="detail.uprDeptCd" style="flex-grow: 1;">
                                                    <InputText type="text" v-model="detail.uprDeptCd" maxlength="10"
                                                        class="form_control" size="large" />
                                                    <Message v-if="$field?.invalid" severity="error" size="large"
                                                        variant="simple">{{ $field.error?.message }}
                                                    </Message>
                                                </FormField>
                                                <template v-else>
                                                    <div style="display: flex; align-items: center;">
                                                        {{ detail.uprDeptCd ? detail.uprDeptCd : '0' }}
                                                    </div>
                                                </template>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">{{ t('10367') }}<span class="text_red">*</span></th>
                                            <!--Whether it is used-->
                                            <td>
                                                <div class="input_item">
                                                    <div class="check_area">
                                                        <span class="check_item">
                                                            <input type="radio" name="inputRadio1" id="inputRadio1_1"
                                                                checked v-model="detail.useYn" value="Y">
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
                                            <th scope="row">{{ t('10369') }}<span class="text_red">*</span>
                                            </th><!--Department name (Kyrgyzu)-->
                                            <td colspan="3">
                                                <FormField v-slot="$field" name="deptNm1" :initialValue="detail.deptNm1"
                                                    style="flex-grow: 1;">
                                                    <InputText type="text" v-model="detail.deptNm1" class="form_control"
                                                        maxlength="480" size="large" style="width: 100%" />
                                                    <Message v-if="$field?.invalid" severity="error" size="large"
                                                        variant="simple">{{ $field.error?.message }}
                                                    </Message>
                                                </FormField>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">{{ t('10370') }}<span class="text_red">*</span>
                                            </th><!--Department name (Russian)-->
                                            <td colspan="3">
                                                <FormField v-slot="$field" name="deptNm2" :initialValue="detail.deptNm2"
                                                    style="flex-grow: 1;">
                                                    <InputText type="text" v-model="detail.deptNm2" class="form_control"
                                                        maxlength="480" size="large" style="width: 100%" />
                                                    <Message v-if="$field?.invalid" severity="error" size="large"
                                                        variant="simple">{{ $field.error?.message }}
                                                    </Message>
                                                </FormField>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">{{ t('10363') + t('10419') }}</th>
                                            <!--Department name (Korean)-->
                                            <td colspan="3"><input type="text" class="form_control" maxlength="480"
                                                    v-model="detail.deptNm3"></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">{{ t('10371') + t('10372') }}</th>
                                            <td colspan="3"><input type="text" class="form_control" maxlength="480"
                                                    v-model="detail.shrtNm1">
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">{{ t('10371') + t('10373') }}</th>
                                            <td colspan="3"><input type="text" class="form_control" maxlength="480"
                                                    v-model="detail.shrtNm2">
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">{{ t('10371') + t('10419') }}</th>
                                            <td colspan="3"><input type="text" class="form_control" maxlength="480"
                                                    v-model="detail.shrtNm3">
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="btn_group_fixed">
                            <button type="button" class="v_btn btn_outline_primary btn_md" @click="fnNew">{{
                                t('10353') }}</button>
                            <button type="submit" class="v_btn btn_primary btn_md" @click="fnRequireSave">{{
                                t('10000') }}</button>
                            <button type="button" v-show="btnYn" class="v_btn btn_outline_secondary btn_md"
                                @click="fnRequireDel">{{ t('10173')
                                }}</button>

                        </div>

                    </div>
                </div>
            </div>
            <!-- // Main area -->
        </Form>
    </div>
    <DeptUserModal v-if="dialog" @close="dialog = false;" :dialog="dialog" :deptCd="detail.deptCd" />
</template>

<style scoped>
.v_table .form_control {
    width: 100%;
}

.no_data {
    display: flex;
    /* Flex box use */
    justify-content: center;
    /* Horizontal */
    align-items: center;
    flex-direction: column;
    height: 16rem;
}
</style>
