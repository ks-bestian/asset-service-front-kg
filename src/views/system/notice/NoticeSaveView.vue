<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router'
import { useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { FormField } from '@primevue/forms';
import Textarea from 'primevue/textarea';
import TitleComp from "@/components/TitleComp.vue";
import { useI18n } from 'vue-i18n'
import dayjs from "dayjs";

const today = dayjs().format('YYYY-MM-DD')
const { t } = useI18n()
const confirm = useConfirm();
const router = useRouter();
const route = useRoute();
const tabType = ref('')
const brdSj = ref('');
const brdCn = ref('');
const stDt = ref(null);
const edDt = ref(null);
const useYn = ref('N');
const importantYn = ref('N');
const hiddenYn = ref('N')
const files = ref(null);
const store = useStore();
const deptCd = store.loginInfo.deptCd;


const fnGoList = (e) => {
    router.push({
        path: '/main/system/notice',
        query: { key: tabType.value }
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
            fnSave();
        },
    });
}



const fnSave = () => {
    if (tabType.value === 'DATA') {
        fnSave2();
    } else {
        fnSave1();
    }
}

// save

const fnSave1 = (e) => {

    // if (!fnValidate()) {
    //     return;
    // }


    const jsonData = {
        brdSj: brdSj.value,
        brdCn: brdCn.value,
        pupYn: useYn.value,
        pupBgDt: stDt.value,
        pupEdDt: edDt.value,
        importantYn: importantYn.value,
        hiddenYn: hiddenYn.value,
        cmtCd: deptCd
    }

    const apiUrl = `/admin/board/${tabType.value}`;

    store.API_SAVE(apiUrl, jsonData).then((data) => {
        fnGoList();
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

// Storage (including files)

const fnSave2 = () => {

    // if (!fnValidate()) {
    //     return;
    // }


    const formData = new FormData();
    formData.append("brdSj", brdSj.value);
    formData.append("brdCn", brdCn.value);
    formData.append("importantYn", importantYn.value);
    formData.append("hiddenYn", hiddenYn.value)
    formData.append("cmtCd", deptCd)

    for (var i = 0; i < files.value?.length; ++i) {
        formData.append("files", files.value[i]);
    }

    const apiUrl = `/admin/board/file/${tabType.value}`;

    store.API_SAVE_FILE(apiUrl, formData).then((data) => {
        fnGoList();
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
    if (!brdSj.value) {
        errors.brdSj = [{ message: t('10460') }];
    }
    if (!brdCn.value) {
        errors.brdCn = [{ message: t('10460') }];
    }
    if (stDt.value > edDt.value || (stDt.value && !edDt.value) || (!stDt.value && edDt.value)) {
        errors.popDt = [{ message: t('10618') }]
    }
    return {
        errors
    };
};

onMounted(() => {
    tabType.value = route.query.key
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
                                <th scope="row">{{ t('10354') }}</th><!--Hidden-->
                                <td>
                                    <div class="alignCenter">
                                        <span class="check_item">
                                            <input style="margin-right: 10px;" type="checkbox" id="inputCheck"
                                                v-model="hiddenYn" true-value="Y" false-value="N">
                                            <label for="inputCheck"></label>{{ t('10355')
                                            }}<!--When selecting, the user does not see the post.-->
                                        </span>

                                    </div>
                                </td>
                                <th scope="row">{{ t('10356') }}</th><!--Or-->
                                <td>
                                    <div class="alignCenter">
                                        <span class="check_item">
                                            <input type="checkbox" id="inputCheck1" v-model="importantYn" true-value="Y"
                                                false-value="N">
                                            <label for="inputCheck1"></label>
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="tabType === 'NOTI'">
                                <th scope="row">{{ t('10507') }}</th><!--Pop -up period-->
                                <td>
                                    <div class="form_row">
                                        <input type="date" class="form_control" value="" v-model="stDt"
                                            style="width: 15rem; margin-right: 20px;" :min="today">
                                        {{ "~" }}
                                        <input type="date" class="form_control" value="" v-model="edDt"
                                            style="width: 15rem; margin-left: 20px;" :min="today">
                                    </div>
                                    <FormField v-slot="$field" name="popDt" initialValue="" style="flex-grow: 1;"
                                        v-model="stDt">
                                        <Message v-if="stDt > edDt || (stDt || edDt)" severity="error" size="large"
                                            variant="simple">{{ $field.error?.message }}</Message>
                                    </FormField>
                                </td>
                                <th scope="row">{{ t('10508') }}</th><!--Pop -up-->
                                <td>
                                    <div class="alignCenter">
                                        <span class="check_item">
                                            <input type="checkbox" id="inputCheck2" v-model="useYn" true-value="Y"
                                                false-value="N">
                                            <label for="inputCheck2"></label>
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">{{ t('10049') }}<span class="text_red">*</span></th><!--title-->
                                <td colspan="3">
                                    <FormField v-slot="$field" name="brdSj" initialValue="" style="flex-grow: 1;">
                                        <InputText type="text" v-model="brdSj" class="form_control" size="large"
                                            maxlength="180" style="width: 100%" />
                                        <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">
                                            {{ $field.error?.message }}</Message>
                                    </FormField>
                                </td>
                            </tr>

                            <tr>
                                <th scope="row">{{ t('10256') }}<span class="text_red">*</span></th><!--detail-->
                                <td colspan="3">
                                    <FormField v-slot="$field" name="brdCn" initialValue="" style="flex-grow: 1;">
                                        <Textarea v-model="brdCn" class="form_control" size="large"
                                            style="width: 100%; line-height: 1.5;" maxlength="3900"></Textarea>
                                        <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">
                                            {{ $field.error?.message }}</Message>
                                    </FormField>
                                </td>
                            </tr>
                            <tr v-if="tabType === 'DATA'">
                                <th scope="row">{{ t('10257') }}</th><!--attachment-->
                                <td colspan="3">
                                    <div class="file_attatch">
                                        <div class="form_col type4">
                                            <div class="input_item">
                                                <div class="input_group">
                                                    <!-- Label for and input ID matching required -->
                                                    <input type="file" class="form_file" id="inputFile1_1" multiple
                                                        @change="e => files = e.target.files">
                                                    <input type="text" class="form_control file_name">
                                                    <span class="input_addon">
                                                        <label class="v_btn btn_outline_primary btn_sm btn_file"
                                                            for="inputFile1_1">{{ t('10160') }}</label><!--File selection-->
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="btn_group_fixed">
                <a href="javascript:void(0)" class="v_btn btn_outline_primary btn_md" @click="fnGoList">{{ t('10084')
                    }}</a>
                <button type="submit" class="v_btn btn_primary btn_md" @click="fnRequireSave">{{ t('10000')
                }}</button>
            </div>
        </Form>
        <!-- // Main area -->
    </div>
</template>

<style scoped>
.alignCenter {
    display: flex;
    align-items: center;
}
</style>