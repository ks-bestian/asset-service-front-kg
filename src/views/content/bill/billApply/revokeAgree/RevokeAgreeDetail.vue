<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from 'vue-router'
import { useStore } from "@/store";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Chip from 'primevue/chip';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import TitleComp from "@/components/TitleComp.vue";
import BillFileList from "@/views/content/billMng/common/billFileList.vue";
import { useI18n } from 'vue-i18n'
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';

const { t } = useI18n()

/** Variable declaration */
const store = useStore();
const router = useRouter();
const route = useRoute();
const agreeYn = ref(null);
const proposerList = ref([]);
const revokeProposerList = ref([]);
const applyDetail = ref([]);
const fileList = ref([]);
const revokeFileList = ref([]);
const lang = localStorage.getItem('languageType');
const confirm = useConfirm();
const toast = useToast();

const authBtnAgree = ref(false); // agreement

const authBtnCancelAgree = ref(false); // Cancellation


const fnAuthSetup = () => {

    const currentStepId = applyDetail.value.currentStepId;

    // Withdrawal

    authBtnAgree.value = currentStepId == '1100' //Withdrawal


    // Cancellation of withdrawal agreement

    authBtnCancelAgree.value = currentStepId == '1100' //Withdrawal


};

/** function list */

/** Power Listing tab */
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

/** Withdrawal */
const fnAgree = (event) => {
    confirm.require({
        target: event.currentTarget,
        message: t('10155'),
        accept: () => {
            fnSave();
        },
        reject: () => {
            toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
}

/** save */
const fnSave = () => {
    let params = {};
    params.agreeYn = agreeYn.value == 'N' ? 'Y' : 'N';

    const apiUrl = `/bill/revokeAgree/${route.query.id}`;
    store.API_UPDATE(apiUrl, params).then((data) => {
        fnSearch();
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}


/** check */
const fnSearch = () => {
    let params = {};
    params.lang = lang;

    const apiUrl = `/bill/revokeAgree/${route.query.id}`;
    store.API_LIST(apiUrl, params).then((data) => {
        applyDetail.value = data.data.data.applyDetail;

        // const basicFileKindCd = ['110', '120', '130', '140', '150', '160'];
		// fileList.value = data.data.data.fileList.filter(file => basicFileKindCd.includes(file.fileKindCd));


        fileList.value = data.data.data.applyFileList;

        revokeFileList.value = data.data.data.fileList.filter(file => file.fileKindCd == '170');

        proposerList.value = data.data.data.proposerList;

        revokeProposerList.value = proposerList.value.filter(proposer => proposer.revokeYn == 'Y');

        agreeYn.value = applyDetail.value.revokeYn;

        fnAuthSetup();

    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

/** Initial inquiry */
const fnInit = () => {
    fnSearch();
};

/** List */
const fnGoList = () => {
    router.push({name: 'bill.retractAgree'});
}

onMounted(() => {
    fnInit();
});

</script>

<template>
    <div class="content_inner">
        <!-- <div class="content_util">
            <div class="title_wrap">
                <h2 class="content_tit">Маселенин артка кайтаруу макулдугу</h2>
                <button type="button" class="v_btn btn_favorite"><i class="v_ico ico_bookmark"></i></button>
            </div>
            <nav class="v_breadcrumb">
                <ul class="path">
                    <li><i class="v_ico ico_home"></i></li>
                    <li>{{ t('10002') }}</li>
                    <li>{{ t('10575') }}</li>
                </ul>
            </nav>
        </div> -->
        <TitleComp />
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
                            <td>{{ applyDetail.regDate }}</td>
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
                                        <Column field="revokeYn" :header="t('10540')" style="width: 60%;" class="text_center">
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
                            <th scope="row">{{ t('10093') }}</th>
                            <td colspan="3">
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
                            <th scope="row">{{ t('10540') }}</th>
                            <td colspan="5">
                                <Chip v-for="item in revokeProposerList" :key="item.proposerId" :label="item.memberNmKg" />
                            </td>
                        </tr> -->
                    </tbody>
                </table>
                <div class="btn_group_fixed">
                        <button type="button" class="v_btn btn_outline_primary btn_md" @click="fnAgree($event)" v-if="authBtnCancelAgree && agreeYn == 'Y'">{{ t('10542') }}</button>
                        <a href="javascript:void(0)" class="v_btn btn_primary btn_md" @click="fnAgree($event)" v-if="authBtnAgree && agreeYn == 'N'">{{ t('10541') }}</a>
                        <button type="button" class="v_btn btn_outline_primary btn_md" @click="fnGoList">{{ t('10084') }}</button>
                </div>
            </div>
        </div>
        <!-- Main area -->
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
