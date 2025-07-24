<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router'
import { useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import { isEmpty , replace} from 'lodash';
import dayjs from "dayjs";
import ProposalModal from "@/views/content/billMng/common/proposalModal.vue";
import TitleComp from "@/components/TitleComp.vue";
import BillFileList from "../common/billFileList.vue";
import { useI18n } from 'vue-i18n'
import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { FormField } from '@primevue/forms';

const { t } = useI18n()

const lang = localStorage.getItem("languageType");
const router = useRouter();
const route = useRoute();
const store = useStore();
const confirm = useConfirm();
const userInfo = store.loginInfo;
const billDetail = ref({});//particular

const openModal = ref(false);
const rcpDt = ref(dayjs().format('YYYY-MM-DD'));//Reception date

const processVo = ref({});

/////////////////////////////////

//Buttons

const btnBillRegister = ref(false);
const fnAuthSetup = () => {
	if(processVo.value.assignedTo == userInfo.deptCd && processVo.value.taskStatus == 'P') {
		btnBillRegister.value = true;//Only if it is not work

	}
};
/////////////////////////////////

/** Details */
const fnSearchDetail = () => {

	let params = {};
	params.lang = lang;
	params.billId = route.query.id;
	params.taskId = route.query.taskId;
	params.assignedTo = userInfo.deptCd;
	params.lngType = lang == 'lng_type_3' ? 'lng_type_1' : lang; //End File Language Type

	const apiUrl = `/bill/review/billMng/detail`;
	store.API_LIST(apiUrl, params).then((data) => {
        billDetail.value = data.data.data.billMngVo;
		processVo.value = data.data.data.processVo;

		fnAuthSetup();
	}).catch(({ message }) => {
		console.log("message : ", message);
	});
}

/** Agenda */
const fnBillRegister = () => {

	if(!fnValidate()) {
		return;
	}

    let msg = t('10165'); //Would you like to accept the agenda?

    confirm.require({
        target: event.currentTarget,
        message: msg,
        accept: () => {
			let params = {};
			params.lang = lang;
			params.billId = route.query.id;
			params.stepId = '1200';
			params.taskId = processVo.value.taskId;
			params.rcpDt = rcpDt.value.replace(/-/g, '');
			const apiUrl = `/bill/review/billRegisterMng`;
            store.API_SAVE(apiUrl, params).then((data) => {
                fnGoList();
            });
        },
        reject: () => {
        }
    });
};

const fnGoList = () => {
	router.push({ name: 'billMng.gdMng.billMngRcList' });
};

/** File download */
const fnDownloadFile = (fileId, fileNm) => {
    store.API_FILE_DOWN(fileId, fileNm);
}

const fnValidate = () => {
	const {errors} = resolver();
	return Object.keys(errors).length === 0;
}

const resolver = () => {
    const errors = {};

	if(!rcpDt.value) {
		errors.rcpDt = [{ message: 'required.' }];
	}

    return {
        errors
    };
};

onMounted(() => {
    fnSearchDetail();
});

</script>

<template>
	<div class="content_inner">
		<!-- <div class="content_util">
			<div class="title_wrap">
				<h2 class="content_tit">{{ t('10114') }}</h2>
				<button type="button" class="v_btn btn_favorite"><i class="v_ico ico_bookmark"></i></button>
			</div>
			<nav class="v_breadcrumb">
				<ul class="path">
					<li><i class="v_ico ico_home"></i></li>
					<li>{{ t('10662') }}</li>
					<li>{{ t('10114') }}</li>
				</ul>
			</nav>
		</div> -->
		<TitleComp />
		<!-- Main area -->
		<Form v-slot="$form" :resolver="resolver">
			<div class="content_section">
				<div class="v_table" > 
					<table>
						<colgroup>
							<col style="width: 16.3%;">
							<col>
							<col style="width: 16.3%;">
							<col style="width: 33.7%;">
						</colgroup>
						<tbody>
							<tr>
								<th scope="row">{{ t('10292') }}</th>
								<td>
									{{ billDetail.billNo }}
								</td>
								<th scope="row">{{ t('10051') }}</th>
								<td>{{ dayjs(billDetail.ppslDt).format('DD/MM/YYYY') }}</td>
							</tr>
							<tr>
								<th scope="row">{{ t('10293') }}</th>
								<td colspan="3">{{ billDetail.billName }}</td>
							</tr>
							<tr>
								<th scope="row">{{ t('10111') }}</th>
								<td colspan="3">{{ billDetail.etc }}</td>
							</tr>
							<tr>
								<th scope="row">{{ t('10071') }}</th>
								<td colspan="3">
									{{ billDetail.ppsrNm }}
									<a href="javascript:void(0)" class="v_btn btn_outline_secondary btn_xs" @click="openModal = true">{{ t('10112') }}</a>
								</td>
							</tr>
							<tr>
								<th scope="row">{{ t('10093') }}</th>
								<td colspan="3">
									<BillFileList :fileList="billDetail.applyFileList" />
								</td>
							</tr>
							<tr v-if="btnBillRegister">
								<th scope="row">{{ t('10148') }}<span class="text_red">*</span></th>
								<td colspan="3">
									<FormField v-slot="$field" name="rcpDt" initialValue="" style="flex-grow: 1;">
										<input type="date" class="form_control" value="" v-model="rcpDt">
										<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
									</FormField>
								</td>
							</tr>
							<tr v-else>
								<th scope="row">{{ t('10148') }}</th>
								<td colspan="3">
									{{ dayjs(billDetail.rcpDt).format('DD/MM/YYYY') }}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<div class="btn_group_fixed">
				<button type="button" class="v_btn btn_outline_primary btn_md" @click="fnGoList">{{ t('10084') }}</button>
				<button type="submit" class="v_btn btn_primary btn_md" @click="fnBillRegister" v-if="btnBillRegister">{{ t('10113') }}</button>
			</div>
		</Form>
		<!-- // Main area -->
	</div>
	<ProposalModal v-if="openModal" @close="openModal = false" :dialog="openModal" :billId="route.query.id" />
</template>

<style></style>
