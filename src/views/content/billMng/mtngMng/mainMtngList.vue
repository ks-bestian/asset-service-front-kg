<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import dayjs from "dayjs";
import TitleComp from "@/components/TitleComp.vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore();
const router = useRouter();
const lang = localStorage.getItem("languageType");
const tableDatas = ref([]);
const today = dayjs(); // Current date

const searchDate = ref(today.format('YYYY-MM-DD'));
const searchSessionNo = ref('');
const searchSessionOrd = ref('');

const fnGetMtngList = () => {

	let params = {};
	params.lang = lang;
	params.searchDate = searchDate.value.replace(/-/g, '');
	params.searchSessionNo = searchSessionNo.value;
	params.searchSessionOrd = searchSessionOrd.value;
	const apiUrl = '/bill/mtng/hallMtng';
	store.API_LIST(apiUrl, params).then((data) => {
		tableDatas.value = data.data.data;
	}).catch(({ message }) => {
		console.log("message : ", message);
	});
}

const fnGoDetail = (e) => {

	//router.push({name: 'mtng.mainMtng.detail', query : {  mtngId: e.data.mtngId }});


	router.push({ name: 'mtng.mainMtng.update', query: { mtngId: e.data.mtngId } });
}


const fnGoSave = (e) => {
	router.push({ name: 'mtng.mainMtng.create' });
}

const fnReset = () => {
	searchDate.value = today.format('YYYY-MM-DD');
	searchSessionNo.value = '';
	searchSessionOrd.value = '';
};


const fnExcelDownload = () => {
	// Header designation to include

	const selectedHeaders = ["openDtm", "sessionNo", "sessionOrd", "billName"];
	const wsCols = [t('10186'), t('10211'), t('10212'), t('10293')];

	const title = t('10210') + t('10084')//'List of the plenary session';


	const formattedList = tableDatas.value.map(item => ({
		...item,
		ppslDt: dayjs(item.ppslDt).isValid ? dayjs(item.ppslDt).format('DD/MM/YYYY HH:mm') : ''
	}));

	store.fnExcelDownload(formattedList, selectedHeaders, wsCols, title);
};


onMounted(() => {

	fnGetMtngList();

});

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
							<label class="form_label">{{ t('10199') }}</label>
							<div class="input_group">
								<input type="date" class="form_control" v-model="searchDate" style="width: 200px;">
							</div>
						</div>

						<div class="input_item">
							<label class="form_label">{{ t('10211') }}</label>
							<div class="input_group">
								<input type="text" class="form_control" v-model="searchSessionNo" style="width: 100px;"
									@keyup.enter="fnGetMtngList">
							</div>
						</div>

						<div class="input_item">
							<label class="form_label">{{ t('10212') }}</label>
							<div class="input_group">
								<input type="text" class="form_control" v-model="searchSessionOrd" style="width: 100px;"
									@keyup.enter="fnGetMtngList">
							</div>
						</div>

					</div>
				</div>
				<div class="search_btn">
					<button type="button" class="v_btn btn_primary btn_md" @click="fnGetMtngList"><i
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
						<a href="javascript:void(0)" class="v_btn btn_secondary btn_sm" @click="fnGoSave">{{ t('10193')}}</a>
						<button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnExcelDownload"><i
								class="v_ico ico_download_secondary"></i><span>{{ t('10055') }}</span></button>
					</div>
				</div>
			</div>
			<div class="v_table table_list">
				<DataTable :value="tableDatas" scrollable scrollHeight="600px" :paginator="false"
					@row-dblclick="fnGoDetail">
					<Column field="openDtm" :header="t('10186')" sortable style="width: 15%;"
						bodyStyle="text-align: center;">
						<template #body="slotProps">
							<span v-if="slotProps.data.openDtm">
								{{ dayjs(slotProps.data.openDtm, "YYYYMMDDHHmm").format('DD/MM/YYYY HH:mm') }}
							</span>
						</template>
					</Column>
					<Column field="sessionNo" :header="t('10211')" style="width: 5%;" bodyStyle="text-align: center;">
					</Column>
					<Column field="sessionOrd" :header="t('10212')" style="width: 5%;" bodyStyle="text-align: center;">
					</Column>
					<Column field="billName" :header="t('10293')" bodyStyle="text-align: left;">
						<template #body="slotProps">

							<DataTable :value="slotProps.data.agendaList" size="small" class="no-header">
								<Column field="billNo" header="Code">
									<template #body="slotProps">
										[{{ slotProps.data.billNo }}] &nbsp; {{ slotProps.data.billName }}
									</template>
								</Column>
							</DataTable>
						</template>
					</Column>
				</DataTable>
			</div>
		</div>
		<!-- // Main area -->
	</div>
</template>

<style>
.no-header thead {
	display: none;
}
</style>
