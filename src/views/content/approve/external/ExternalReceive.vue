<script setup>
import { ref } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {useRouter} from "vue-router";
import TitleComp from "@/components/TitleComp.vue";

import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const openModal = ref(false);
const data = ref([
  {
    icon1: "bookmark",
    icon2: "info",
    regDt: "03.04.2024 16:03",
    id : "№01-2-6508",
    type : "Мыйзам долбоор",
    job : "Payment request",
    name : "№ 175-ӨК тескемеси",
    deadLine : "06.02.2024",
    color: "blue"
  },
  {
    icon1: "bookmark",
    icon2: "info",
    regDt: "03.04.2024 16:04",
    id : "12-2621",
    type : "bill",
    job : "check",
    name : "2026 Budget review matter",
    deadLine : "07.02.2024",
  },
  {
    icon1: "bookmark_on",
    icon2: "info",
    regDt: "03.04.2024 16:05",
    id : "12-2622",
    type : "Budget and settlement",
    job : "Check budget and balance",
    name : "2021 Budget review matter",
    deadLine : "08.02.2024",
  }
])

const clickedStar = ()=>{
  console.log("Star");
}
const set_searchArea = ()=>{
  console.log("set_searchArea")
}
const getData = ()=>{

}
const fn_search =()=>{

}
const fn_reset = ()=>{

}
const fn_detail = (data)=>{
  console.log(data)
  router.push({
    name:'external.insert',
    params : {
      'externalId' : data
    }
  })
}
const router = useRouter();
const insert = ()=>{
  router.push({
    name:'external.insert'
  })
}
</script>

<template>
  <div class="content_inner">
    <TitleComp/>
    <!-- Main area -->
    <div>
      <div class="board_search type2">
        <div class="search_title">
          {{t('10053')}}
          <button class="v_btn btn_xs"><i class="v_ico ico_chevron_down_gray" @click="set_searchArea"></i></button>
        </div>
        <div class="search_inner">
          <div class="search_area">
            <!--5 lines -->
            <div class="search_one">
              <div class="search_one_title">{{t('10100')}}</div>
              <div>
                <input type="date" class="form_control"/>
                -
                <input type="date" class="form_control"/>
              </div>
            </div>
            <div class="search_one">
              <div class="search_one_title">{{t('10472')}}</div>
              <input type="date" class="form_control full"/>
            </div>
            <div class="search_one">
              <div class="search_one_title">{{t('10049')}}</div>
              <input type="text" class="form_control full">
            </div>
            <!--2nd line -->
            <div class="search_one">
              <div class="search_one_title">{{ t('10490') }}</div>
              <input type="text" class="form_control full">
            </div>
            <div class="search_one">
              <div class="search_one_title">{{t('10237')}}</div>
              <div class="check_area">
                <div class="check_item">
                  <input type="checkbox" id="checkbox1" >
                  <label for="checkbox1">{{ t('10239') }}</label>
                </div>
                <div class="check_item">
                  <input type="checkbox" id="checkbox2">
                  <label for="checkbox2">{{ t('10243') }}</label>
                </div>
                <div class="check_item">
                  <input type="checkbox" id="checkbox4">
                  <label for="checkbox4">{{ t('10491') }}</label>
                </div>
              </div>
            </div>
          </div>
          <div class="button_area">
            <button type="button" @click="fn_search" class="v_btn btn_md btn_outline_neutral search_button"><i class="v_ico ico_search"></i><span class="search_button_title">{{t('10053')}}</span></button>
            <button type="button" @clcick="fn_reset" class="v_btn btn_md btn_outline_neutral"><span>{{ t('10492') }}</span></button>
          </div>
        </div>
      </div>
      <div class="board_info" style="margin-top: 2rem;">
        <div class="left">
          <div class="board_title">{{t('10093')}}</div>
          <div class="total_num">Total <span class="text_primary">13</span></div>
        </div>
        <div class="right">
          <div class="btn_wrap">
            <button class="v_btn btn_md btn_outline_neutral" @click="insert">{{ t('10493') }}</button>
          </div>
        </div>
      </div>
      <div class="v_table table_list">
        <DataTable :value="data" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem;"
                   paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                   @row-click="fn_detail(1)"
        >
          <Column field="icon2" style="width:2.5%;">
            <template #body="slotProps">
              <i :class="'v_ico ico_error'"></i>
            </template>
          </Column>
          <Column field="regDt" :header="t('10494')" style="width: 10%; text-align: center" sortable ></Column>
          <Column field="id" :header="t('10090')" style="width: 8%;" sortable >
            <template #body="slotProps">
              <div>{{slotProps.data.id}}</div>
              <div>{{slotProps.data.type}}</div>
            </template>
          </Column>
          <Column field="name" :header="t('10412')" sortable ></Column>
          <Column field="deadLine" :header="t('10484')" style="width: 8%;" sortable >
            <template #body="slotProps">
              <div>{{slotProps.data.deadLine}}</div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
    <!-- // Main area -->
  </div>
</template>

<style scoped>
.board_search{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;
}
.search_title{
  font-size: 1.6rem;
  font-weight : 600;
}
.search_inner{
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.button_area{
  display:flex;
  flex-direction: column;
}
.button_area button{
  margin: 5px;
}
.search_button_title{
  font-weight : 600;
  color: #0094D3;
}
.board_title{
  font-size: 1.6rem;
  font-weight : 600;
}
.search_area{
  width: 100%;
  display:grid;
  grid-template-columns: repeat(5,1fr);
  //grid-template-rows: repeat(2, 1fr) ;
  grid-gap: 10px;
}
.search_one_title{
  color:#C7C7C7;
}
</style>
