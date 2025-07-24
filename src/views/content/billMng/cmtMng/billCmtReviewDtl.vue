<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from 'vue-router'
import { useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import { isEmpty , replace} from 'lodash';
import dayjs from "dayjs";
import billAllInfoInc from "@/views/content/billMng/common/billAllInfoInc.vue";
import CmtReviewModal from "./cmtReviewModal.vue";
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
const billIdRef = ref(route.query.id);
const billAllInfoIncRef = ref(null);
const cmtReviewRef = ref(null);
const billCmtReviewVoList = ref([]);
const cmtSeCd = ref();

const fnGoList = () => {
	router.push({ name: 'billMng.cmtMng.billCmtReviewList' });
};

/** check */
const fnSearch = () => {

    let params = {};
	params.lang = lang;
	params.billId = route.query.id;
	params.deptCd = userInfo.deptCd;
	const apiUrl = `/bill/review/billMng/detail`;
	store.API_LIST(apiUrl, params).then((data) => {

		billCmtReviewVoList.value = data.data.data.billCmtReviewVoList;
		billAllInfoIncRef.value.fnSearch();
		
		const cmtList = data.data.data.cmtList;
		for(var i = 0; i < cmtList.length; ++i) {
			if(cmtList[i].cmtCd == userInfo.deptCd) {
				cmtSeCd.value = cmtList[i].cmtSeCd;
				break;
			}
		}

		billCmtReviewVoList.value.forEach(review => {
			if(review.ebsfileList) {
				const l = lang == 'lng_type_3' ? 'lng_type_1' : lang;
				review.ebsfileListLang = review.ebsfileList.filter(file => file.lngType == l);
			}
		});

	}).catch(({ message }) => {
		console.log("message : ", message);
	})
}



const fnDelete = (item) => {

	confirm.require({
        target: event.currentTarget,
        message: t('10201'),
        accept: () => {

			let params = {};
			params.seq = item.seq;
			params.detailSeq = item.seq;
			params.billId = item.billId;

			console.log(params);

			const apiUrl = `/bill/review/deleteCmtReview`;
			store.API_UPDATE(apiUrl, params).then((data) => {
				fnSearch();
			}).catch(({ message }) => {
				console.log("message : ", message);
			});

        },
        reject: () => {
        }
    });

};

/** Review add */
const fnAddReview = () => {
	cmtReviewRef.value.fnOpen(billIdRef.value, cmtSeCd.value);
};

const fnReviewCallback = () => {
	fnSearch();
};

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
		<billAllInfoInc ref="billAllInfoIncRef" :billId="billIdRef"/>

		<div style="display: flex; align-items: baseline; justify-content: space-between;">
			<h3 class="v_tit1">{{ t('10061') }}</h3>
			<a href="javascript:void(0)" class="v_btn btn_primary btn_md" @click="fnAddReview">{{ t('10204') }}</a>
		</div>
		<div class="v_table">
			<table>
				<colgroup>
					<col>
					<col>
					<col style="width: 10%;">
					<col style="width: 15%;">
					<col style="width: 10%;">
				</colgroup>
				<tbody>
					<tr>
						<th scope="col" class="text_center">{{ t('10093') }}</th>
						<th scope="col" class="text_center">{{ t('10111') }}</th>
						<th scope="col" class="text_center">{{ t('10091') }}</th>
						<th scope="col" class="text_center">{{ t('10099') }}</th>
						<th scope="col" class="text_center">{{ t('10173') }}</th>
					</tr>
					<tr v-for="(item, index) in billCmtReviewVoList" :key="index">
						<td>
							<BillFileList :fileList="item.ebsfileListLang" />
						</td>
						<td>{{ item.rmrk }}</td>
						<td class="text_center">{{ dayjs(item.regDt).format('DD/MM/YYYY') }}</td>
						<td class="text_center">{{ item.regNm }}</td>
						<td class="text_center">
							<a href="javascript:void(0)" class="v_btn btn_outline_secondary btn_xs" @click="fnDelete(item)">{{ t('10173') }}</a>
						</td>
					</tr>
					<tr v-if="!billCmtReviewVoList?.length">
						<td colspan="5">
							<div class="no_data">
								<i class="v_ico ico_error"></i>
								<span class="text_msg">{{ t('10075') }}</span>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="btn_group_fixed">
			<button type="button" class="v_btn btn_outline_primary btn_md" @click="fnGoList">{{ t('10084') }}</button>
		</div>
	</div>
	<!-- // Main area -->
</div>


<CmtReviewModal ref="cmtReviewRef" @fnReviewCallback="fnReviewCallback" />

</template>

<style>
</style>
