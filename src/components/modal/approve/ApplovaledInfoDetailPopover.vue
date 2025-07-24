<script setup>
import Popover from 'primevue/popover';
import {useI18n} from "vue-i18n";
import {ref} from "vue";
import {useStore} from "@/store/index.js";

const { t } = useI18n()
const props= defineProps(['type' , 'color', 'data'])
const store = useStore();

const op =ref();
const toggle = (event) => {
  op.value.toggle(event);
}



</script>

<template>
  <div @click="toggle"><i class="pi" :class="type" ></i> </div>
  <Popover ref="op">
    <div :style="{width: '15vw'}">
      <div class="popup_header" style="width: 100%; border-top-left-radius: 12px; padding: 5px;">
        <h4 class="popup_tit text_center">{{data.userNm}}</h4>
      </div>
      <div class="received_main_area">
        <div class="received_one" v-if="data.rcvDtm">
          <div class="circle">
            <i class="pi pi-check" style="color: white"></i>
          </div>
          <div class="date_time">
            {{store.formatLocalDateTime(data.rcvDtm, 'dateTime')}}
          </div>
          <div class="title">
            {{t('10348')}}
          </div>
        </div>
        <div class="received_one" v-if="data.checkDtm">
          <div class="circle">
            <i class="pi pi-check" style="color: white"></i>
          </div>
          <div class="date_time">
            {{ store.formatLocalDateTime(data.checkDtm, 'dateTime')}}
          </div>
          <div class="title">
            {{t('10563')}}
          </div>
        </div>
        <div class="received_one" v-if="data.resDtm && data.resOpinion == null">
          <div class="circle">
            <i class="pi pi-check" style="color: white"></i>
          </div>
          <div class="date_time">
            {{store.formatLocalDateTime(data.resDtm, 'dateTime')}}
          </div>
          <div class="title">
            {{t('10268')}}
          </div>
        </div>
        <div class="received_one" v-if="data.resDtm && data.resOpinion != null">
          <div class="circle">
            <i class="pi pi-check" style="color: white"></i>
          </div>
          <div class="date_time">
            {{store.formatLocalDateTime(data.resDtm, 'dateTime')}}
          </div>
          <div class="title">
            {{t('10269')}}
          </div>
        </div>
        <div class="no_data" v-if="!data.rcvDtm && !data.checkDtm && !data.resDtm ">
          {{t('10075')}}
        </div>
      </div>
    </div>
  </Popover>
</template>

<style scoped>
.received_main_area{
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
}
.received_one{
  display: flex;
  align-items: center;
  gap: 1rem;
}
.circle{
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0094d3;
  border-radius: 10rem;
  width: 26px;
  height: 26px;
}
.title {
  font-weight: bold;
}
.pi-check{
  color: white;
}
.round{
  background-color: #0094d3;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor:pointer
}
.round-white{
  background-color: #ffffff;
  border: 4px solid #0094d3;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor:pointer
}
.round-red{
  color: #E22A21;
  background-color: #ffffff;
  border: 4px solid #E22A21;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor:pointer
}
.no_data {
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>