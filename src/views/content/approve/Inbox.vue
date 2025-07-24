<script setup>
import {computed, onMounted, ref} from "vue";
import LetterListComponent from "@/components/approve/LetterListComponent.vue"
import LetterDetailComponent from "@/components/approve/LetterDetailComponent.vue"
import RecipientsComponent from "@/components/approve/RecipientsComponent.vue"
import CommandComponent from "@/components/approve/CommandComponent.vue"
import WriteCommandComponent from "@/components/approve/WriteCommandComponent.vue"
import TitleComp from "@/components/TitleComp.vue";
import RequestModal from "@/components/modal/approve/RequestModal.vue";
import MainCommandPersonComponent from "@/components/approve/MainCommandPersonComponent.vue";
import { useI18n } from 'vue-i18n'
import ApprovalModal from "@/components/modal/approve/ApprovalModal.vue";
import RejectModal from "@/components/modal/approve/RejectModal.vue";
import {useAlarmStore, useStore} from "@/store";

import router from "@/router/index.js";

const alarmStore = useAlarmStore();
const { t } = useI18n()
const lists = ref();
const selectedData = ref();
const isReceipt = ref(false);
const fileTab = ref('basic');
const isRequestModal =ref(false);
const isApprovalModal =ref(false);
const isRejectModal = ref(false);
const store = useStore();
const isReject = ref();
const page = ref(0);
const size = ref(10);
const selectedRequest = ref(null);
const respondedUsers  = ref([]);
const mainWorker = ref();
const requestType = ref();

const getListData = (data = {})=>{
  store.API_LIST("/eas/documents", data)
      .then((res)=>{
        lists.value = res.data.data;
      });
}

const getMainCommandPerson = (rcvId)=>{
  store.API_LIST("/eas/receivedInfo/worker/" + rcvId)
      .then(res => {
        mainWorker.value = res.data.data;
      })
}

const open_RequestModal = async(data, type) => {
  selectedRequest.value = data ? {...data } : null;
  //get respondedUsers
  if (selectedRequest.value?.workReqId) {
    const res = await store.API_LIST(`/eas/workResponse/byWorkReqId/${selectedRequest.value.workReqId}`);
    respondedUsers.value = res.data.data;
  }
  requestType.value = type;
  set_isRequestModal(true);
}

const set_selectedData = (data)=>{
  selectedData.value = data
  let list = get_selectedDataList.value
  let checkDtm = list.checkDtm;
  let rcvId = list.rcvId;
  get_isReceipt(rcvId);

  if(checkDtm == null){
    store.API_UPDATE("/eas/document/read/" +rcvId)
        .then(()=>{
          getListData();
          alarmStore.setReceiveCount();
        });

  }
  getMainCommandPerson(rcvId);
}

const get_isReceipt = (rcvId)=>{
  store.API_LIST("/eas/isReceipt/"+rcvId)
      .then(res =>{
        isReceipt.value = res.data.data;
      });
}
const getIsReject = (docId)=>{
  store.API_LIST("/eas/reject/" + docId) 
      .then((res)=>{
        console.log(res.data.data);
        isReject.value = res.data.data;
      })
}
const get_selectedDataList = computed(()=>{
  return lists.value.find(item => item.docId === selectedData.value);
})

const fn_reception =  async (data)=>{
  await getIsReject(get_selectedDataList.value.docId)
  let axiosData = {
    docId: get_selectedDataList.value.docId,
    docTypeCd: get_selectedDataList.value.docTypeCd,
    workCn: data.responseContent,
    tmlmtYn: data.deadline != null ? "Y" : "N" ,
    tmlmtDtm: data.deadline != null ?data.deadline+ "T00:00" : null ,
    infoYn: data.checkYn != null ? data.checkYn  : "N" ,
    workCycleCd : data.repeat,
    rcvId: get_selectedDataList.value.rcvId,
    workResponseVos: data.respondents,
    workReqId: data.workReqId || 0,
    workerId : data.mainWorker
  }

  if(!isReject.value){
    await store.API_UPDATE("/eas/reception/", axiosData);
    await refresh();
  }
}

const fn_reject =async (data)=>{
  const axiosData = {
    docId: get_selectedDataList.value.docId,
    rcvId: get_selectedDataList.value.rcvId,
    rjctCn : data
  }
  await store.API_UPDATE("/eas/reject", axiosData);
  await refresh();
}
const fn_end = async ()=>{
  await getIsReject(get_selectedDataList.value.docId)
  const data = {
    rcvId: get_selectedDataList.value.rcvId,
    docId: get_selectedDataList.value.docId,
    docTypeCd: get_selectedDataList.value.docTypeCd,
  }
  if(!isReject.value){
    if(confirm(t('10655'))){
      await store.API_UPDATE("/eas/reception", data)
    }
  }else{
   //todo alert
  }
  refresh();
}
const fn_approve = async ()=>{
  await getIsReject(get_selectedDataList.value.docId)
  // todo hashFileId Adding
  const data = {
    rcvId: get_selectedDataList.value.rcvId,
    docId: get_selectedDataList.value.docId,
    docTypeCd: get_selectedDataList.value.docTypeCd,
    hashFileId : ""
  }
  if(!isReject.value){
    await store.API_UPDATE("/eas/reception", data)
    await refresh();
  }
}
const clear =()=>{
  selectedData.value = null;
  isReceipt.value = false;
  isRejectModal.value = false;
  isApprovalModal.value = false;
  isReject.value = false;
}
const refresh = ()=>{
  getListData();
  clear()
}
const set_isReceipt = (data)=>{
  isReceipt.value = data
}
const set_isApprovalModal = (data)=>{
  isApprovalModal.value = data
}
const set_isRejectModal = (data)=>{
  isRejectModal.value = data;
}
const set_fileTab = (tabName)=>{
  fileTab.value = tabName;
}
const set_isRequestModal = (data)=>{
  isRequestModal.value = data
}
const fn_updateRequest = async (data)=>{
  //todo 정리
  let axiosData = {
    docId: get_selectedDataList.value.docId,
    docTypeCd: get_selectedDataList.value.docTypeCd,
    workCn: data.responseContent,
    tmlmtYn: data.deadline != null ? "Y" : "N" ,
    tmlmtDtm: data.deadline != null ?data.deadline+ "T00:00" : null ,
    infoYn: data.checkYn != null ? data.checkYn  : "N" ,
    workCycleCd : data.repeat,
    rcvId: get_selectedDataList.value.rcvId,
    workResponseVos: data.respondents,
    workReqId: data.workReqId || 0,
    workerId : data.mainWorker
  }
  await store.API_UPDATE("/eas/workRequest/response",axiosData)
  await refresh();
}
const fn_search = (data)=>{
  getListData(data)
}
const receptionModalOpen = ()=>{
  set_isRequestModal(true);
  requestType.value = 'reception'
}
const addWorkRequest = async (data)=>{
  //todo 정리
  let axiosData = {
    docId: get_selectedDataList.value.docId,
    docTypeCd: get_selectedDataList.value.docTypeCd,
    workCn: data.responseContent,
    tmlmtYn: data.deadline != null ? "Y" : "N" ,
    tmlmtDtm: data.deadline != null ?data.deadline+ "T00:00" : null ,
    infoYn: data.checkYn != null ? data.checkYn  : "N" ,
    workCycleCd : data.repeat,
    rcvId: get_selectedDataList.value.rcvId,
    workResponseVos: data.respondents,
    workReqId: data.workReqId || 0,
    workerId : data.mainWorker
  }
  await store.API_SAVE("/eas/workRequest/response", axiosData)
  await refresh();
}
onMounted(()=>{
  getListData();
})

</script>

<template>
  <div class="title_area">
    <TitleComp></TitleComp>
  </div>
  <div class="main_area">
    <div class="left_section">
      <LetterListComponent
          search-type="inbox"
          @fn_search="fn_search"
          @select="set_selectedData"
          :data="lists"
      ></LetterListComponent>
    </div>

    <div class="main_section">
      <LetterDetailComponent
          :data = selectedData
          :fileTab = fileTab
          @set_fileTab = set_fileTab
      ></LetterDetailComponent>
    </div>

    <div class="right_section" >
      <div class="right_top_area" v-if="selectedData">
        <div class="btn_group"> 
          <div v-if="!isReceipt && get_selectedDataList.docTypeCd === 'DMT01'">
            <button type="button" class="v_btn btn_outline_neutral btn_md" @click="receptionModalOpen">{{ t('10678') }}</button>
            <button type="button" class="v_btn btn_outline_error btn_md"  @click="set_isRejectModal">{{ t('10269') }}</button>
          </div>
          <div v-else-if="!isReceipt && get_selectedDataList.docTypeCd === 'DMT02'">
            <button type="button" class="v_btn btn_outline_neutral btn_md" @click="fn_end">{{ t('10497') }}</button>
          </div>
          <div v-else-if="!isReceipt && get_selectedDataList.docTypeCd === 'DMT03'">
            <button type="button" class="v_btn btn_outline_neutral btn_md" @click="set_isApprovalModal(true)">{{ t('10268')}}</button>
            <button type="button" class="v_btn btn_outline_error btn_md"  @click="set_isRejectModal">{{ t('10269') }}</button>
          </div>
        </div>
        <div class="recipients">
          <RecipientsComponent
              :doc-id = selectedData
          ></RecipientsComponent>
        </div>
        <div class="main_command_person">
          <MainCommandPersonComponent
              :add-yn="true"
              :rcv-id = get_selectedDataList.rcvId
          ></MainCommandPersonComponent>
        </div>
        <div class="commands">
          <CommandComponent
              :rcv-id="get_selectedDataList.rcvId"
              :add-yn="true"
              @open-request-modal="open_RequestModal"
          ></CommandComponent>
        </div>
      </div>
      <div class="right_bottom_area" v-if="selectedData && isReceipt">
        <WriteCommandComponent></WriteCommandComponent>
      </div>
    </div>
  </div>
  <approval-modal
      :isApprovalModal="isApprovalModal"
      @fn_approve="fn_approve"
      @set_isApprovalModal="set_isApprovalModal"
  ></approval-modal>
  <RequestModal
      @add_work-request-and-response="addWorkRequest"
      :type="requestType"
      @fn_updateRequest = "fn_updateRequest"
      :is-request-modal="isRequestModal"
      @set_is-request-modal="set_isRequestModal"
      @fn_reception = "fn_reception"
      :request="selectedRequest"
      :respondedUsers="respondedUsers"
      :p_main-worker="mainWorker"
  ></RequestModal>
  <RejectModal
      :is-reject-modal="isRejectModal"
      @set_isRejectModal="set_isRejectModal"
      @fn_reject="fn_reject"
  ></RejectModal>
</template>

<style scoped>
.main_area{
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  border-radius: 2rem;
  justify-content: center;
}
.left_section{
  background-color: white;
  width: 20%;
  min-width: 300px;
  height: 100%;
  border : 1px solid #DCE0E5;
}
.main_section{
  width: 50%;
  background-color: white;
  border : 1px solid #DCE0E5;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.right_section{
  width: 30%;
  min-width: 313px;
  background-color: white;
  border : 1px solid #DCE0E5;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.recipients{
  margin: 10px 0 10px 0;
}
.right_bottom_area{
  position: sticky;
  left: 5vw;
  bottom: 2vh;
}
.right_top_area{
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.title_area{
  background-color: #fff;
  border-radius: 1rem 1rem 0 0 ;
}

.left_section,
.main_section,
.right_section {
  border: 1px solid #ddd;
  box-sizing: border-box;
  resize: horizontal;
  overflow: auto;
  max-height: 80vh;
}
</style>