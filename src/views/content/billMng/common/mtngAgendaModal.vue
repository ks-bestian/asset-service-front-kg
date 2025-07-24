<script setup>
import {ref, defineEmits, onMounted, defineExpose } from "vue";
import { useStore } from "@/store";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import dayjs from "dayjs";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore();
const selectedItems = ref([]);
const emit = defineEmits(["sendList"]);
const props = defineProps({
	mode: String
}); 

const lang = localStorage.getItem("languageType");
const userInfo = store.loginInfo;
const visible = ref(false);
const tableDatas = ref([]);
const searchBillNo = ref('');
const searchBillNm = ref('');

const fnOpen = () => {
    visible.value = true;
    selectedItems.value = [];
};

const fnClose = () => {
  visible.value = false;
};

const fnSendList = () => {
  emit('sendList', selectedItems.value);
  visible.value = false;
}

const fnGetAgendaList = () => {

	let params = {};
	params.lang = lang;
	params.billNo = searchBillNo.value;
	params.billNm = searchBillNm.value;
	if (props.mode == 'cmt') {// In the case of a committee, only the correspondence

		params.deptCd = userInfo.deptCd;
		const apiUrl = `/bill/mtng/from/selectListMtngBill`;
		store.API_LIST(apiUrl, params).then((data) => {
			tableDatas.value = data.data.data;
			for(var i = 0; i < tableDatas.value?.length; ++i) {
				const data = tableDatas.value[i];
				if(data.mtngList) {
					data.cmtMtngList = data.mtngList.filter(mtng => mtng.mtngTypeCd == '1'); //Committee

					data.mainMtngList = data.mtngList.filter(mtng => mtng.mtngTypeCd == '2'); //Plenary

				}
			}
		}).catch(({ message }) => {
			console.log("message : ", message);
		})
	}
	else if(props.mode == 'main') { // Plenary

		const apiUrl = `/bill/mtng/from/selectListMainMtngBill`;
		store.API_LIST(apiUrl, params).then((data) => {
			tableDatas.value = data.data.data;
			for(var i = 0; i < tableDatas.value?.length; ++i) {
				const data = tableDatas.value[i];
				if(data.mtngList) {
					data.cmtMtngList = data.mtngList.filter(mtng => mtng.mtngTypeCd == '1'); //Committee

					data.mainMtngList = data.mtngList.filter(mtng => mtng.mtngTypeCd == '2'); //Plenary

				}
			}
		}).catch(({ message }) => {
			console.log("message : ", message);
		})
	}

}

onMounted(() => {
	fnGetAgendaList();
})

defineExpose({ fnOpen });

</script>

<template>
	<Dialog v-model:visible="visible" modal :style="{ width: '80vw', height: '86vh'}" @hide="fnClose">
		<template #header>
			<div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
				<h2 class="popup_tit">{{ t('10200') }}</h2><!--Select agenda-->
			</div>
		</template>
		<div class="popup_inner"  >
			<div class="popup_body">
				<div class="popup_cont">
					<div class="board_search mb_4">
						<div class="search_inner">
							<div class="form_row">
								<div class="input_item">
									<label class="form_label">{{ t('10292') }}</label><!--Agenda number-->
									<input type="text" class="form_control" v-model="searchBillNo" @keyup.enter="fnGetAgendaList">
								</div>
								<div class="input_item">
									<label class="form_label">{{ t('10293') }}</label><!--Agency-->
									<input type="text" class="form_control" v-model="searchBillNm" @keyup.enter="fnGetAgendaList">
								</div>
							</div>
						</div>
						<div class="search_btn">
							<button type="button" class="v_btn btn_primary btn_md" @click="fnGetAgendaList"><i class="v_ico ico_search_white"></i><span>{{ t('10053') }}</span></button>
						</div>
					</div>
					<div class="v_table table_list fixed_header type2">
						<DataTable :value="tableDatas" v-model:selection="selectedItems" paginator :rows="10" :pageLinkSize="10" paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink">
							<Column field="selection" selectionMode="multiple" class="text_center" style="width: 5%;"></Column>
							<Column field="billNo" :header="t('10292')" class="text_center" style="width: 10%;"></Column><!--Agenda number-->
							<Column field="billName" :header="t('10293')"></Column><!--Agency-->
							<Column field="mtngList" :header="t('10198')" class="text_center" style="width: 10%;"><!--Committee-->
								<template #body="slotProps">
									<template v-for="mtng in slotProps.data.cmtMtngList" :key="mtng.mtngId">
										<p v-if="mtng.openDtm">{{ dayjs(mtng.openDtm).format('DD/MM/YYYY') }}</p>
									</template>
								</template>
							</Column>
							<Column field="mtngList" :header="t('10199')" class="text_center" style="width: 10%;"><!--Date of the plenary session-->
								<template #body="slotProps">
									<template v-for="mtng in slotProps.data.mainMtngList" :key="mtng.mtngId">
										<p v-if="mtng.openDtm">{{ dayjs(mtng.openDtm).format('DD/MM/YYYY') }}</p>
									</template>
								</template>
							</Column>
							<Column field="ppslDt" :header="t('10051')" class="text_center" style="width: 10%;">
								<template #body="slotProps">
									{{ dayjs(slotProps.data.ppslDt).format('DD/MM/YYYY') }}
								</template>
							</Column><!--Suggestion-->
							<Column field="ppsrNm" :header="t('10196')" class="text_center" style="width: 20%;"></Column><!--Proposal-->
						</DataTable>
					</div>
				</div>
				<div class="popup_footer">
					<div class="btn_group">
						<button type="button" class="v_btn btn_primary btn_md" @click="fnSendList">{{ t('10089') }}</button> <!--check-->
						<button type="button" class="v_btn btn_outline_neutral btn_md" @click="fnClose">{{ t('10163') }}</button><!--cancellation-->
					</div>
				</div>
			</div>
		</div>
	</Dialog>
</template>
<style></style>
