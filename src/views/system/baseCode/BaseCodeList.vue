<script setup>
import { ref, watch, onMounted } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import BaseCodeModal from "@/views/system/baseCode/BaseCodeModal.vue";
import { useStore } from "@/store";
import TitleComp from "@/components/TitleComp.vue";
import dayjs from "dayjs";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore();
const dialog = ref(false)
const list = ref([]);
const popType = ref('')
const selectCd = ref(null)
const listCnt = ref(null);
const codeDetail = ref({})
const currYn = ref(false);
const codeIdList = ref([])
const currCodeId = ref(null)

const fnDetail = (e) => {
	codeIdList.value = list.value.map(item => item.codeId);
	codeDetail.value = e.data;
	popType.value = 'detail'
	dialog.value = true;
}

const fnNew = () => {
	codeIdList.value = list.value.map(item => item.codeId);
	codeDetail.value = {}
	popType.value = 'new'
	dialog.value = true;
}

const fnList = () => {
	const api = '/admin/baseCode'
	store.API_LIST(api).then((data) => {
		list.value = data.data.data
		listCnt.value = list.value.length;
		currYn.value = list.value.some(item => item.currYn === 'Y');
		currCodeId.value = list.value.find(item => item.currYn === 'Y').codeId

	}).catch(({ message }) => {
		console.log("message : ", message);
	})
}

const fnExcelDownload = () => {
	// Header designation to include

	const selectedHeaders = ["codeId", "codeNm", "bgDt", "edDt", 'currYn'];
	const wsCols = [t('10116'), t('10383'), t('10384'), t('10385'), t('10386')]; // Heather name array


	const title = t('10512');

	const data = list.value.map(item => ({
		...item,
		bgDt: dayjs(item.bgDt).isValid() ? dayjs(item.bgDt).format('DD/MM/YYYY') : '',
		edDt: dayjs(item.edDt).isValid() ? dayjs(item.edDt).format('DD/MM/YYYY') : ''
	}))

	store.fnExcelDownload(data, selectedHeaders, wsCols, title);
};

onMounted(() => {
	fnList();
})
</script>

<template>
	<div class="content_inner">
		<TitleComp />
		<!-- Main area -->
		<div class="content_section">
			<div class="board_info">
				<div class="left">
					<div class="total_num">{{ t('10104') }} <span class="text_primary">{{ listCnt }}</span></div>
				</div>
				<div class="right">
					<div class="btn_wrap">
						<a href="javascript:void(0)" class="v_btn btn_outline_primary btn_sm" @click="fnNew">{{ t('10353') }}</a>
						<button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnExcelDownload"><i
								class="v_ico ico_download_secondary"></i><span>{{ t('10055') }}</span></button>
					</div>
				</div>
			</div>

			<div class="v_table table_list">
				<DataTable :value="list" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
					@row-dblclick="fnDetail" tableStyle="min-width: 50rem;" v-model:selection="selectCd"
					data-key="codeId"
					paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
					:pt="{
						pcPaginator: {
						},
					}">
					<Column field="codeId" :header="t('10116')" style="width: 10%;" class="text_center" sortable></Column>
					<Column field="codeNm" :header="t('10383')" class="text_center" sortable></Column>
					<Column field="bgDt" :header="t('10384')" style="width: 15%;" class="text_center" sortable>
						<template #body="{ data }">
							{{ dayjs(data.bgDt).isValid() ? dayjs(data.bgDt).format('DD/MM/YYYY') : '' }}
						</template>
					</Column>
					<Column field="edDt" :header="t('10385')" style="width: 15%;" class="text_center" sortable>
						<template #body="{ data }">
							{{ dayjs(data.edDt).isValid() ? dayjs(data.edDt).format('DD/MM/YYYY') : '' }}
						</template>
					</Column>
					<Column field="currYn" :header="t('10386')" style="width: 10%;" class="text_center"></Column>
					<Column field="ord" :header="t('10290')" style="width: 10%;" class="text_center"></Column>
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
	<BaseCodeModal v-if="dialog" @close="dialog = false; fnList();" :popType="popType" :detail="codeDetail"
		:currIs="currYn" :codeIdList="codeIdList" :dialog="dialog" :currCodeId="currCodeId"/>
</template>

<style>
.no_data {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}
</style>
