<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useRouter } from 'vue-router';
import { useStore } from "@/store";
import TreeSelect from 'primevue/treeselect';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import TitleComp from "@/components/TitleComp.vue";
import Button from 'primevue/button';

import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { FormField } from '@primevue/forms';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const toast = useToast();
const confirm = useConfirm();
const store = useStore()
const router = useRouter();
const detail = ref({ jobCd: '', deptHeadYn: 'N' })
const treeData = ref([])
const jobList = ref([])
const selCcof = ref({})

const fnRequire = (event) => {

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
    if (detail.value.deptCd) {
        detail.value.deptCd = Object.keys(detail.value.deptCd)[0]
    }

    detail.value.ccofCds = Object.keys(selCcof.value)

    const deptCds = [detail.value.deptCd, ...detail.value.ccofCds].filter(code => code !== undefined)

    const uniqueCds = new Set(deptCds)

    if (uniqueCds.size !== deptCds.length) {
        toast.add({ severity: 'error', summary: 'Rejected', detail: t('10509'), life: 3000 });
    } else {
        store.API_SAVE('admin/user', detail.value).then((data) => {
        }).catch(({ message }) => {
            console.log(message)
        })
        router.push({
            path: '/main/system/user',
            query: { key: 'user' }
        })
    }
}


const fnGetData = () => {
    let param = {
        lang: localStorage.getItem('languageType'),
        searchYn: false
    }

    store.API_LIST('admin/dept/tree', param).then((data) => {
        treeData.value = data.data.data
    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnJobCd = () => {
    let param = {
        grpCode: '1012'
    }
    store.API_LIST('/admin/comCode', param).then((data) => {
        jobList.value = data.data.data
        detail.value.jobCd = ""
    }).catch(({ message }) => {
        console.log(message);
    })
}

const fnValidate = () => {
    const { errors } = resolver();
    return Object.keys(errors).length === 0;
}

const resolver = () => {
    const errors = {};
    const checkData = ['userId', 'userNmKg', 'userNmRu', 'deptCd', 'userPassword', 'pswdChk']

    for (const item of checkData) {
        if (!detail.value[item]) {
            errors[item] = [{ message: t('10460') }]
        }
    }

    if (detail.value.userPassword && detail.value.pswdChk && detail.value.userPassword !== detail.value.pswdChk) {
        errors.pswdChk = [{ message: t('10612') }]
    }

    return {
        errors
    };
};

const selectLabels = computed(() => {
    const result = [];

    const search = (nodes) => {
        for (const node of nodes) {
            if (Object.keys(selCcof.value).includes(node.key)) {
                result.push({
                    label: node.label,
                    key: node.key
                });
            }

            if (node.children) {
                search(node.children);
            }
        }
    };

    search(treeData.value);

    return result;
});

const fnRemoveCcof = (key) => {
    const result = {...selCcof.value};
    delete result[key];
    selCcof.value = result;
}

onMounted(() => {
    fnGetData();
    fnJobCd();
})
</script>

<template>
    <div class="content_inner">
        <TitleComp />
        <!-- Main area -->

        <Form v-slot="$form" :resolver="resolver">
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
                            <tr>
                                <th scope="row">{{ t('10324') }}<span class="text_red">*</span></th><!--Id-->
                                <td>
                                    <FormField v-slot="$field" name="userId" initial-value="" style="flex-grow: 1;">
                                        <InputText type="text" v-model="detail.userId" class="form_control"
                                            maxlength="20" size="large"></InputText>
                                        <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">
                                            {{ $field.error?.message }}</Message>
                                    </FormField>
                                </td>
                                <th scope="row">{{ t('10359') }}</th><!--email-->
                                <td><input type="text" class="form_control" v-model="detail.email" maxlength="90"></td>
                            </tr>
                            <tr>
                                <th scope="row">{{ t('10613') }}<span class="text_red">*</span></th><!--password-->
                                <td>
                                    <FormField v-slot="$field" name="userPassword" initialValue=""
                                        style="flex-grow: 1;">
                                        <InputText type="password" v-model="detail.userPassword" class="form_control"
                                            maxlength="70" size="large"></InputText>
                                        <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">
                                            {{ $field.error?.message }}</Message>
                                    </FormField>
                                </td>
                                <th>{{ t('10614') }}<span class="text_red">*</span></th><!--verify password-->
                                <td>
                                    <FormField v-slot="$field" name="pswdChk" initialValue="" style="flex-grow: 1;">
                                        <InputText type="password" v-model="detail.pswdChk" class="form_control"
                                            maxlength="70" size="large"></InputText>
                                        <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">
                                            {{ $field.error?.message }}</Message>
                                    </FormField>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">{{ t('10327') }}<span class="text_red">*</span></th><!--Name (Kyrgyz)-->
                                <td>
                                    <!-- <input type="text" class="form_control" v-model="detail.userNmKg"> -->
                                    <FormField v-slot="$field" name="userNmKg" initialValue="" style="flex-grow: 1;">
                                        <InputText type="text" v-model="detail.userNmKg" class="form_control"
                                            maxlength="90" size="large"></InputText>
                                        <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">
                                            {{ $field.error?.message }}</Message>
                                    </FormField>
                                </td>

                                <th scope="row">{{ t('10326') }}<span class="text_red">*</span></th><!--Name (Russian)-->
                                <td>
                                    <FormField v-slot="$field" name="userNmRu" initialValue="" style="flex-grow: 1;">
                                        <InputText type="text" v-model="detail.userNmRu" class="form_control"
                                            maxlength="90" size="large"></InputText>
                                        <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">
                                            {{ $field.error?.message }}</Message>
                                    </FormField>
                                </td>
                            </tr>

                            <tr>
                                <th scope="row">{{ t('10361') }}</th><!--Position-->
                                <td colspan="3">
                                    <select class="form_control" v-model="detail.jobCd">
                                        <option disabled value="">{{ t('10224') }}</option> <!--Please select.-->
                                        <option v-for="(item, i) in jobList" :key="i" :value="item.codeId">{{
                                            item.codeNm }}
                                        </option>
                                    </select>
                                </td>
                            </tr>

                            <tr>
                                <th scope="row">{{ t('10347') }}<span class="text_red">*</span></th><!--department-->
                                <td>
                                    <div style="display: flex; align-items: center;">
                                        <FormField v-slot="$field" name="deptCd" style="flex-grow: 1;" initialValue="">
                                            <TreeSelect :options="treeData" :placeholder="t('10224')"
                                                selectionMode="single" style="width: 79%; margin-right: 10px;"
                                                v-model="detail.deptCd" />
                                            <Button icon="pi pi-refresh" severity="contrast" variant="text"
                                                @click="detail.deptCd = {}; detail.deptCd = null"></Button>
                                            <Message v-if="!detail.deptCd" severity="error" size="large"
                                                variant="simple">
                                                {{ $field.error?.message }}</Message>
                                        </FormField>
                                    </div>

                                </td>
                                <th scope="row">{{ t('10630') }}</th><!--Department manager-->
                                <td>
                                    <span class="check_item">
                                        <input style="margin-right: 10px;" type="checkbox" id="inputCheck"
                                            v-model="detail.deptHeadYn" true-value="Y" false-value="N">
                                        <label for="inputCheck"></label>
                                    </span>
                                </td>
                            </tr>

                            <tr>
                                <th scope="row">{{ t('10362') }}</th><!--Whisper-->
                                <td colspan="3">
                                    <FormField v-slot="$field" name="ccof1" style="flex-grow: 1;" initialValue="">
                                        <TreeSelect v-model="selCcof" :options="treeData" :placeholder="t('10224')"
                                            class="mb_1" selectionMode="multiple"
                                            style="width: 33%; margin-right: 10px;" :maxSelectedLabels="0" />

                                        <template v-for="(item, i) in selectLabels" :key="i">
                                            <div class="mb_1" style="display: flex; align-items: center;">
                                                {{ '- ' + item.label }}
                                                <Button icon="pi pi-times" severity="contrast" variant="text"
                                                    @click="fnRemoveCcof(item.key)"></Button>
                                            </div>
                                        </template>
                                    </FormField>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="btn_group_fixed">
                        <a href="javascript:void(0)" class="v_btn btn_outline_primary btn_md"
                            @click="$router.push({ path: '/main/system/user', query: { key: 'user' } })">{{ t('10084')
                            }}</a><!--inventory-->
                        <button type="submit" class="v_btn btn_primary btn_md" @click="fnRequire">{{ t('10000')
                        }}</button><!--save-->
                    </div>

                </div>
            </div>
        </Form>
        <!-- // Main area -->
    </div>
</template>

<style scoped>
.v_table .form_control {
    width: 100%;
}
</style>
