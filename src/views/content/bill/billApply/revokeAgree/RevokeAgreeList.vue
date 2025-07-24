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

/** Variable declaration */
const router = useRouter();
const store = useStore();
const tableDatas = ref([]);
const lang = localStorage.getItem('languageType');
const comCodes1010 = store.getComCodes(1010);
const billNo = ref(null);
const billName = ref(null);
const statCd = ref("");

/** function list */

/** Excel download */
const fnExcelDownload = () => {
    // Header designation to include

    const selectedHeaders = ["sclDscRcpNmb", "billName", "ppsrNm", "regDt", "regDate", "regDt2", "agreeYn"];
    const wsCols = [t('10147'), t('10049'), t('10106'), t('10100'), t('10576'), t('10056'), t('10541')]; // Heather name array


    const title = t('10575') + t('10084') //"List of the agenda withdrawal";


    // Move to Store (20250226 Cho Jin -ho)

    store.fnExcelDownload(tableDatas.value, selectedHeaders, wsCols, title);
};

/** check */
const fnSearch = () => {
    let params = {};
    params.lang = lang;
    params.billName = billName.value;
    params.billNo = billNo.value;
    // params.statCd = statCd.value;

    const apiUrl = '/bill/revokeAgree';
    store.API_LIST(apiUrl, params).then((data) => {
        tableDatas.value = data.data.data;

        console.log('tableDatas.value', tableDatas.value);
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
};

/** Initial inquiry */
const fnInit = () => {
    fnSearch();
};

/** Detailed screen */
const fnGoDetail = (e) => {
    router.push({ name: 'bill.retractAgree.dtl', query: { id: e.data.billId }});
};

const fnReset = () => {
    billName.value = null;
    statCd.value = "";
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
                            <label class="form_label">{{ t('10292') }}</label>
                            <input type="text" class="form_control" placeholder="" v-model="billNo">
                        </div>
                        <div class="input_item">
                            <label class="form_label">{{ t('10293') }}</label>
                            <input type="text" class="form_control" placeholder="" v-model="billName">
                        </div>
                        <!-- <div class="input_item">
                            <label class="form_label">{{ t('10056') }}</label>
                            <select class="form_control" v-model="statCd">
                                <option value="">{{ t('10224') }}</option>
                                <option v-for="comCode in comCodes1010" :key="comCode.codeId" :value="comCode.codeId">{{ comCode.codeNm }}</option>
                            </select>
                        </div> -->
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
                <DataTable @row-dblclick="fnGoDetail" :value="tableDatas" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem;"
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink">
                    <Column field="billNo" :header="t('10292')" style="width: 7.8%;" class="text_center" sortable></Column>
                    <Column field="billName" :header="t('10293')" sortable></Column>
                    <Column field="ppsrNm" :header="t('10106')" style="width: 15.5%;" class="text_center"></Column>
                    <Column field="regDate" :header="t('10533')" style="width: 8.4%;" class="text_center" sortable>
                        <template #body="{ data }">
                            {{ data.revokeRegDt ? dayjs(data.revokeRegDt).format('DD/MM/YYYY') : '' }}
                        </template>                      
                    </Column>
                    <Column field="statNm" :header="t('10056')" style="width: 13.9%;" class="text_center"></Column>
                    <Column field="wtDt" :header="t('10541')" style="width: 8.9%;" class="text_center" >
                        <template #body="{ data }">
                            {{ data.wtDt ? dayjs(data.wtDt).format('DD/MM/YYYY') : '' }}
                        </template>




                        <!-- <template #body="{ data }">
                            {{ dayjs(data.agreeYn).isValid() ? dayjs(data.agreeYn).format('DD/MM/YYYY') : '' }}
                        </template> -->

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
