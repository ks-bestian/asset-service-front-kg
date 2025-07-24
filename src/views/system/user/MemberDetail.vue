<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import TitleComp from "@/components/TitleComp.vue";
import Button from 'primevue/button';
import { useI18n } from 'vue-i18n'
import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { FormField } from '@primevue/forms';
import OverlayPanel from 'primevue/overlaypanel'
import TreeSelect from 'primevue/treeselect';
import MultiSelect from 'primevue/multiselect';


const { t } = useI18n()
const confirm = useConfirm();
const store = useStore();
const router = useRouter();
const detail = ref({})
const ageList = ref([])
const items = ref([])
const itemsCmt = ref([])
const generatePswd = ref('')
const op = ref(null)
const btnOfs = ref(null)
const selectCmits = ref([])


const fnRequireUpdate = (event) => {
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
            fnUpdate();
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
        message: t('10201'),//'Would you like to delete?',

        accept: () => {
            fnDelete();
        },
    });
}

const fnRequireResetPswd = (event) => {
    btnOfs.value = event.currentTarget

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
        message: t('10619'),// Do you want to initialize?

        accept: () => {
            fnResetPswd();
        }
    })
}


const fnResetPswd = () => {

    let param = { memberId: detail.value.memberId }


    store.API_UPDATE('admin/member/reset/pswd', param).then((data) => {
        generatePswd.value = data.data.data;

        op.value.toggle({ currentTarget: btnOfs.value })

        setTimeout(() => {
            op.value.hide()
        }, 10000)


    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnUpdate = () => {
    detail.value.cmitList = selectCmits.value
    store.API_UPDATE('admin/member', detail.value).then((data) => {
        router.push({
            path: '/main/system/user',
            query: { key: 'member' }
        })
    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnDelete = () => {
    const deleteItems = []
    deleteItems.push(detail.value.memberId)

    store.API_DELETE('admin/member', deleteItems).then((data) => {
        router.push({
            path: '/main/system/user',
            query: { key: 'member' }
        })
    }).catch(({ message }) => {
        console.log(message)
    })
}

/** Party inquiry */
const fnSearchPoly = () => {
    let params = {};
    const apiUrl = 'admin/dept';
    store.API_LIST(apiUrl, params).then((data) => {
        items.value.push(...data.data.data.filter(data => data.uprDeptCd == 'poly'));
        itemsCmt.value.push(...data.data.data.filter(data => data.uprDeptCd == 'CMT'));
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

/**Algebraic */
const fnAgeList = () => {
    const api = '/admin/baseCode'
    store.API_LIST(api).then((data) => {
        ageList.value = data.data.data
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

const fnGetCcof = () => {
    let param = {
        lang: localStorage.getItem('languageType'),
        userId: detail.value.memberId
    }

    store.API_LIST(`admin/ccof`, param).then((data) => {
        selectCmits.value = data.data.data.map(item => item.deptCd)

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
    if (!detail.value.memberNmKg) {
        errors.memberNmKg = [{ message: t('10460') }];
    }
    if (!detail.value.memberNmRu) {
        errors.memberNmRu = [{ message: t('10460') }];
    }
    if (!detail.value.ageCd) {
        errors.ageCd = [{ message: t('10460') }];
    }
    return {
        errors
    };
};

const fnCopy = async () => {
    await navigator.clipboard.writeText(generatePswd.value)
}

const selectLabels = computed(() => {
    const result = []

    for(let i=0; i < itemsCmt.value.length; i++) {
        if(selectCmits.value.includes(itemsCmt.value[i].deptCd)) {
            result.push(itemsCmt.value[i].deptNm)
        }
    }
    return result;
})


onMounted(() => {
    detail.value = { ...history.state.data }
    fnSearchPoly();
    fnAgeList();
    fnGetCcof();
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
                                <th scope="row">{{ t('10324') }}</th><!--Id-->
                                <td>
                                    <div style="display: flex; align-items: center;">
                                        {{ detail.memberId }}

                                        <button type="button" style="margin-left: auto;"
                                            class="v_btn btn_outline_primary btn_sm" @click="fnRequireResetPswd">{{
                                                t('10615') }}</button><!--Password initialization-->
                                        <OverlayPanel ref="op" style="font-size: 1.5rem;">{{ t('10613') + " : " }} <span
                                                style="color: red;">{{ generatePswd }}</span><i class="pi pi-copy"
                                                style="margin-left: 8px; font-size: 1.7rem; cursor: pointer;"
                                                v-tooltip.bottom="{ value: t('10620'), showDelay: 300, hideDelay: 100 }"
                                                @click="fnCopy"></i></OverlayPanel>
                                    </div>
                                </td>
                                <th scope="row">{{ t('10116') }}<span class="text_red">*</span></th><!--Algebraic-->
                                <td>
                                    <div class="alignCenter">
                                        <FormField v-slot="$field" name="ageCd" :initialValue="detail.ageCd"
                                            style="flex-grow: 1;">
                                            <select class="form_control" v-model="detail.ageCd"
                                                style="width: 200px; margin-right: 10px;">
                                                <option disabled value="">{{ t('10224') }}</option><!--Please select.-->
                                                <option v-for="(item, index) in ageList" :key="index"
                                                    :value="item.codeId">
                                                    {{ item.codeNm }}</option>
                                            </select>
                                            <Button icon="pi pi-refresh" severity="contrast" variant="text" rounded
                                                aria-label="Cancel" @click="detail.ageCd = ''"></Button>
                                            <Message v-if="detail.ageCd == '' || detail.ageCd == null" severity="error"
                                                size="large" variant="simple">
                                                {{ $field.error?.message }}</Message>
                                        </FormField>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">{{ t('10327') }}<span class="text_red">*</span></th><!--Name (Kyrgyz)-->
                                <td>
                                    <FormField v-slot="$field" name="memberNmKg" :initialValue="detail.memberNmKg"
                                        style="flex-grow: 1;">
                                        <InputText type="text" v-model="detail.memberNmKg" class="form_control"
                                            maxlength="200" size="large" style="width: 100%" />
                                        <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">
                                            {{ $field.error?.message }}</Message>
                                    </FormField>
                                </td>
                                <th scope="row">{{ t('10326') }}<span class="text_red">*</span></th><!--Name (Russian)-->
                                <td>
                                    <FormField v-slot="$field" name="memberNmRu" :initialValue="detail.memberNmRu"
                                        style="flex-grow: 1;">
                                        <InputText type="text" v-model="detail.memberNmRu" class="form_control"
                                            maxlength="200" size="large" style="width: 100%" />
                                        <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">
                                            {{ $field.error?.message }}</Message>
                                    </FormField>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">{{ t('10331') }}</th><!--Email-->
                                <td>
                                    <input type="text" class="form_control" v-model="detail.email" maxlength="100">
                                </td>
                                <th scope="row">{{ t('10360') }}</th><!--Cell phone-->
                                <td><input type="text" class="form_control" v-model="detail.mblNo" maxlength="100"></td>
                            </tr>
                            <!-- <tr>
                                <th scope="row">{{ t('10090') }}</th>
                                <td colspan="3">{{ detail.rsdnRgstNmbr }}</td>
                            </tr> -->
                            <tr>
                                <th scope="row">{{ t('10073') }}</th><!--political party-->
                                <td colspan="3">
                                    <div class="alignCenter">
                                        <select class="form_control" v-model="detail.polyCd" style="width: 26vw;">
                                            <option disabled value="">{{ t('10224') }}</option><!--Please select.-->
                                            <option v-for="(item, i) in items" :key="i" :value="item.deptCd">{{
                                                item.deptNm
                                                }}</option>
                                        </select>
                                        <Button icon="pi pi-refresh" severity="contrast" variant="text" rounded
                                            aria-label="Cancel" @click="detail.polyCd = ''"></Button>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <th scope="row">{{ t('10045') }}</th><!--committee-->
                                <td colspan="3">
                                    <div class="alignCenter">
                                        <FormField v-slot="$field" name="ccof1" style="flex-grow: 1;" initialValue="">
                                            <MultiSelect v-model="selectCmits" :options="itemsCmt" optionLabel="deptNm"
                                                optionValue="deptCd" :placeholder="t('10224')" :maxSelectedLabels="0"
                                                style="width: 26vw;" class="mb_1" />
                                            <template v-for="(item, i) in selectLabels" :key="i">
                                                <div class="mb_1">{{ '- ' + item }}</div>
                                            </template>
                                        </FormField>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="btn_group_fixed">
                        <a href="javascript:void(0)" class="v_btn btn_outline_primary btn_md"
                            @click="$router.push({ path: '/main/system/user', query: { key: 'member' } })">{{
                                t('10084') }}</a><!--inventory-->
                        <button type="submit" class="v_btn btn_primary btn_md" @click="fnRequireUpdate">{{
                            t('10000') }}</button><!--save-->
                        <button type="button" class="v_btn btn_outline_secondary btn_md" @click="fnRequireDel">{{
                            t('10173') }}</button><!--delete-->
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

.alignCenter {
    display: flex;
    align-items: center;
}
</style>
