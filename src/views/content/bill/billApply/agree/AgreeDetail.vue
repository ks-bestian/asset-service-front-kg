<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from 'vue-router'
import { useStore } from "@/store";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useConfirm } from "primevue/useconfirm";
import { isEmpty , replace} from 'lodash';
import dayjs from "dayjs";
import TitleComp from "@/components/TitleComp.vue";
import BillFileList from "@/views/content/billMng/common/billFileList.vue";
import { useI18n } from 'vue-i18n'
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TreeTable from 'primevue/treetable';


const { t } = useI18n()

/** Variable declaration */
const store = useStore();
const router = useRouter();
const route = useRoute();
const commentList = ref([]);//Homepage Comment List Homepage Division Link

const agreeYn = ref(null);
const proposerList = ref([]);
const applyDetail = ref([]);
const fileList = ref([]);
const lang = localStorage.getItem('languageType');
const confirm = useConfirm();

const authBtnAgree = ref(false); // agreement

const authBtnCancelAgree = ref(false); // Cancellation


const fnAuthSetup = () => {

    const currentStepId = applyDetail.value.currentStepId;

    // Consent (until the first plenary session is assumed)

    authBtnAgree.value = currentStepId == '0' //First registration

                      || currentStepId == '1000' //Reception

                      || currentStepId == '1200' //Waiting

                      || currentStepId == '1300' //Committee

                      || currentStepId == '1400'
                      || currentStepId == '1500'
                      || currentStepId == '1600' //Committee


    // Cancellation of consent (before the first plenary session)

    authBtnCancelAgree.value = currentStepId == '0' //First registration

                            || currentStepId == '1000' //Reception

                            || currentStepId == '1200' //Waiting

                            || currentStepId == '1300' //Committee

                            || currentStepId == '1400'
                            || currentStepId == '1500'
                            || currentStepId == '1600' //Committee                      


};

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
    if(a.agreeYn === b.agreeYn) return 0;
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

/** Save (agreement) */
const fnAgree = (argAgreeYn) => {

    let msg = "";
    if(argAgreeYn == 'Y') {
        msg = t('10427'); // "Do you agree?"

    } else {
        msg = t('10428'); // "Would you like to cancel your consent?"

    }

    confirm.require({
        target: event.currentTarget,
        message: msg,
        accept: () => {

            let params = {};
            params.agreeYn = argAgreeYn;

            const apiUrl = `/bill/agree/${route.query.id}`;
            store.API_UPDATE(apiUrl, params).then((data) => {
                fnSearch();
            });


        },
        reject: () => {
        }
    });
}


/** File download */
const fnDownloadFile = (fileId, fileNm) => {
    store.API_FILE_DOWN(fileId, fileNm);
}

/** Opinion list inquiry */
const toggleComment = (val) => {
    comment.value = !val;
}

/** List */
const fnGoList = () => {
    router.push({name: 'bill.agree'});
}

/** Details */
const fnSearch = () => {

    let params = {};
    params.lang = lang;

    const apiUrl = `/bill/agree/${route.query.id}`;
    store.API_LIST(apiUrl, params).then((data) => {

        applyDetail.value = data.data.data.applyDetail;
        proposerList.value = data.data.data.proposerList;

        // const basicFileKindCd = ['110', '120', '130', '140', '150', '160'];
		// fileList.value = data.data.data.fileList.filter(file => basicFileKindCd.includes(file.fileKindCd));


        fileList.value = data.data.data.applyFileList;

        if(!isEmpty(data.data.data.commentLists)) {
			commentList.value = data.data.data.commentLists;
		} 

        fnAuthSetup();

    }).catch(({ message }) => {
        console.log("message : ", message);
    });
}

const fnInit = () => {
    fnSearch();
}

onMounted(() => {
    fnInit();
});
</script>

<template>
    <div class="content_inner">
        <!-- <div class="content_util">
            <div class="title_wrap">
                <h2 class="content_tit">Маселеге макулдук</h2>
                <button type="button" class="v_btn btn_favorite"><i class="v_ico ico_bookmark"></i></button>
            </div>
            <nav class="v_breadcrumb">
                <ul class="path">
                    <li><i class="v_ico ico_home"></i></li>
                    <li>{{ t('10002') }}</li>
                    <li>{{ t('10577') }}</li>
                </ul>
            </nav>
        </div> -->
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
                            <td>{{ applyDetail.sclDscRcpNmb }}</td>
                            <th scope="row">{{ t('10051') }}</th>
                            <td>{{ dayjs(applyDetail.ppslDt).format('DD/MM/YYYY') }}</td>
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
                            <th scope="row">{{ t('10071') }}</th>
                            <td colspan="3">
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
                                        style="min-height: 200px">
                                        <Column field="polyNm" :header="t('10073')" style="width: 30%;" class="text_center"></Column>
                                        <Column field="memberNm" :header="t('10074')" style="width: 60%;" class="text_center" />
                                        <Column field="agreeYn" :header="t('10094')" style="width: 60%;" class="text_center">
                                            <template #body="{ data }">
                                                {{ data.agreeYn == 'Y' ? t('10095') : t('10096')}}
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
                <div class="btn_group_fixed">
                    <button type="button" class="v_btn btn_outline_primary btn_md" @click="fnAgree('N')" v-if="authBtnCancelAgree && applyDetail.agreeYn == 'Y'" >{{ t('10542') }}</button> 
                    <a href="javascript:void(0)" class="v_btn btn_primary btn_md" @click="fnAgree('Y')" v-if="authBtnAgree && applyDetail.agreeYn == 'N'">{{ t('10541') }}</a>
                    <button type="button" class="v_btn btn_outline_primary btn_md" @click="fnGoList">{{ t('10084') }}</button>                    
                </div>
            </div>
            
            <div class="btn_group_fixed btnGroups">
                <h3 class="v_tit1">{{ t('10098') }}</h3>
                <!-- <a href="javascript:void(0)" class="v_btn btn_primary btn_md" style="margin-left: auto;" @click="toggleComment(comment)">{{ t('10617') }}</a> -->
            </div>
            <div class="v_table table_list" v-show="commentList.length">
                <TreeTable :value="commentList" :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
                    tableStyle="min-width: 50rem">
                    <Column field="id" header="No" style="width: 2%;">
                        <template #body="slotProps">
                            <i v-if="slotProps.node.parentYn != 'Y'" class="pi pi-reply" style="transform: scaleY(-1); margin: 0 10px 0 50px;"></i>
                                <span>{{ slotProps.node.key }}</span>
                        </template>
                    </Column>
                    <Column field="label" :header="t('10098')" style="width: 40%;"></Column>
                    <Column field="regNm" :header="t('10099')" style="width: 5%;"></Column>
                    <Column field="regDt" :header="t('10100')" style="width: 3%;">
                        <template #body="slotProps">
                            {{ slotProps.node.regDt != undefined ? dayjs(slotProps.node.regDt).format('DD/MM/YYYY') : '' }}
                        </template>
                    </Column>
                    <Column expander style="width: 2%;"></Column>
                    <template #empty>
                        <div class="no_data" style="border-bottom: none; height: 11rem;">
                            <i class="v_ico ico_error"></i>
                            <span class="text_msg">{{ t('10075') }}</span>
                        </div>
                    </template>
                </TreeTable>
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

.p-treetable-column-header-content{
    justify-content: center;
}

.p-treetable-body-cell-content {
    justify-content: center;
}
</style>
