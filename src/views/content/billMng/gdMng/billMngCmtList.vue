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
const tableDatas1 = ref([]);
const store = useStore();
const ageObj = computed(() => store.getAgeObj);
const lang = localStorage.getItem("languageType");
const userInfo = store.loginInfo;
const comCodes1010 = store.getComCodes(1010); //Agenda

const comCodes1010Filtered = comCodes1010.filter(code => code.codeId != 'ST001' );
const searchStatCd = ref('ST010');

const billNo = ref();
const searchBillName = ref();

/** List inquiry */
const fnSearch = () => {

	let params = {};
	params.lang = lang;
	params.naTermCd = ageObj.value.naTermCd;
	params.assignedTo = userInfo.deptCd;
	//params.taskStatus = 'P';

	params.stepId = '1300';
	params.statCd = searchStatCd.value;
	const apiUrl = '/bill/review/billMng';

	// let params = {};
	// params.naTermCd = ageObj.value.naTermCd;
	// params.statCd = searchStatCd.value;
	// params.billNo = billNo.value;
	// params.searchBillName = searchBillName.value;
	// const apiUrl = '/bill/review/all';

	store.API_LIST(apiUrl, params).then((data) => {

		tableDatas1.value = data.data.data;
		console.log(tableDatas1.value);

	}).catch(({ message }) => {
		console.log("message : ", message);
	});
};

const fnBillDetail = (e) => {
	router.push({ name: 'billMng.gdMng.billMngCmt.dtl', query: { id: e.data.billId, taskId: e.data.taskId } });
};

const fnExcelDownload = () => {
	// Header designation to include

	const selectedHeaders = ["billNo", "billName", "ppsrNm", "ppslDt", "statNm"];
	const wsCols = [t('10147'), t('10049'), t('10106'), t('10051'), t('10107')];
	const title = t('10154') + t('10084')//'Committee's Corporate List';

	const formattedList = tableDatas1.value.map(item => ({
		...item,
		ppslDt: dayjs(item.ppslDt).isValid ? dayjs(item.ppslDt).format('DD/MM/YYYY') : ''
	}));
	store.fnExcelDownload(formattedList, selectedHeaders, wsCols, title);
};

const fnReset = () => {
	billNo.value = '';
	searchBillName.value = '';
	searchStatCd.value = 'ST032'
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
	router.push({ name: 'review.billMng.save' });
}

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
							<input type="text" class="form_control" placeholder="" v-model="billNo">
						</div>
						<div class="input_item">
							<label class="form_label">{{ t('10293') }}</label>
							<input type="text" class="form_control" placeholder="" v-model="searchBillName">
						</div>
						<div class="input_item">
							<label class="form_label">{{ t('10107') }}</label><!--Agenda-->
							<select class="form_control" v-model="searchStatCd">
								<option value="">{{ t('10066') }}</option><!--entire-->
								<option v-for="comCode in comCodes1010Filtered" :key="comCode.codeId" :value="comCode.codeId">{{
									comCode.codeNm }}</option>
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

			<div class="board_info mt_6">
				<div class="left">
					<div class="total_num">Total <span class="text_primary">{{ tableDatas1.length }}</span></div>
				</div>
				<div class="right">
					<div class="btn_wrap">
						<!-- <a href="javascript:void(0)" class="v_btn btn_secondary btn_sm" @click="fnGoSave">{{ t('10103') }}</a> -->
						<button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnExcelDownload"><i
								class="v_ico ico_download_secondary"></i><span>{{ t('10055') }}</span></button>
					</div>
				</div>
			</div>

			<div class="v_table table_list">
				<DataTable :value="tableDatas1" @row-dblclick="fnBillDetail" paginator :rows="10" :pageLinkSize="10" :rowClass="getRowClass"
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
					<Column field="statNm" :header="t('10107')" style="width: 15%;" class="text_center" sortable></Column>
					<Column field="completedDt" :header="t('10144')" style="width: 10%;" class="text_center" sortable></Column>
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




