<script setup>
import { ref , defineEmits} from "vue";
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button';
import AutoCompleteUserInput from "@/components/approve/insert/AutoCompleteUserInput.vue";
import AutoCompleteOrganizationInput from "@/components/approve/insert/AutoCompleteOrganizationInput.vue";

  const { t } = useI18n()
  const props = defineProps(['index', 'userNm', 'id']);
  const emits = defineEmits(['change_recipient', 'delete_recipient'])
  const is_external =ref(false);

  const set_isExternal = (data)=>{
    is_external.value = data;
  }
  const changeRecipient = (result)=>{
    let data = {
      "userNm" : result.userNm,
      "index" : props.index,
      "is_external" : is_external.value ?"Y" :"N",
      "userId" : result.userId,
    }
    emits('change_recipient', data);
  }

  const fnDeleteRcv = () => {
    emits('delete_recipient', props.id);
  }
  const changeOrganization = (result)=>{

  }

</script>

<template>
  <div class="recipient">
    <div class="recipient_tab_area" style="display: flex;">
      <button @click="set_isExternal(false)" :class="{tab_on : !is_external}">{{t('10252')}}</button>
      <button @click="set_isExternal(true)" :class="{tab_on : is_external}">{{t('10253')}}</button>

      <Button icon="pi pi-trash" variant="text" style="margin-left: auto" @click="fnDeleteRcv" severity="contrast"></Button>
    </div>

    <div v-if="!is_external">
      {{t('10254')}}
      <auto-complete-user-input
          @change_user="changeRecipient"
          :default-user-nm="userNm"
      ></auto-complete-user-input>
    </div>
    <div v-else>
      {{t('10464')}}
      <auto-complete-organization-input
          @change_org="changeOrganization"
          :default-org-nm="userNm"
      ></auto-complete-organization-input>
    </div>
  </div>

</template>

<style scoped>
.tab_on {
  color: #0094d3;
  border-bottom : 1px solid #F6F9FD;
}
.recipient_tab_area{
  display: flex;
  min-width: 8rem;
  gap: 1rem;
}
.recipient_tab_area button {
  font-size: 1.5rem
}
.recipient_tab_area button:hover{
  font-weight: bold;
}
.recipient{
  border : 1px solid #DCE0E5;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding:1rem;
}
.top_area{
  display: flex;
  justify-content: space-between;
}
.text_blue:hover{
  font-weight: bold;
}
</style>