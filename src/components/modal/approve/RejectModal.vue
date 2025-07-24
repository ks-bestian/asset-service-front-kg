<script setup>
import Dialog from "primevue/dialog";
import {useI18n} from "vue-i18n";
import {ref} from "vue";

const { t } = useI18n()
const props = defineProps(['isRejectModal']);
const emits = defineEmits(['set_isRejectModal', 'fn_reject']);
const rejectCn = ref();

const close = ()=>{
  emits('set_isRejectModal', false);
}
const insert = ()=>{
  emits('fn_reject', rejectCn.value);

  alert(t('10525'));
  close();
}
</script>

<template>
  <Dialog :visible="isRejectModal" modal :style="{width : '27vw', height: '25vh'}" @update:visible="close()">
    <template #header>
      <div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
        <h2 class="popup_tit text_center">{{ t('10269') }} </h2>
      </div>
    </template>
    <div class="main_area">
      <div>
        <textarea class="form_control full" rows="4" :placeholder="t('10488')" v-model="rejectCn"></textarea>
      </div>
    </div>
    <div class="btn_group">
      <button class="btn_md btn_primary" @click="insert()">{{ t('10269') }}</button>
      <button class="btn_md btn_neutral" @click="close()">{{t('10001')}}</button>
    </div>
  </Dialog>
</template>

<style scoped>
.main_area{
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
}
.btn_group{
  display: flex;
  justify-content: center;
}
</style>