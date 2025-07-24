<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "@/store";
import { useRouter } from "vue-router";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import * as XLSX from "xlsx-js-style";
import { isEmpty , replace} from 'lodash';
import dayjs from "dayjs";
import TitleComp from "@/components/TitleComp.vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const tableDatas = ref([]);
const router = useRouter();
const store = useStore();
const billName = ref(null);
const statCd = ref("");
const sclDscRcpNmb = ref(null);
const ppslDt = ref(null);
const comCodes1010 = store.getComCodes(1010);
const ageObj = computed(() => store.getAgeObj);
const lang = localStorage.getItem("languageType");
const ppsrNm = ref(null);
const toDate = ref(dayjs().subtract(1, 'month').format('YYYY-MM-DD'));
const fromDate = ref(dayjs().format('YYYY-MM-DD'));


/** function List */

/** Excel download */
const fnExcelDownload = () => {
    // Header designation to include

    const selectedHeaders = ["sclDscRcpNmb", "billName", "ppsrNm", "regDate", "regDt2", "signDate"];
    const wsCols = [t('10147'), t('10049'), t('10106'), t('10100'), t('10056'), t('10541')]; // Heather name array


    const title = t('10577') + t('10084') //"List of agenda";


    // Move to Store (20250226 Cho Jin -ho)

    store.fnExcelDownload(tableDatas.value, selectedHeaders, wsCols, title);
};

/** List inquiry */
const fnSearch = () => {

    let params = {};
    params.lang = lang;
    params.billName = billName.value;
    params.ppsrNm = ppsrNm.value;
    params.toDate = isEmpty(toDate.value) ? '': replace(toDate.value, /-/g, '');
    params.fromDate = isEmpty(fromDate.value) ? '': replace(fromDate.value, /-/g, '');
    params.naTermCd = ageObj.value.naTermCd;

    const apiUrl = '/bill/agree';
    store.API_LIST(apiUrl, params).then((data) =>{
        tableDatas.value = data.data.data;
    }).catch(({ message }) => {10541
        console.log("message : ", message);
    });
};

const fnGoDetail = (e) => {
    router.push({name: 'bill.agree.dtl', query: { id: e.data.billId }});
}

/** Initial inquiry */
const fnInit = () => {
    fnSearch();
};

const fnReset = () => {
    toDate.value = dayjs().subtract(1, 'month').format('YYYY-MM-DD');
    fromDate.value = dayjs().format('YYYY-MM-DD'); 
    billName.value = null;
    ppsrNm.value = null;
}

onMounted(() => {
    fnInit();
});

</script>

<template>
    <div class="content_inner">
        <TitleComp />
        <!-- Main area -->
        <div class="content_section">
            <div class="board_search type2">
                <div class="search_inner">
                    <div class="form_row">
                        <div class="input_item">
                            <label class="form_label">{{ t('10051') }}</label>
                            <div class="input_group">
                                <input type="date" class="form_control form_datepicker" v-model="toDate">
                                <span class="text">~</span>
                                <input type="date" class="form_control form_datepicker" v-model="fromDate">
                            </div>
                        </div>
                        <div class="input_item" style="max-width: 100%;">
                            <label class="form_label">{{ t('10106') }}</label>
                            <input type="text" v-model="ppsrNm" class="form_control" placeholder="" @keyup.enter="fnSearch">
                        </div>
                    </div>
                    <div class="form_row">
                        <div class="input_item" style="max-width: 100%;">
                            <label class="form_label">{{ t('10293') }}</label>
                            <input type="text" v-model="billName" class="form_control" placeholder="" @keyup.enter="fnSearch">
                        </div>
                    </div>
                </div>
                <div class="search_btn">
                    <button type="button" class="v_btn btn_primary btn_md" @click="fnSearch"><i class="v_ico ico_search_white"></i><span>{{ t('10053') }}</span></button>
                    <button type="button" @click="fnReset" class="v_btn btn_outline_primary btn_md"><i class="v_ico ico_reset_primary"></i><span></span></button>
                </div>
            </div>
            <div class="board_info" style="margin-top: 2rem;">
                <div class="left">
                    <div class="total_num">Total <span class="text_primary">{{ tableDatas.length }}</span></div>
                </div>
                <div class="right">
                    <div class="btn_wrap">
                        <button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnExcelDownload"><i class="v_ico ico_download_secondary"></i><span>{{ t('10055') }}</span></button>
                    </div>
                </div>
            </div>

            <div class="v_table table_list">
                <DataTable 
                    @row-dblclick="fnGoDetail" 
                    :value="tableDatas" 
                    paginator 
                    :rows="10" 
                    :rowsPerPageOptions="[5, 10, 20, 50]" 
                    tableStyle="min-width: 50rem;"
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink">
                    <Column field="billNo" :header="t('10292')" style="width: 10%;" class="text_center" sortable></Column>
                    <Column field="billName" :header="t('10293')" sortable></Column>
                    <Column field="ppsrNm" :header="t('10106')" style="width: 15.5%;" class="text_center" ></Column>
                    <Column field="ppslDt" :header="t('10051')" style="width: 8.4%;" class="text_center" sortable>
                        <template #body="{ data }">
                            {{ dayjs(data.ppslDt).isValid() ? dayjs(data.ppslDt).format('DD/MM/YYYY') : '' }}
                        </template>
                    </Column>
                    <Column field="statNm" :header="t('10056')" style="width: 13.9%;" class="text_center" ></Column>
                    <Column field="signDt" :header="t('10573')" style="width: 8.9%;" class="text_center" sortable>
                        <template #body="{ data }">
                            {{ dayjs(data.signDt).isValid() ? dayjs(data.signDt).format('DD/MM/YYYY') : '' }}
                        </template>                    
                    </Column>
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
        text-align: center;
        height: 16rem; 
    }
</style>
