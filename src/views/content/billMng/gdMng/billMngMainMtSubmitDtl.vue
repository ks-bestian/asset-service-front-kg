<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router'
import { useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import { isEmpty , replace} from 'lodash';
import dayjs from "dayjs";
import billAllInfoInc from "@/views/content/billMng/common/billAllInfoInc.vue";
import mainMtSubmitModal from "./mainMtSubmitModal.vue";
import TitleComp from "@/components/TitleComp.vue";
import { useI18n } from "vue-i18n";

const {t} = useI18n();
const router = useRouter();
const route = useRoute();
const store = useStore();
const confirm = useConfirm();

const userInfo = store.loginInfo;
const lang = localStorage.getItem("languageType");
const billIdRef = ref(route.query.id);
const billAllInfoIncRef = ref(null);
const mainMTSubmitRef = ref(null);
const billEtcList = ref([]);

const fnGoList = () => {
	router.push({ name: 'billMng.gdMng.billMngMainMtSubmit' });
};

/** check */
const fnSearch = () => {

    let params = {};
	params.lang = lang;
	params.billId = route.query.id;
	params.deptCd = userInfo.deptCd;
    params.clsCd = '340';
	const apiUrl = `/bill/review/billBillEtcInfo`;
	store.API_LIST(apiUrl, params).then((data) => {

        console.log(data.data.data);

		billEtcList.value = data.data.data;
		billAllInfoIncRef.value.fnSearch();

	}).catch(({ message }) => {
		console.log("message : ", message);
	})
}



const fnDelete = (item) => {

	confirm.require({
        target: event.currentTarget,
        message: t('10431'),
        accept: () => {

			let params = {};
			params.seq = item.seq;
			params.detailSeq = item.seq;
			params.billId = item.billId;

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
	mainMTSubmitRef.value.fnOpen(billIdRef.value);
};

const fnCallback = () => {
	fnSearch();
};

/** File download */
const fnDownloadFile = (fileId, fileNm) => {
    store.API_FILE_DOWN(fileId, fileNm);
}


onMounted(() => {
	fnSearch();
})

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

	<h3 class="v_tit1">{{ t('10166') }}</h3>
	<billAllInfoInc ref="billAllInfoIncRef" :billId="billIdRef"/>

	<div style="display: flex; align-items: baseline; justify-content: space-between;">
		<h3 class="v_tit1">{{ t('10663') }}</h3>
		<a href="javascript:void(0)" class="v_btn btn_primary btn_md" @click="fnAddReview">{{ t('10663') }}</a>
	</div>
	<div class="v_table">
		<table>
			<colgroup>
                <col style="width: 10%;">
				<col>
				<col style="width: 10%;">
				<col style="width: 15%;">
				<col style="width: 10%;">
			</colgroup>
			<tbody>
				<tr>
					<th scope="col" class="text_center">{{ t('10133') }}</th>
                    <th scope="col" class="text_center">{{ t('10111') }}</th>
					<th scope="col" class="text_center">{{ t('10091') }}</th>
					<th scope="col" class="text_center">{{ t('10099') }}</th>
					<th scope="col" class="text_center">{{ t('10173') }}</th>
				</tr>
				<tr v-for="(item, index) in billEtcList" :key="index">
					<td class="text_center">{{ dayjs(item.mtnDt).format('DD/MM/YYYY') }}</td>
					<td>{{ item.rmrk }}</td>
					<td class="text_center">{{ dayjs(item.regDt).format('DD/MM/YYYY') }}</td>
					<td class="text_center">{{ item.regNm }}</td>
					<td class="text_center">
						<a href="javascript:void(0)" class="v_btn btn_outline_secondary btn_xs" @click="fnDelete(item)">{{ t('10173') }}</a>						
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


<mainMtSubmitModal ref="mainMTSubmitRef" @fnCallback="fnCallback" />

</template>

<style></style>
