<script setup>
import Dialog from 'primevue/dialog';
import {ref, watch, onMounted} from "vue";
import {useI18n} from "vue-i18n";
import {useStore} from "@/store/index.js";
import  AutoComplete from 'primevue/autocomplete';
import AutoCompleteUserInput from "@/components/approve/insert/AutoCompleteUserInput.vue";

const { t } = useI18n();
const store = useStore();

const props = defineProps({
  visible: Boolean,
  rcvId: [Number, String],
  currentPerson: Object,
});

const emits = defineEmits(['update:visible', 'updated']);

const userId = ref('');
const userNm = ref('');

watch(() => props.currentPerson, (val) => {
  if (val){
    userId.value = val.userId || '';
    userNm.value = val.userNm || '';
  } else {
    userId.value = '';
    userNm.value = '';
  }
}, { immediate: true});

const save = () => {
  const data = {
    rcvId: props.rcvId,
    workerId: userId.value,
  };

  store.API_UPDATE('/eas/receivedInfo', data).then(() => {
    alert(t('10103'));
    emits('updated');
    close();
  });
}

const set_user = (user)=>{
  userId.value = user.userId;
  userNm.value = user.userNm;
}
const close = ()=>{
  emits("update:visible", false);
};

</script>

<template>
  <Dialog :visible="visible" modal :style="{width : '30vw', height: '20vh'}" @update:visible="close">
    <template #header>
      <div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
        <h2 class="popup_tit text_center">{{ t('10651')}} </h2>
      </div>
    </template>
    <div class="dialog_main_area">
      <label>{{ t('10152') }}</label>
        <AutoCompleteUserInput
            :default-user-nm = currentPerson?.userNm
            @change_user="set_user"
        ></AutoCompleteUserInput>
    </div>
    <template #footer>
      <button class="btn_md btn_primary" @click="save">{{ t('10103') }}</button>
      <button class="btn_md btn_neutral" @click="close">{{ t('10001') }}</button>
    </template>
  </Dialog>
</template>

<style scoped>
.dialog_main_area{
  height: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.mainWorker{
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.features_area{
  display: flex;
  align-items: center;
  gap: 2rem;
}
.worker_top_area{
  display: flex;
  justify-content: space-between;
}
.blue{
  font-weight: bold;
  color: #007bff;
  cursor: pointer;
}
</style>