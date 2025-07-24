<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useStore } from "@/store";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import participantViewModal from "@/views/content/billMng/common/participantViewModal.vue";
import TitleComp from "@/components/TitleComp.vue";
import BillFileList from "../common/billFileList.vue";
import { useI18n } from 'vue-i18n'
import BillInfoIncModal from "@/views/content/billMng/common/billInfoIncModal.vue";


const { t } = useI18n()

const confirm = useConfirm();
const router = useRouter();
const route = useRoute();
const mtngId = route.query.mtngId;
const store = useStore();
const dialog = ref(false);
const selectBillId = ref('')

/** Buttons */
const userInfo = store.loginInfo;
const authBtnUpdate = ref(false);//correction

const authBtnCancel = ref(false);//cancellation

const authBtnReport = ref(false);//Report


const fnAuthSetup = () => {
	if(mtngData.value.statCd == '1') {
		authBtnUpdate.value = true;
		authBtnCancel.value = true;
		authBtnReport.value = true;
	}
};

const agendaList = ref([]);
const attendantList = ref([]);
const mtngData = ref({});
const reportList = ref([]);
const lang = localStorage.getItem("languageType");
const participantRef = ref(null);
const viewMode = ref('1');

const fnGoList = () => {
	router.push({name: 'mtng.cmtMtng'});
};

const fnGoMtngResult = () => {
	router.push({name: 'mtng.cmtMtng.result', query : {  mtngId: mtngId }});
};

const fnDelete = (event) => {

    confirm.require({
        target: event.currentTarget,
        message: t('10434'),
        accept: () => {

			let deleteItems = [];
			deleteItems.push(mtngId);
			const apiUrl = `/bill/mtng/from`;
			store.API_DELETE(apiUrl, deleteItems).then((data) => {
				fnGoList();
			}).catch(({ message }) => {
				console.log(message)
			})
        },
    });
}

const fnGetMtngData = () => {
	
    let params = {};
    params.lang = lang;
    const apiUrl = '/bill/mtng/from/detail/'+mtngId;
    store.API_LIST(apiUrl, params).then((data) => {

	  mtngData.value = data.data.data;
      agendaList.value = data.data.data.agendaList;
	  attendantList.value = data.data.data.attendantList;
	  reportList.value = data.data.data.reportList;
	  viewMode.value = mtngData.value.statCd;
	  
	  fnAuthSetup();

    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

const fnGoUpdate = () => {
	router.push({name: 'mtng.cmtMtng.update', query : { mtngId: mtngId }});
}

const fnViewPatsp = () => {
	participantRef.value.fnOpen();
}

/** File download */
const fnDownloadFile = (fileId, fileNm) => {
    store.API_FILE_DOWN(fileId, fileNm);
}

const fnConvertPdfFileDownload = () => {
}

const fnBillModal = (data) => {
	selectBillId.value = data
	dialog.value = true;
}

onMounted(() => {
	fnGetMtngData();//Initial inquiry

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
						<col style="width: 15%;">
						<col>
						<col style="width: 15%;">
						<col style="width: 25%;">
					</colgroup>
					<tbody>
						<tr>
							<th scope="row">{{ t('10045') }}</th>
							<td>
								{{ mtngData.deptNm }}
							</td>
							<th scope="row">{{ t('10181') }}</th>
							<td>{{ mtngData.mtngTypeNm }}</td>
						</tr>
						<tr v-if="mtngData.statCd == '1'">
							<th scope="row">{{ t('10185') }}</th>
							<td>{{ dayjs(mtngData.dueDtm).format('DD/MM/YYYY HH:mm') }}</td>
							<th scope="row">{{ t('10187') }}</th>
							<td>        
								{{ mtngData.mtngPlc }}
							</td>
						</tr>
						<tr  v-if="mtngData.statCd == '2'">
							<th scope="row">{{ t('10186') }}</th>
							<td>{{ mtngData.openDtm ? dayjs(mtngData.openDtm).format('DD/MM/YYYY') : '' }}&nbsp;
								{{ mtngData.openDtm ? dayjs(mtngData.openDtm).format('HH:mm') : '' }} ~ {{ mtngData.closeDtm ? dayjs(mtngData.closeDtm).format('HH:mm') : '' }}</td>
							<th scope="row">{{ t('10187') }}</th>
							<td>        
								{{ mtngData.mtngPlc }}
							</td>
						</tr>
						<tr  v-if="mtngData.statCd == '1'">
							<th scope="row">{{ t('10213') }}</th>
							<td colspan="3">
								{{ attendantList.length }} {{ t('10546') }}<a href="javascript:void(0)" class="v_btn btn_outline_secondary btn_xs ml_2" @click="fnViewPatsp">{{ t('10112') }}</a>
							</td>
						</tr>
						<tr  v-if="mtngData.statCd == '2'">
							<th scope="row">{{ t('10188') }}</th>
							<td colspan="3">
								{{ attendantList.length }} {{ t('10546') }}<a href="javascript:void(0)" class="v_btn btn_outline_secondary btn_xs ml_2" @click="fnViewPatsp">{{ t('10112') }}</a>
							</td>
						</tr>

						<tr>
							<th scope="row">{{ t('10111') }}</th>
							<td colspan="3">
								{{ mtngData.rmk }}
							</td>
						</tr>
						
						<tr v-if="mtngData.statCd == '2'">
							<th scope="row">{{ t('10191') }}</th>
							<td colspan="3">
								<BillFileList :fileList="reportList" />
							</td>
						</tr>


					</tbody>
				</table>

				<div class="v_table" style="height: 10px;"> 

				</div>

					<div class="v_table"> 
						<DataTable :value="agendaList" >
							<Column field="billNo" :header="t('10292')" class="text_center" style="width: 10%;">
							<template #body="{ data }">
								<button type="button" class="v_btn btn_outline_primary btn_sm" @click="fnBillModal(data.billId)">{{ data.billNo }}</button>
							</template>
							</Column>
							<Column field="billName" :header="t('10293')"  ></Column>
							<Column field="ppslDt" :header="t('10051')" class="text_center" style="width: 10%;">
								<template #body="slotProps">
									{{ dayjs(slotProps.data.ppslDt).format('DD/MM/YYYY') }}
								</template>
							</Column>
							<Column field="ppsrNm" :header="t('10106')" class="text_center" style="width: 30%;"></Column>
							<Column v-if="mtngData.statCd == '2'" field="rsltNm" :header="t('10136')" class="text_center" style="width: 10%;"></Column>
						</DataTable>

					</div>
			</div>
		
		</div>
		<!-- // Main area -->
		<div class="btn_group_fixed ">
			<div class="btns">
				<button type="button" class="v_btn btn_outline_primary btn_md" @click="fnGoList">{{ t('10084') }}</button>
				<a href="javascript:void(0)" v-if="authBtnUpdate" class="v_btn btn_primary btn_md" @click="fnGoUpdate">{{ t('10157') }}</a>
				<a href="javascript:void(0)" v-if="authBtnCancel" class="v_btn btn_primary btn_md" @click="fnDelete">{{ t('10545') }}</a>
				<a href="javascript:void(0)" v-if="authBtnReport" class="v_btn btn_primary btn_md" @click="fnGoMtngResult">{{ t('10218') }}</a>
			</div>
		</div>
</div>		
<participantViewModal ref="participantRef" :viewMode="viewMode" :mtngId="mtngId" />
<BillInfoIncModal v-if="dialog" @close="dialog = false" :bill-id="selectBillId" :dialog="dialog"/> 
</template>

<style scoped>
.btns > * {
    margin-right: 10px; /* Right margin */
}
.btns > *:last-child {
    margin-right: 0; /* The last element is to remove margins */
}
</style>
