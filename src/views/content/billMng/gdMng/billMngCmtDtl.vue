

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from 'vue-router'
import { useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import ProposalModal from "@/views/content/billMng/common/proposalModal.vue";
import Select from 'primevue/select';
import MultiSelect from 'primevue/multiselect';
import { isEmpty , replace} from 'lodash';
import dayjs from "dayjs";
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

const proposalModal = ref(false);
const fileList = ref(null);
const cmtItem = ref(null);
const relCmtItems = ref([]);
const filteredData = ref([]);
const cmtList = ref(null);
const processVo = ref(null);

/////////////////////////////////

//Buttons

const btnSave = ref(false);
const btnBillRegister = ref(false);

const cmtList1 = computed(() => {
	return filteredData.value.filter((data) => {
		return !relCmtItems.value.includes(data.deptCd);
	});
})

const cmtList2 = computed(() => {
	return filteredData.value.filter((data) => {
		return data.deptCd != cmtItem.value;
	});
})

const relCmtItemsNm = computed(() => {
	return relCmtItems.value.map(item => {
		const ret = [];
		for(var i = 0; i < filteredData.value.length; ++i) {
			if(filteredData.value[i].deptCd == item) {
				return filteredData.value[i].deptNm;
			}
		}
	})
})

const fnAuthSetup = () => {

	console.log(processVo.value.taskStatus);
	btnSave.value = true;

	if(processVo.value.taskStatus != 'C') {
		if( cmtItem.value) {
			btnBillRegister.value = true;
		} else {
			btnBillRegister.value = false;
		}
	}
    // // Even if you have been sent, there is a situation where you have to do it again.
	// 	if( cmtItem.value) {
	// 		btnBillRegister.value = true;
	// 	} else {
	// 		btnBillRegister.value = false;
	// 	}


};

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

		processVo.value = data.data.data.processVo;
        billDetail.value = data.data.data.billMngVo;
		cmtList.value = data.data.data.cmtList;

		// fileList.value = data.data.data.billMngVo.ebsfileList;
		// const basicFileKindCd = ['110', '120', '130', '140', '150', '160'];
		// if(fileList.value) {
		// 	fileList.value = fileList.value.filter(file => basicFileKindCd.includes(file.fileKindCd));
		// }

		fileList.value = data.data.data.billMngVo.applyFileList;


		const mainCmt = cmtList.value.filter(data => data.cmtSeCd === 'M').map(data => data.cmtCd)[0] || '';
		const relatedCmts = cmtList.value.filter(data => data.cmtSeCd === 'R').map(data => data.cmtCd) || [];

		cmtItem.value = mainCmt;
		relCmtItems.value = relatedCmts;

		console.log('fileList.value', fileList.value);
		
		fnAuthSetup();

	}).catch(({ message }) => {
		console.log("message : ", message);
	});
}

/** Saving of the agenda committee */

const fnConfirmSave = (event) => {

	if (!fnValidate()) {
		return;
	}

    let msg = t('10155');

    confirm.require({
        target: event.currentTarget,
        message: msg,
        accept: () => {
			fnSave();
        },
        reject: () => {
        }
    });

};

const fnSave = () => {

	if (cmtItem.value == null) {
		alert(t('10544'));
		return;
	}
	const jsonData = {
		billId: route.query.id,
		cmtCd: cmtItem.value,
		relCmtList: relCmtItems.value,
	};

	const apiUrl = `/bill/review/billMng/committ`;
	return store.API_SAVE(apiUrl, jsonData).then((data) => {
		fnSearchDetail();
	}).catch(({ message }) => {
		console.log("message : ", message);
	})

};

/** Committee on the agenda committee */
/** Confirmation window */
const fnConfirmNext = (event) => {

	let msg = t('10179'); //Would you like to refer to the agenda?


    confirm.require({
        target: event.currentTarget,
        message: msg,
        accept: () => {
			fnSave().then(() => fnNextProcess());
        },
        reject: () => {
        }
    });
}


/** Process Committee on Committee*/
const fnNextProcess = () => {

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
}

const fnGoList = () => {
	router.push({ name: 'billMng.gdMng.billMngCmt' });
};

/** Committee */
const fnGetDeptList = () => {

	let params = {};
	params.lang = lang;
	const apiUrl = `/admin/dept`;
	store.API_LIST(apiUrl, params).then((data) => {

		const deptList = data.data.data;
		filteredData.value = [...deptList.filter(item => item.uprDeptCd === 'CMT')];
		fnSearchDetail();

	}).catch(({ message }) => {
		console.log("message : ", message);
	})
}

const fnValidate = () => {
	const {errors} = resolver();
	return Object.keys(errors).length === 0;
}

const resolver = () => {
    const errors = {};
	
	if (!cmtItem.value) {
        errors.cmtItem = [{ message: 'cmtItem is required.' }];
    }

    return {
        errors
    };
};

onMounted(() => {
	fnGetDeptList();
    fnSearchDetail();
});

</script>
<template>
	<div class="content_inner">
		<!-- <div class="content_util">
			<div class="title_wrap">
				<h2 class="content_tit">{{ t('10154') }}</h2>
				<button type="button" class="v_btn btn_favorite"><i class="v_ico ico_bookmark"></i></button>
			</div>
			<nav class="v_breadcrumb">
				<ul class="path">
					<li><i class="v_ico ico_home"></i></li>
					<li>{{ t('10662') }}</li>
					<li>{{ t('10154') }}</li>
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
								<td>{{ billDetail.billNo }}</td>
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
								<th scope="row">{{ t('10176') }}</th>
								<td colspan="3">
									{{ billDetail.ppsrNm }}
									<a href="javascript:void(0)" class="v_btn btn_outline_secondary btn_xs" @click="proposalModal = true">{{ t('10112') }}</a>
								</td>
							</tr>
							<tr>
								<th scope="row">{{ t('10093') }}</th>
								<td colspan="3">
									<BillFileList :fileList="fileList" />
								</td>
							</tr>
							<tr>
								<th scope="row">{{ t('10045') }}</th>
								<td colspan="3">
									<!-- <div class="mb_2">
										<a href="javascript:void(0)" @click="fnSelectCmt" class="v_btn btn_secondary btn_sm"><i class="v_ico ico_search_white_sm"></i><span>{{ t('10177') }}</span></a>
									</div> -->
									<div class="form_col type2">
										<div class="input_item">
											<FormField v-slot="$field" name="cmtItem" initialValue="" style="flex-grow: 1;">
												<label class="form_label">
													{{ t('10140') }}<span class="text_red">*</span> :
														<Select v-model="cmtItem" :options="cmtList1" optionLabel="deptNm" optionValue="deptCd" :placeholder="t('10177')" class="" />
												</label>
												<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
											</FormField>
										</div>
										<div class="input_item">
											<label class="form_label">
												{{ t('10142') }} :
												<MultiSelect v-model="relCmtItems" :options="cmtList2" optionLabel="deptNm" optionValue="deptCd" :placeholder="t('10177')" :maxSelectedLabels="1" />
												<ul>
													<li v-for="(item, index) in relCmtItemsNm" :key="index">
														- {{ item }}
													</li>
												</ul>
												<!-- <br>{{ relCmtItemsNm.join(', ') }}  -->
											</label>
										</div>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<div class="btn_group_fixed">
				<button type="button" class="v_btn btn_outline_primary btn_md" @click="fnGoList">{{ t('10084') }}</button>
				<button type="submit" class="v_btn btn_primary btn_md" @click="fnConfirmSave($event)" v-if="btnSave">{{ t('10174') }}</button>
				<a href="javascript:void(0)" class="v_btn btn_primary btn_md" @click="fnConfirmNext" v-if="btnBillRegister">{{ t('10154') }}</a>
			</div>
		</Form>
		<!-- // Main area -->
	</div>

	<ProposalModal v-if="proposalModal" @close="proposalModal = false" :dialog="proposalModal" :billId="route.query.id" />
</template>

<style scoped>

</style>
