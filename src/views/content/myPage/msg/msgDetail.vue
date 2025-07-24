<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter } from 'vue-router'
import { useRoute } from "vue-router";
import pdfIcon from '@/assets/images/common/ico_file_pdf.png';
import wordIcon from '@/assets/images/common/ico_file_word.png';
import { useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import dayjs from "dayjs";
import TitleComp from "@/components/TitleComp.vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const confirm = useConfirm();
const store = useStore();
const router = useRouter();
const route = useRoute();
const tabType = ref('')
const data = ref({})
const files = ref([])

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
        reject: () => {
        }
    });
}

const fnDelete = () => {
    const deleteItems = []
    deleteItems.push(data.value.msgId)

    store.API_DELETE('myPage/msg', deleteItems).then((data) => {
        router.push('/myPage/msg')
    }).catch(({ message }) => {
        console.log(message)
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

const fnRvcDt = () => { //Confirmation date storage

    let param = {
        msgGroupId: data.value.msgGroupId,
        rcvId: data.value.rcvId,
        msgId: data.value.msgId,
    }

    store.API_UPDATE(`myPage/msg/rcvDt`, param).then((data) => {
    }).catch(({ message }) => {
        console.log(message)
    })

}


onMounted(() => {
    tabType.value = route.query.key
    data.value = { ...history.state.data }

    fnGetFileData(data.value.fileGroupId)

    if (data.value.msgDiv === 'R' && data.value.rcvDt === null) {
        fnRvcDt();
    }
})
</script>

<template>
    <div class="content_inner">
        <TitleComp />
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
                        <tr>
                            <th scope="row">{{ t('10049') }}</th><!--title-->
                            <td colspan="3">
                                {{ data.msgSj }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">{{ t('10256') }}</th><!--detail-->
                            <td colspan="3" style="line-height: 1.5;">
                                {{ data.msgCn }}
                            </td>
                        </tr>
                        <tr v-if="files.length == 0">
                            <th scope="row">{{ t('10257') }}</th><!--attachment-->
                            <td colspan="3">{{ t('10520') }}</td>
                        </tr>
                        <tr v-else>
                            <th scope="row">{{ t('10257') }}</th><!--attachment-->
                            <td colspan="3">
                                <ul class="file_list">
                                    <li v-for="file in files" :key="file.fileId" v-if="files.length > 0">
                                        <span>{{ file.orgFileNm }}</span>
                                        <div class="file_wrap">
                                            <a href="javascript:void(0)" class="v_btn"
                                                @click="fnDownloadFile(file.fileId, file.orgFileNm)"><img
                                                    :src="wordIcon" alt=""></a>
                                        </div>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr v-if="tabType === 'send'">
                            <th scope="row">{{ t('10250') }}</th><!--Recipient-->
                            <td>{{ data.rcvNm }}</td>
                            <th scope="row">{{ t('10338') }}</th><!--Reception-->
                            <td>{{ dayjs(data.rcvDt).isValid() ? dayjs(data.rcvDt).format('DD/MM/YYYY HH:mm') : '' }}
                            </td>
                        </tr>
                        <tr v-else>
                            <th scope="row">{{ t('10275') }}</th><!--Sender-->
                            <td>{{ data.sendNm }}</td>
                            <th scope="row">{{ t('10340') }}</th><!--Date of delivery-->
                            <td>{{ dayjs(data.sendDt).isValid() ? dayjs(data.sendDt).format('DD/MM/YYYY HH:mm') : '' }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="btn_group_fixed">
            <a href="javascript:void(0)" class="v_btn btn_outline_primary btn_md"
                @click="$router.push({ path: '/myPage/msg', query: { key: tabType } })">{{ t('10084') }}</a><!--inventory-->
            <button type="button" class="v_btn btn_outline_secondary btn_md" @click="fnRequireDel">{{ t('10173') }}</button>
        </div>
        <!-- // Main area -->
    </div>
</template>

<style></style>