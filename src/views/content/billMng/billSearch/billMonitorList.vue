<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useStore } from "@/store";
import TitleComp from "@/components/TitleComp.vue";
import ProgressGauge from "./billMonitorGauge.vue";
import dayjs from "dayjs";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore();
const router = useRouter();
const tableDatas = ref([]);

const comCodes1010 = store.getComCodes(1010);
const ageObj = computed(() => store.getAgeObj);
const ageList = computed(() => store.getAgeList);

const searchBillNo = ref();
const searchBillName = ref();
const searchStatCd = ref('');
const searchAgeCd = ref(ageObj.value.naTermCd);

const fnSearch = () => {

    const lang = localStorage.getItem("languageType");
    let params = {};
    params.lang = lang;
	params.searchBillName = searchBillName.value;
	params.billNo = searchBillNo.value;
	params.naTermCd = searchAgeCd.value;
	params.statCd = searchStatCd.value;
    const apiUrl = `/bill/search/monitor`;
    store.API_LIST(apiUrl, params).then((data) => {
        tableDatas.value = data.data.data;
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

const fnGoDetail= (item)=>{
   router.push({name: 'billMng.billSearch.billMonitorList.dtl', params : {  billId: item.billId }});
}

const fnReset = () => {
    searchBillNo.value = '';
    searchBillName.value = '';
    searchStatCd.value = '';
    searchAgeCd.value = ageObj.value.naTermCd;
}

onMounted(() => {
	fnSearch();//Initial inquiry

});

</script>
<template>
<div class="content_inner">
    <TitleComp />
  <!-- Main area -->
  <div class="content_section">
    <div class="board_search"><!-- If you go over 2 lines of search items.Type2 -->
        <div class="search_inner">
            <!-- Search item width if you need to adjust the width of the class.Col_1 ~ 12 additional -->
            <div class="form_row">
                <div class="input_item">
                    <label class="form_label">{{ t('10292') }}</label><!--Agenda number-->
                    <input type="text" class="form_control" :placeholder="t('10292')" v-model="searchBillNo" @keyup.enter="fnSearch">
                </div>
                <div class="input_item">
                    <label class="form_label">{{ t('10293') }}</label><!--Agency-->
                    <input type="text" v-model="searchBillName" class="form_control" :placeholder="t('10293')" @keyup.enter="fnSearch">
                </div>
                <div class="input_item">
                    <label class="form_label">{{ t('10107') }}</label><!--Agenda-->
                    <select class="form_control" v-model="searchStatCd">
                        <option value="">{{ t('10066') }}</option><!--entire-->
                        <option v-for="comCode in comCodes1010" :key="comCode.codeId" :value="comCode.codeId">{{ comCode.codeNm }}</option>
                    </select>
                </div>
                <div class="input_item">
                    <label class="form_label">{{ t('10116') }}</label><!--Algebraic-->
                    <select class="form_control" v-model="searchAgeCd">
                        <option v-for="age in ageList" :value="age.codeId">{{ age.codeNm }}</option>
                    </select>
                </div>
            </div>

        </div>
        <div class="search_btn">
            <button type="button" class="v_btn btn_primary btn_md" @click="fnSearch"><i class="v_ico ico_search_white"></i><span>{{ t('10053') }}</span></button>
            <button type="button" @click="fnReset" class="v_btn btn_outline_primary btn_md"><i class="v_ico ico_reset_primary"></i><span></span></button>
        </div>
    </div>
    <div class="board_info mt_6">
        <div class="left">
            <div class="total_num">Total <span class="text_primary">{{ tableDatas.length }}</span></div>
        </div>
    </div>

            <div class="v_table table_list type2 table_monitoring">
                <div class="table_scroll_wrapper">
                    <table>
                        <colgroup>
                            <col style="width: 10%;">
                            <col style="width: 30%;">
                            <col style="width: 10%;">
                            <col span="5" >
                        </colgroup>
                        <thead>
                            <tr>
                                <th scope="col">{{ t('10292') }}</th><!--Agenda number-->
                                <th scope="col">{{ t('10293') }}</th><!--Agency-->
                                <th scope="col">{{ t('10051') }}</th><!--Suggestion-->
                                <th scope="col">{{ t('10113') }}</th><!--Agenda-->
                                <th scope="col">{{ t('10045') }}</th><!--committee-->
                                <th scope="col">{{ t('10046') }}</th><!--Plenary-->
                                <th scope="col">{{ t('10047') }}</th><!--Government transfer-->
                                <th scope="col">{{ t('10048') }}</th><!--horror-->
                            </tr>
                        </thead>
                        <tbody>
                            <template v-if="tableDatas.length > 0">
                                <tr v-for="(item, index) in tableDatas" :key="index" @dblclick="fnGoDetail(item)" style="cursor: pointer">
                                    <td>{{ item.billNo }}</td>
                                    <td class="text_left">{{ item.billName }}</td>
                                    <td>{{ dayjs(item.ppslDt).format('DD/MM/YYYY') }}</td>
                                    <td v-for="(idx, i) in 5" :key="i">
                                        <ProgressGauge :count="i" :progressValue="item.progressValue" />
                                    </td>
                                </tr>
                            </template>
                            <template v-else>
                                <tr>
                                    <td class="no_data" colspan="8" style="border-bottom: none; height: 11rem;">
                                        <i class="v_ico ico_error"></i>
                                        <span class="text_msg">{{ t('10075') }}</span>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <!-- // Main area -->    
</div>
</template>

<style></style>
