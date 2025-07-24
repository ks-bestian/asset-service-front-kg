<script setup>

import WriteCommandComponent from "@/components/approve/WriteCommandComponent.vue";
import RecipientsComponent from "@/components/approve/RecipientsComponent.vue";
import CommandComponent from "@/components/approve/CommandComponent.vue";
import CommandCompleteComponent from "@/components/approve/CommandCompleteComponent.vue";
import LetterListComponent from "@/components/approve/LetterListComponent.vue";
import LetterDetailComponent from "@/components/approve/LetterDetailComponent.vue";
import {ref} from "vue";
import ApprovalListComponent from "@/components/approve/ApprovalListComponent.vue";
import TitleComp from "@/components/TitleComp.vue";

const data = {
  icon1: "bookmark",
  icon2: "info",
  regDt: "03.04.2024 16:03",
  id : "№01-2-6508",
  type : "Мыйзам долбоор",
  name : "«Салыктык эмес кирешелер жөнүндө Кыргыз Республикасынын кодексине өзгөртүү киргизүү тууралуу» Ырастоо өтүнүчү",
  deadLine : "06.02.2024",
  color: "blue"
}

const fileTab = ref('basic');
const set_fileTab = (tabName)=>{
  fileTab.value = tabName;
}
</script>

<template>

  <!--External sentence-->
  <div class="title_area">
    <TitleComp></TitleComp>
  </div>
  <div class="main_area">
    <div class="left_section">
      <LetterListComponent></LetterListComponent>
    </div>

    <div class="main_section">
      <LetterDetailComponent
          :data = data
          :fileTab = fileTab
          @set_fileTab = set_fileTab
      ></LetterDetailComponent>
    </div>
    <div class="right_section">
      <div class="right_top_area">
        <div class="approvals">
          <ApprovalListComponent></ApprovalListComponent>
        </div>
        <div class="recipients">
          <RecipientsComponent></RecipientsComponent>
        </div>
        <div class="commands">
          <CommandComponent></CommandComponent>
        </div>
        <div class="command_complete">
          <CommandCompleteComponent></CommandCompleteComponent>
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