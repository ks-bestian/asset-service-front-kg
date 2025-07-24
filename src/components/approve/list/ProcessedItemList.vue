<script setup>
import {onMounted, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import {useStore} from "@/store/index.js";
import CommandCompleteComponent from "@/components/approve/CommandCompleteComponent.vue";

const store = useStore();
const { t } = useI18n()
const props =defineProps(['data']);
const isFolding = ref(true);

const workResponses = ref();
const getWorkResponses = ()=>{
  workResponses.value = props.data?.workResponseVos;
}

onMounted(()=>{
  if(props.data == null) return;
  getWorkResponses();
})
watch(()=> props.data, ()=>{
  getWorkResponses();
})
</script>

<template>
  <div>
    {{ t('10652') }}
    <button type="button" @click="isFolding=!isFolding"><i class="pi" :class="{'pi-chevron-up' : isFolding, 'pi-chevron-down' : !isFolding}" style="color:#0094d3" ></i></button>
  </div>
  <div v-if="isFolding">
    <div class="command_area">
      <div class="command_top">
        <div class="command_title">
          {{data.regUserNm}}
        </div>
        <div class="command_date">
          <div class="reg_date">
            {{store.formatLocalDateTime(data.regDt, 'dateTime')}}
          </div>
          <div class="tmlmt_date" v-if="data.tmlmtDtm">
            {{ t('10484') }} :
            {{store.formatLocalDateTime(data.tmlmtDtm, 'date')}}
          </div>
        </div>
      </div>
      <div class="command_detail">
        {{data.workCn}}
      </div>
    </div>
    <div class="command_complete_area">
      <CommandCompleteComponent
          :datas="workResponses"
      ></CommandCompleteComponent>
    </div>
  </div>
</template>

<style scoped>
.command_area{
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
.command_top{
  display: flex;
  justify-content: space-between;
}
.command_title{
  font-size: 1.4rem;
  font-weight: 600;
}
.command_date{
  font-size: 1.2rem;
  color: #8E8E8E;
}
</style>