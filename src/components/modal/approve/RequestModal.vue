<script setup>
import Dialog from 'primevue/dialog';
import { ref, watch,computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from '@/store/index.js';
import AutoCompleteUserInput from "@/components/approve/insert/AutoCompleteUserInput.vue";

const { t } = useI18n();

const props = defineProps({
  request: Object,
  isRequestModal: Boolean,
  respondedUsers: Array,
  p_mainWorker: Object,
  type : String
});
// reception, addWorkRequest, updateWorkRequest
const emits = defineEmits(['set_isRequestModal', 'fn_reception', 'fn_updateRequest', 'add_workRequestAndResponse']);

const respondedUserIds = computed(() => props.respondedUsers?.map(u => u?.toString()) || []);
const respondents = ref([{ userId: '' }]);
const responseContent = ref('');
const checkYn = ref(false);
const repeat = ref('');
const deadline = ref(props.request?.tmlmtDtm?.slice(0, 10) || '');
// const repeatOptions = store.getComCodes('1029');
const mainWorker = ref('')


const clear = () => {
  respondents.value = [{ userId: '' }];
  responseContent.value = '';
  deadline.value = null;
  checkYn.value = false;
  repeat.value = '';
};

watch(() => props.request , (val) => {
  if (val) {
    responseContent.value = val.workCn || '';
    checkYn.value = val.infoYn === 'Y';
    repeat.value = val.workCycleCd || '';
    respondents.value = val.respondents?.length
      ? val.respondents.map(r => ({ userId: r.userId || '' }))
      : [{ userId: '' }];
    deadline.value = val.tmlmtDtm?.slice(0, 10) || '';
  } else {
    clear();
  }
} , { immediate: true });

watch(() => props.p_mainWorker, (val) => {
  mainWorker.value = val;
})
const reception = () => {
  const data = {
    mainWorker: mainWorker.value || '',
    respondents: respondents.value,
    responseContent: responseContent.value,
    deadline: deadline.value || null,
    checkYn: checkYn.value ? 'Y' : 'N',
    repeat: repeat.value,
    workReqId: props.request?.workReqId ?? 0 ,
  };
  emits('fn_reception', data);
  alert(t('10454'));
  close();
};
const addRequest = () =>{
  const data= {
    respondents: respondents.value,
    responseContent: responseContent.value,
    deadline: deadline.value || null,
    checkYn: checkYn.value ? 'Y' : 'N',
    repeat: repeat.value,
    workReqId: props.request?.workReqId ?? 0 ,
  }
  emits('add_workRequestAndResponse', data);
  alert(t('10454'));
  close();
}
const addRespondent = () => {
  respondents.value.push({ userId: '' });
};

const fnDelete = (index, userId) => {
  if (respondedUserIds.value.includes(userId?.toString())) {
    alert(t('10683'));
    return;
  }
  if (respondents.value.length > 0) {
    respondents.value.splice(index, 1);
  }
};

const close = () => {
  clear();
  emits('set_isRequestModal', false);
};

const fn_update = ()=>{
  const data = {
    respondents: respondents.value,
    responseContent: responseContent.value,
    deadline: deadline.value || null,
    checkYn: checkYn.value ? 'Y' : 'N',
    repeat: repeat.value,
    workReqId: props.request?.workReqId ?? 0 ,
  };
  emits('fn_updateRequest', data);
  alert(t('10209'));
  close();
}

const set_mainWorker = (user) => {
  mainWorker.value = user.userId;
  respondents.value[0].userId = user.userId;
}
</script>

<template>

  <Dialog :visible="isRequestModal" modal :style="{ width: '30vw', height: '43vh' }" @update:visible="close">
    <template #header>
      <div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
        <h2 class="popup_tit text_center">{{ t('10475') }}</h2>
      </div>
    </template>
    <div class="dialog_main_area">
      <div class="mainWorker" v-if="type !== 'add_workRequestAndResponse'">
        <div>{{ t('10651') }}</div>
          <auto-complete-user-input
              :default-user-nm="props?.p_mainWorker?.userNm"
              @change_user="set_mainWorker"
              :isReadOnly="!!props.p_mainWorker"
          ></auto-complete-user-input>
      </div>

      <div class="worker_top_area">
        <div>{{ t('10526') }}</div>
        <button type="button" class="blue" @click="addRespondent">+{{ t('10195') }}</button>
      </div>
      <template v-for="(r, i) in respondents" :key="i">
        <div class="responder_row">
          <AutoCompleteUserInput
              class="full"
              :default-user-nm="r.userId"
              @change_user="r.userId = $event.userId"
            />
          <i class="pi pi-trash" @click="fnDelete(i, r.userId)"></i>
        </div>
      </template>

      <div>{{ t('10477') }}</div>
      <textarea rows="3" class="form_control full" v-model="responseContent" />

      <div class="features_area">
        <div class="check_item">
          <input type="checkbox" id="checkbox1" v-model="checkYn" />
          <label for="checkbox1">{{ t('10482') }}</label>
        </div>

        <div v-if="!checkYn">
          <div>{{ t('10472') }}</div>
          <div>
            <input type="date" class="form_datepicker form_control" v-model="deadline" />
          </div>
        </div>

<!--        <div>
          <div>{{ t('10527') }}</div>
          <div>
            <select class="form_control" v-model="repeat">
              <template v-for="ro in repeatOptions" :key="ro.codeId">
                <option :value="ro.codeId">{{ ro.codeNm }}</option>
              </template>
              </select>
          </div>
        </div>-->
      </div>
    </div>

    <template #footer>
      <button class="btn_md btn_primary" @click="addRequest" v-if="type ==='add_workRequestAndResponse'">{{ t('10103') }}</button>
      <button class="btn_md btn_primary" @click="fn_update" v-else-if="type === 'updateWorkRequest'">{{ t('10157') }}</button>
      <button class="btn_md btn_primary" @click="reception" v-else-if=" type === 'reception'">{{ t('10103') }}</button>
      <button class="btn_md btn_neutral" @click="close">{{ t('10001') }}</button>
    </template>
  </Dialog>
</template>

<style scoped>
.responder_row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.delete_icon {
  background: none;
  border: none;
  color: #c00;
  cursor: pointer;
  font-size: 1.2rem;
}
</style>


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
.full{
  width: 100%;
}
</style>
