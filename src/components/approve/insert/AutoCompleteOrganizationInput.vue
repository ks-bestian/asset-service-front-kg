<script setup>
import {computed, ref, toRef} from "vue";
import {useOrgStore} from "@/store/organization.js";
import AutoComplete from "primevue/autocomplete";

const orgStore = useOrgStore();
const lang = localStorage.getItem('languageType');
const data = orgStore.getOrganizationByAble;
const getOptionLabel = computed(() => {
  if(lang === 'lng_type_1') return 'orgNameKy';
  else return 'orgNameRu';
})

const props = defineProps(['defaultOrgNm', 'isReadOnly']);
const emits = defineEmits(['change_org']);

const recipient = ref();
const items = ref();

const searchOrg = (event)=>{
  items.value = data.value.filter(d => d.orgNameKy.includes(event.query) || d.orgNameRu.includes(event.query));
}
const clear = ()=>{
  recipient.value = "";
}
const change = ()=>{
  let data = {
    orgInn : recipient.value.orgInn,
    orgNameKy : recipient.value.orgNameKy,
    orgNameRu : recipient.value.orgNameRu,
  }
  emits("change_org", data);
}
</script>

<template>
  <AutoComplete
      :disabled="isReadOnly"
      dropdown
      fluid
      v-model="recipient"
      size="large"
      :default-value="defaultOrgNm"
      :suggestions="items"
      @complete="searchOrg"
      @change="change"
      :option-label="getOptionLabel"
  ></AutoComplete>
</template>

<style scoped>

</style>