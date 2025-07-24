<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, toRef } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useRouter, useRoute } from "vue-router";
import { useStore, usePageStore } from "@/store";
import dayjs from "dayjs";
import { useConfirm } from "primevue/useconfirm";
import TitleComp from "@/components/TitleComp.vue";
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast';
import 'primeicons/primeicons.css'

const { t } = useI18n()
const store = useStore();
const pageStore = usePageStore();
const confirm = useConfirm();
const router = useRouter();
const route = useRoute();
const list = ref([]);
const tab = computed(() => (route.query.key || 'NOTI'));
const searchNm = ref(pageStore.getSearchParams.searchNm || '');
const deptNm = ref(pageStore.getSearchParams.deptNm || '');
const regNm = ref(pageStore.getSearchParams.regNm || '');
const selection = ref([]);
const rows = computed(() => pageStore.getRows)
const firstIndex = ref(pageStore.getStartIndex)
const toast = useToast();

watch(tab, () => {
    fnSearch();
})

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

const fnDelete = () => {

    const deleteItems = [];
    for (var i = 0; i < selection.value.length; ++i) {
        deleteItems.push(selection.value[i].brdId);
    }
    if (deleteItems.length === 0) {
        // Alert(t('10505'));

        toast.add({ severity: 'warn', summary: t('10505'), detail: t('10505'), life: 3000 });
        return;
    }

    const apiUrl = `/admin/board`;
    store.API_DELETE(apiUrl, deleteItems).then((data) => {
        fnSearch();
    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnTab = (tabname) => {
    router.push({
        path: '/main/system/notice',
        query: { key: tabname }
    })
}

const fnGoDetail = (e) => {
    router.push({
        path: '/main/system/notice/detail',
        query: { key: tab.value, id: e.data.brdId }
    })
}

const fnNew = () => {
    router.push({
        path: '/main/system/notice/save',
        query: { key: tab.value }
    })
}

const fnSearch = () => {
    let params = {
        brdSj: searchNm.value,
        regNm: regNm.value,
        deptNm: deptNm.value,
    };

    const apiUrl = `/admin/board/${tab.value}`;
    pageStore.fnSaveParams({ 'searchNm': searchNm.value, 'regNm': regNm.value, 'deptNm': deptNm.value})

    store.API_LIST(apiUrl, params).then((data) => {
        list.value = data.data.data;
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

const fnExcelDownload = () => {
    // Header designation to include

    const selectedHeaders = ["brdSj", "regNm", "regDt", "notiInqCnt"];
    const wsCols = [t('10049'), t('10099'), t('10100'), t('10350')]; // Heather name array


    const tabNm = tab.value === 'DATA' ? t('10029') : tab.value === 'NOTI' ? t('10028') : t('10030');

    const title = `${tabNm} ${t('10084')}`

    const data = list.value.map(item => ({
        ...item,
        regDt: dayjs(item.regDt).isValid() ? dayjs(item.regDt).format('DD/MM/YYYY') : ''
    }))

    store.fnExcelDownload(data, selectedHeaders, wsCols, title);
};

const fnReset = () => {
    searchNm.value = '';
    regNm.value = '';
    deptNm.value = '';
}

const fnPage = (e) => {
    pageStore.fnSavePage(e.page, e.rows)
};


onMounted(async() => {
    fnSearch();//Initial inquiry

})

</script>

<template>
    <div class="content_inner">
        <TitleComp />
        <!-- Main area -->
        <div class="content_section">
            <nav class="tab_menu type2 mb_6">
                <ul class="tab_list">
                    <li :class="{ on: tab == 'NOTI' }"><a href="javascript:void(0)" @click="fnTab('NOTI')">{{ t('10028')
                    }}</a></li>
                    <li :class="{ on: tab == 'DATA' }"><a href="javascript:void(0)" @click="fnTab('DATA')">{{ t('10029')
                    }}</a></li>
                    <li :class="{ on: tab == 'FAQ' }"><a href="javascript:void(0)" @click="fnTab('FAQ')">{{ t('10030')
                    }}</a></li>
                </ul>
            </nav>
            <div class="board_search">
                <div class="search_inner">
                    <div class="form_row">
                        <div class="input_item">
                            <label class="form_label">{{ t('10049') }}</label>
                            <input type="text" class="form_control" :placeholder="t('10146')" v-model="searchNm"
                                @keydown.enter="firstIndex = 0; fnSearch();">
                        </div>

                        
                        <div class="input_item">
                            <label class="form_label">{{ t('10099') }}</label>
                            <input type="text" class="form_control" :placeholder="t('10146')" v-model="regNm"
                                @keydown.enter="firstIndex = 0; fnSearch();">
                        </div>

                        <div class="input_item">
                            <label class="form_label">{{ t('10347') }}</label>
                            <input type="text" class="form_control" :placeholder="t('10146')" v-model="deptNm"
                                @keydown.enter="firstIndex = 0; fnSearch();">
                        </div>
                    </div>
                </div>
                <div class="search_btn">
                    <button type="button" class="v_btn btn_primary btn_md" @click="firstIndex = 0; fnSearch();"><i
                            class="v_ico ico_search_white"></i><span>{{ t('10053') }}</span></button>
                    <button type="button" @click="fnReset" class="v_btn btn_outline_primary btn_md">
                        <i class="v_ico ico_reset_primary"></i><span></span></button>
                </div>
            </div>

            
            <nav class="tab_menu type2 mt_6">
            </nav>


            <div class="board_info">
                <div class="left">
                    <div class="total_num">{{ t('10104') }} <span class="text_primary">{{ list.length }}</span></div>
                </div>
                <div class="right">
                    <div class="btn_wrap">
                        <button type="button" class="v_btn btn_outline_primary btn_sm" @click="fnNew">{{ t('10353')
                        }}</button><!--new-->
                        <button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnRequireDel">{{
                            t('10088') }}</button> <!--Selection deletion-->
                        <button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnExcelDownload">
                            <i class="v_ico ico_download_secondary"></i><span>{{ t('10055')
                            }}</span></button><!--Excel download-->
                    </div>
                </div>
            </div>

            <div class="v_table table_list">
                <DataTable :value="list" paginator :rows="rows" v-model:first="firstIndex"
                    :rowsPerPageOptions="[5, 10, 20, 50]" @page="fnPage" tableStyle="min-width: 50rem;"
                    @row-dblclick="fnGoDetail" v-model:selection="selection"
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink">
                    <Column field="selection" selection-mode="multiple" style="width: 4%;" class="text_center"></Column>
                    <Column field="brdSj" :header="t('10049')" sortable>
                        <template #body="{ data }">
                            <span class="pi pi-thumbtack" style="margin-right: 5px;"
                                v-if="data.importantYn == 'Y'"></span>{{ data.brdSj }}
                        </template>
                    </Column>
                    <Column field="regDt" :header="t('10100')" style="width: 7%;" class="text_center" sortable>
                        <template #body="{ data }">
                            {{ dayjs(data.regDt).isValid() ? dayjs(data.regDt).format('DD/MM/YYYY') : '' }}
                        </template>
                    </Column>
                    <Column field="regNm" :header="t('10099')" style="width: 10%;" class="text_center"></Column>
                    <!--registrant-->
                    <Column field="deptNm" :header="t('10347')" style="width: 15%;" class="text_center"></Column>
                    <Column v-if="tab === 'NOTI'" field="pupYn" :header="t('10506')" class="text_center"
                        style="width: 5%;"></Column>
                    <!--Pop -up-->
                    <Column field="hiddenYn" :header="t('10352')" class="text_center" style="width: 5%;"></Column>
                    <!--hiding-->
                    <Column field="notiInqCnt" :header="t('10350')" style="width: 10%;" class="text_center"></Column>
                    <!--Views-->
                    <template #empty>
                        <div class="no_data">
                            <i class="v_ico ico_error"></i>
                            <span class="text_msg">{{ t('10075') }}</span><!--There is no data.-->
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
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
</style>