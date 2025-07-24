<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router'
import wordIcon from '@/assets/images/common/ico_file_word.png';
import { useStore } from "@/store";
import dayjs from "dayjs";
import { useConfirm } from "primevue/useconfirm";
import TitleComp from "@/components/TitleComp.vue";
import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { FormField } from '@primevue/forms';
import Textarea from 'primevue/textarea';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const confirm = useConfirm();
const router = useRouter();
const route = useRoute();
const tabType = ref('')
const tableDatas = ref({});
const store = useStore();
const files = ref([]);

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
            fnGoUpdate();
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
            fnGoDelete();
        },
    });
}


const fnGoList = (e) => {
    router.push({
        path: '/main/system/notice',
        query: { key: tabType.value }
    });
}

const fnGoUpdate = (e) => {
    const jsonData = {
        ...tableDatas.value
    }

    const apiUrl = `/admin/board/${route.query.id}`;


    store.API_UPDATE(apiUrl, jsonData).then((data) => {
        fnGoList();
    }).catch(({ message }) => {
        console.log(message)
    })
}

/*Bringing details*/
const fnGetData = () => {
    let params = { lang: localStorage.getItem('languageType') };
    const apiUrl = `/admin/board/detail/${route.query.id}`;

    store.API_LIST(apiUrl, params).then((data) => { //CMT_CD is not in the com_board table

        tableDatas.value = data.data.data;
        fnGetFileData(tableDatas.value.fileGroupId);

    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

const fnGetFileData = (fileGroupId) => {
    let params = {};
    const apiUrl = `/com/file/${fileGroupId}`;

    store.API_LIST(apiUrl, params).then((data) => {
        files.value = data.data;
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

const fnDownloadFile = (fileId, fileNm) => {
    store.API_FILE_DOWN(fileId, fileNm);
}

const fnGoDelete = () => {

    let deleteItems = [];
    if (route.query.id) {
        deleteItems.push(route.query.id)

        const apiUrl = `/admin/board`;

        store.API_DELETE(apiUrl, deleteItems).then((data) => {
            fnGoList();
        }).catch(({ message }) => {
            console.log(message)
        })
    }
}

const fnValidate = () => {
    const { errors } = resolver();
    return Object.keys(errors).length === 0;
}

const resolver = () => {
    const errors = {};
    if (!tableDatas.value.brdSj) {
        errors.brdSj = [{ message: t('10460') }];
    }
    if (!tableDatas.value.brdCn) {
        errors.brdCn = [{ message: t('10460') }];
    }
    if (tableDatas.value.pupBgDt > tableDatas.value.pupEdDt || (tableDatas.value.pupBgDt && !tableDatas.value.pupEdDt) || (!tableDatas.value.pupBgDt && tableDatas.value.pupEdDt)) {
        errors.popDt = [{ message: t('10618') }]
    }


    return {
        errors
    };
};

onMounted(() => {
    tabType.value = route.query.key
    fnGetData();
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
                                                v-model="tableDatas.hiddenYn" true-value="Y" false-value="N">
                                            <label for="inputCheck">{{ t('10355')
                                                }}</label><!--When selecting, the user does not see the post.-->
                                        </span>
                                    </div>
                                </td>

                                <th scope="row">{{ t('10356') }}</th><!--Or-->
                                <td>
                                    <div class="alignCenter">
                                        <span class="check_item">
                                            <input type="checkbox" id="inputCheck1" v-model="tableDatas.importantYn"
                                                true-value="Y" false-value="N">
                                            <label for="inputCheck1"></label>
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="tabType === 'NOTI'">
                                <th scope="row">{{ t('10507') }}</th><!--Pop -up period-->
                                <td>
                                    <div class="form_row">
                                        <input type="date" class="form_control" v-model="tableDatas.pupBgDt"
                                            style="width: 15rem; margin-right: 20px;">
                                        {{ "~" }}
                                        <input type="date" class="form_control" v-model="tableDatas.pupEdDt"
                                            style="width: 15rem; margin-left: 20px;">
                                    </div>
                                    <FormField v-slot="$field" name="popDt" initialValue="" style="flex-grow: 1;">
                                        <Message
                                            v-if="tableDatas.pupBgDt > tableDatas.pupEdDt || (tableDatas.pupBgDt || tableDatas.pupEdDt)"
                                            severity="error" size="large" variant="simple">{{ $field.error?.message }}
                                        </Message>
                                    </FormField>
                                </td>
                                <th scope="row">{{ t('10508') }}</th><!--Pop -up-->
                                <td>
                                    <div class="alignCenter">
                                        <span class="check_item">
                                            <input type="checkbox" id="inputCheck2" v-model="tableDatas.pupYn"
                                                true-value="Y" false-value="N">
                                            <label for="inputCheck2"></label>
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">{{ t('10049') }}<span class="text_red">*</span></th><!--title-->
                                <td colspan="3">
                                    <!-- <input type="text" class="form_control" v-model="tableDatas.brdSj"
                                        style="width: 100%;"> -->

                                    <FormField v-slot="$field" name="brdSj" :initialValue="tableDatas.brdSj"
                                        style="flex-grow: 1;">
                                        <InputText type="text" v-model="tableDatas.brdSj" class="form_control"
                                            size="large" style="width: 100%" />
                                        <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">
                                            {{ $field.error?.message }}</Message>
                                    </FormField>
                                </td>
                            </tr>

                            <tr>
                                <th scope="row">{{ t('10256') }}<span class="text_red">*</span></th><!--detail-->
                                <td colspan="3">
                                    <FormField v-slot="$field" name="brdCn" :initialValue="tableDatas.brdCn"
                                        style="flex-grow: 1;">
                                        <Textarea v-model="tableDatas.brdCn" class="form_control" size="large"
                                            style="width: 100%; line-height: 1.5;"></Textarea>
                                        <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">
                                            {{ $field.error?.message }}</Message>
                                    </FormField>
                                </td>
                            </tr>

                            <tr v-if="tabType === 'DATA'">
                                <th scope="row">{{ t('10257') }}</th><!--attachment-->
                                <td colspan="3">

                                    <ul class="file_list" v-if="files.length > 0">
                                        <li v-for="file in files" :key="file.fileId">
                                            <span>{{ ' - ' + file.orgFileNm }}</span>
                                            <div class="file_wrap">
                                                <a href="javascript:void(0)" class="v_btn"
                                                    @click="fnDownloadFile(file.fileId, file.orgFileNm)"><img
                                                        :src="wordIcon" alt=""></a>
                                            </div>
                                        </li>
                                    </ul>

                                    <span v-else>{{ t('10520') }}</span> <!--There is no attachment.-->
                                </td>
                            </tr>
                            <tr>
                                <th>{{ t('10625') }}</th>
                                <td colspan="3">{{ tableDatas.deptNm }}</td>
                            </tr>
                            <tr>
                                <th scope="row">{{ t('10099') }}</th><!--registrant-->
                                <td>{{ tableDatas.regNm }}</td>
                                <th scope="row">{{ t('10100') }}</th><!--Registration date-->
                                <td>{{ dayjs(tableDatas.regDt).isValid() ? dayjs(tableDatas.regDt).format('DD/MM/YYYY') : '' }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="btn_group_fixed">
                <a href="javascript:void(0)" class="v_btn btn_outline_primary btn_md" @click="fnGoList">{{ t('10084')
                }}</a><!--inventory-->
                <button type="submit" class="v_btn btn_primary btn_md" @click="fnRequireSave">{{ t('10174')
                }}</button><!--save-->
                <button type="button" class="v_btn btn_outline_secondary btn_md" @click="fnRequireDel">{{ t('10173')
                }}</button><!--delete-->
            </div>
            <!-- // Main area -->
        </Form>
    </div>
</template>

<style scoped>
.alignCenter {
    display: flex;
    align-items: center;
}
</style>