<script setup>
import Dialog from 'primevue/dialog';
import {useI18n} from "vue-i18n";

const { t } = useI18n()
const props = defineProps(['isApprovalModal']);
const emits = defineEmits(['set_isApprovalModal', 'fn_approve']);


const close = ()=>{
  emits('set_isApprovalModal', false);
}
const insert= ()=>{
  // todo 외부연계확인해서 e-sign 거쳐오기
  emits('fn_approve', true);
  close();
}
</script>

<template>
<Dialog :visible="isApprovalModal" modal :style="{width: '25vw', height:'35vh'}" @update:visible='close'>
  <template #header>
    <div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
      <h2 class="popup_tit text_center">{{ t('10095') }} </h2>
    </div>
  </template>
  <div class="main_area">
    <div class="icon_area">
      <div class="circle_area">
        <i class="pi pi-lock lock_icon"></i>
      </div>
    </div>
    <div class="title">
      {{ t('10528') }}
    </div>
    <div class="sub_title">
      {{ t('10529') }}
    </div>
    <div class="input_area">
      <input type="password" class="form_control"  />
    </div>
  </div>
  <div class="btn_group">
    <button class="btn_md btn_primary" @click="insert()">{{ t('10268') }}</button>
    <button class="btn_md btn_neutral" @click="close()">{{ t('10001') }}</button>
  </div>

</Dialog>
</template>

<style scoped>
.circle_area{
  border: 2px solid #0094d3;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  background-color:#98CCFD ;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon_area{
  display: flex;
  justify-content: center;
  align-items: center;
}
.title{
  font-weight: bold;
  text-align: center;
}
.sub_title{
  text-align: center;
}
.main_area{
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}
.input_area{
  display: flex;
  justify-content: center;
}
.lock_icon{
  color: #ffffff;
  font-size: 4rem;
}
.btn_group{
  display: flex;
  justify-content: center;
}
</style>