<script setup>
import Popover from 'primevue/popover';
import {useI18n} from "vue-i18n";
import {ref} from "vue";

const { t } = useI18n()
const props= defineProps(['type' , 'color'])

const op =ref();
const toggle = (event) => {
  op.value.toggle(event);
}
// dtm = dateTime
const data = {
  userName : "Ли Бомсу",
  receivedDtm : "03.04.2024 16:03" ,
  checkDtm : "03.04.2024 16:08",
  approvalDtm : '03.04.2024 16:08',
  rejectDtm : null
}
</script>

<template>

</template>

<style scoped>
.command_status{
  background-color: #FFCB5A;
  color: #FF7415;
  border-radius: 10px;
  padding: 0 5px 0 5px ;
}
</style>