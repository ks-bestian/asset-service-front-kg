<script setup>
import { useI18n } from 'vue-i18n'
import {onMounted, ref, watch} from "vue";
import ReceivedInfoDetailPopover from "@/components/modal/approve/ReceivedInfoDetailPopover.vue";
import {useStore} from "@/store/index.js";

const { t } = useI18n()
const store = useStore();
const emits = defineEmits([])
const isFolding = ref(true);
const props = defineProps(['docId'])
const lists = ref();
const getData = ()=>{
  store.API_LIST("/eas/receivedInfo/" + props?.docId)
      .then(res=>{
        lists.value = res.data.data;
      })
}

const type = {
  "reject" : "pi-arrow-left round-red",
  "reception" : "pi-check round",
  "yet" : "round-white",
}
const getType = (data)=>{
  if(data.rcpDtm != null) return type.reception
  else if(data.rjctDtm != null) return type.reject
  else return type.yet
}
onMounted(()=>{
  getData();
})

watch(()=> props.docId, ()=>{
  getData()
})

</script>

<template>
  <div>
    {{t('10487')}}
    <button type="button" @click="isFolding=!isFolding"><i class="pi" :class="{'pi-chevron-up' : isFolding, 'pi-chevron-down' : !isFolding}" style="color:#0094d3" ></i></button>
  </div>
  <div class="recipients" v-show="isFolding">
    <template v-for="rcv in lists" :key="lists.rcvId">
      <div class="recipient" v-if="rcv.status !== 'RS00'">
        <ReceivedInfoDetailPopover
            :type="getType(rcv)"
            :data = rcv
        ></ReceivedInfoDetailPopover>
        <div class="user_info">
          <div class="top_area">
            <div class="user_name">{{rcv.userNm}}</div>
            <div v-if ='rcv.rcvStatus  === "RS03"' >{{store.formatLocalDateTime(rcv.rcvDtm, 'dateTime')}}</div>
            <div v-else-if='rcv.rcvStatus  === "RS04" '>{{store.formatLocalDateTime(rcv.rjctDtm, 'dateTime')}}</div>
          </div>
          <div class="user_job">
            <div class="user_position">
              {{rcv.jobCd}}
            </div>
            <div class="user_dept">
              {{rcv.deptCd}}
            </div>
          </div>
          <div class="rejected_contents" v-if="rcv.rjctDtm">
            {{rcv.rjctCn}}
          </div>
        </div>
      </div>
    </template>
  </div>

</template>

<style scoped>
.recipient{
  display: flex;
  gap:10px;
  align-items: center;
  margin: 10px 0 10px 0;
}

.user_info{
  border: 1px solid #EDF4FD;
  background-color: #F6F9FD;
  border-radius: 10px;
  width: 100%;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.user_name{
  font-weight: 600;
  font-size: 1.6rem;
}
.user_position{
  padding-right: 0.5rem
}
.user_job{
  display: flex;
}
.top_area{
  display: flex;
  justify-content: space-between;
}
.rejected_contents{
  font-weight: 600;
}

</style>