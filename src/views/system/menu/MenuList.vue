<script setup>
import { ref, onMounted, watch } from "vue";
import Tree from 'primevue/tree';
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
const nodes = ref([]);
const detail = ref({ uprMenuId: null, useYn: 'Y', menuNm1: '', menuNm2: '', menuNm3: '' });
const selectNode = ref(null);
const newYn = ref(true);
const checkTop = ref(false);
const uprId = ref('');

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
            fnSave();
        },
    });
}


const fnDelete = () => {
    const deleteItems = [];
    deleteItems.push(detail.value.menuId);

    store.API_DELETE('/admin/menu', deleteItems).then((data) => {
        fnList();
        newYn.value = true;
        detail.value = { useYn: 'Y' }
    }).catch(({ message }) => {
        console.log(message);
    })
}

const fnSave = () => {

    if (newYn.value) {
        store.API_SAVE('/admin/menu', detail.value).then((data) => {
            fnList();
            detail.value = { useYn: 'Y', uprMenuId: 0 };
        }).catch(({ message }) => {
            console.log(message);
        })
    } else {
        store.API_UPDATE('/admin/menu', detail.value).then((data) => {
            fnList();
        }).catch(({ message }) => {
            console.log(message);
        })
    }
}

const fnNew = () => {
    newYn.value = true;
    detail.value = { useYn: 'Y', uprMenuId: selectNode.value ? Object.keys(selectNode.value)[0] : 0 };
    if (detail.value.uprMenuId != 0) {
        uprId.value = selectNode.value ? Object.keys(selectNode.value)[0] : 0;
    }
    checkTop.value = false
}

const fnList = () => {
    let params = { lang: localStorage.getItem('languageType'), type: 'menu' }
    store.API_LIST('/admin/menu', params).then((data) => {
        nodes.value = data.data.data
    }).catch(({ message }) => {
        console.log(message);
    })
}

const fnDetail = (e) => {
    newYn.value = false;

    let param = {
        lang: localStorage.getItem('languageType')
    }

    store.API_LIST(`/admin/menu/${e.key}`, param).then((data) => {
        detail.value = data.data.data;
        if (detail.value.uprMenuId == 0) {
            checkTop.value = true;
        }
    }).catch(({ message }) => {
        console.log(message);
    })
}

const fnCheckTop = () => {
    if (detail.value.uprMenuId !== '') { //High menu

        if (checkTop.value) {
            detail.value.uprMenuId = '0'
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
    if (!detail.value.menuNm1) {
        errors.menuNm1 = [{ message: t('10460') }];
    }

    if (!detail.value.menuNm2) {
        errors.menuNm2 = [{ message: t('10460') }];
    }
    if (detail.value.uprMenuId === 0) {
        return { errors };
    } else if (!detail.value.uprMenuId) {
        errors.uprMenuId = [{ message: t('10460') }];
    }

    return { errors };
};

watch(() => detail.value.uprMenuId, (newval) => {
    if (newval == '0') {
        checkTop.value = true;
    } else if (newval != 0) {
        checkTop.value = false;
    }
})

watch(() => checkTop.value, (newval) => {
    if (newval) {
        detail.value.uprMenuId = 0
    } else {
        detail.value.uprMenuId = (detail.value.uprMenuId === 0) ? null : selectNode.value ? Object.keys(selectNode.value)[0] : null;
    }
})


onMounted(() => {
    fnList();
});
</script>

<template>
    <div class="content_inner">
        <TitleComp />
        <Form v-slot="$form" :resolver="resolver">
            <!-- Main area -->
            <div class="content_section">
                <div class="content_row department_wrap">
                    <div class="col_6 v_box" style="height: 75vh; overflow: auto;">
                        <Tree :value="nodes" v-model:selectionKeys="selectNode" selectionMode="single"
                            @node-select="fnDetail"></Tree>
                        <!-- (e) => { $form.reset(); fnDetail(e); } -->
                    </div>
                    <div class="col_6">
                        <div class="tit_header mb_4">
                            <div class="left">
                                <h4 class="v_tit">{{ detail?.menuNm }}</h4>
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
                                        <tr v-if="!newYn">
                                            <th scope="row">{{ t('10420') }}<span class="text_red">*</span></th>
                                            <!--Menu ID-->
                                            <td colspan="3">
                                                <input type="text" class="form_control" :value="detail.menuId" readonly>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">{{ t('10422') }}<span class="text_red">*</span></th>
                                            <td colspan="2" style="border-right: none;">
                                                <FormField v-slot="$field" name="uprMenuId"
                                                    :initialValue="detail.uprMenuId" style="flex-grow: 1;">
                                                    <InputText type="number" v-model="detail.uprMenuId" min="0"
                                                        class="form_control" size="large" style="width: 100%" />
                                                    <Message v-if="$field?.invalid" severity="error" size="large"
                                                        variant="simple">{{ $field.error?.message }}</Message>
                                                </FormField>
                                            </td>
                                            <td>
                                                <div style="display: flex; align-items: center;">
                                                    <div class="check_area">
                                                        <span class="check_item">
                                                            <input type="checkbox" id="inputCheck3_1"
                                                                :checked="checkTop" v-model="checkTop"
                                                                @change="fnCheckTop">
                                                            <label for="inputCheck3_1"></label>
                                                        </span>
                                                    </div>
                                                    <label>{{ t('10564') }} &nbsp;</label><!--Top menu-->
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">{{ t('10424') + t('10372') }}<span class="text_red">*</span>
                                            </th><!--Menu-->
                                            <td colspan="3">
                                                <FormField v-slot="$field" name="menuNm1" :initialValue="detail.menuNm1"
                                                    style="flex-grow: 1;">
                                                    <InputText type="text" v-model="detail.menuNm1" class="form_control"
                                                        maxlength="180" size="large" style="width: 100%" />
                                                    <Message v-if="$field?.invalid" severity="error" size="large"
                                                        variant="simple">{{ $field.error?.message }}</Message>
                                                </FormField>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">{{ t('10424') + t('10373') }}<span class="text_red">*</span>
                                            </th><!--Menu-->
                                            <td colspan="3">
                                                <FormField v-slot="$field" name="menuNm2" :initialValue="detail.menuNm2"
                                                    style="flex-grow: 1;">
                                                    <InputText type="text" v-model="detail.menuNm2" class="form_control"
                                                        maxlength="180" size="large" style="width: 100%" />
                                                    <Message v-if="$field?.invalid" severity="error" size="large"
                                                        variant="simple">{{ $field.error?.message }}</Message>
                                                </FormField>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">{{ t('10424') + t('10419') }}</th><!--Menu-->
                                            <td colspan="3"><input type="text" class="form_control" maxlength="180"
                                                    v-model="detail.menuNm3">
                                            </td>
                                        </tr>

                                        <tr>
                                            <th scope="row">URL</th>
                                            <td colspan="3"><input type="text" class="form_control" maxlength="180"
                                                    v-model="detail.menuPath">
                                            </td>
                                        </tr>

                                        <tr>
                                            <th scope="row">{{ t('10111') }}</th>
                                            <td colspan="3"><input type="text" class="form_control" maxlength="800"
                                                    v-model="detail.rmk">
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">{{ t('10290') }}</th>
                                            <td>
                                                <input type="number" class="form_control" v-model="detail.ord" min="0">
                                            </td>
                                            <th scope="row">{{ t('10367') }}<span class="text_red">*</span></th>
                                            <td>
                                                <div class="check_area">
                                                    <span class="check_item">
                                                        <input type="radio" name="inputRadio1" id="inputRadio1_1"
                                                            v-model="detail.useYn" value="Y">
                                                        <label for="inputRadio1_1">Y</label>
                                                    </span>
                                                    <span class="check_item">
                                                        <input type="radio" name="inputRadio1" id="inputRadio1_2"
                                                            v-model="detail.useYn" value="N">
                                                        <label for="inputRadio1_2">N</label>
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="btn_group_fixed">
                            <button type="button" class="v_btn btn_outline_primary btn_md" @click="fnNew">{{ t('10353')
                                }}</button>
                            <button type="submit" class="v_btn btn_primary btn_md" @click="fnRequireSave">{{
                                t('10000') }}</button>
                            <button type="button" class="v_btn btn_outline_secondary btn_md" @click="fnRequireDel"
                                v-if="!newYn">{{ t('10173') }}</button>
                        </div>
                    </div>
                </div>
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
