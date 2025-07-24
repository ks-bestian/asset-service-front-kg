<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "@/store";
import { useRouter } from "vue-router";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import * as XLSX from "xlsx-js-style";
import { isEmpty, replace } from 'lodash';
import dayjs from "dayjs";
import TitleComp from "@/components/TitleComp.vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

///////////////////////////////////////
const router = useRouter();
const tableDatas = ref([]);
const store = useStore();
const ageObj = computed(() => store.getAgeObj);
const lang = localStorage.getItem("languageType");
const userInfo = store.loginInfo;
const billName = ref();
const searchBillNo = ref();
const ppslDtFrom = ref();
const ppslDtTo = ref();
const searchStatCd = ref('ST010');
const comCodes1010 = store.getComCodes(1010); //Agenda

const comCodes1010Filtered = comCodes1010.filter(code => code.codeId != 'ST001' );

/** List inquiry */
const fnSearch = () => {

	let params = {};
	params.lang = lang;
	params.naTermCd = ageObj.value.naTermCd;
	params.assignedTo = userInfo.deptCd;
	//params.taskStatus = 'P';

	params.stepId = '1000';
	params.statCd = searchStatCd.value;
	params.billName = billName.value;
	params.billNo = searchBillNo.value;
	params.ppslDtFrom = isEmpty(ppslDtFrom.value) ? '' : replace(ppslDtFrom.value, /-/g, '');
	params.ppslDtTo = isEmpty(ppslDtTo.value) ? '' : replace(ppslDtTo.value, /-/g, '');

	const apiUrl = '/bill/review/billMng';
	store.API_LIST(apiUrl, params).then((data) => {
		tableDatas.value = data.data.data;

		console.log(tableDatas.value);

	}).catch(({ message }) => {
		console.log("message : ", message);
	});
};

const fnBillDetail = (e) => {
	router.push({ name: 'billMng.gdMng.billMngRcDtl', query: { id: e.data.billId, taskId: e.data.taskId } });
};


const fnExcelDownload = () => {
	// Header designation to include

	const selectedHeaders = ["billName", "ppsrNm", "ppslDt", "statNm"];
	const wsCols = [t('10049'), t('10106'), t('10051'), t('10107')];

	const title = t('10114') + t('10084')//`` List of bills '';


	const filteredData = tableDatas.value.map(item => ({
		...item,
		ppslDt: dayjs(item.ppslDt).isValid ? dayjs(item.ppslDt).format('DD/MM/YYYY') : ''
	}))

	store.fnExcelDownload(filteredData, selectedHeaders, wsCols, title);
};

const fnReset = () => {
	billName.value = '';
	ppslDtFrom.value = '';
	ppslDtTo.value = '';
	searchBillNo.value = '';

}

const getRowClass = (data) => {
  return {
    'row-gray': data.taskStatus === 'C'
  }
}

onMounted(() => {
	fnSearch();
});
//////////////////////////////////////

const fnGoSave = (e) => {
	router.push({ name: 'billMng.gdMng.billMngRcSave' });
}

</script>

<template>
	<div class="content_inner">
		<TitleComp />
		<!-- Main area -->
		<div class="content_section">
			<div class="board_search type2"><!-- If you go over 2 lines of search items.Type2 -->
				<div class="search_inner">
					<!-- Search item width if you need to adjust the width of the class.Col_1 ~ 12 additional -->
					<div class="form_row">
						<div class="input_item">
							<label class="form_label">{{ t('10292') }}</label><!--Agency number-->
							<input type="text" class="form_control" :placeholder="t('10292')" v-model="searchBillNo" @keyup.enter="fnSearch">
						</div>
						<div class="input_item">
							<label class="form_label">{{ t('10293') }}</label>
							<input type="text" class="form_control" placeholder="" v-model="billName" @keyup.enter="fnSearch">
						</div>
						<div class="input_item">
							<label class="form_label">{{ t('10107') }}</label><!--Agenda-->
							<select class="form_control" v-model="searchStatCd">
								<option value="">{{ t('10066') }}</option><!--entire-->
								<option v-for="comCode in comCodes1010" :key="comCode.codeId" :value="comCode.codeId">{{
									comCode.codeNm }}</option>
							</select>
						</div>
					</div>
					<div class="form_row">
						<div class="input_item">
							<label class="form_label">{{ t('10051') }}</label>
							<input type="date" class="form_control" value="" v-model="ppslDtFrom" style="width: 200px;"> ~
							<input type="date" class="form_control" value="" v-model="ppslDtTo" style="width: 200px;">
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

			<div class="board_info mt_6">
				<div class="left">
					<div class="total_num">Total <span class="text_primary">{{ tableDatas.length }}</span></div>
				</div>
				<div class="right">
					<div class="btn_wrap">
						<a href="javascript:void(0)" class="v_btn btn_secondary btn_sm" @click="fnGoSave">{{ t('10103')
						}}</a>
						<button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnExcelDownload"><i
								class="v_ico ico_download_secondary"></i><span>{{ t('10055') }}</span></button>
					</div>
				</div>
			</div>


			<div class="v_table table_list">
				<DataTable :value="tableDatas" @row-dblclick="fnBillDetail" paginator :rows="10" :pageLinkSize="10" :rowClass="getRowClass"
					:rowsPerPageOptions="[5, 10, 20, 50]"
					paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink">
					<Column field="billNo" :header="t('10292')" style="width: 10%;" class="text_center" sortable></Column>
					<Column field="billName" :header="t('10293')" sortable></Column>
					<Column field="ppsrNm" :header="t('10106')" style="width: 15%;" class="text_center" sortable></Column>
					<Column field="ppslDt" :header="t('10051')" style="width: 10%;" class="text_center" sortable>
						<template #body="{ data }">
							{{ dayjs(data.ppslDt).format('DD/MM/YYYY') }}
						</template>
					</Column>
					<Column field="rcpDt" :header="t('10148')" style="width: 10%;" class="text_center" sortable>
						<template #body="{ data }">
							{{ isEmpty(data.rcpDt) ? "": dayjs(data.rcpDt).format('DD/MM/YYYY') }}
						</template>
					</Column>
					<Column field="statNm" :header="t('10107')" style="width: 15%;" class="text_center" sortable></Column>
				</DataTable>
			</div>
		</div>
		<!-- // Main area -->
	</div>
</template>

<style>
.row-gray {
  background-color: #f0f0f0 !important; /* Light gray */
}
</style>
