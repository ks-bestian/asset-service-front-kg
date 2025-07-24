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
const billNo = ref();
const billName = ref();
const statCd = ref('ST110');
const ppslDtFrom = ref(dayjs().subtract(1, 'month').format('YYYY-MM-DD'));
const ppslDtTo = ref(dayjs().format('YYYY-MM-DD'));
const comCodes1010 = store.getComCodes(1010); //Agenda

const comCodes1010Filtered = comCodes1010.filter(code => code.codeId != 'ST001' );
const searchStatCd = ref('ST110');

/** List inquiry */
const fnSearch = () => {

	let params = {};
	params.lang = lang;
	params.naTermCd = ageObj.value.naTermCd;
	params.cmtCd = userInfo.deptCd;
	//params.cmtSeCd = 'M';//meeting type 
	//params.statCd = '2';//meeting state  

	params.statCd = searchStatCd.value;
	params.billNo = billNo.value;
	params.billName = billName.value;
	params.ppslDtFrom = ppslDtFrom.value.replace(/-/g, '');
	params.ppslDtTo = ppslDtTo.value.replace(/-/g, '');

	const apiUrl = '/bill/review/selectListCmtReviewReport';
	store.API_LIST(apiUrl, params).then((data) => {
		tableDatas1.value = data.data.data;

	}).catch(({ message }) => {
		console.log("message : ", message);
	});
};

const fnBillDetail = (e) => {
	router.push({ name: 'billMng.cmtMng.billCmtReviewDtl', query: { id: e.data.billId } });
};

const fnExcelDownload = () => {
	// Header designation to include

	const selectedHeaders = ["billNo", "billName", "cmtSeNm", "ppsrNm", "ppslDt", "statNm"];
	const wsCols = [t('10147'), t('10049'), t('10134'), t('10106'), t('10051'), t('10107')];
	const title = t('10061') + t('10084')//'Committee review list';

	const formattedList = tableDatas1.value.map(item => ({
		...item,
		ppslDt: dayjs(item.ppslDt).isValid ? dayjs(item.ppslDt).format('DD/MM/YYYY') : ''
	}));

	store.fnExcelDownload(formattedList, selectedHeaders, wsCols, title);
};

const fnReset = () => {
	//TODO search term initialization

}

const getRowClass = (data) => {
  return {
    'row-gray': data.taskStatus === 'C'
  }
}

onMounted(() => {
	fnSearch();

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
							<input type="text" class="form_control" placeholder="" v-model="billNo">
						</div>
						<div class="input_item">
							<label class="form_label">{{ t('10293') }}</label>
							<input type="text" class="form_control" placeholder="" v-model="billName">
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
					<!-- <div class="form_row">
						<div class="input_item">
							<label class="form_label">{{ t('10051') }}</label>
							<input type="date" class="form_control" value="" v-model="ppslDtFrom">
							<input type="date" class="form_control" value="" v-model="ppslDtTo">
						</div>
					</div> -->

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
						<button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnExcelDownload"><i
								class="v_ico ico_download_secondary"></i><span>{{ t('10055') }}</span></button>
					</div>
				</div>
			</div>


			<div class="v_table table_list">
				<DataTable :value="tableDatas1" @row-dblclick="fnBillDetail" paginator :rows="10" :pageLinkSize="10"
					:rowsPerPageOptions="[5, 10, 20, 50]"
					paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink">

					<Column field="billNo" :header="t('10292')" style="width: 10%;" class="text_center" sortable>
					</Column>
					<Column field="billName" :header="t('10293')" sortable></Column>
					<Column field="cmtSeNm" :header="t('10134')" style="width: 10%;" class="text_center"></Column>
					<Column field="ppsrNm" :header="t('10106')" style="width: 20%;" class="text_center" sortable></Column>
					<Column field="ppslDt" :header="t('10051')" style="width: 10%;" class="text_center" sortable>
						<template #body="{ data }">
							{{ dayjs(data.ppslDt).format('DD/MM/YYYY') }}
						</template>
					</Column>
					<Column field="statNm" :header="t('10107')" style="width: 16%;" class="text_center"></Column>
				</DataTable>
			</div>
		</div>
		<!-- // Main area -->
	</div>
</template>

