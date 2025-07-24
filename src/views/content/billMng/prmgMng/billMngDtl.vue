<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router'
import { useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import { isEmpty , replace} from 'lodash';
import dayjs from "dayjs";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Panel from 'primevue/panel';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import BillAllInfoInc from "../common/billAllInfoInc.vue";
import TitleComp from "@/components/TitleComp.vue";
import PrmgModal from "./prmgModal.vue";
import BillFileList from "../common/billFileList.vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter();
const route = useRoute();
const store = useStore();
const confirm = useConfirm();

const userInfo = store.loginInfo;
const lang = localStorage.getItem("languageType");
const billBasicVo = ref({});
const billLangReview1stVo = ref({});//language spc 1st review


const inputModal = ref({});
const tableDatas = ref([]);
const billAllInfoIncRef = ref(null);

const prmgList = ref([]);

/** Buttons */
const btnReport = ref(false);//Report


const fnAuthSetup = () => {

	let taskStatus = billBasicVo.value.taskStatus;
	if(taskStatus != 'C') {//Unless it's completed


		if(isEmpty(prmgList.value)) {
			btnReport.value = false;
		} else {
			btnReport.value = true;
		}

	}
};

const fnGoList = () => {
	router.push({ name: 'billMng.prmgMng.billMngList' });
};

/** Process progression (fear) */
const fnNextProcessTask = () => {

	confirm.require({
		target: event.currentTarget,
		message: t('10561'),
		accept: () => {
			const jsonData = {
				billId: route.query.id,
				stepId: '9999',
				taskId: route.query.taskId
			};

			const apiUrl = `/process/processMng/handleProcessStep`;
			store.API_SAVE(apiUrl, jsonData).then((data) => {
				fnGoList();
			}).catch(({ message }) => {
				console.log("message : ", message);
			})
		},
		reject: () => {
		}
	});
}

/** check */
const fnSearch = () => {

    let params = {};
	params.lang = lang;
	params.billId = route.query.id;
	params.taskId = route.query.taskId;
	params.assignedTo = userInfo.deptCd;
	const apiUrl = `/bill/review/billMng/detail`;
	store.API_LIST(apiUrl, params).then((data) => {

        billBasicVo.value = data.data.data.billMngVo;
		prmgList.value = data.data.data.billEtcInfoList.filter(info => info.clsCd == '320');

		console.log('billBasicVo.value', billBasicVo.value);

		fnAuthSetup();

	}).catch(({ message }) => {
		console.log("message : ", message);
	})
}

/** File download */
const fnDownloadFile = (fileId, fileNm) => {
    store.API_FILE_DOWN(fileId, fileNm);
}

const fnReload = () => {
	inputModal.value.open = false
	fnSearch();
	billAllInfoIncRef.value.fnSearch();
}

const fnDelete = (prmg) => {

	confirm.require({
		target: event.currentTarget,
		message: t('10201'),
		accept: () => {
			let params = {};
			params.billId = route.query.id;
			params.seq = prmg.seq;
			params.detailSeq = prmg.seq;

			const apiUrl = '/bill/review/deleteCmtReview'
			store.API_UPDATE(apiUrl, params).then((data) => {
				fnReload();
			}).catch(({ message }) => {
				console.log("message : ", message);
			})
		},
		reject: () => {
		}
	});
}

const fnAddReview = () => {
	inputModal.value = {};
	inputModal.value.open = true
}

const fnUpdateReview = (review) => {
	review.prmgNo = billBasicVo.value.prmgNo;
	inputModal.value.review = review;
	inputModal.value.open = true;
}

onMounted(() => {
	fnSearch();
})

</script>

<template>
<div class="content_inner">
	<TitleComp />
	
	<!-- Main area -->
	<div class="content_section">
		<h3 class="v_tit1">{{ t('10166') }}</h3>
		<BillAllInfoInc ref="billAllInfoIncRef" :billId="route.query.id" />

		<div style="display: flex; align-items: baseline; justify-content: space-between;">
			<h3 class="v_tit1">{{ t('10048') }}</h3>
			<a href="javascript:void(0)" class="v_btn btn_primary btn_md" @click="fnAddReview" v-if="prmgList.length === 0">{{ t('10234') }}</a>
		</div>
		<Panel v-for="info in prmgList" :key="info.seq" style="margin-bottom: 3rem;">
			<template #header>
				<div class="flex items-center gap-2">
					<span class="font-bold">
					</span>
				</div>
			</template>
			<template #icons>
				<a href="javascript:void(0)" class="v_btn btn_primary btn_xs" @click="fnUpdateReview(info)">{{ t('10157') }}</a>
				<a href="javascript:void(0)" class="v_btn btn_primary btn_xs" @click="fnDelete(info)">{{ t('10173') }}</a>
			</template>
			<div class="v_table">
				<table>
					<colgroup>
						<col width="20%">
						<col width="30%">
						<col width="20%">
						<col width="30%">
					</colgroup>
					<tbody>
						<tr>
							<th scope="row">{{ t('10144') }}</th>
							<td>{{ info.rsltDt ? dayjs(info.rsltDt).format('DD/MM/YYYY') : '' }}</td>
							<th scope="row">{{ t('10090') }}</th>
							<td>{{ billBasicVo.prmgNo }}</td>
						</tr>
						<tr>
							<th scope="row">{{ t('10122') }}</th>
							<td colspan="3">
								<BillFileList :fileList="info.ebsfileList" />
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</Panel>
		<div class="no_data" v-if="!prmgList?.length">
			<i class="v_ico ico_error"></i>
			<span class="text_msg">{{ t('10075') }}</span>
		</div>
		<div class="btn_group_fixed">
			<button type="button" class="v_btn btn_outline_primary btn_md" @click="fnGoList">{{ t('10084') }}</button>
			<a href="javascript:void(0)" class="v_btn btn_primary btn_md" @click="fnNextProcessTask" v-if="btnReport">{{ t('10172') }}</a>
		</div>

	</div>

	<PrmgModal v-if="inputModal.open" :dialog="inputModal.open" :id="route.query.id" :review="inputModal.review" @close="inputModal.open = false" @reload="fnReload" />
	<!-- // Main area -->
</div>
</template>

<style scoped>
    .no_data {
        display: flex;
        justify-content: center; 
        align-items: center;
        flex-direction: column;
        text-align: center;
        height: 10rem; 
    }
	.btn_xs {
		margin: 2px;
	}
</style>
