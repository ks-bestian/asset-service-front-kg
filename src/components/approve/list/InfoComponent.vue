<script setup>
import { useI18n } from 'vue-i18n'
import {useStore} from "@/store/index.js";
import {computed} from "vue";
const { t } = useI18n()
const store = useStore();
const props = defineProps(['data']);
const docTypeList = store.getComCodes('1022');
const docAttrbList = store.getComCodes('1023');
const langList = store.getComCodes('1024');

const getDocType = computed(()=>{
  return docTypeList.find((item)=>{
    return item.codeId === props.data.docTypeCd;
  })?.codeNm;
})

const getLangNm = computed(()=>{
  let list = props.data.docLng?.split(',');
  let docLangs = [];
  list.forEach((item)=>{
    langList.forEach((langItem)=>{
      if(item === langItem.codeId){
        docLangs.push(langItem?.codeNm);
      }
    })
  })
  return docLangs;
})

const getDocAttrbNm = computed(()=>{
  let list = props.data.docAttrbCd?.split(',');
  let docAttrbs = [];
  list.forEach((item)=>{
    docAttrbList.forEach((docAttrbItem)=>{
      if(item === docAttrbItem.codeId){
        docAttrbs.push(docAttrbItem);
      }
    })
  })
  return docAttrbs;
})

</script>

<template>
  <div class="document_info_area">
    <div class="document_top_area">
      <div class="title">
<!--        Document card-->
        {{t('10272')}}
      </div>
    </div>
    <div class="info_main_area">
      <div class="subTitle">
<!--        Document-->
        {{t('10273')}} :
      </div>
      <div>
        {{getDocType}}
      </div>
      <div class="subTitle">
<!--        Registration date-->
        {{t('10100')}} :
      </div>
      <div>{{store.formatLocalDateTime(data?.regDtm, 'dateTime')}}</div>
      <div class="subTitle">
<!--        Sender-->
        {{t('10275')}} :
      </div>
      <div>{{data?.senderNm}}</div>
      <div class="subTitle">
<!--        language-->
        {{t('10238')}} :
      </div>
      <div>
        {{getLangNm.join(',')}}
      </div>
      <div class="subTitle">
<!--        Document characteristics-->
        {{t('10276')}} :
      </div>
      <div>
        <template v-for="(da,i) in getDocAttrbNm" :key="da.codeId">
          <template v-if="i===0">
            <template v-if="da.codeId ==='DMA03' && data.billNo">{{da.codeNm}}({{data.docNo}})</template>
            <template v-else> {{da.codeNm}}</template>
          </template>
          <template v-else>
            <template v-if="da.codeId ==='DMA03' && data.billNo">, {{da.codeNm}}({{data.billNo}})</template>
            <template v-else>, {{da.codeNm}}</template>
          </template>
        </template>
      </div>
      <template v-if="data.tmlmtDtm != null" >
        <!--    deadLine    -->
        <div class="subTitle">
          {{ t('10484') }} :
        </div>
        <div>
          {{store.formatLocalDateTime(data.tmlmtDtm, 'date')}}
        </div>
      </template>

    </div>
  </div>
</template>

<style scoped>
.document_top_area{
  display: flex;
}
.title{
  font-size:1.6rem;
  font-weight: bold;
  color:#1453AE;
}
.info_main_area{
  display: grid;
  grid-template-columns: 20% 80% ;
  grid-template-rows:repeat(5, 1fr) ;
  border: 1px solid #DCE0E5;
  border-radius: 1rem;
  gap:10px;
  padding: 10px 0 10px 10px;
}
.document_info_area{
  display: flex;
  gap: 10px;
  flex-direction: column;
}
.subTitle{
  font-weight: bold;
}
</style>