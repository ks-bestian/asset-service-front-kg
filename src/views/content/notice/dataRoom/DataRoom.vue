<script setup>
import { ref, onMounted, computed } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useRouter } from "vue-router";
import { useStore, usePageStore } from "@/store";
import dayjs from "dayjs";
import TitleComp from "@/components/TitleComp.vue";
import { useI18n } from 'vue-i18n'
import 'primeicons/primeicons.css'


const { t } = useI18n()
const store = useStore();
const pageStore = usePageStore();
const router = useRouter();
const list = ref([]);
const brdType = ref('DATA')
const searchSj = ref(pageStore.getSearchParams.searchSj || '')
const regNm = ref(pageStore.getSearchParams.regNm || '')
const deptNm = ref(pageStore.getSearchParams.deptNm || '')
const rows = computed(() => pageStore.getRows)
const firstIndex = ref(pageStore.getStartIndex)

const fnDetail = (e) => {
    router.push({
        path: '/notice/dataRoom/detail',
        query: { id: e.data.brdId }
    })
}

const fnSearch = () => {
    let param = {
        lang: localStorage.getItem('languageType'),
        brdSj: searchSj.value,
        regNm: regNm.value,
        deptNm: deptNm.value, 
    }

    pageStore.fnSaveParams({'searchSj' : searchSj.value, 'regNm' : regNm.value, 'deptNm' : deptNm.value})

    store.API_LIST(`admin/board/${brdType.value}`, param).then((data) => {
        list.value = data.data.data
        list.value = list.value.filter((item) => item.hiddenYn !== 'Y')
    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnExcelDownload = () => {
    // Header designation to include

    const selectedHeaders = ["brdSj", "regNm", "regDt", "notiInqCnt"];
    const wsCols = [t('10049'), t('10099'), t('10100'), t('10350')]; // Heather name array


    const title = t('10029') + t('10084')//"List of the Archives";


    const data = list.value.map(item => ({
        ...item,
        regDt: dayjs(item.regDt).isValid() ? dayjs(item.regDt).format('DD/MM/YYYY') : ''
    }))

    store.fnExcelDownload(data, selectedHeaders, wsCols, title);
};

const fnReset = () => {
    searchSj.value = ''
    regNm.value = ''
    deptNm.value = ''
}

const fnPage = (e) => {
    pageStore.fnSavePage(e.page, e.rows)
}

onMounted(() => {
    fnSearch();
})
</script>

<template>
    <div class="content_inner">
        <TitleComp />
        <!-- Main area -->
        <div class="content_section">
            <div class="board_search">
                <div class="search_inner">
                    <div class="form_row">
                        <div class="input_item">
                            <label class="form_label">{{ t('10049') }}</label><!--title-->
                            <input type="text" class="form_control" :placeholder="t('10146')" v-model="searchSj"
                                @keydown.enter="firstIndex = 0; fnSearch()">
                        </div>

                        <div class="input_item">
                            <label class="form_label">{{ t('10099') }}</label><!--registrant-->
                            <input type="text" class="form_control" :placeholder="t('10146')" v-model="regNm"
                                @keydown.enter="firstIndex = 0; fnSearch()">
                        </div>

                        <div class="input_item">
                            <label class="form_label">{{ t('10347') }}</label><!--department-->
                            <input type="text" class="form_control" :placeholder="t('10146')" v-model="deptNm"
                                @keydown.enter="firstIndex = 0; fnSearch()">
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
                    <div class="total_num">Total <span class="text_primary">{{ list.length }}</span></div>
                </div>

                <div class="right">
                    <div class="btn_wrap">
                        <button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnExcelDownload"><i
                                class="v_ico ico_download_secondary"></i><span>{{ t('10055') }}</span></button>
                    </div>
                </div>
            </div>

            <div class="v_table table_list">
                <DataTable :value="list" paginator :rows="rows" v-model:first="firstIndex" :rowsPerPageOptions="[5, 10, 20, 50]" paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink" @page="fnPage"
                    tableStyle="min-width: 50rem;" @row-dblclick="fnDetail">
                    <Column field="brdSj" :header="t('10049')" sortable>
                        <template #body="{ data }">
                            <span class="pi pi-thumbtack" v-if="data.importantYn == 'Y'"
                                style="margin-right: 5px;"></span>{{ data.brdSj }}
                        </template>
                    </Column>
                    <Column field="regNm" :header="t('10099')" style="width: 8%;" class="text_center" sortable></Column>
                    <Column field="deptNm" :header="t('10347')" style="width: 15%;" class="text_center" sortable></Column>
                    <Column field="regDt" :header="t('10100')" style="width: 8%;" class="text_center" sortable>
                        <template #body="{ data }">
                            {{ dayjs(data.regDt).isValid() ? dayjs(data.regDt).format('DD/MM/YYYY') : '' }}
                        </template>
                    </Column>
                    <Column field="notiInqCnt" :header="t('10350')" style="width: 8%;" class="text_center"></Column>
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
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
</style>