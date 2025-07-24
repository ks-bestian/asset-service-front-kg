<script setup>
import { ref, onMounted, computed } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import * as XLSX from "xlsx-js-style";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/store";
import { isEmpty, replace } from 'lodash';
import dayjs from "dayjs";
import TitleComp from "@/components/TitleComp.vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const tableDatas = ref([]);
const router = useRouter();
const route = useRoute();
const store = useStore();
const sclDscRcpNmb = ref(null);
const ppslDt = ref(null);
const statCd = ref(route.query.statCd || "");
const billName = ref(null);
const lang = localStorage.getItem("languageType");
const comCodes1010 = store.getComCodes(1010);
const ageObj = computed(() => store.getAgeObj);
const toDate = ref(dayjs().subtract(1, 'month').format('YYYY-MM-DD'));
const fromDate = ref(dayjs().format('YYYY-MM-DD'));

/** check */
const fnSearch = () => {
    let params = {};
    params.statCd = statCd.value;
    // params.sclDscRcpNmb = sclDscRcpNmb.value;

    params.billName = billName.value;
    params.toDate = isEmpty(toDate.value) ? '' : replace(toDate.value, /-/g, '');
    params.fromDate = isEmpty(fromDate.value) ? '' : replace(fromDate.value, /-/g, '');
    params.lang = lang;
    params.naTermCd = ageObj.value.naTermCd;

    const apiUrl = '/bill/apply';
    store.API_LIST(apiUrl, params).then((data) => {
        tableDatas.value = data.data.data;
    }).catch(({ message }) => {
        console.log("message : ", message);
    });

}

/** save */
const fnGoSave = () => {
    router.push({ name: 'bill.apply.save' })
}

/** particular */
const fnGoDetail = (e) => {
    router.push({ name: 'bill.apply.dtl', query: { id: e.data.billId } });
}

/** Excel download */
const fnExcelDownload = () => {
    // Header designation to include

    const selectedHeaders = ["sclDscRcpNmb", "billName", "memberNm", "ppslDt", "status"];
    const wsCols = [t('10147'), t('10049'), t('10099'), t('10100'), t('10056')]; // Heather name array


    const title = t('10003') + t('10084')//"Examination List";


    // Move to Store (20250226 Cho Jin -ho)

    store.fnExcelDownload(tableDatas.value, selectedHeaders, wsCols, title);
};

/** Initial inquiry */
const fnInit = () => {
    fnSearch();
}

const fnReset = () => {
    billName.value = null;
    toDate.value = dayjs().subtract(1, 'month').format('YYYY-MM-DD');
    fromDate.value = dayjs().format('YYYY-MM-DD');
}

onMounted(() => {
    fnInit();//Initial inquiry

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
                        <div class="input_item">
                            <label class="form_label">{{ t('10293') }}</label>
                            <input type="text" v-model="billName" class="form_control" :placeholder="t('10293')"
                                @keyup.enter="fnSearch">
                        </div>
                        <div class="input_item">
                            <label class="form_label">{{ t('10107') }}</label>
                            <select class="form_control" v-model="statCd">
                                <option value="">{{ t('10066') }}</option>
                                <option v-for="comCode in comCodes1010" :key="comCode.codeId" :value="comCode.codeId">{{ comCode.codeNm }}</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="search_btn">
                    <button type="button" class="v_btn btn_primary btn_md" @click="fnSearch"><i
                            class="v_ico ico_search_white"></i><span>{{ t('10053') }}</span></button>
                    <button type="button" @click="fnReset" class="v_btn btn_outline_primary btn_md"><i
                            class="v_ico ico_reset_primary"></i><span></span></button>
                </div>
            </div>
            <div class="board_info" style="margin-top: 2rem;">
                <div class="left">
                    <div class="total_num">Total <span class="text_primary">{{ tableDatas.length }}</span></div>
                </div>
                <div class="right">
                    <div class="btn_wrap">
                        <a href="javascript:void(0)" class="v_btn btn_secondary btn_sm" @click="fnGoSave">{{ t('10054')
                            }}</a>
                        <button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnExcelDownload"><i
                                class="v_ico ico_download_secondary"></i><span>{{ t('10055') }}</span></button>
                    </div>
                </div>
            </div>

            <div class="v_table table_list">
                <DataTable @row-dblclick="fnGoDetail" :value="tableDatas" paginator :rows="10"
                    :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem;"
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink">
                    <Column field="billNo" :header="t('10292')" style="width: 10%;" class="text_center" sortable></Column>
                    <Column field="billName" :header="t('10293')" sortable></Column>
                    <Column field="ppslDt" :header="t('10051')" style="width: 10.4%;" class="text_center" sortable>
                        <template #body="{ data }">
                            {{ dayjs(data.ppslDt).format('DD/MM/YYYY') }}
                        </template>
                    </Column>
                    <Column field="rcpDt" :header="t('10148')" style="width: 10%;" class="text_center" sortable>
						<template #body="{ data }">
							{{ isEmpty(data.rcpDt) ? "": dayjs(data.rcpDt).format('DD/MM/YYYY') }}
						</template>
					</Column>
                    <Column field="statNm" :header="t('10056')" style="width: 16.9%;" class="text_center"></Column>
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
