<script setup>

import RecipientsComponent from "@/components/approve/RecipientsComponent.vue";
import CommandComponent from "@/components/approve/CommandComponent.vue";
import LetterListComponent from "@/components/approve/LetterListComponent.vue";
import LetterDetailComponent from "@/components/approve/LetterDetailComponent.vue";
import {computed, onMounted, ref} from "vue";
import TitleComp from "@/components/TitleComp.vue";
import MainCommandPersonComponent from "@/components/approve/MainCommandPersonComponent.vue";
import {useStore} from "@/store/index.js";
import ApplovaledInfoDetailPopover from "@/components/modal/approve/ApplovaledInfoDetailPopover.vue";
import ProcessedItemList from "@/components/approve/list/ProcessedItemList.vue";
import {useI18n} from "vue-i18n";

const store = useStore()
const { t } = useI18n()
const fileTab = ref('basic');
const selectedData = ref();
const lists = ref();
const approvals = ref();
const works = ref();
const recipients = ref();
const type = {
  "reject" : "pi-arrow-left round-red",
  "approval" : "pi-check round",
  "yet" : "round-white",
}

const getData = (data)=>{
  store.API_LIST("/eas/document/processed", data)
      .then(res=>{
        lists.value = res.data.data;
      })
}
const set_fileTab = (tabName)=>{
  fileTab.value = tabName;
}
const get_selectedDataList = computed(()=>{
  return lists.value.find(item => item.docId === selectedData.value);
})
const set_selectedData = (data)=>{
  selectedData.value = data
  clear()

  getApprovals();
  getWorks();
  getRecipients();
}
const clear = ()=>{
  approvals.value = null;
  works.value = null;
  recipients.value = null;
}
const getType = (data)=>{
  if(data ==="AS04") return type.approval
  else if(data === "AS05") return type.reject
  else return type.yet
}
const getApprovals = ()=>{
  store.API_LIST("/eas/approval/user/"+selectedData.value)
      .then(res=>{
        approvals.value = res.data.data;
      })
}
const getWorks = ()=>{
  store.API_LIST("/eas/workRequest/user/"+ selectedData.value)
      .then(res=>{
        works.value = res.data.data;
      })
}
const getRecipients = ()=>{
  store.API_LIST("/eas/receivedInfo/user/"+ selectedData.value)
      .then(res=>{
        recipients.value = res.data.data;
      })
}
onMounted(()=>{
  getData()
})
</script>

<template>
<!--Treatment completion-->
  <div class="title_area">
    <TitleComp></TitleComp>
  </div>
  <div class="main_area">
    <div class="left_section">
      <LetterListComponent
          @select="set_selectedData"
          :data="lists"
          search-type="processed"
          @fn_search = "getData"
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
      <div class="right_top_area"  >
        <template v-if="selectedData && approvals ">
          {{t('10270')}}
           <div class="approval">
             <ApplovaledInfoDetailPopover
                 :data = approvals
                 :type="getType(approvals.apvlStatusCd)"
             ></ApplovaledInfoDetailPopover>
             <div class="user_info">
               <div class="user_top_area">
                 <div class="user_name">{{ approvals.userNm }}</div>
                 <div>{{ store.formatLocalDateTime(approvals.resDtm, 'dateTime' )}}</div>
               </div>
               <div class="user_job">
                 <div class="user_position">{{ approvals.jobCd }}</div>
                 <div class="user_dept">{{ approvals.deptCd }}</div>
               </div>
               <div v-if="approvals.apvlStatusCd ==='AS05'" class="rejected_contents">
                 {{approvals.resOpinion}}
               </div>
             </div>
           </div>
        </template>
        <template v-if="selectedData && works ">
          <processed-item-list
              :data = works
          ></processed-item-list>
        </template>
        <template v-if="selectedData && recipients ">
          <div class="recipients">
            <RecipientsComponent
                :doc-id = recipients.docId
            ></RecipientsComponent>
          </div>
          <div class="main_command_person">
            <MainCommandPersonComponent
                :rcv-id="recipients.rcvId"
            ></MainCommandPersonComponent>
          </div>
          <div class="commands">
            <CommandComponent
                :rcv-id="recipients.rcvId"
            ></CommandComponent>
          </div>
        </template>

      </div>
      <div class="right_bottom_area">

      </div>
    </div>
  </div>
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
.recipients{
  margin: 10px 0 10px 0;
}
.right_bottom_area{
  display: flex;
  justify-content: space-between;
  gap: 5px;
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
.content_util{
  margin-bottom: 0;
  padding: 2rem;
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
.user_info{
  border: 1px solid #EDF4FD;
  background-color: #F6F9FD;
  width: 100%;
  padding: 0.5rem;
  min-height: 60px ;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  gap:5px;
  border-radius: 10px;
}
.user_name{
  font-weight: 600;
  font-size: 1.6rem;
}
.approval{
  display: flex;
  gap:10px;
  align-items: center;
  margin: 10px 0 10px 0;
}
.user_top_area{
  display: flex;
  justify-content: space-between;
}
</style>