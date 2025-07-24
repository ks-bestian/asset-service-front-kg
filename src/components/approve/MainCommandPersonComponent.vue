<script setup>
import {onMounted, ref, watch} from "vue";
import {useStore} from "@/store/index.js";
import MainCommandPersonModal from "../modal/approve/MainCommandPersonModal.vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const store = useStore();
const isFolding = ref(true);
const props = defineProps(['rcvId', 'addYn']);
const emits = defineEmits(['setMainWorker'])
const data = ref();
const showModal = ref(false);
const users = ref([]);

const getMainCommandPerson = ()=>{
  store.API_LIST("/eas/receivedInfo/worker/" + props.rcvId)
      .then(res => {
        data.value = res.data.data;
        emits('setMainWorker', data.value);
      })
}

const set_mainCommandPersonModal = ()=>{
  getUsers();
  showModal.value = true;
}

const fnRefresh = () => {
  getMainCommandPerson();
};

watch(()=> props.rcvId, ()=>{
  getMainCommandPerson();
})

const getUsers = () => {
  const param = '';
  store.API_LIST('admin/user', param).then((data) => {
    users.value = data.data.data;
  }).catch(({message}) => {
    console.log(message);
  });
}
onMounted(()=>{
  getMainCommandPerson();
})
</script>

<template>
  <div v-if="data">
    <div>
      {{ t('10651') }}
      <button type="button" @click="isFolding=!isFolding">
        <i class="pi" :class="{'pi-chevron-up' : isFolding, 'pi-chevron-down' : !isFolding}" style="color:#0094d3" ></i>
      </button>
    </div>
    <div class="main_command_person_area" v-show="isFolding">
      <div class="top_area">
        <div class="person_name">
          {{data?.userNm}}
        </div>
        <div class="update_area" v-if="addYn">
          <button type="button" @click="set_mainCommandPersonModal()" v-if="addYn">{{ t('10648') }}</button>
        </div>
      </div>
      <div class="person_department_job">
        <div class="job">
          {{ data?.jobCd }}
        </div>
        <div class="department">
          {{data?.deptCd}}
        </div>
      </div>
    </div>
  </div>
  <MainCommandPersonModal 
    v-model:visible="showModal"
    :rcv-id="props.rcvId"
    :current-person="data"
    :user-list="users"
    @updated="fnRefresh"
    />
   
</template>

<style scoped>
.main_command_person_area{
  background-color: #EDF4FD;
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.person_department_job{
  display: flex;
  gap: 1rem;
}
.person_name{
  font-weight: 600;
  font-size: 1.6rem;
}
.update_area{
  color: #0094d3;
  cursor: pointer;
}
.top_area{
  display: flex;
  justify-content: space-between;
}
.job{
  border-right: 1px solid #EDF4FD;
}

</style>