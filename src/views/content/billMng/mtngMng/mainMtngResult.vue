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
import { useI18n } from 'vue-i18n'

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
const fileItems = ref([]);

// Add -In my documentation (20250221 Cho Jinho)

const myFolderModal = ref({});
const myFileItems = ref([]);


Array.from({ length: 24 }, (_, i) => {
  const num = (i).toString().padStart(2, '0');
  time.value.push(num);
});

/** List */
const fnGoList = () => {
	router.push({name: 'mtng.mainMtng2'});
};

const fnGoDetail= (e)=>{
    router.push({name: 'mtng.mainMtng2.detail', query : {  mtngId: mtngId }});
}

const fnAddAttendants = (event) => {
	participantRef.value.fnOpen();
};

const fnSendList = (sendList) => {
	console.log('fnSendList', participantList.value, sendList);
	participantList.value = [...new Map([...participantList.value, ...sendList].map(item => [item.memberId, item])).values()];
	console.log(participantList.value);
};

const fnAgendaSendList = (sendList) => {
	agendaList.value = [...new Map([...agendaList.value, ...sendList].map(item => [item.billId, item])).values()];
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
				agendaList: agendaList.value,
				mtngTypeCd: '2', //Plenary

    		};

			const apiUrl = `/bill/mtng/result`;
			const formData = new FormData();
			formData.append("jsonData", JSON.stringify(jsonData));

			for (var i = 0; i < fileItems.value?.length; ++i) {
				formData.append("files", fileItems.value[i]);
				formData.append("fileKindCds", fileItems.value[i].kind);
			}

			for (var i = 0; i < myFileItems.value?.length; ++i) {
				formData.append("myFileIds", myFileItems.value[i].fileId);
				formData.append("fileKindCds2", myFileItems.value[i].kind);
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

    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

/** Pile */
const addFilesToFiles = (kind, e) => {
//   const file = e.target.files[0];
//   if (file) {
//     file.kind = kind; // Add a kind attribute to the file object
//     fileItems.value = fileItems.value.filter(f => f.kind !== kind);
//     fileItems.value.push(file);
//   }


  fileItems.value = [];
  const files = e.target.files;
  for(var i = 0; i < files?.length; ++i) {
	const file = files[i];
	file.kind = kind; // Add KIND properties to file objects

    fileItems.value.push(file);
  }
};

const fnOpenMyFolderModal = (kind, fileInputId) => {
    myFolderModal.value.open = true;
    myFolderModal.value.kind = kind;
    myFolderModal.value.fileInputId = fileInputId;
}

const selectFile = (fileId, fileTitle, fileType) => {
    const {kind, fileInputId} = myFolderModal.value;
    const fileInput = document.querySelector(`#${fileInputId}`);
    fileInput.value = '';
    fileItems.value = fileItems.value.filter(f => f.kind !== kind);
    myFileItems.value = myFileItems.value.filter(f => f.kind !== kind);
    myFileItems.value.push({fileId, kind});

    let filename = fileTitle;
    if(fileType) {
        filename += '.' + fileType;
    }
    $(`#${fileInputId}`).next('.file_name').val(filename);
}

onMounted(() => {
    fnGetMtngData();
});

</script>

<template>
	<div class="content_inner">
 
		<TitleComp />
		<!-- Main area -->
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
						<!-- <tr>
							<th scope="row">{{ t('10045') }}</th>
							<td colspan="3" >
								{{ userInfo.deptNm }}
							</td>
						</tr> -->
						<tr>
							<th scope="row">{{ t('10185') }}</th>
							<td>
								{{ dayjs(mtngData.dueDtm).format('DD/MM/YYYY HH:mm') }}
							</td>
							<th scope="row">{{ t('10186') }}</th>
							<td>
								<div class="input_group">

									<input type="date" class="form_control"  v-model="mtngData.openDate">
									<select class="form_control" v-model="mtngData.openHour">
										<option v-for="tval in time" :value="tval">
											{{ tval }}{{ t('10547') }}
										</option>
									</select>
									<select class="form_control" v-model="mtngData.openMin">
										<option v-for="mVal in min" :value="mVal">
											{{ mVal }}{{ t('10548') }}
										</option>
									</select>
									<span class="text">~</span>
									<select class="form_control" v-model="mtngData.closeHour">
										<option v-for="tval in time" :value="tval">
											{{ tval }}{{ t('10547') }}
										</option>
									</select>
									<select class="form_control" v-model="mtngData.closeMin">
										<option v-for="mVal in min" :value="mVal">
											{{ mVal }}{{ t('10548') }}
										</option>
									</select>
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
												<!-- <div class="input_group">
													<select v-model="slotProps.data.atdtDivCd" class="form_control">
														<option :value="null" selected>{{ t('10224') }}</option>
														<option value="Y">{{ t('10668') }}</option>
														<option value="N">{{ t('10667') }}</option>
														<option value="M">{{ t('10638') }}</option>
													</select>
												</div> -->
											</template>
										</Column>
                                        <!-- <Column :header="t('10173')" class="text_center" style="width: 10%;">
                                            <template #body="slotProps">
                                                <button type="button" class="v_btn btn_outline_secondary btn_xs" @click="fnRemoveAttend(slotProps.data.memberId)">{{ t('10173') }}</button>
                                            </template>
                                        </Column> -->
                                    </DataTable>
								</div>
							</td>
						</tr>
						<tr>
							<th scope="row">{{ t('10222') }}</th>
							<td colspan="3">
								<div class="file_attatch">
                                    <div class="form_row">
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
                                    </div>
									<div class="form_row">
										<ul class="file_list" v-for="(file, index) in reportList" :key="index">
										<li>
											<span>{{ file.orgFileNm }}</span>
											<div class="file_wrap">
												<a href="javascript:void(0)" class="v_btn" @click="fnDownloadFile(file.orgFileId, file.orgFileNm)"><img src="@/assets/images/common/ico_file_word.png" alt=""></a>
												<a href="javascript:void(0)" class="v_btn" @click="fnConvertPdfFileDownload"><img src="@/assets/images/common/ico_file_pdf.png" alt=""></a>
											</div>
										</li>
									</ul>
									</div>
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
				<!-- <a href="javascript:void(0)" class="v_btn btn_primary btn_sm" @click="fnAddAgenda">{{ t('10197') }}</a> -->
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
								<select v-model="slotProps.data.rsltCd" class="form_control" :disabled="slotProps.data.currentStepId != '1700'">
									<option :value="null" selected>{{ t('10224') }}</option>
									<option value="PL01">{{ t('10138') }}</option>
									<option value="PL02">{{ t('10137') }}</option>
								</select>
							</div>
						</template>
					</Column>
				</DataTable>
			</div>
		
		</div>
		<!-- // Main area -->
		<div class="btn_group_fixed">
			<button type="button" class="v_btn btn_outline_primary btn_md" @click="fnGoList">{{ t('10084') }}</button>
			<a href="javascript:void(0)" class="v_btn btn_primary btn_md" @click="fnSave">{{ t('10220') }}</a>
		</div>
	</div>		
	<cmtMtngAttendModal ref="participantRef" @sendList="fnSendList"></cmtMtngAttendModal>
	<mtngAgendaModal ref="agendaRef" mode="main" @sendList="fnAgendaSendList"></mtngAgendaModal>
	<MyFolderModal v-if="myFolderModal.open" :dialog="myFolderModal.open" @close="myFolderModal.open = false" @selectFile="selectFile" />

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
