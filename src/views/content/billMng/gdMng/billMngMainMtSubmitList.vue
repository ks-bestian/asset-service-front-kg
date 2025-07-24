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
import { useI18n } from "vue-i18n";

///////////////////////////////////////
const router = useRouter();
const tableDatas = ref([]);
const store = useStore();
const ageObj = computed(() => store.getAgeObj);
const lang = localStorage.getItem("languageType");
const userInfo = store.loginInfo;
const {t} = useI18n();
const schBillName = ref('');
const schBillNo = ref('');


/** List inquiry */
const fnSearch = () => {

	let params = {};
	params.lang = lang;
	params.naTermCd = ageObj.value.naTermCd;
	params.billNo = schBillNo.value;
	params.billName = schBillName.value;
	const apiUrl = '/bill/review/selectListMainMtSubmit';
	store.API_LIST(apiUrl, params).then((data) => {
		tableDatas.value = data.data.data;
	}).catch(({ message }) => {
		console.log("message : ", message);
	});
};

const fnBillDetail = (e) => {
	router.push({ name: 'billMng.gdMng.billMngMainMtSubmit.dtl', query: { id: e.data.billId } });
};

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
		<!-- <div class="content_util">
							<div class="title_wrap">
								<h2 class="content_tit">{{ t('10663') }}</h2>
								<button type="button" class="v_btn btn_favorite"><i class="v_ico ico_bookmark"></i></button>
							</div>
							<nav class="v_breadcrumb">
								<ul class="path">
									<li><i class="v_ico ico_home"></i></li>
									<li>{{ t('10662') }}</li>
									<li>{{ t('10663') }}</li>
								</ul>
							</nav>
						</div> -->
		<TitleComp />
		<!-- Main area -->
		<div class="content_section">
			<div class="board_search"><!-- If you go over 2 lines of search items.Type2 -->
				<div class="search_inner">
					<!-- Search item width if you need to adjust the width of the class.Col_1 ~ 12 additional -->
					<div class="form_row">
						<div class="input_item">
							<label class="form_label">{{ t('10101') }}</label>
							<input type="text" class="form_control" v-model="schBillNo" @keyup.enter="fnSearch"
								:placeholder="t('10146')">
						</div>
						<div class="input_item">
							<label class="form_label">{{ t('10049') }}</label>
							<input type="text" class="form_control" v-model="schBillName" @keyup.enter="fnSearch"
								:placeholder="t('10146')">
						</div>
					</div>
				</div>
				<div class="search_btn">
					<button type="button" class="v_btn btn_primary btn_md" @click="fnSearch"><i
							class="v_ico ico_search_white"></i><span>{{ t('10053') }}</span></button>
				</div>
			</div>

			<div class="board_info mt_6">
				<div class="left">
					<div class="total_num">Total <span class="text_primary">{{ tableDatas.length }}</span></div>
				</div>
				<div class="right">
					<div class="btn_wrap">
					</div>
				</div>
			</div>

			<div class="v_table table_list">
				<DataTable :value="tableDatas" @row-dblclick="fnBillDetail" paginator :rows="10" :pageLinkSize="10"
					:rowsPerPageOptions="[5, 10, 20, 50]"
					paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink">
					<Column field="billNo" :header="t('10101')" style="width: 10%;" class="text_center"></Column>
					<Column field="billName" :header="t('10049')"></Column>
					<Column field="ppsrNm" :header="t('10106')" style="width: 10%;"></Column>
					<Column field="ppslDt" :header="t('10051')" style="width: 10%;" class="text_center">
						<template #body="{ data }">
							{{ dayjs(data.ppslDt).format('DD/MM/YYYY') }}
						</template>
					</Column>
					<Column field="statNm" :header="t('10107')" style="width: 10%;" class="text_center"></Column>
				</DataTable>
			</div>
		</div>
		<!-- // Main area -->
	</div>
</template>

<style></style>
