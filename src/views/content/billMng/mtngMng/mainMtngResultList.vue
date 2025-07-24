<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import dayjs from "dayjs";
import TitleComp from "@/components/TitleComp.vue";
import { useConfirm } from "primevue/useconfirm";
import { useI18n } from 'vue-i18n'
import BillInfoIncModal from "@/views/content/billMng/common/billInfoIncModal.vue";

const { t } = useI18n()

const confirm = useConfirm();
const store = useStore();
const router = useRouter();
const lang = localStorage.getItem("languageType");
const tableDatas = ref([]);
const today = dayjs(); // Current date

const searchDate = ref(today.format('YYYY-MM-DD'));
const dialog = ref(false);
const selectBillId = ref('');

const searchSessionNo = ref();
const searchSessionOrd = ref();
const billName = ref();
const billNo = ref();
const comCodes1009 = store.getComCodes(1009); //Code of this meeting

const agendaList = ref([]);

const fnGetMtngBillList = () => {

	let params = {};
	params.lang = lang;
	params.searchSessionNo = searchSessionNo.value;
	params.searchSessionOrd = searchSessionOrd.value;
	params.billName = billName.value;
	params.billNo = billNo.value;
	params.searchDate = searchDate.value.replace(/-/g, '');
	const apiUrl = '/bill/mtng/hallMtng/billList';
	store.API_LIST(apiUrl, params).then((data) => {
		tableDatas.value = data.data.data;
	}).catch(({ message }) => {
		console.log("message : ", message);
	});
}

const fnReset = () => {
	searchDate.value = today.format('YYYY-MM-DD');
	searchSessionNo.value = '';
	searchSessionOrd.value = '';
	billName.value = '';
	billNo.value = '';
};

const fnSaveResult = (item) => {

	const mtngId = item.data.mtngId;
	const billId = item.data.billId;
	const rsltCd = item.data.rsltCd;

	confirm.require({
		target: event.currentTarget,
		message: t('10155'),
		accept: () => {

			const jsonData = {
				mtngId: mtngId,
				billId: billId,
				rsltCd: rsltCd
			};

			const apiUrl = `/bill/mtng/hallMtng/result`;
			store.API_SAVE(apiUrl, jsonData).then((data) => {
				fnGetMtngBillList();
			}).catch(({ message }) => {
				console.log("message : ", message);
			})

		},
	});

}

const fnExcelDownload = () => {
	// Header designation to include

	const selectedHeaders = ["openDtm", "sessionNo", "sessionOrd", "billNo", "billName", "rsltCd"];
	const wsCols = [t('10186'), t('10211'), t('10212'), t('10292'), t('10293'), t('10125')];

	const title = t('10217') + t('10084')//'Input list of this meeting';


	const formattedList = tableDatas.value.map(item => ({
		...item,
		openDtm: dayjs(item.openDtm).isValid ? dayjs(item.openDtm).format('DD/MM/YYYY HH:mm') : ''
	}));

	store.fnExcelDownload(formattedList, selectedHeaders, wsCols, title);
};

const fnSubmitMtngAgenda = () => {

	if (!agendaList.value?.length) {
		alert(t('10556'));
		return;
	}

	confirm.require({
		target: event.currentTarget,
		message: t('10558'), //'Would you like to request the verification of the plenary session?',

		accept: () => {

			let params = {};
			// params.lang = lang;
			// params.mtngId = mtngId;

			params.agendaList = agendaList.value;
			const apiUrl = '/bill/mtng/to/send';
			store.API_UPDATE(apiUrl, params).then((data) => {
				fnGetMtngBillList();
			}).catch(({ message }) => {
				console.log("message : ", message);
			})
		},
	});
}

const onRowReorder = (e) => {
	tableDatas.value = e.value

	//EBS_MTNG_AGENDA order storage when changing the order


	const jsonData = {
		agendaList: tableDatas.value,
	};

	const apiUrl = `/bill/mtng/hallMtng/ord`;
	store.API_UPDATE(apiUrl, jsonData).then((data) => {
		fnGetMtngBillList();
	}).catch(({ message }) => {
		console.log("message : ", message);
	})
}


onMounted(() => {
	fnGetMtngBillList();

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
							<label class="form_label" style="width: 200px;">{{ t('10199') }}</label>
							<div class="input_group">
								<input type="date" class="form_control" v-model="searchDate" style="width: 150px;">
							</div>
						</div>
						<div class="input_item">
							<label class="form_label" style="width: 200px;">{{ t('10211') }}</label>
							<input type="text" class="form_control" v-model="searchSessionNo" :placeholder="t('10211')"
								style="width: 100px;" @keyup.enter="fnGetMtngBillList">
						</div>
						<div class="input_item">
							<label class="form_label" style="width: 200px;">{{ t('10212') }}</label>
							<input type="text" class="form_control" v-model="searchSessionOrd" :placeholder="t('10212')"
								style="width: 100px;" @keyup.enter="fnGetMtngBillList">
						</div>
					</div>
					<div class="form_row">
						<div class="input_item">
							<label class="form_label" style="width: 200px;">{{ t('10292') }}</label>
							<input type="text" class="form_control" v-model="billNo" :placeholder="t('10292')"
								style="width: 200px;" @keyup.enter="fnGetMtngBillList">
						</div>
						<div class="input_item">
							<label class="form_label" style="width: 200px;">{{ t('10293') }}</label>
							<input type="text" class="form_control" v-model="billName" :placeholder="t('10293')"
								@keyup.enter="fnGetMtngBillList">
						</div>
						<div class="input_item">
						</div>
					</div>
				</div>

				<div class="search_btn">
					<button type="button" @click="fnGetMtngBillList" class="v_btn btn_primary btn_md"><i
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
						<a href="javascript:void(0)" class="v_btn btn_secondary btn_sm" @click="fnSubmitMtngAgenda">{{
							t('10557') }}</a>
						<button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnExcelDownload"><i
								class="v_ico ico_download_secondary"></i><span>{{ t('10055') }}</span></button>
					</div>
				</div>
			</div>

			<div class="v_table table_list">
				<DataTable :value="tableDatas" scrollable scrollHeight="600px" :paginator="false"
					v-model:selection="agendaList" @rowReorder="onRowReorder">
					<Column rowReorder headerStyle="width: 3rem" :reorderableColumn="false"
						style="border-right: none;" />
					<Column selectionMode="multiple" style="width: 4.8%" class="text_center"></Column>
					<Column field="openDtm" :header="t('10186')" sortable style="width: 10%;"
						bodyStyle="text-align: center;">
						<template #body="slotProps">
							{{ dayjs(slotProps.data.openDtm, "YYYYMMDDHHmm").format("DD/MM/YYYY HH:mm") }}
						</template>
					</Column>
					<Column field="sessionNo" :header="t('10211')" style="width: 5%;" bodyStyle="text-align: center;"></Column>
					<Column field="sessionOrd" :header="t('10212')" style="width: 5%;" bodyStyle="text-align: center;">
					</Column>
					<Column field="billNo" :header="t('10292')" style="width: 15%;" bodyStyle="text-align: center;">
						<template #body="{ data }">
							<button type="button" class="v_btn btn_outline_primary btn_xs"
								@click="dialog = true; selectBillId = data.billId">{{ data.billNo }}</button>
						</template>

					</Column>
					<Column field="billName" :header="t('10293')"></Column>
					<Column field="rsltCd" :header="t('10136')" style="width: 10%;" bodyStyle="text-align: center;">
						<template #body="slotProps">
							<select class="form_control" v-model="slotProps.data.rsltCd"
								@change="fnSaveResult(slotProps)">
								<option value="">{{ t('10177') }}</option>
								<option v-for="comCode in comCodes1009" :key="comCode.codeId" :value="comCode.codeId">{{
									comCode.codeNm }}</option>
							</select>
						</template>
					</Column>
				</DataTable>
			</div>

		</div>
		<!-- // Main area -->
	</div>
	<BillInfoIncModal v-if="dialog" @close="dialog = false" :bill-id="selectBillId"	:dialog="dialog" />

</template>

<style></style>
