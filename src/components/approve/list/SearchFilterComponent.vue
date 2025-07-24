<script setup>
import {ref} from "vue";
import {useI18n} from "vue-i18n";
import {useStore} from "@/store/index.js";
const props = defineProps(['isSearchFilter', 'searchType']);

const emits = defineEmits(['set_isSearchFilter', 'addSearchItem']);

const { t } = useI18n()
const store = useStore();
const registrationFromDate = ref();
const registrationToDate = ref();
const deadline = ref();
const sender = ref();
const subTitle = ref();
const type = ref();
const letterNo = ref();
const responseFromDate = ref();
const responseToDate = ref();

const documentTypes = store.getComCodes('1022');

const close = ()=>{
  registrationFromDate.value = null;
  registrationToDate.value = null;
  deadline.value = null;
  sender.value = null;
  subTitle.value = null;
  type.value = null;
  letterNo.value = null;
  responseFromDate.value = null;
  responseToDate.value = null;
  emits('set_isSearchFilter', false);
}

const search = ()=>{
  let data = [];
  if(registrationFromDate.value && registrationToDate.value) {
    data.push({value : `${registrationFromDate.value}~${registrationToDate.value}`, codeNm : 'betweenRcvDtm'})
  }else if(registrationFromDate.value){
    data.push({value : `${registrationFromDate.value}~${registrationFromDate.value}`, codeNm : 'betweenRcvDtm'})
  }
  if(deadline.value){
    data.push({value: deadline.value , codeNm : 'tmlmtDtm'})
  }
  if(sender.value){
    data.push({value: sender.value , codeNm : 'senderNm'})
  }
  if(subTitle.value){
    data.push({value: subTitle.value, codeNm : 'docSubtle'})
  }
  if(type.value){
    data.push({value: type.value, codeNm : 'docTypeCd', typeNm: store.getCodeNm( '1022', type.value)})
  }
  if(letterNo.value){
    data.push({value : letterNo.value, codeNm: 'docNo'})
  }
  if(responseFromDate.value && responseToDate.value){
    data.push({value : `${responseFromDate.value}~${responseToDate.value}`, codeNm : 'betweenResDtm'})
  }else if(responseFromDate.value){
    data.push({value : `${responseFromDate.value}~${responseFromDate.value}`, codeNm : 'betweenResDtm'})
  }
  emits('addSearchItem', data);
  close()
}
</script>

<template>
  <div class="search_area" v-if="isSearchFilter">
    <div class="search_wrap">
      <div class="search_top_area">
        <h3 class="search_title">
          {{ t('10471') }}
        </h3>
        <div class="close_button">
          <button @click="close"><i class="pi pi-times"></i></button>
        </div>
      </div>
      <div class="filter_area">
        <!-- inbox -->
        <template v-if="searchType === 'inbox'">
          <div class="filter_item">
            <div>{{ t('10100') }}</div>
            <div>
              <input type="date" class="form_control" v-model="registrationFromDate"/>
              ~
              <input type="date" class="form_control" v-model="registrationToDate"/>
            </div>
          </div>
          <div class="filter_item">
            <div>{{ t('10484') }}</div>
            <input type="date" class="form_control" v-model="deadline"/>
          </div>
          <div class="filter_item">
            <div>{{t('10473')}}</div>
            <input type="text" class="form_control" v-model="sender" />
          </div>
        </template>
        <!-- processed -->
        <template v-if="searchType === 'processed'">
          <div class="filter_item">
            <div>{{ t('10686') }}</div>
            <div>
              <input type="date" class="form_control" v-model="responseFromDate"/>
              ~
              <input type="date" class="form_control" v-model="responseToDate"/>
            </div>
          </div>
        </template>
        <!-- addRcv -->
        <template v-if="searchType === 'addRcv'">
          <div class="filter_item">
            <div>{{ t('10687') }}</div>
            <div>
              <input type="date" class="form_control" v-model="registrationFromDate"/>
              ~
              <input type="date" class="form_control" v-model="registrationToDate"/>
            </div>
          </div>
        </template>
        <!-- basic -->
        <div class="filter_item">
          <div>{{ t('10249') }}</div>
          <input type="text" class="form_control" v-model="subTitle" />
        </div>
        <div class="filter_item">
          <div>{{ t('10090') }}</div>
          <input type="text" class="form_control" v-model="letterNo" />
        </div>
        <div class="filter_item" v-if="searchType !== 'processed'">
          <div>{{ t('10236') }}</div>
          <div class="check_area">
            <div class="check_item" v-for="d in documentTypes" :key="d.codeId">
              <input type="radio" :id="d.codeId" :value="d.codeId" v-model="type" >
              <label :for="d.codeId">{{ d.codeNm }}</label>
            </div>
          </div>
        </div>
      </div>
      <div class="search_footer">
        <button class="btn_sm btn_primary" @click="search"> <i class="pi pi-search"></i>{{ t('10053') }}</button>
        <button class="btn_sm btn_neutral" @click="close"> {{ t('10153') }}</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.search_area{
  position: absolute;
  padding: 1rem;
  z-index: 99;
}
.search_wrap{
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 450px;
  border:1px solid #DCE0E5;
  padding: 1rem;
  background-color: white;
  border-radius: 1rem;
}
.filter_area{
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.filter_item{
  display: grid;
  align-items: center;
  grid-template-columns: 25% 75%;
}
.search_top_area{
  display: flex;
  justify-content: space-between;
}
.search_footer{
  gap: 1rem;
  display: flex;
  justify-content: flex-end;
}
</style>