<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router'
import { useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import { isEmpty , replace} from 'lodash';
import dayjs from "dayjs";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
// import LangFileInputModal from "./langFileInputModal.vue";
import Panel from 'primevue/panel';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import BillAllInfoInc from "../common/billAllInfoInc.vue";
import TitleComp from "@/components/TitleComp.vue";
import GvrnTrsfModal from "./gvrnTrsfModal.vue";
import BillFileList from "../common/billFileList.vue";
import { useI18n } from 'vue-i18n'
import PresidentRejectModal from "./presidentRejectModal.vue";
import PrmgModal from "../prmgMng/prmgModal.vue";
import { reject } from "lodash";

const { t } = useI18n()

const router = useRouter();
const route = useRoute();
const store = useStore();
const confirm = useConfirm();

const userInfo = store.loginInfo;
const lang = localStorage.getItem("languageType");
const billBasicVo = ref({});
const inputModal = ref({});
const billAllInfoIncRef = ref(null);
// const gvrnTrsfList = ref([]);


/** Buttons */
const processVo = ref(null);
const btnReport = ref(false);//Government transfer

const btnReject = ref(false);//Presidential rejection

const btnAddReview = ref(false);//Results registration

const rejectModal = ref({});

const prmgList = ref([]);
const prsdRjctList = ref([]);

const fnAuthSetup = () => {

	const taskStatus = processVo.value.taskStatus;

	btnAddReview.value = taskStatus != 'C' && prmgList.value?.length === 0 && prsdRjctList.value?.length === 0;
	btnReject.value = taskStatus != 'C' && prmgList.value?.length === 0 && prsdRjctList.value?.length === 0;
	btnReport.value = taskStatus != 'C' && (prmgList.value?.length || prsdRjctList.value?.length);
};

const fnGoList = () => {
	router.push({ name: 'billMng.gvrnTrsfMng.billMngList' });
};

/** Processing (government transfer) */
const fnNextProcessTask = () => {

	confirm.require({
		target: event.currentTarget,
		message: t('10397'), //Would you like to proceed?

		accept: () => {
			let nextStepId;
			if(prmgList.value?.length) {
				nextStepId = '3300'; // horror

			}
			else if(prsdRjctList.value?.length) {
				nextStepId = '3400'; // Presidential rejection

			}

			const jsonData = {
				billId: route.query.id,
				stepId: nextStepId,
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
		// gvrnTrsfList.value = data.data.data.billEtcInfoList.filter(info => info.clsCd == '325');

		prmgList.value = data.data.data.billEtcInfoList.filter(info => info.clsCd == '320');
		prmgList.value.forEach(review => {
			if(review.ebsfileList) {
				const l = lang == 'lng_type_3' ? 'lng_type_1' : lang;
				review.ebsfileListLang = review.ebsfileList.filter(file => file.lngType == l);
			}
		});

		prsdRjctList.value = data.data.data.billEtcInfoList.filter(info => info.clsCd == '330');
		prsdRjctList.value.forEach(review => {
			if(review.ebsfileList) {
				const l = lang == 'lng_type_3' ? 'lng_type_1' : lang;
				review.ebsfileListLang = review.ebsfileList.filter(file => file.lngType == l);
			}
		});

		processVo.value = data.data.data.processVo;
		fnAuthSetup();

	}).catch(({ message }) => {
		console.log("message : ", message);
	})
}

const fnReload = () => {
	inputModal.value.open = false;
	rejectModal.value.open = false;
	fnSearch();
	billAllInfoIncRef.value.fnSearch();
}

const fnDelete = (gvrnTrsf) => {

	confirm.require({
		target: event.currentTarget,
		message: t('10201'),
		accept: () => {
			let params = {};
			params.billId = route.query.id;
			params.seq = gvrnTrsf.seq;
			params.detailSeq = gvrnTrsf.seq;

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

const fnAddReject = () => {
	rejectModal.value = {};
	rejectModal.value.open = true;
}

const fnUpdateReject = (review) => {
	rejectModal.value.review = review;
	rejectModal.value.open = true;
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
			<h3 class="v_tit1">{{ t('10047') }}</h3>
			<!-- <a href="javascript:void(0)" class="v_btn btn_primary btn_md" @click="fnAddReview" v-if="btnAddReview">{{ t('10234') }}</a> -->
		</div>
		<Panel v-for="info in prmgList" :key="info.seq" style="margin-bottom: 3rem;">
			<template #header>
				<div class="flex items-center gap-2">
					<span class="font-bold">{{ t('10048	') }}
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
							<th scope="row">{{ t('10562') }}</th>
							<td>{{ billBasicVo.prmgNo }}</td>
						</tr>
						<tr>
							<th scope="row">{{ t('10122') }}</th>
							<td colspan="3">
								<BillFileList :fileList="info.ebsfileListLang" />
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</Panel>

		<Panel v-for="info in prsdRjctList" :key="info.seq" style="margin-bottom: 3rem;">
			<template #header>
				<div class="flex items-center gap-2">
					<span class="font-bold">{{ t('10064	') }}
					</span>
				</div>
			</template>
			<template #icons>
				<a href="javascript:void(0)" class="v_btn btn_primary btn_xs" @click="fnUpdateReject(info)">{{ t('10157') }}</a>
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
							<td>{{ info.prsdRjctDt ? dayjs(info.prsdRjctDt).format('DD/MM/YYYY') : '' }}</td>
							<th scope="row">{{ t('10632') }}</th>
							<td>{{ info.prsdRjctNo }}</td>
						</tr>
						<tr>
							<th scope="row">{{ t('10122') }}</th>
							<td colspan="3">
								<BillFileList :fileList="info.ebsfileListLang" />
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</Panel>

		<div class="no_data" v-if="!prmgList?.length && !prsdRjctList?.length">
			<i class="v_ico ico_error"></i>
			<span class="text_msg">{{ t('10075') }}</span>
		</div>
		<div class="btn_group_fixed">
			<button type="button" class="v_btn btn_outline_primary btn_md" @click="fnGoList">{{ t('10084') }}</button>
			<a href="javascript:void(0)" class="v_btn btn_primary btn_md" @click="fnNextProcessTask" v-if="btnReport">{{ t('10172') }}</a>
			<a href="javascript:void(0)" class="v_btn btn_primary btn_md" @click="fnAddReview" v-if="btnAddReview">{{ t('10633') }}</a>
			<a href="javascript:void(0)" class="v_btn btn_primary btn_md" @click="fnAddReject" v-if="btnReject">{{ t('10064') }}</a>
		</div>

	</div>

	<!-- <GvrnTrsfModal v-if="inputModal.open" :dialog="inputModal.open" :id="route.query.id" :review="inputModal.review" @close="inputModal.open = false" @reload="fnReload" /> -->
	<PrmgModal v-if="inputModal.open" :dialog="inputModal.open" :id="route.query.id" :review="inputModal.review" @close="inputModal.open = false" @reload="fnReload" />
	<PresidentRejectModal v-if="rejectModal.open" :dialog="rejectModal.open" :id="route.query.id" :review="rejectModal.review" @close="rejectModal.open = false" @reload="fnReload" />
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
