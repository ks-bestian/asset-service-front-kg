<script setup>
import { ref, onMounted, watch, computed } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import TreeSelect from 'primevue/treeselect';
import TitleComp from "@/components/TitleComp.vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute();
const confirm = useConfirm();
const store = useStore();
const router = useRouter();
const memberList = ref([]);
const userList = ref([]);
const tab = computed(() => (route.query.key || 'member'))
const searchNm = ref('')
const lang = ref(localStorage.getItem("languageType"))
const selectUsers = ref([])
const polyList = ref([])
const polyCd = ref('')
const treeData = ref([])
const searchDept = ref({})


const fnRequire = (event) => {
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
    });
}


const fnNew = () => {
    if (tab.value === 'member') {
        router.push('/main/system/user/member/save')
    } else {
        router.push('/main/system/user/save');
    }
}

const fnMemberList = () => {
    let param = {
        lang: lang.value,
        memberNm: searchNm.value,
        polyCd: polyCd.value,
    }
    store.API_LIST('admin/member', param).then((data) => {
        memberList.value = data.data.data
    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnSearch = () => {
    if (tab.value === 'member') {
        fnMemberList();
    } else {
        fnUserList();
    }
}

const fnUserList = () => {
    let param = {
        lang: lang.value,
        userNm: searchNm.value,
        deptCd: Object.keys(searchDept.value)[0],

    }
    store.API_LIST('admin/user', param).then((data) => {
        userList.value = data.data.data
    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnDetail = (e) => {
    if (tab.value === 'member') {
        router.push({
            path: '/main/system/user/member/detail',
            state: { data: { ...e.data } }
        })
    } else {
        router.push({
            path: '/main/system/user/detail',
            state: { data: { ...e.data } }
        })
    }
}


const fnDelete = () => {
    const deleteItems = []

    if (tab.value === 'member') {
        selectUsers.value.forEach((item) => {
            deleteItems.push(item.memberId)
        })

        store.API_DELETE('admin/member', deleteItems).then((data) => {
            fnMemberList();
        }).catch(({ message }) => {
            console.log(message);
        })
    } else {
        selectUsers.value.forEach((item) => {
            deleteItems.push(item.userId)
        })

        store.API_DELETE('admin/user', deleteItems).then((data) => {
            fnUserList();
        }).catch(({ message }) => {
            console.log(message);
        })
    }
}

/** Party inquiry */
const fnSearchPoly = () => {
    let params = {};
    const apiUrl = 'admin/dept';
    store.API_LIST(apiUrl, params).then((data) => {
        polyList.value.push(...data.data.data.filter(data => data.uprDeptCd == 'poly'));
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
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

const fnTab = (tabname) => {
    router.push({
        path: '/main/system/user',
        query: { key: tabname }
    })
}

const fnExcelDownload = () => {
    // Header designation to include

    let selectedHeaders = [];
    let wsCols = [];
    let title = '';
    let data = null;

    if (tab.value === 'member') {
        selectedHeaders = ["memberId", "memberNm", "polyNm", "email", 'mblNo'];
        wsCols = [t('10324'), t('10152'), t('10073'), t('10331'), t('10358')]; // Heather name array


        title = t('10357') + t('10084');
        data = memberList.value;

    } else if (tab.value === 'user') {
        selectedHeaders = ["userId", "userNm", "deptNm", "jobNm", 'mblNo'];
        wsCols = [t('10324'), t('10152'), t('10347'), t('10361'), t('10331')]; // Heather name array


        title = t('10510')//'Employee list';

        data = userList.value;
    }

    store.fnExcelDownload(data, selectedHeaders, wsCols, title);
};

const fnReset = () => {
    searchNm.value = '';
    polyCd.value = '';
    searchDept.value = {};
}

onMounted(() => {
    fnGetData();
    fnMemberList();
    fnUserList();
    fnSearchPoly();
})
</script>

<template>
    <div class="content_inner">
        <TitleComp />
        <!-- Main area -->
        <div class="content_section">
            <nav class="tab_menu type2 mb_6">
                <ul class="tab_list">
                    <li :class="{ on: tab == 'member' }"><a href="javascript:void(0)" @click="fnTab('member');">{{
                            t('10357') }}</a><!--Parliamentary-->
                    </li>
                    <li :class="{ on: tab == 'user' }"><a href="javascript:void(0)" @click="fnTab('user');">{{
                            t('10345') }}</a></li><!--employee-->
                </ul>
            </nav>

            <div class="board_search">
                <div class="search_inner">
                    <div class="form_row">
                        <div class="input_item">
                            <label class="form_label">{{ t('10152') }}</label><!--name-->
                            <input type="text" class="form_control" :placeholder="t('10146')" v-model="searchNm"
                                @keydown.enter="fnSearch">
                        </div>
                        <div class="input_item" v-if="tab === 'member'">
                            <label class="form_label">{{ t('10073') }}</label><!--political party-->
                            <select class="form_control" v-model="polyCd">
                                <option value="">{{ t('10224') }}</option><!--Please select.-->
                                <option v-for="(item, i) in polyList" :key="i" :value="item.deptCd">{{ item.deptNm }}
                                </option>
                            </select>
                            <td>
                            </td>
                        </div>
                        <div class="input_item" v-if="tab === 'user'">
                            <label class="form_label">{{ t('10347') }}</label><!--department-->
                            <TreeSelect v-model="searchDept" :options="treeData" :placeholder="t('10224')"
                                selectionMode="single" style="width: 100%; padding: 5px;" />
                            <td>
                            </td>
                        </div>
                    </div>

                </div>
                <div class="search_btn">
                    <button type="button" class="v_btn btn_primary btn_md" @click="fnSearch"><i
                            class="v_ico ico_search_white"></i><span>{{ t('10053') }}</span></button><!--check-->
                    <button type="button" @click="fnReset" class="v_btn btn_outline_primary btn_md"><i
                            class="v_ico ico_reset_primary"></i><span></span></button>
                </div>
            </div>
            <nav class="tab_menu type2 mt_6">
            </nav>
            <div class="board_info">
                <div class="left">
                    <div class="total_num" v-if="tab === 'member'">{{ t('10104') }} <span class="text_primary">{{
                        memberList.length
                            }}</span></div><!--Total-->
                    <div class="total_num" v-else>Total <span class="text_primary">{{ userList.length }}</span></div>
                </div>
                <div class="right">
                    <div class="btn_wrap">
                        <!-- <a href="javascript:void(0)" class="v_btn btn_outline_neutral btn_sm" @click="fnRequire($event)">Тандоону жок кылуу</a> -->
                        <a href="javascript:void(0)" class="v_btn btn_outline_primary btn_sm" @click="fnNew">{{ t('10353')
                            }}</a><!--new-->
                        <button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnExcelDownload()"><i
                                class="v_ico ico_download_secondary"></i><span>{{ t('10055')
                                }}</span></button><!--Excel download-->
                    </div>
                </div>
            </div>

            <div class="v_table table_list" v-show="tab === 'member'">
                <DataTable :value="memberList" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                    tableStyle="min-width: 50rem;" @row-dblclick="fnDetail" v-model:selection="selectUsers">
                    <!-- <Column field="selection" selection-mode="multiple" style="width: 4%;" class="text_center"></Column> -->
                    <Column field="memberId" :header="t('10324')" style="width: 10%;" class="text_center" sortable></Column>
                    <Column field="memberNm" :header="t('10152')" sortable></Column>
                    <Column field="polyNm" :header="t('10073')" style="width: 15%;" class="text_center"></Column>
                    <Column field="email" :header="t('10331')" style="width: 15%;" class="text_center"></Column>
                    <Column field="mblNo" :header="t('10358')" style="width: 15%;" class="text_center"></Column>
                    <template #empty>
                        <div class="no_data">
                            <i class="v_ico ico_error"></i>
                            <span class="text_msg">{{ t('10075') }}</span>
                        </div>
                    </template>
                </DataTable>
            </div>

            <div class="v_table table_list" v-show="tab === 'user'">
                <DataTable :value="userList" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                    tableStyle="min-width: 50rem;" @row-dblclick="fnDetail" v-model:selection="selectUsers">
                    <!-- <Column field="selection" selection-mode="multiple" style="width: 3%;" class="text_center"></Column> -->
                    <Column field="userId" :header="t('10324')" style="width: 10%;" class="text_center" sortable></Column>
                    <Column field="userNm" :header="t('10152')" sortable></Column>
                    <!-- <Column field="userKind" header="Түрү" style="width: 10.4%;" class="text_center"></Column> -->
                    <Column field="deptNm" :header="t('10347')" style="width: 20%;" class="text_center"></Column>
                    <Column field="jobNm" :header="t('10361')" style="width: 15%;" class="text_center"></Column>
                    <Column field="email" :header="t('10331')" style="width: 15%;" class="text_center"></Column>
                    <template #empty>
                        <div class="no_data">
                            <i class="v_ico ico_error"></i>
                            <span class="text_msg">{{ t('10075') }}</span>
                        </div>
                    </template>
                </DataTable>
            </div>
        </div>
        <!-- // Main area -->
    </div>
</template>

<style>
.no_data {
    display: flex;
    /* Flex box use */
    justify-content: center;
    /* Horizontal */
    align-items: center;
    flex-direction: column;
}
</style>
