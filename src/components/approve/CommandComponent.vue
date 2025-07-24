<script setup>
import { useI18n } from 'vue-i18n'
import {computed, onMounted, ref, watch} from "vue";
import CommandCompleteComponent from "@/components/approve/CommandCompleteComponent.vue";
import {useStore} from "@/store/index.js";
import WriteCommandComponent from "@/components/approve/WriteCommandComponent.vue";

const store = useStore();
const { t } = useI18n()

const props = defineProps(['addYn', 'rcvId', 'docId'])
const emits = defineEmits(['open-request-modal'])

const isFolding = ref(true);
const data = ref();
const workRequests = ref([]);
const workResponses = ref([]);
const clickedWorkRequest = ref();
const isWriteModal = ref(false);

const endPoint = computed(() =>
      props.docId
          ? `/eas/workRequest/document/${props.docId}`
          : `/eas/workRequest/${props.rcvId}`
);

const fn_updateUser =  (request) => {
  request.respondents =  getUsers(request.workReqId);
  emits("open-request-modal", request, 'updateWorkRequest');
};

const open_request_modal = () => {
  emits('open-request-modal', null,'add_workRequestAndResponse');
}

const clear = ()=>{
  data.value = null;
  workRequests.value = null;
  workResponses.value = null;
}
const set_isWriteModal = (value)=>{
  isWriteModal.value = value;
}

const getCommand = async()=>{
  if(endPoint.value === 'undefined') return;
  store.API_LIST(endPoint.value)
      .then(res => {
        clear();
        data.value = res.data.data;
        // Data separation processing

        if (data.value && data.value.length > 0) {
          // Work Request Data Settings (WorkRequests)

          workRequests.value = data.value.map(item => {
            const { workResponseVos, ...requestData } = item;
            return requestData;
          });

          // Working Data Settings (WorkRESPONSES)

          workResponses.value = [];
          data.value.forEach(item => {
            if (item.workResponseVos && item.workResponseVos.length > 0) {
              const responsesWithRequestId = item.workResponseVos.map(response => ({
                ...response,
                workReqId: item.workReqId
              }));
              workResponses.value = [...workResponses.value, ...responsesWithRequestId];
            }
          });
        }
      })
}
const refresh = ()=>{
  getCommand();
  clear();
}
const getUsers = (reqId) => {
  if (!data.value) return [];
  const item = data.value.find(item => item.workReqId === reqId);
  // Processes for each workrequest

  return item.workResponseVos.map(response => {
      return {
        userId: response.userId,
        userNm: response.userNm || response.userId // If there is no usernm, display userId

      };
  });
};

const getRspnsId = (workReqId)=>{
  const userId = store.loginInfo.userId;
  const list = workResponses.value.filter(item => item.workReqId === workReqId);
  return list.find(item => item.userId === userId)?.rspnsId;
}

const userClicked = (userId) => {
  console.log('User clicked:', userId);
};

const fn_clickedAnswer= (data)=>{
  let rspnsId = getRspnsId(data);
  if(rspnsId == null) {
    alert(t('10450'));
    return;
  }
  clickedWorkRequest.value = getRspnsId(data);
  isWriteModal.value = true;
}

const fn_enterCommand = async (modalData)=>{

  const formData = new FormData();
  if(modalData.file != null){
    formData.append("files", modalData.file);
    formData.append("docId", data.value[0].docId);
    formData.append('fileType', 'EFT03');
  }
  // Performance answer file
  const responseData = {
    rspnsId : clickedWorkRequest.value,
    rspnsCn : modalData.content,
    rcvId : props.rcvId,
  }
  if(modalData.file != null && modalData.file !== ''){
    await store.API_SAVE_FILE("/eas/file", formData)
        .then(res=>{
          responseData.fileNm = modalData.file.name
          responseData.fileId = res.data.data[0]
        })
  }
  await store.API_UPDATE("/eas/workResponse", responseData)
      .then(()=>{
        getCommand()
        alert(t('10647'))
      })
  await refresh();
}

const fn_delete = async (reqId)=>{
  await store.API_DELETE(`/eas/workRequest/${reqId}`);
  await refresh();
}

function getDeadlineColor(deadlineInput) {
  const today = new Date();
  const deadlineDate = new Date(deadlineInput);

  if (isNaN(deadlineDate.getTime())) {
    return null;
  }

  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);

  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 2) {
    return 'red';
  } else if (diffDays < 7) {
    return 'orange';
  } else {
    return 'green';
  }
}


watch([() => props.rcvId, () => props.docId], () => {
  getCommand();
})

onMounted(()=>{
  getCommand();
})
</script>

<template>
  <div class="command_title">
    <div>
      {{t('10478')}}
      <button type="button" @click="isFolding=!isFolding"><i class="pi" :class="{'pi-chevron-up' : isFolding, 'pi-chevron-down' : !isFolding}" style="color:#0094d3" ></i></button>
    </div>
    <div v-if="addYn">
      <button type="button" class="add_command" @click="open_request_modal"> <i class="pi pi-plus"></i> {{t('10479')}}</button>
    </div>
  </div>
  
  <div class="commands" v-show="isFolding">
    <template v-for="(d,i) in workRequests" :key="d.workReqId">
      <div class="command">
        <div class="command_top">
          <div class="command_top_left">
            <div class="command_name">
              {{t('10475')}} {{i+1}}
            </div>
            <div class="command_status" :class="{complete : d.workStatus ==='WS03'}">
              {{store.getCodeNm("1030", d.workStatus)}}
            </div>
          </div>
          <div class="command_top_right">
            <div class="command_date">
              <div>
                {{store.formatLocalDateTime(d.regDt, 'dateTime')}}
              </div>
              <div v-if="d.tmlmtDtm" class="deadline_date" :style="{color: getDeadlineColor(d.tmlmtDtm)}">
                {{ t('10484') }} :
                {{store.formatLocalDateTime(d.tmlmtDtm, 'date')}}
              </div>

            </div>
            <div class="delete_area" v-if="addYn">
              <button type="button" @click="fn_delete(d.workReqId)">{{ t('10173') }}</button>
            </div>
          </div>


        </div>
        <div class="command_detail">
          {{d.workCn}}
        </div>
        <div class="command_footer">
          <div class="command_user">
            <div>
              {{t('10483')}}:
            </div>
            <div class="user_top_area">
              <div class="user_name">
                <template v-for="(user, i) in getUsers(d.workReqId)" :key="user.userId">
                  <div v-if="i+1 === getUsers.length" class="user" @click="userClicked(user.userId)">
                    {{user.userNm}}
                  </div>
                  <div v-else  class="user" @click="userClicked(user.userId)">
                    ,  {{user.userNm}}
                  </div>
                </template>
              </div>
              <div class="command_button_area" >
                <div class="update_button" v-if="addYn">
                  <button type="button"  @click="() => fn_updateUser(d)">{{ t('10648') }}</button> 
                </div>
                <div class="register_button">
                  <!--      TODO If you can't see it already     -->
                  <button type="button" class="v_btn btn_outline_neutral btn_sm" @click="fn_clickedAnswer(d.workReqId)" v-if="!isWriteModal">{{ t('10496') }}</button>
                  <button type="button" class="v_btn btn_outline_neutral btn_sm" @click="set_isWriteModal(false)" v-if="isWriteModal">{{t('10001')}}</button>
                </div>
              </div>
            </div>
          </div>
          <div class="deadline_area" v-if="!d.tmlmtYn">
            <div>
              {{t('10484')}}:
            </div>
            <div>
              {{store.formatLocalDateTime(d.tmlmtDtm, "dateTime")}}
            </div>
          </div>
        </div>
      </div>
    </template>
    <WriteCommandComponent
        :isWrite="isWriteModal"
        @set_is-write="set_isWriteModal"
        @fn_enterCommand = "fn_enterCommand"
    ></WriteCommandComponent>
  </div>
  <CommandCompleteComponent
      :datas="workResponses"
  ></CommandCompleteComponent>
</template>

<style scoped>


.command{
  border: 1px solid #DCE0E5;
  border-radius: 1rem;
  min-width: 300px;
  min-height: 100px;
  display: flex;
  gap:10px;
  margin: 10px 0 10px 0;
  flex-direction: column;
  padding: 1rem
}
.command_status{
  background-color: #FFCB5A;
  color: #FF7415;
  border-radius: 10px;
  padding: 0 5px 0 5px ;
  height: 20px;
}
.complete{
  background-color: #08FF77;
  color: #05632F;
  border-radius: 10px;
  padding: 0 5px 0 5px ;
}
.command_top{
  display: flex;
  justify-content: space-between;
}
.command_top_left{
  display: flex;
  gap: 5px;
}
.delete_area{
  color:red;
  cursor: pointer;
}
.command_footer{
  padding:5px;
  font-size: 1.4rem;
  background-color: #EDF4FD;
  display: flex;
  flex-direction: column;
  gap: 5px;
  border-radius: 20px;
}
.add_command{
  color : #0094d3;
  font-weight: 600;
}
.command_title{
  display: flex;
  justify-content: space-between;
}
.command_name{
  font-weight: 600;
}
.command_user{
  display: flex;
  align-items: center;
  gap: 5px;
}
.deadline_area{
  display: flex;
  gap: 5px;
}
.user_name{
  display: flex;
  align-items: center;
}
.user_top_area{
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 5px;
}
.update_button{
  color: #0094d3;
  cursor: pointer;
}
.user{
  cursor: pointer;
  font-weight: 600;
}
.user:hover{
  color: #0094d3;
  font-weight: 600;
}
.command_detail{
  font-size: 1.4rem;
}
.command_button_area{
  display: flex;
  gap: 5px;
  align-items: center;
}
.command_date{
  font-size:1.2rem;
  font-weight: 400;
}
.command_top_right{
  display: flex;
  gap: 5px;
  align-items: center;
}
.deadline_date{
  font-weight: 600;
}
</style>