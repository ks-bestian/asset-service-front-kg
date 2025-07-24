<script setup>
import { ref, computed, onMounted } from "vue";
import cmtMtngAttendModal from "@/views/content/billMng/common/cmtMtngAttendModal.vue";
import mtngAgendaModal from "@/views/content/billMng/common/mtngAgendaModal.vue";
import MyFolderModal from "@/views/content/document/modal/MyFolderModal.vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import dayjs from "dayjs";
import { isEmpty , replace} from 'lodash';
import { useConfirm } from "primevue/useconfirm";
import FileUpload from 'primevue/fileupload';
import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/store";
import TitleComp from "@/components/TitleComp.vue";
import BillFileInput from "../common/billFileInput.vue";
import { useI18n } from 'vue-i18n'
import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { FormField } from '@primevue/forms';

const { t } = useI18n()

const confirm = useConfirm();
const router = useRouter();
const route = useRoute();
const store = useStore();

const mtngId = route.query.mtngId;
const ageObj = computed(() => store.getAgeObj);
const userInfo = store.loginInfo;

const lang = localStorage.getItem("languageType");
const participantRef = ref(null);
const agendaRef = ref(null);
const agendaList = ref([]); // Agenda

const participantList = ref([]); // Participation list

const reportList = ref([]); // Results report

const mtngData = ref({});
const time = ref([]);
const min = ref(['00','10','20','30','40','50']);
// const fileItems = ref([]);


// // Add -In my documentation (20250221 Cho Jinho)
// conf myfoldermodal = ref ({});
// conf ([]);


const files = ref();
const myFiles = ref();
const comCodes1017 = store.getComCodes(1017);
const comCodes1008 = store.getComCodes(1008);

Array.from({ length: 24 }, (_, i) => {
  const num = (i).toString().padStart(2, '0');
  time.value.push(num);
});

/** List */
const fnGoList = () => {
	router.push({name: 'mtng.cmtMtng'});
};

const fnGoDetail= (e)=>{
    router.push({name: 'mtng.cmtMtng.detail', query : {  mtngId: mtngId }});
}

const fnAddAttendants = (event) => {
	participantRef.value.fnOpen();
};

const fnSendList = (sendList) => {

	for(var i = 0; i < sendList?.length; ++i) {
		delete sendList[i]['isNew'];
		sendList[i].atdtDivCd = 'Y'; // Set as a default attendance

	}

	participantList.value = [...new Map([...participantList.value, ...sendList].map(item => [item.memberId, item])).values()];
};

const fnAgendaSendList = (sendList) => {

	const sent = [];
	for(var i = 0; i < sendList?.length; ++i) {
		sent.push({
			billId: sendList[i].billId,
			billNo: sendList[i].billNo,
			billName: sendList[i].billName,
			ppslDt: sendList[i].ppslDt,
			ppsrNm: sendList[i].ppsrNm,
			rsltCd: null,
		});
	}

	agendaList.value = [...new Map([...agendaList.value, ...sent].map(item => [item.billId, item])).values()];
};

const fnRemoveAttend = (memberId) => {
	participantList.value = participantList.value.filter(user => user.memberId !== memberId);
};

const fnAddAgenda = (event) => {
	agendaRef.value.fnOpen();
};

const fnDeleteAgenda = (item) => {
	agendaList.value = agendaList.value.filter(selected => selected.billId !== item.billId);
};

const fnSave = (event) => {

	if (!fnValidate()) {
		return;
	}

    confirm.require({
        target: event.currentTarget,
        message: t('10219'),
        accept: () => {

			let openDtm = '';
			let closeDtm = '';
			if(!isEmpty(mtngData.value.openDate) && !isEmpty(mtngData.value.openHour) && !isEmpty(mtngData.value.openMin)) {
				openDtm =  replace(mtngData.value.openDate, /-/g, '')+mtngData.value.openHour+mtngData.value.openMin;
			}

			if(!isEmpty(mtngData.value.openDate) && !isEmpty(mtngData.value.closeHour) && !isEmpty(mtngData.value.closeMin)) {
				closeDtm =  replace(mtngData.value.openDate, /-/g, '')+mtngData.value.closeHour+mtngData.value.closeMin;
			}

			const jsonData = {
				mtngId: mtngId,
				statCd: '2',
				openDtm: openDtm,
				closeDtm: closeDtm,
				mtngPlc: mtngData.value.mtngPlc,
				rmk: mtngData.value.rmk,
				attendantList:participantList.value,
				agendaList: agendaList.value
    		};

			const apiUrl = `/bill/mtng/result`;
			const formData = new FormData();
			formData.append("jsonData", JSON.stringify(jsonData));

			// for (var i = 0; i < fileItems.value?.length; ++i) {
			// 	formData.append("files", fileItems.value[i]);
			// 	formData.append("fileKindCds", fileItems.value[i].kind);
			// }


			// for (var i = 0; i < myFileItems.value?.length; ++i) {
			// 	formData.append("myFileIds", myFileItems.value[i].fileId);
			// 	formData.append("fileKindCds2", myFileItems.value[i].kind);
			// }


			for (var i = 0; i < files.value?.length; ++i) {
				formData.append("files", files.value[i]);
			}
			for(var i = 0; i < myFiles.value?.length; ++i) {
				formData.append("myFileIds", myFiles.value[i].fileId);
			}
			
			store.API_SAVE_FILE(apiUrl, formData).then((data) => {
				fnGoDetail();
			}).catch(({ message }) => {
				console.log("message : ", message);
			});

        },
    });
};

const fnGetMtngData = () => {
	
    let params = {};
    params.lang = lang;
    const apiUrl = '/bill/mtng/from/detail/'+mtngId;
    store.API_LIST(apiUrl, params).then((data) => {

	  mtngData.value = data.data.data;
      agendaList.value = data.data.data.agendaList;
	  participantList.value = data.data.data.attendantList;
	  reportList.value = data.data.data.reportList;

	  for(var i = 0; i < participantList.value?.length; ++i) {
		const part = participantList.value[i];
		if(!part.atdtDivCd) {
			part.atdtDivCd = 'Y'; // Set as a default attendance

		}
	  }

    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

const onFileChange = (selection, type) => {
	if (type == 'file') {
		files.value = selection;
		myFiles.value = null;
	}
	else {
		files.value = null;
		myFiles.value = selection;
	}
}

const fnValidate = () => {
	const {errors} = resolver();
	return Object.keys(errors).length === 0;
}

const resolver = () => {
    const errors = {};

	if (!mtngData.value.openDate || !mtngData.value.openHour || !mtngData.value.openMin || !mtngData.value.closeHour || !mtngData.value.closeMin) {
        errors.date = [{ message: 'date is required.' }];
    }
	for(var i = 0; i < agendaList.value?.length; ++i) {
		const agenda = agendaList.value[i];
		if(!agenda.rsltCd) {
			errors[agenda.billNo] = [{ message: 'required.' }];
		}
	}

	console.log('errors', errors);

    return {
        errors
    };
};

onMounted(() => {
    fnGetMtngData();
});

</script>

<template>
	<div class="content_inner">
		<TitleComp />
		<!-- Main area -->
		<Form v-slot="$form" :resolver="resolver">
			<div class="content_section">
				<div class="v_table" >
					<table>
						<colgroup>
							<col style="width: 16.3%;">
							<col style="width: 25.3%;">
							<col style="width: 16.3%;">
							<col>
						</colgroup>
						<tbody>
							<tr>
								<th scope="row">{{ t('10045') }}</th>
								<td colspan="3" >
									{{ userInfo.deptNm }}
								</td>
							</tr>
							<tr>
								<th scope="row">{{ t('10185') }}</th>
								<td>
									{{ dayjs(mtngData.dueDtm).format('DD/MM/YYYY HH:mm') }}
								</td>
								<th scope="row">{{ t('10186') }}<span class="text_red">*</span></th>
								<td>
									<div class="input_group">
										<FormField v-slot="$field" name="date" initialValue="" style="flex-grow: 1;">
											<input type="date" class="form_control"  v-model="mtngData.openDate" style="width: 25%;">
											<select class="form_control" v-model="mtngData.openHour" style="width: 15%;">
												<option v-for="tval in time" :value="tval">
													{{ tval }}{{ t('10547') }}
												</option>
											</select>
											<select class="form_control" v-model="mtngData.openMin" style="width: 15%;">
												<option v-for="mVal in min" :value="mVal">
													{{ mVal }}{{ t('10548') }}
												</option>
											</select>
											<span class="text">~</span>
											<select class="form_control" v-model="mtngData.closeHour" style="width: 15%;">
												<option v-for="tval in time" :value="tval">
													{{ tval }}{{ t('10547') }}
												</option>
											</select>
											<select class="form_control" v-model="mtngData.closeMin" style="width: 15%;">
												<option v-for="mVal in min" :value="mVal">
													{{ mVal }}{{ t('10548') }}
												</option>
											</select>
											<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
										</FormField>
									</div>
								</td>
							</tr>
							<tr>
								<th scope="row">{{ t('10187') }}</th>
								<td  colspan="3">        
									<input type="text" class="form_control" v-model="mtngData.mtngPlc" :placeholder="t('10187')">
								</td>
							</tr>
							<tr>
								<th scope="row">{{ t('10188') }}</th>
								<td colspan="3">
									<div class="mb_2">
										<a href="javascript:void(0)" class="v_btn btn_secondary btn_xs" @click="fnAddAttendants"><i class="v_ico ico_search_white_xs"></i><span>{{ t('10177') }}</span></a>
									</div>
									<div class="card flex flex-wrap gap-2">
										<DataTable :value="participantList" size="small" tableStyle="min-width: 100px;" scrollable  scrollHeight="200px" >
											<Column field="memberNm"   :header="t('10152')" class="text_center" style="width: 30%;"></Column>
											<Column field="polyNm" :header="t('10189')"></Column>
											<Column :header="t('10221')" class="text_center" style="width: 15%;">
												<template #body="slotProps">
													<div class="input_group">
														<select v-model="slotProps.data.atdtDivCd" class="form_control">
															<option :value="null" hidden>{{ t('10224') }}</option>
															<option v-for="code in comCodes1017" :value="code.codeId">{{ code.codeNm }}</option>
															<!-- <option value="Y">{{ t('10668') }}</option>
															<option value="N">{{ t('10667') }}</option>
															<option value="M">{{ t('10638') }}</option> -->
														</select>
													</div>
												</template>
											</Column>
											<Column :header="t('10173')" class="text_center" style="width: 10%;">
												<template #body="slotProps">
													<button type="button" class="v_btn btn_outline_secondary btn_xs" @click="fnRemoveAttend(slotProps.data.memberId)">{{ t('10173') }}</button>
												</template>
											</Column>
										</DataTable>
									</div>
								</td>
							</tr>
							<tr>
								<th scope="row">{{ t('10222') }}</th>
								<td colspan="3">
									<div class="file_attatch">
										<BillFileInput multiple button-name="file" @change="(selection, type) => onFileChange(selection, type)" :set-public="false" />
										<!-- <div class="form_row">
											<div class="input_item">
												<div class="input_group">
													<input type="file" class="form_file" id="inputFile1_1" multiple @change="e => addFilesToFiles('110',e)">
													<input type="text" class="form_control file_name">
													<span class="input_addon">
														<label class="v_btn btn_outline_secondary btn_sm btn_file" for="inputFile1_1">file</label>
													</span>
													<span class="input_addon">
														<label class="v_btn btn_outline_secondary btn_sm btn_file" for="" @click="fnOpenMyFolderModal('110', 'inputFile1_1')">{{ t('10081') }}</label>
													</span>
												</div>
											</div>
										</div> -->
									</div>
								</td>
							</tr>
							<tr>
								<th scope="row">{{ t('10111') }}</th>
								<td colspan="3">
									<textarea row="2" class="form_control full" v-model="mtngData.rmk"></textarea>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div class="text_right mb_2 mt_2">
					<a href="javascript:void(0)" class="v_btn btn_primary btn_sm" @click="fnAddAgenda">{{ t('10197') }}</a>
				</div>

				<div class="v_table"> 
					<DataTable :value="agendaList">
						<Column field="billNo"   :header="t('10292')" class="text_center" style="width: 10%;"></Column>
						<Column field="billName" :header="t('10293')"  ></Column>
						<Column field="ppslDt" :header="t('10051')" class="text_center" style="width: 10%;">
							<template #body="slotProps">
								{{ dayjs(slotProps.data.ppslDt).format('DD/MM/YYYY') }}
							</template>
						</Column>
						<Column field="ppsrNm" :header="t('10196')" class="text_center" style="width: 10%;"></Column>
						<Column field="rsltCd" :header="t('10223')" class="text_center" style="width: 10%;">
							<template #body="slotProps">
								<div class="input_group">
									<FormField v-slot="$field" :name="slotProps.data.billNo" initialValue="" style="flex-grow: 1;">
										<select v-model="slotProps.data.rsltCd" class="form_control" style="width: 100%;">
											<option :value="null" hidden>{{ t('10224') }}</option>
											<option v-for="code in comCodes1008" :value="code.codeId">{{ code.codeNm }}</option>
											<!-- <option value="CM01">{{ t('10138') }}</option>
											<option value="CM02">{{ t('10137') }}</option> -->
										</select>
										<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
									</FormField>
								</div>
							</template>
						</Column>
						<Column :header="t('10173')" class="text_center" style="width: 10%;">
							<template #body="slotProps">
								<button type="button" class="v_btn btn_outline_secondary btn_xs" @click="fnDeleteAgenda(slotProps.data)">{{ t('10173') }}</button>
							</template>
						</Column>
					</DataTable>
				</div>
			
			</div>
			<!-- // Main area -->
			<div class="btn_group_fixed">
				<button type="button" class="v_btn btn_outline_primary btn_md" @click="fnGoList">{{ t('10084') }}</button>
				<button type="submit" class="v_btn btn_primary btn_md" @click="fnSave">{{ t('10220') }}</button>
			</div>
		</Form>
	</div>		
	<cmtMtngAttendModal ref="participantRef" @sendList="fnSendList"></cmtMtngAttendModal>
	<mtngAgendaModal ref="agendaRef" mode="cmt" @sendList="fnAgendaSendList"></mtngAgendaModal>
	<!-- <MyFolderModal v-if="myFolderModal.open" :dialog="myFolderModal.open" @close="myFolderModal.open = false" @selectFile="selectFile" /> -->

</template>
<style>
.no_data {
    display: flex; /* Flex box use */
    justify-content: center; /* Horizontal */
    align-items: center;
    flex-direction: column;
    height: 16rem; 
}
</style>
