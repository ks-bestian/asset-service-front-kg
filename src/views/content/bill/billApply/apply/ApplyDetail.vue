<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router'
import { useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ApplyRevokeModal from "@/views/content/bill/billApply/apply/ApplyRevokeModal.vue";
// import ApplySignModal from "@/views/content/bill/billApply/apply/ApplySignModal.vue";
import { isEmpty } from 'lodash';
import TitleComp from "@/components/TitleComp.vue";
import BillFileList from "@/views/content/billMng/common/billFileList.vue";
import { useI18n } from 'vue-i18n'
import { Tab, TabList, TabPanel, TabPanels, Tabs, Tree } from "primevue";
import ApplyCommentModal from "@/views/content/bill/billApply/apply/ApplyCommentModal.vue";
import dayjs from "dayjs";
import TreeTable from 'primevue/treetable';

const { t } = useI18n()

/** Variable declaration */
const store = useStore();
const router = useRouter();
const route = useRoute();
const commentList = ref([]);
const revokeModal = ref(false);
const signModal = ref(false);
const proposerList = ref([]);
const applyDetail = ref([]);
const fileList = ref([]);
const lang = localStorage.getItem("languageType");
const confirm = useConfirm();
const toast = useToast();
const gBillId = route.query.id;
const tabValue = ref('');
const commentModal = ref(false);
const lawId = ref(null);
const parentId = ref(null);


/** Buttons */
const processVo = ref({});//process info

const userInfo = store.loginInfo;
const authBtnUpdate = ref(false);//correction

const authBtnCancel = ref(false);//cancellation

const authBtnReq = ref(false);//Reception
// Const Authbtnstop = ref (false); //stop

const authBtnRevoke = ref(false);//Withdrawal


const fnAuthSetup = () => {

    // Authbtnrevoke.value = Applydetail.value.billno! == NULL; //withdrawal button (when completed application)


    // if (applyDetail.value.currentStepId == '1100' || applyDetail.value.currentStepId == '1150') { //Agenda withdrawal management
    //     authBtnUpdate.value = false;
    //     authBtnReq.value = false;
    //     authBtnStop.value = false;


    //     authBtnRevoke.value = false;
    // }
    // else if (userInfo.userId == applyDetail.value.ppsrId && processVo.value.taskStatus == 'P') {
    //     authBtnUpdate.value = true;
    //     authBtnReq.value = true;
    //     authBtnStop.value = true;
    // }


    const currentStepId = applyDetail.value.currentStepId;

    // Modification (until the completion of the law review)

    authBtnUpdate.value = currentStepId == '0' //First registration

        || currentStepId == '1000' //Reception

        || currentStepId == '1200' //Waiting


    // Cancellation (until application)

    authBtnCancel.value = currentStepId == '0' //First registration

        || currentStepId == '1000' //Reception


    // Withdrawal (until the completion of the application until the first round of conference)

    authBtnRevoke.value = currentStepId == '1200' //Waiting

        || currentStepId == '1300' //Committee

        || currentStepId == '1400'
        || currentStepId == '1500'
        || currentStepId == '1600' //Committee


    // Reception

    authBtnReq.value = currentStepId == '0' //First registration


};


/** Tap setting */
const tabVal = ref('');
const fnTab = (val) => {
    tabVal.value = val;
};

const filteredData = computed(() => {
    let list;
    if (tabVal.value === "") {
        list = proposerList.value;
    }
    else {
        list = proposerList.value.filter((item) => item.polyCd === tabVal.value);
    }
    list.sort((a, b) => {
        if (a.agreeYn === b.agreeYn) return 0;
        if (a.agreeYn === 'Y') return -1;
        return 1;
    });
    return list;
});

/** Party group */
const groupedPoly = computed(() => {
    const map = new Map();

    proposerList.value.forEach(member => {
        if (!map.has(member.polyCd)) {
            map.set(member.polyCd, { polyCd: member.polyCd, polyNm: member.polyNm, count: 0 });
        }
        map.get(member.polyCd).count++;
    });

    return Array.from(map.values());
});

/** stop */
const fnConfirmStop = (event) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Save your current process?',
        accept: () => {
            fnStop();
        },
        reject: () => {
            toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
}

const fnStop = () => {
}

const openModal = (kind) => {
    if (kind == 'revoke') {
        revokeModal.value = true;
    } else if (kind == 'sign') {
        signModal.value = true
    }
}

const openRevokeModal = () => {
    revokeModal.value = true;
}

/** Details */
const fnSearch = () => {

    let params = {};
    params.lang = lang;
    params.stepId = '0';
    params.trgtUserId = userInfo.userId;
    params.lngType = lang == 'lng_type_3' ? 'lng_type_1' : lang; //File language

    const apiUrl = `/bill/apply/${route.query.id}`
    store.API_LIST(apiUrl, params).then((data) => {

        applyDetail.value = data.data.data.applyDetail;
        proposerList.value = data.data.data.proposerList;

        // const basicFileKindCd = ['110', '120', '130', '140', '150', '160'];
        // fileList.value = data.data.data.fileList.filter(file => basicFileKindCd.includes(file.fileKindCd));


        fileList.value = data.data.data.applyFileList;
        processVo.value = data.data.data.processVo;

        if (!isEmpty(data.data.data.commentLists)) {
            commentList.value = data.data.data.commentLists;
        }

        fnAuthSetup();

    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

/** List */
const fnGoList = () => {
    router.push({ name: 'bill.apply' });
}

/** Modification */
const fnGoUpdate = () => {
    router.push({ name: 'bill.apply.update', query: { id: route.query.id } });
}

/** cancellation */
const fnGoCancel = (event) => {
    confirm.require({
        target: event.currentTarget,
        message: t('10660'),
        accept: () => {
            let params = {};
            const apiUrl = `/bill/apply/${route.query.id}`;
            store.API_DELETE(apiUrl, params).then((data) => {
                fnGoList();
            }).catch(({ message }) => {
                console.log("message : ", message);
            })
        },
        reject: () => {
        }
    });
}

/** receipt */
const fnConfirmSave = (event) => {
    confirm.require({
        target: event.currentTarget,
        message: t('10164'),
        accept: () => {
            fnSave();
        },
        reject: () => {
        }
    });
}

const fnSave = () => {
    let params = {};
    params.taskId = processVo.value.taskId;
    params.stepId = '1000';
    const apiUrl = `/bill/apply/accept/${route.query.id}`;
    store.API_SAVE(apiUrl, params).then((data) => {
        fnGoList();
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

const fnModalClose = () => {
    revokeModal.value = false;
    // Fn go list();

    fnSearch();
};

/** Initial inquiry */
const fnInit = () => {
    fnSearch(); // API call

};

const fnSetHome = () => {
    const jsonData = {
        billId: route.query.id,
        ppsrNm: applyDetail.value.memberNm,
        billNameKg: applyDetail.value.billNameKg,
        billNameRu: applyDetail.value.billNameRu,
        etcKg: applyDetail.value.etcKg,
        etcRu: applyDetail.value.etcRu
    };

    const apiUrl = `/bill/apply/home`;
    store.API_SAVE(apiUrl, jsonData).then((data) => {
        fnSearch();
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

const fnStopHome = () => {
    const jsonData = {
        sclDscRcpNmb: applyDetail.value.sclDscRcpNmb,
        billId: route.query.id
    };

    const apiUrl = `/bill/apply/home/stop`;
    store.API_SAVE(apiUrl, jsonData).then((data) => {
        fnSearch();
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

const fnCommentModal = (data) => {
    commentModal.value = true;
    parentId.value = data.key;
    lawId.value = data.lawId
}

onMounted(() => {
    fnInit();
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
                        <col style="width: 16.3%;">
                        <col>
                        <col style="width: 16.3%;">
                        <col style="width: 33.7%;">
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row">{{ t('10090') }}</th>
                            <td>{{ applyDetail.billNo }}</td>
                            <th scope="row">{{ t('10091') }}</th>
                            <td>{{ applyDetail.regDate }}</td>
                        </tr>
                        <tr>
                            <th scope="row">{{ t('10293') }}</th>
                            <td colspan="3">
                                {{ applyDetail.billName }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">{{ t('10111') }}</th>
                            <td colspan="3">
                                {{ applyDetail.etc }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">{{ t('10071') }}</th> <!--Shared-->
                            <td colspan="3">
                                <!-- <nav class="tab_menu type2">
                                    <ul class="tab_list">
                                        <li class="on"><a href="javascript:void(0)" @click="fnTab('')">{{ t('10083') }}({{ proposerList.length }})</a></li>
                                        <li v-for="(data, index) in groupedPoly" :key="data.polyCd">
                                            <a href="javascript:void(0)" @click="fnTab(data.polyCd)">
                                                {{ data.polyNm }} ({{ data.count }})
                                            </a>
                                        </li>
                                    </ul>
                                </nav> -->
                                <Tabs v-model:value="tabValue">
                                    <TabList>
                                        <Tab value="" @click="fnTab('')">{{ t('10083') }}({{ proposerList.length }})
                                        </Tab>
                                        <Tab v-for="(data, index) in groupedPoly" :key="data.polyCd"
                                            :value="data.polyCd" @click="fnTab(data.polyCd)">
                                            {{ data.polyNm }} ({{ data.count }})
                                        </Tab>
                                    </TabList>
                                </Tabs>
                                <div class="v_table table_list type2 fixed_header">
                                    <DataTable :value="filteredData" scrollable scrollHeight="200px"
                                        style="min-height: 200px">
                                        <Column field="polyNm" :header="t('10073')" style="width: 30%;"
                                            class="text_center"></Column>
                                        <Column field="memberNm" :header="t('10074')" style="width: 60%;"
                                            class="text_center" />
                                        <Column field="agreeYn" :header="t('10094')" style="width: 60%;"
                                            class="text_center">
                                            <template #body="{ data }">
                                                {{ data.agreeYn == 'Y' ? t('10095') : t('10096') }}
                                            </template>
                                        </Column>
                                        <template #empty>
                                            <div class="no_data" style="border-bottom: none; height: 11rem;">
                                                <i class="v_ico ico_error"></i>
                                                <span class="text_msg">{{ t('10075') }}</span>
                                            </div>
                                        </template>
                                    </DataTable>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">{{ t('10093') }}</th>
                            <td colspan="3">
                                <BillFileList :fileList="fileList" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="btn_group_fixed btnGroups">
                    <div>
                        <a href="javascript:void(0)" style="display: inline-block; width: 200px; height: 20px;"></a>
                    </div>
                    <div class="btns">
                        <button type="button" class="v_btn btn_outline_primary btn_md" @click="fnGoUpdate"
                            v-if="authBtnUpdate">{{
                            t('10157') }}</button>
                        <button type="button" class="v_btn btn_outline_primary btn_md" @click="fnGoCancel"
                            v-if="authBtnCancel">{{
                            t('10163') }}</button>
                        <a href="javascript:void(0)" class="v_btn btn_primary btn_md" @click="fnConfirmSave($event)"
                            v-if="authBtnReq">{{ t('10158') }}</a>
                        <button type="button" class="v_btn btn_outline_primary btn_md" @click="fnGoList">{{ t('10084')
                            }}</button>
                    </div>
                    <div class="btns">
                        <a href="javascript:void(0)" class="v_btn btn_primary btn_md" @click="openRevokeModal"
                            v-if="authBtnRevoke">{{ t('10065') }}</a>
                    </div>
                </div>
            </div>

            <div class="btn_group_fixed btnGroups">
                <h3 class="v_tit1">{{ t('10098') }}</h3>

                <!--Toggle change-->
                <button type="button" class="v_btn btn_outline_primary btn_md" style="margin-left: auto;"
                    @click="fnSetHome" v-if="applyDetail?.sclDscRcpNmb == null || applyDetail?.sclDscRcpNmb == ''">{{
                        t('10097') }}</button>
                <button type="button" class="v_btn btn_outline_primary btn_md" @click="fnStopHome" v-else>{{ t('10628')
                }}</button>
                <!-- <a href="javascript:void(0)" class="v_btn btn_primary btn_md" @click="toggleComment(comment)">Комментарий(Comments)</a> -->
            </div>
            <div class="v_table table_list">
                <TreeTable :value="commentList" :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
                    tableStyle="min-width: 50rem">
                    <Column field="id" header="No" style="width: 2%;" class="text_center">
                        <template #body="slotProps">
                            <i v-if="slotProps.node.parentYn != 'Y'" class="pi pi-reply" style="transform: scaleY(-1); margin: 0 10px 0 50px;"></i>
                                <span>{{ slotProps.node.key }}</span>
                        </template>
                    </Column>
                    <Column field="label" :header="t('10098')" style="width: 30%;"></Column>
                    <Column field="regNm" :header="t('10099')" style="width: 5%;"></Column>
                    <Column field="regDt" :header="t('10100')" style="width: 4%;">
                        <template #body="slotProps"> {{ slotProps.node.regDt != undefined ?
                            dayjs(slotProps.node.regDt).format('DD/MM/YYYY') : '' }}
                        </template>
                    </Column>
                    <Column style="width: 2%;" field="parentYn">
                        <template #body="slotProps">
                            <button v-if="slotProps.node.parentYn == 'Y'" type="button"
                                class="v_btn btn_outline_secondary btn_sm" @click="fnCommentModal(slotProps.node)">{{ t('10617') }}</button><!--Reply-->
                        </template>
                    </Column>
                    <Column expander style="width: 2%;"/>
                    <template #empty>
                        <div class="no_data" style="border-bottom: none; height: 11rem;">
                            <i class="v_ico ico_error"></i>
                            <span class="text_msg">{{ t('10075') }}</span>
                        </div>
                    </template>
                </TreeTable>
            </div>
        </div>
    </div>

    <ApplyRevokeModal :billId="gBillId" v-if="revokeModal" @close="fnModalClose" :dialog="revokeModal">
    </ApplyRevokeModal>
    <!-- <ApplySignModal v-if="signModal" @close="signModal = false"></ApplySignModal> -->
    <ApplyCommentModal v-if="commentModal" @close="commentModal = false; fnSearch();" :dialog="commentModal"
        :lawId="lawId" :parentId="parentId"></ApplyCommentModal>
</template>

<style scoped>
.btnGroups {
    display: flex !important;
    justify-content: space-between !important;
}

.btns>* {
    margin-right: 10px;
    /* Right margin */
}

.btns>*:last-child {
    margin-right: 0;
    /* The last element is to remove margins */
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

.p-datatable-scrollable>.p-datatable-table-container>.p-datatable-table>.p-datatable-thead {
    background: #F3F5F6 !important;
    z-index: 0 !important;
}

::v-deep(.p-datatable .p-datatable-tbody > tr:hover td) {
    background-color: transparent !important;
    cursor: default !important;
}


:deep(.p-treetable-column-header-content){
    justify-content: center;
}

:deep(.p-treetable-body-cell-content) {
    justify-content: center;
}
</style>
