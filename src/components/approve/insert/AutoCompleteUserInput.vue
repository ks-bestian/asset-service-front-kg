<script setup>
import {ref} from "vue";
import AutoComplete from "primevue/autocomplete";

const props = defineProps(['defaultUserNm', 'isReadOnly']);
const emits = defineEmits(['change_user']);
const recipients = ref();
const items = ref();

const data = ref([
  {"userNm" : "XK4544" , "userId": "XK4544"},
  {"userNm" : "QM9264" , "userId": "QM9264"},
  {"userNm" : "gduser1" , "userId": "gduser1"},
  {"userNm" : "LGRVuser1" , "userId": "LGRVuser1"},
  {"userNm" : "LGGSPLZ" , "userId": "LGGSPLZ"},
  {"userNm" : "lgexntnuser" , "userId": "lgexntnuser"},
  {"userNm" : "cmtuser1" , "userId": "cmtuser1"},
  {"userNm" : "cmtuser2" , "userId": "cmtuser2"},
  {"userNm" : "rahima" , "userId": "rahima"},
  {"userNm" : "legalactuser" , "userId": "legalactuser"},
  {"userNm" : "admin" , "userId": "admin"},
])

const searchUser = (event)=>{
  items.value = data.value.filter(d => d.userNm.includes(event.query));
}
const clearUser = ()=>{
  recipients.value = "";
}
const changeUser = ()=>{
  let data = {
    userNm : recipients.value.userNm,
    userId : recipients.value.userId,
  }
  emits("change_user", data);
}

</script>

<template>
  <AutoComplete
      :disabled="isReadOnly"
      dropdown
      fluid
      v-model="recipients"
      size="large"
      :default-value="defaultUserNm"
      :suggestions="items"
      @complete="searchUser"
      option-label="userNm"
      @change="changeUser"/>
</template>

<style scoped>

</style>