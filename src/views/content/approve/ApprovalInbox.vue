<script setup>
import LetterListComponent from "@/components/approve/LetterListComponent.vue";
import LetterDetailComponent from "@/components/approve/LetterDetailComponent.vue";
import {onMounted, ref} from "vue";
import ApprovalListComponent from "@/components/approve/ApprovalListComponent.vue";
import TitleComp from "@/components/TitleComp.vue";
import ApprovalModal from "@/components/modal/approve/ApprovalModal.vue";
import RejectModal from "@/components/modal/approve/RejectModal.vue";
import { useI18n } from 'vue-i18n'
import {useAlarmStore, useStore} from "@/store/index.js";
const store = useStore();
const { t } = useI18n()
const fileTab = ref('basic');
const alarmStore = useAlarmStore();
const isApprovalModal =ref(false);
const isRejectModal = ref(false);
const isReceipt = ref(false);
const lists = ref();
const selectedData = ref();
const isReject = ref();

const getListData = (data)=>{
  store.API_LIST("/eas/approval", data)
      .then((res)=>{;
        lists.value = res.data.data;
      })
}
const set_selectedData = (data)=>{
  selectedData.value = data
  let findData = lists.value.find(item => item.docId === data);
  let apvlId = findData.apvlId;
  let checkDtm = findData.checkDtm;
  if(checkDtm == null){
    store.API_UPDATE("/eas/approval/read/"+apvlId)
        .then(()=>{
          getListData();
          alarmStore.setApprovalCount();
        });

  }
}
const clear = ()=>{
  selectedData.value = null;
  isReceipt.value = false;
  isRejectModal.value = false;
  isApprovalModal.value = false;
  isReject.value = false;
}
const getIsReject = (docId)=>{
  store.API_LIST("/eas/reject/" + docId)
      .then((res)=>{
        isReject.value = res.data.data;
      })
}
const fn_approve = async()=> {
  let docId = selectedData.value;
  let findData = lists.value.find(item => item.docId === docId);
  let apvlId = findData.apvlId;
  let data = {
    apvlId: apvlId,
    docId: docId,
    apvlType: findData.apvlType,
  }
  await getIsReject(docId);
  if (!isReject.value) {
    await store.API_UPDATE("/eas/approval/approve", data)
  } else {
    alert(t('10654'))
  }
  await getListData();
  await clear();
}

const fn_reject = async(resOpinion)=>{
  let docId= selectedData.value;
  let findData = lists.value.find(item => item.docId === docId);
  let apvlId = findData.apvlId;
  await getIsReject(docId);
  let data =  {
    resOpinion : resOpinion,
    apvlId: apvlId,
    docId: docId,
  }
  if(!isReject.value){
    await store.API_UPDATE("/eas/approval/reject", data);
  }else{
    alert(t('10654'))
  }
  await getListData()
  await clear();
}
const set_isReceipt = (data)=>{
  isReceipt.value =data
}
const set_isRejectModal = (data)=>{
  isRejectModal.value = data;
}
const set_fileTab = (tabName)=>{
  fileTab.value = tabName;
}

const set_isApprovalModal = (data)=>{
  isApprovalModal.value = data
}

onMounted(()=>{
  getListData()
})

</script>

<template>
<!--Waiting for payment-->
  <div class="title_area">
    <TitleComp></TitleComp>
  </div>
  <div class="main_area">
  <div class="left_section">
    <LetterListComponent
        @select="set_selectedData"
        :data = lists
        search-type="addRcv"
        @fn_search="getListData"
    ></LetterListComponent>
  </div>
  <div class="main_section">
    <LetterDetailComponent
        :data = selectedData
        :fileTab = fileTab
        @set_fileTab = set_fileTab
    ></LetterDetailComponent>
  </div>
  <div class="right_section">
    <div class="right_top_area" v-if="selectedData">
      <div class="btn_group">
        <button type="button" class="v_btn btn_outline_primary btn_md" @click="set_isApprovalModal(true)" v-if="!isReceipt">{{ t('10268')}}</button>
        <button type="button" class="v_btn btn_outline_error btn_md" @click="set_isRejectModal(true)" v-if="!isReceipt">{{t('10269')}}</button>
      </div>
      <div class="approvals">
        <ApprovalListComponent
            :doc-id="selectedData"
        ></ApprovalListComponent>
      </div>

    </div>
    <div class="right_bottom_area">

    </div>
  </div>
</div>
<ApprovalModal
    :isApprovalModal="isApprovalModal"
    @set_isApprovalModal="set_isApprovalModal"
    @fn_approve="fn_approve"
></ApprovalModal>
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
  min-width:450px;
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
.right_bottom_area{
  display: flex;
  justify-content: space-between;
  gap: 5px;
}
.right_top_area{
  display: flex;
  flex-direction: column;
  gap: 2rem;
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