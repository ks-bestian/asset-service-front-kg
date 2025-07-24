<script setup>

import RecipientsComponent from "@/components/approve/RecipientsComponent.vue";
import CommandComponent from "@/components/approve/CommandComponent.vue";
import LetterListComponent from "@/components/approve/LetterListComponent.vue";
import LetterDetailComponent from "@/components/approve/LetterDetailComponent.vue";
import {computed, onMounted, ref} from "vue";
import TitleComp from "@/components/TitleComp.vue";
import { useI18n } from 'vue-i18n'
import router from "@/router/index.js";
import MainCommandPersonComponent from "@/components/approve/MainCommandPersonComponent.vue";
import {useAlarmStore, useStore} from "@/store/index.js";

const alarmStore = useAlarmStore();
const store = useStore();
const { t } = useI18n();
const lists = ref();
const selectedData = ref();
const fileTab = ref('basic');
const isRequestModal = ref(false);
const isMainWorker = computed(()=>
  store.loginInfo.userId === mainWorker.value.userId
)
const mainWorker = ref();
const set_mainWorker = (worker)=>{
  mainWorker.value = worker;
}


const getData = (data)=>{
  store.API_LIST("/eas/document/work", data)
      .then(res=>{
        lists.value = res.data.data;
      })
}
const get_selectedDataList = computed(()=>{
  return lists.value.find(item => item.docId === selectedData.value);
})
const set_fileTab = (tabName)=>{
  fileTab.value = tabName;
}
const set_selectedData = (data)=>{
  selectedData.value = data
  let list = get_selectedDataList.value;
  if(list.checkDtm == null){
    store.API_UPDATE("/eas/workResponse/"+ list.rspnsId)
        .then(()=>{
          getData();
          alarmStore.setWorkResCount();
        });
  }
};
const fn_answer = ()=>{
  router.push({
    name: 'letter.insert',
    query: {
      docId: get_selectedDataList.value.docId,
      rcvId: get_selectedDataList.value.rcvId
    }
  })

}
const set_isRequestModal = (data)=>{
  isRequestModal.value = data;
}
onMounted(()=>{
  getData();
})
</script>

<template>
<!--Waiting-->
  <div class="title_area">
    <TitleComp></TitleComp>
  </div>
  <div class="main_area">
    <div class="left_section">
      <LetterListComponent
          @Select ="set_selectedData"
          :data = "lists"
          search-type="addRcv"
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
      <div class="right_top_area" v-if="selectedData">
        <div class="btn_group">
          <button type="button" class="v_btn btn_outline_neutral btn_md" @click="fn_answer()" v-if="get_selectedDataList.docTypeCd ==='DMT01'">{{ t('10496') }}</button>
        </div>
        <div class="recipients">
          <RecipientsComponent
              :doc-id="selectedData"
          ></RecipientsComponent>
        </div>
        <div class="main_command_person">
          <MainCommandPersonComponent
              @set-main-worker="set_mainWorker"
              :rcv-id = get_selectedDataList.rcvId
          ></MainCommandPersonComponent>
        </div>
        <div class="commands">
          <CommandComponent
              :rcv-id="get_selectedDataList.rcvId"
              :add-yn="false"
          ></CommandComponent>
        </div>
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