<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useRouter } from 'vue-router';
import { useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import { size } from "lodash";
import TitleComp from "@/components/TitleComp.vue";
import Button from 'primevue/button';
import { useI18n } from 'vue-i18n'
import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { FormField } from '@primevue/forms';
import MultiSelect from 'primevue/multiselect';

const { t } = useI18n()
const confirm = useConfirm();
const store = useStore();
const router = useRouter();
const detail = ref({ polyCd: '', cmitCd: '', ageCd: '' });
const items = ref([])
const itemsCmt = ref([])
const ageList = ref([])
const selectCmits = ref([])

const fnRequire = (event) => {

    if (!fnValidate()) {
        return;
    }

    confirm.require({
        target: event.currentTarget,
        rejectProps: {
            outlined: true,
            severity: 'secondary',
            size: 'large'
        },
        acceptProps: {
            size: 'large'
        },
        message: t('10155'),//'Would you like to save?',

        accept: () => {
            fnSave();
        },
    });
}

const fnSave = () => {
    detail.value.cmitList = selectCmits.value
    store.API_SAVE('admin/member', detail.value).then((data) => {
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

const fnValidate = () => {
    const { errors } = resolver();
    return Object.keys(errors).length === 0;
}

const resolver = () => {
    const errors = {};
    const checkData = ['memberId', 'memberNmKg', 'memberNmRu', 'ageCd', 'userPassword', 'pswdChk']

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
    const result = []

    for(let i=0; i < itemsCmt.value.length; i++) {
        if(selectCmits.value.includes(itemsCmt.value[i].deptCd)) {
            result.push(itemsCmt.value[i].deptNm)
        }
    }
    return result;
})

onMounted(() => {
    fnSearchPoly();
    fnAgeList();
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
                                <th scope="row">ID<span class="text_red">*</span></th>
                                <td>
                                    <FormField v-slot="$field" name="memberId" initial-value="" style="flex-grow: 1;">
                                        <InputText type="text" v-model="detail.memberId" class="form_control"
                                            maxlength="20" size="large"></InputText>
                                        <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">
                                            {{ $field.error?.message }}</Message>
                                    </FormField>
                                </td>
                                <th scope="row">{{ t('10116') }}<span class="text_red">*</span></th><!--Algebraic-->
                                <td>
                                    <div class="alignCenter">
                                        <FormField v-slot="$field" name="ageCd" initialValue=""
                                            style="flex-grow: 1; display: flex; align-items: center;">
                                            <select class="form_control" v-model="detail.ageCd"
                                                style="width: 7vw; margin-right: 10px;">
                                                <option disabled value="">{{ t('10224') }}</option><!--Please select.-->
                                                <option v-for="(item, index) in ageList" :key="index"
                                                    :value="item.codeId"> {{ item.codeNm }}</option>
                                            </select>
                                            <Button icon="pi pi-refresh" variant="text" rounded severity="contrast"
                                                aria-label="Cancel" @click="detail.ageCd = ''"></Button>
                                            <Message v-if="detail.ageCd == ''" severity="error" size="large"
                                                variant="simple">{{ $field.error?.message }}</Message>
                                        </FormField>
                                    </div>
                                </td>
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
                                    <FormField v-slot="$field" name="memberNmKg" initial-value="" style="flex-grow: 1;">
                                        <InputText type="text" v-model="detail.memberNmKg" class="form_control"
                                            maxlength="200" size="large"></InputText>
                                        <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">
                                            {{ $field.error?.message }}</Message>
                                    </FormField>
                                </td>
                                <th scope="row">{{ t('10326') }}<span class="text_red">*</span></th><!--Name (Russian)-->
                                <td>
                                    <FormField v-slot="$field" name="memberNmRu" initial-value="" style="flex-grow: 1;">
                                        <InputText type="text" v-model="detail.memberNmRu" class="form_control"
                                            maxlength="200" size="large"></InputText>
                                        <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">
                                            {{ $field.error?.message }}</Message>
                                    </FormField>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">{{ t('10360') }}</th><!--Cell phone-->
                                <td><input type="text" class="form_control" v-model="detail.mblNo" maxlength="100"></td>
                                <th scope="row">{{ t('10359') }}</th><!--email-->
                                <td><input type="text" class="form_control" v-model="detail.email" maxlength="100"></td>
                            </tr>
                            <tr>
                                <th scope="row">{{ t('10073') }}</th><!--political party-->
                                <td colspan="3">
                                    <div class="alignCenter">
                                        <select class="form_control" v-model="detail.polyCd"
                                            style="width: 26vw; margin-right: 10px;">
                                            <option disabled value="">{{ t('10224') }}</option><!--Please select.-->
                                            <option v-for="(item, i) in items" :key="i" :value="item.deptCd">{{
                                                item.deptNm }}</option>
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
                                                style="width: 26vw;" class="mb_1"/>
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
                                t('10084')
                            }}</a><!--inventory-->
                        <button type="submit" class="v_btn btn_primary btn_md" @click="fnRequire">{{
                            t('10174')
                        }}</button><!--save-->
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

.alignCenter {
    display: flex;
    align-items: center;
}
</style>
