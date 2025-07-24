<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router'
import { useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import { isEmpty , replace} from 'lodash';
import dayjs from "dayjs";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import LangFileInputModal from "./langFileInputModal.vue";
import Panel from 'primevue/panel';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import BillAllInfoInc from "../common/billAllInfoInc.vue";
import TitleComp from "@/components/TitleComp.vue";
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

const langReviewList = ref([]);
const processVo = ref(null);
/** Buttons */
const btnReport = ref(false);//Report



const fnAuthSetup = () => {

	let taskStatus = processVo.value.taskStatus;
	if(taskStatus != 'C') {//Unless it's completed



		if(isEmpty(langReviewList.value)) {
			btnReport.value = false;
		} else {
			btnReport.value = true;
		}

	}
};

const fnGoList = () => {
	router.push({ name: 'billMng.langReviewMng.billMngList' });
};

/** Confirmation window */
const fnConfirm = (event) => {
    confirm.require({
        target: event.currentTarget,
        message: t('10175'),
        accept: () => {
			fnNextProcessTask();	
        },
        reject: () => {
        }
    });
}


/** Process progress */
const fnNextProcessTask = () => {

	const jsonData = {
		billId: route.query.id,
		taskId: route.query.taskId,
		taskStatus: 'C'
	};

	const apiUrl = `/process/taskMng/taskUpdate`;
	store.API_SAVE(apiUrl, jsonData).then((data) => {
		fnGoList();
	}).catch(({ message }) => {
		console.log("message : ", message);
	})
}

/** Check */
const fnSearch = () => {

    let params = {};
	params.lang = lang;
	params.billId = route.query.id;
	params.taskId = route.query.taskId;
	params.assignedTo = userInfo.deptCd;
	const apiUrl = `/bill/review/billMng/detail`;
	store.API_LIST(apiUrl, params).then((data) => {

		processVo.value = data.data.data.processVo;
        billBasicVo.value = data.data.data.billMngVo;
		langReviewList.value = data.data.data.billLangReviewVoList;
		// if(!isEmpty(data.data.data.billMngVo.ebsfileList)) {
		// 	tableDatas.value = data.data.data.billMngVo.ebsfileList.filter(data => data.fileKindCd == '200'); //opinion report of the language specialist committee
		// } 



		langReviewList.value.forEach(review => {
			if(review.ebsfileList) {
				const l = lang == 'lng_type_3' ? 'lng_type_1' : lang;
				review.ebsfileListLang = review.ebsfileList.filter(file => file.lngType == l);
			}
		});

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

const fnDelete = (langReview) => {

	confirm.require({
		target: event.currentTarget,
		message: t('10201'),
		accept: () => {
			let params = {};
			params.billId = route.query.id;
			params.seq = langReview.seq;
			params.detailSeq = langReview.seq;

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

const fnUpdateReview = (langReview) => {
	inputModal.value.langReview = langReview;
	inputModal.value.open = true;
}

const fnGoLetter = () => {
	router.push({name: 'letter.insert'});
}

onMounted(() => {
	fnSearch();
})

</script>

<template>
<div class="content_inner">
	<!-- <DIV class = "Content_util">
		<DIV class = "title_wrap">
			<H2 class = "Content_tit"> Committee's first fictional part </h2>
			<Button type = "Button" class = "V_BTN BTN_FAVORITE">
		</div>
		<NAV Class = "V_BREADCRUMB">
			<Ul class = "path">
				<li> <I class = "V_ICO ICO_HOME"> </i> </li>
				<li> Agenda review </li>
				<li> Language professional screening </li>
			</ul>
		</NAV>
	</div> ->
	<TitleComp />
	
	<!-- Main area -->
	<div class="content_section">
		<h3 class="v_tit1">{{ t('10166') }}</h3>
		<BillAllInfoInc ref="billAllInfoIncRef" :billId="route.query.id" />

		<div style="display: flex; align-items: baseline; justify-content: space-between;">
			<h3 class="v_tit1">{{ t('10129') }}</h3>
			<div>
				<button type="button" class="v_btn btn_outline_primary btn_md" @click="fnGoLetter" style="margin-right: 1rem;">{{ t('10602') }}</button>
				<a href="javascript:void(0)" class="v_btn btn_primary btn_md" @click="fnAddReview">{{ t('10601') }}</a>
			</div>
		</div>
		<Panel v-for="info in langReviewList" :key="info.seq" style="margin-bottom: 3rem;">
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
							<th scope="row">{{ t('10122') }}</th>
							<td>
								<BillFileList :fileList="info.ebsfileListLang" />
							</td>
							<th scope="row">{{ t('10100') }}</th>
							<td>{{ info.regDt ? dayjs(info.regDt).format('DD/MM/YYYY') : '' }}</td>
						</tr>
						<tr>
							<th scope="row">{{ t('10111') }}</th>
							<td colspan="3">
								{{ info.rmrk }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</Panel>
		<div class="no_data" v-if="!langReviewList?.length">
			<i class="v_ico ico_error"></i>
			<span class="text_msg">{{ t('10075') }}</span>
		</div>
		<div class="btn_group_fixed">
			<button type="button" class="v_btn btn_outline_primary btn_md" @click="fnGoList">{{ t('10084') }}</button>
			<a href="javascript:void(0)" class="v_btn btn_primary btn_md" @click="fnConfirm" v-if="btnReport">{{ t('10172') }}</a>
		</div>

	</div>

	<LangFileInputModal v-if="inputModal.open" :dialog="inputModal.open" :id="route.query.id" :langReview="inputModal.langReview" @close="fnReload" @reload="fnReload" />
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
