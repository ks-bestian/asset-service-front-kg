<script setup>
import { useI18n } from 'vue-i18n'
import {onMounted,  ref, watch} from "vue";
import ApplovaledInfoDetailPopover from "@/components/modal/approve/ApplovaledInfoDetailPopover.vue"
import {useStore} from "@/store/index.js";
const { t } = useI18n()
const props = defineProps(['isRejected', 'docId'])
const store = useStore();
const approvals = ref();


const getApprovalList = ()=>{
  store.API_LIST("/eas/approval/" +props?.docId)
      .then(res => {
        approvals.value = res.data.data;
      })
}

const type = {
  "reject" : "pi-arrow-left round-red",
  "approval" : "pi-check round",
  "yet" : "round-white",
}
const getType = (data)=>{
  if(data.resOpinion != null && data.resDtm != null) return type.reject
  else if(data.resDtm != null) return type.approval
  else return type.yet
}
const isFolding = ref(true);

onMounted(()=>{
  getApprovalList()
})

watch(() => props.docId, () => {
  getApprovalList()
})
</script>

<template>
  <div>
    <!-- Payment list-->
    {{t('10270')}}
    <button type="button" @click="isFolding = !isFolding"><i class="pi" :class="{'pi-chevron-up' : isFolding, 'pi-chevron-down' : !isFolding}" style="color:#0094d3"></i></button>
  </div>
  <transition name="fade">
    <div class="approvals" v-show="isFolding">
      <template v-for="a in approvals" :key="a.apvlId">
        <div class="approval">
          <ApplovaledInfoDetailPopover
              :data = a
              :type="getType(a)"
          ></ApplovaledInfoDetailPopover>
          <div class="user_info">
            <div class="top_area">
              <div class="user_name">{{ a.userNm }}</div>
              <div>{{ store.formatLocalDateTime(a.resDtm, 'dateTime' )}}</div>
            </div>
            <div class="user_job">
              <div class="user_position">{{ a.jobCd }}</div>
              <div class="user_dept">{{ a.deptCd }}</div>
            </div>
            <div v-if="a.apvlStatusCd ==='AS05'" class="rejected_contents">
              {{a.resOpinion}}
            </div>
          </div>
        </div>
      </template>
    </div>
  </transition>
</template>

<style scoped>
.approval{
  display: flex;
  gap:10px;
  align-items: center;
  margin: 10px 0 10px 0;
}

.round-white{
  background-color: #ffffff;
  border: 4px solid #0094d3;
  width: 34px;
  height: 30px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.round-red{
  background-color: #ffffff;
  border: 4px solid #E22A21;
  width: 34px;
  height: 30px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.user_info{
  border: 1px solid #EDF4FD;
  background-color: #F6F9FD;
  width: 100%;
  padding: 0.5rem;
  min-height: 60px ;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  gap:5px;
  border-radius: 10px;
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
