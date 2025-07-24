<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router'
import { useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import { isEmpty , replace} from 'lodash';
import dayjs from "dayjs";
import Panel from 'primevue/panel';
import BillAllInfoInc from "../common/billAllInfoInc.vue";
import TitleComp from "@/components/TitleComp.vue";
import LegalActModal from "./legalActModal.vue";
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

const openModal = ref(false);
const tableDatas = ref([]);
const billAllInfoIncRef = ref(null);

const legalActModal = ref({});

const legalActInfoList = ref([]); 
const processVo = ref(null);

/** Buttons */
const btnSendCmt = ref(false);//Committee transmission

const btnReviewComplete = ref(false);//Completion of review


const fnAuthSetup = () => {

	let taskStatus = processVo.value.taskStatus;
	btnSendCmt.value = btnReviewComplete.value = taskStatus != 'C' && !isEmpty(legalActInfoList.value);

};

const fnGoList = () => {
	router.push({ name: 'billMng.legalActMng.billMngList' });
};

/** Processing Process (Committee Transmission) */
const fnNextProcessTask = () => {

	confirm.require({
		target: event.currentTarget,
		message: t('10232'), //Would you like to send a committee?

		accept: () => {
			const jsonData = {
				billId: route.query.id,
				stepId: '1400',
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

/** Processing (government transfer) */
const fnNextProcessTask2 = () => {

	confirm.require({
		target: event.currentTarget,
		message: t('10433'), //Would you like to handle it?

		accept: () => {
			const jsonData = {
				billId: route.query.id,
				stepId: '3200',
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

const fnReload = () => {
	legalActModal.value.open = false
	fnSearchLegalAct();
	billAllInfoIncRef.value.fnSearch();
}

const fnSearchLegalAct = () => {

	let params = {};
	params.lang = lang;
	params.billId = route.query.id;
	params.taskId = route.query.taskId;
	params.clsCd = '200';
	const apiUrl = `/bill/review/billBillEtcInfo`;
	store.API_LIST(apiUrl, params).then((data) => {
		legalActInfoList.value = data.data.data.billEtcInfoList;  
		processVo.value = data.data.data.processVo;

		legalActInfoList.value.forEach(review => {
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

const fnDelete = (legalActInfo) => {

	confirm.require({
        target: event.currentTarget,
        message: t('10201'),
        accept: () => {
			let params = {};
			params.billId = route.query.id;
			params.seq = legalActInfo.seq;
			params.detailSeq = legalActInfo.seq;

			const apiUrl = '/bill/review/deleteCmtReview'
			store.API_UPDATE(apiUrl, params).then((data) => {
				fnReload();
			}).catch(({message}) => {
				console.log("message : ", message);
			})		
        },
        reject: () => {
        }
    });
}

const fnAddReview = () => {
	legalActModal.value = {};
	legalActModal.value.open = true;
}

const fnUpdateReview = (legalActInfo) => {
	legalActModal.value.legalActInfo = legalActInfo;
	legalActModal.value.open = true;
}

onMounted(() => {
	fnSearchLegalAct();
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
				<h3 class="v_tit1">{{ t('10559') }}</h3>
				<a href="javascript:void(0)" class="v_btn btn_primary btn_md" @click="fnAddReview">{{ t('10560') }}</a>
			</div>
			<Panel v-for="info in legalActInfoList" :key="info.seq" style="margin-bottom: 3rem;">
				<template #header>
					<div class="flex items-center gap-2">
						<span class="font-bold">
							{{ `${t('10046')} ${info.ageCd || ' '}${t('10584')} ${info.sessionNo || ' '}${t('10585')} ${info.sessionOrd || ' '}${t('10586')}` }}
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
							<col>
							<col>
							<col>
							<col>
							<col>
							<col>
						</colgroup>
						<tbody>
							<tr>
								<th scope="row">{{ t('10136') }}</th>
								<td>{{ info.lglActRsltNm }}</td>
								<th scope="row">{{ t('10144') }}</th>
								<td>{{ info.rsltDt ? dayjs(info.rsltDt).format('DD/MM/YYYY') : '' }}</td>
								<th scope="row">{{ t('10122') }}</th>
								<td>
									<BillFileList :fileList="info.ebsfileListLang" />
								</td>
							</tr>
							<tr>
								<th scope="row">{{ t('10111') }}</th>
								<td colspan="5">
									{{ info.rmrk }}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</Panel>
			<div class="no_data" v-if="!legalActInfoList?.length">
				<i class="v_ico ico_error"></i>
				<span class="text_msg">{{ t('10075') }}</span>
			</div>
			<div class="btn_group_fixed">
				
				<button type="button" class="v_btn btn_outline_primary btn_md" @click="fnGoList">{{ t('10084') }}</button>
				<a href="javascript:void(0)" class="v_btn btn_primary btn_md" @click="fnNextProcessTask" v-if="btnSendCmt">{{ t('10231') }}</a>
				<a href="javascript:void(0)" class="v_btn btn_primary btn_md" @click="fnNextProcessTask2" v-if="btnReviewComplete">{{ t('10172') }}</a>


			</div>

		</div>

		<!-- // Main area -->
	</div>

	<LegalActModal v-if="legalActModal.open" :dialog="legalActModal.open"
		@reload="fnReload" @close="legalActModal.open = false" :legalActInfoList="legalActInfoList" :legalActInfo="legalActModal.legalActInfo" />
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
