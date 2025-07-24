<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from 'vue-router'
import { useStore } from "@/store";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Chip from 'primevue/chip';
import ConfirmModal from '@/components/modal/confirmModal.vue';
import { isEmpty , replace} from 'lodash';
import dayjs from "dayjs";
import TitleComp from "@/components/TitleComp.vue";
import BillFileList from "@/views/content/billMng/common/billFileList.vue";
import { useConfirm } from "primevue/useconfirm";
import { useI18n } from 'vue-i18n'
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';

const { t } = useI18n()

/** Variable declaration */
const store = useStore();
const router = useRouter();
const route = useRoute();
const applyDetail = ref([]);
const proposerList = ref([]);
const revokeProposerList = ref([]);
const fileList = ref([]);
const revokeFileList = ref([]);
const confirm = useConfirm();
const lang = localStorage.getItem("languageType");

const authBtnCancelRevoke = ref(false); // Cancellation of withdrawal

const authBtnSubmitRevoke = ref(false); // Request for withdrawal reception


const fnAuthSetup = () => {

    const currentStepId = applyDetail.value.currentStepId;

    // Cancellation of withdrawal

    authBtnCancelRevoke.value = currentStepId == '1100' //Withdrawal request

                             || currentStepId == '1150' //During the withdrawal demand  


    // Request for withdrawal reception

    authBtnSubmitRevoke.value = currentStepId == '1100' //Withdrawal request


};

/** function list */
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
        if (a.revokeYn === b.revokeYn) return 0;
        if (a.revokeYn === 'Y') return -1;
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

const everyProposerAgreedToRevoke = computed(() => {
    return proposerList.value.filter(proposer => proposer.agreeYn === 'Y').every(proposer => proposer.revokeYn === 'Y');
});

const fnRevokeSubmit = (event) => {

    if (!everyProposerAgreedToRevoke.value) {
        alert(t('10631')); // 'There is not enough lawmakers signed by the withdrawal.'

        return;
    }

    confirm.require({
        target: event.currentTarget,
        message: t('10432'), // 'Would you like to withdraw?'

        accept: () => {
            let params = {};
            const apiUrl = `/bill/revoke/submit/${route.query.id}`;
            store.API_SAVE(apiUrl, params).then((data) => {
                fnGoList();
            }).catch(({ message }) => {
                console.log("message : ", message);
            })
        },
        reject: () => {
            
        }
    });
}

const fnRevokeCancel = (event) => {
    confirm.require({
        target: event.currentTarget,
        message: t('10534'), // 'Would you like to cancel the request?'

        accept: () => {
            let params = {};
            const apiUrl = `/bill/revoke/cancel/${route.query.id}`;
            store.API_UPDATE(apiUrl, params).then((data) => {
                fnGoList();
            }).catch(({ message }) => {
                console.log("message : ", message);
            })
        },
        reject: () => {
            
        }
    });
}

/** check */
const fnSearch = () => {
    let params = {};
    params.lang = lang;

    const apiUrl = `/bill/revoke/${route.query.id}`;

    store.API_LIST(apiUrl, params).then((data) => {

        applyDetail.value = data.data.data.applyDetail;
        proposerList.value = data.data.data.proposerList;
        // fileList.value = data.data.data.fileList;

        // const basicFileKindCd = ['110', '120', '130', '140', '150', '160'];
		// fileList.value = data.data.data.fileList.filter(file => basicFileKindCd.includes(file.fileKindCd));


        fileList.value = data.data.data.applyFileList;

        revokeFileList.value = data.data.data.fileList.filter(file => file.fileKindCd == '170');

        revokeProposerList.value = proposerList.value.filter(proposer => proposer.revokeYn == 'Y');

        fnAuthSetup();

    }).catch(({ message }) => {
        console.log("message : ", message);
    })
};

/** Initial inquiry */
const fnInit = () => {
    fnSearch();
}

/** List */
const fnGoList = () => {
    router.push({ name: 'bill.revoke' })
}

/** File download */
const fnDownloadFile = (fileId, fileNm) => {
    store.API_FILE_DOWN(fileId, fileNm);
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
                    <tbody>
                        <tr>
                            <th scope="row">{{ t('10090') }}</th>
                            <td>{{ applyDetail.sclDscRcpNmb }}</td>
                            <th scope="row">{{ t('10121') }}</th>
                            <td>{{ applyDetail.ppsrNm }}</td>
                            <th scope="row">{{ t('10100') }}</th>
                            <td>{{ dayjs(applyDetail.regDt).format('DD/MM/YYYY') }}</td>
                        </tr>
                        <tr>
                            <th scope="row">{{ t('10293') }}</th>
                            <td colspan="5">
                                {{ applyDetail.billName }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">{{ t('10111') }}</th>
                            <td colspan="5">
                                {{ applyDetail.etc }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">{{ t('10071') }}</th>
                            <td colspan="5">
                                <!-- <nav class="tab_menu type2">
                                    <ul class="tab_list">
                                        <li class="on"><a href="javascript:void(0)" @click="fnTab('')">ALL({{ proposerList.length }})</a></li>
                                        <li v-for="(data, index) in groupedPoly" :key="data.polyCd">
                                            <a href="javascript:void(0)" @click="fnTab(data.polyCd)">
                                                {{ data.polyNm }} ({{ data.count }})
                                            </a>
                                        </li>
                                    </ul>
                                </nav> -->
                                <Tabs value="" scrollable>
                                    <TabList class="tab_list">
                                        <Tab @click="fnTab('')" value="" class="tab_menu type3">
                                            {{ t('10083') }}({{ proposerList.length }})
                                        </Tab>
                                        <Tab v-for="tab in groupedPoly" :value="tab.polyCd" @click="fnTab(tab.polyCd)" class="tab_menu">
                                            {{ tab.polyNm }} ({{ tab.count }})
                                        </Tab>
                                    </TabList>
                                </Tabs>
                                <div class="v_table table_list type2 fixed_header"> 
                                    <DataTable 
                                        :value="filteredData"
                                        scrollable
                                        scrollHeight="200px"
                                        style="min-height: 200px"
                                    >
                                        <Column field="polyNm" :header="t('10073')" style="width: 30%;" class="text_center"></Column>
                                        <Column :field="lang === 'langTy1' ? 'memberNmKg' : 'memberNmRu'" :header="t('10074')" style="width: 60%;" class="text_center" />
                                        <Column field="agreeYn" :header="t('10094')" style="width: 60%;" class="text_center">
                                            <template #body="{ data }">
                                                {{ data.agreeYn == 'Y' ? t('10095') : t('10096')}}
                                            </template>
                                        </Column>
                                        <Column field="agreeYn" :header="t('10661')" style="width: 60%;" class="text_center">
                                            <template #body="{ data }">
                                                {{ data.revokeYn == 'Y' ? t('10095') : t('10096')}}
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
                            <th scope="row">{{ t('10093') }}</th><!--document-->
                            <td colspan="5">
                                <BillFileList :fileList="fileList" />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">{{ t('10535') }}</th>
                            <td colspan="5">
                                <BillFileList :fileList="revokeFileList" />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">{{ t('10536') }}</th>
                            <td colspan="5">
                                {{ applyDetail.wtCn }}
                            </td>
                        </tr>
                        <!-- <tr>
                            <th scope="row">{{ t('10539') }}</th>
                            <td colspan="5">
                                <Chip v-for="item in revokeProposerList" :key="item.proposerId" :label="item.memberNmKg" />
                            </td>
                        </tr> -->
                    </tbody>
                </table>
                <div class="btn_group_fixed btnGroups">
                    <div class="btns">
                        <button type="button" class="v_btn btn_outline_primary btn_md" @click="fnRevokeCancel">{{ t('10537') }}</button>
                    </div>
                    <div class="btns">
                        <!-- <button type="button" class="v_btn btn_outline_primary btn_md" @click="$router.push('/main/applyUpdate')">{{ t('10157') }}</button> -->
                        <a href="javascript:void(0)" class="v_btn btn_primary btn_md text_center" @click="fnRevokeSubmit">{{ t('10538') }}</a>
                        <button type="button" class="v_btn btn_outline_primary btn_md" @click="fnGoList">{{ t('10084') }}</button>
                    </div>
                    <div>
                        <a href="javascript:void(0)" style="display: inline-block; width: 200px; height: 20px;"></a>
                    </div>
                </div>
            </div>
        </div>
        <!-- // Main area -->
    </div>

</template>

<style>
.btnGroups{
    display: flex !important;
    justify-content: space-between !important;
}

.btns > * {
    margin-right: 10px; /* Right margin */
}
.btns > *:last-child {
    margin-right: 0; /* The last element is to remove margins */
}

.no_data {
    display: flex; /* Flex box use */
    justify-content: center; /* Horizontal */
    align-items: center;
    flex-direction: column;
    height: 16rem; 
}

.p-datatable-scrollable > .p-datatable-table-container > .p-datatable-table > .p-datatable-thead {
    background: #F3F5F6 !important;
    z-index: 0 !important;
}

</style>
