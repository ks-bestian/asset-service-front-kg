<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useStore } from "@/store";
import TitleComp from "@/components/TitleComp.vue";
import dayjs from "dayjs";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore();
const router = useRouter();
const list = ref([]);

const comCodes1010 = store.getComCodes(1010);
const ageObj = computed(() => store.getAgeObj);
const ageList = computed(() => store.getAgeList);

const searchBillNo = ref();
const searchBillName = ref();
const searchStatCd = ref('');
const searchAgeCd = ref(ageObj.value.naTermCd);

const fnGetAgendaList = () => {
    const lang = localStorage.getItem("languageType");
    let params = {};
    //params.brdSj = searchNm.value;

    
    params.lang = lang;
	params.searchBillName = searchBillName.value;
	params.billNo = searchBillNo.value;
	params.naTermCd = searchAgeCd.value;
	params.statCd = searchStatCd.value;

    const apiUrl = `/bill/review/all`;

    store.API_LIST(apiUrl, params).then((data) => {
      list.value = data.data.data;
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

const fnGoDetail= (e)=>{
    router.push({name: 'billMng.billSearch.billDetailSearchList.dtl', params : {  billId: e.data.billId }});
}

const fnReset = () => {
	searchBillNo.value = '';
	searchBillName.value = '';
	searchStatCd.value = '';
	searchAgeCd.value = ageObj.value.naTermCd;
}

onMounted(() => {
	fnGetAgendaList();//Initial inquiry

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
											<label class="form_label">{{ t('10292') }}</label>
											<input type="text" class="form_control" :placeholder="t('10292')" v-model="searchBillNo"><!--Agenda number-->
										</div>
										<div class="input_item">
											<label class="form_label">{{ t('10293') }}</label>
											<input type="text" v-model="searchBillName" class="form_control" :placeholder="t('10293')" @keyup.enter="fnSearch"><!--Agency-->
										</div>
										<div class="input_item">
											<label class="form_label">{{ t('10107') }}</label>
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
									<button type="button" class="v_btn btn_primary btn_md" @click="fnGetAgendaList"><i class="v_ico ico_search_white"></i><span>{{ t('10053') }}</span></button><!--check-->
									<button type="button" @click="fnReset" class="v_btn btn_outline_primary btn_md"><i class="v_ico ico_reset_primary"></i><span></span></button>
								</div>
							</div>
							<div class="board_info mt_6">
								<div class="left">
									<div class="total_num">Total <span class="text_primary">{{ list.length }}</span></div>
								</div>
							</div>
							<div class="v_table table_list">
                                <DataTable :value="list" @row-dblclick="fnGoDetail" paginator :rows="10" :pageLinkSize="10" :rowsPerPageOptions="[5, 10, 20, 50]"
								paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink">
                                    <Column field="naTermCd" :header="t('10116')" style="width: 5.8%;" bodyStyle="text-align: center;" sortable></Column><!--Algebraic-->
									<Column field="billNo" :header="t('10292')" style="width: 7.8%;" bodyStyle="text-align: center;" sortable></Column><!--Agenda number-->
                                    <Column field="billName" :header="t('10293')" sortable></Column><!--Agency-->
                                    <Column field="ppsrNm" :header="t('10196')" style="width: 21.5%;" bodyStyle="text-align: center;" sortable></Column><!--Proposal-->
                                    <Column field="ppslDt" :header="t('10051')" style="width: 10.4%;" bodyStyle="text-align: center;" sortable><!--Suggestion-->
										<template #body="slotProps">
											{{ dayjs(slotProps.data.ppslDt, "YYYYMMDD").format("DD/MM/YYYY") }}
										</template>
									</Column>
                                    <Column field="statNm" :header="t('10107')" style="width: 16.9%;" bodyStyle="text-align: center;"></Column><!--Agenda-->
                                </DataTable>
							</div>
						</div>
						<!-- // Main area -->
					</div>
</template>
<style></style>
