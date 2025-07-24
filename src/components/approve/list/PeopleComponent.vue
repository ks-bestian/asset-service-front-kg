<script setup>
import {onMounted,  ref, watch} from "vue";
import { useI18n } from 'vue-i18n'
import {useStore} from "@/store/index.js";
const { t } = useI18n()
const store = useStore();
const props = defineProps(['docId']);
const peoples = ref();
const getPeoples = ()=>{
  store.API_LIST("/eas/document/user/" + props.docId)
      .then(res=>{
        peoples.value = res.data.data;
      })
}
onMounted(()=>{
 getPeoples()
})
watch(()=> props.docId, ()=>{
  getPeoples()
})
</script>

<template>
  <div class="people_list_area">
    <div>{{ t('10469') }}</div>

    <div class="user_department_title_area">
      <div class="title">{{t('10045')}}</div>
      <div><i class="pi pi-chevron-up" style="color: #1453AE"></i></div>
    </div>
    <div class="users_area" v-if = "peoples">
      <template v-for="d in peoples" :key="d.userNm">
        <span class="user" v-if="d.userStatus">{{d.userNm}}</span>
        <span class="user  deactivate" v-else>{{t('10470')}} - {{d.userNm}}</span>
      </template>

    </div>
  </div>
</template>

<style scoped>
.title{
  font-size:1.6rem;
  font-weight: bold;
  color:#1453AE;
}
.user_department_title_area{
  display: flex;
  gap: 10px;
}
.people_list_area{
  display: flex;
  flex-direction: column;
  gap:10px;
}
.users_area{
  width: 100%;
  border: 1px solid #DCE0E5;
  padding:10px;
  display: flex;
  gap:10px;
  flex-wrap: wrap;
  border-radius: 1rem;
}
.user{
  border: 1px solid #DCE0E5;
  padding : 5px;
  border-radius: 1rem;
}
.deactivate{
  background-color: #CA4141;
  color : #ffffff;
}
</style>