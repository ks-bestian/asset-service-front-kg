<script setup>

import RecipientsComponent from "@/components/approve/RecipientsComponent.vue";
import CommandComponent from "@/components/approve/CommandComponent.vue";
import LetterListComponent from "@/components/approve/LetterListComponent.vue";
import LetterDetailComponent from "@/components/approve/LetterDetailComponent.vue";
import {onMounted, ref} from "vue";
import ApprovalListComponent from "@/components/approve/ApprovalListComponent.vue";
import TitleComp from "@/components/TitleComp.vue";
import {useStore} from "@/store/index.js";

const store = useStore();
const lists = ref();
const selectedData = ref();

const getData = (data)=>{
  store.API_LIST("/eas/document/myDocument",data)
      .then(res=>{
        lists.value = res.data.data;
      })
}
const set_selectedData =(data)=>{
  selectedData.value = data
}
const fileTab = ref('basic');
const set_fileTab = (tabName)=>{
  fileTab.value = tabName;
}

onMounted(()=>{
  getData()
})
</script>

<template>
<!--Draft-->
  <div class="title_area">
    <TitleComp></TitleComp>
  </div>
  <div class="main_area">
    <div class="left_section">
      <LetterListComponent
          @select="set_selectedData"
          :data="lists"
          @fn_search="getData"
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
        <div class="approvals">
          <ApprovalListComponent
              :doc-id="selectedData"
          ></ApprovalListComponent>
        </div>
        <div class="recipients">
          <RecipientsComponent
              :doc-id="selectedData"
          ></RecipientsComponent>
        </div>
        <div class="commands">
          <CommandComponent
              :doc-id="selectedData"
          ></CommandComponent>
        </div>
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
  margin: 10px 0px 10px 0px;
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
</style>