<script setup>
import { useI18n } from 'vue-i18n'
import {computed, onMounted, ref, watch} from "vue";
import {useStore} from "@/store/index.js";
const { t } = useI18n()
const store = useStore();
const props = defineProps(['datas' , 'index']);
const isFolding = ref(true);

const getCount = computed(() => {
  if (props.datas == null) return 0;
  return props.datas.reduce((cnt, data) => cnt + (data.rspnsDtm != null ? 1 : 0), 0);
})
const fn_downloadFile = (fileId, fileOrgNm)=>{
  store.API_FILE_DOWN(fileId, fileOrgNm);
}


</script>

<template>
  <div v-if="getCount > 0">
    {{t('10477')}}
    <button type="button" @click="isFolding=!isFolding"><i class="pi" :class="{'pi-chevron-up' : isFolding, 'pi-chevron-down' : !isFolding}" style="color:#0094d3" ></i></button>
  </div>
  <div v-show="isFolding && datas" >
    <template v-for="d in datas" >
      <div class="command_complete_area" v-if="d.rspnsDtm">
        <div class="complete_info" >
          <div class="complete_title">
            <div class="complete_date">
              {{ store.formatLocalDateTime(d.rspnsDtm, 'dateTime')}}
            </div>
            {{d.userNm}}
          </div>
          <div class="complete_detail">
            {{d.rspnsCn}}
          </div>
          <div class="complete_file" v-if="d.fileNm">
            <div class="file_name" @click="fn_downloadFile(d.fileId, d.fileNm)">
              {{d.fileNm}}
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>

</template>

<style scoped>
.command_complete_area{
  border: 1px solid #DCE0E5;
  border-radius: 1rem;
  min-width: 300px;
  min-height: 80px;
  margin: 10px 0 10px 0;
  padding: 1rem;

}
.complete_info{
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.complete_date{
  font-size:1.2rem;
  font-weight: 400;
}
.complete_title{
  display:flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  flex-direction: row-reverse;
}
.complete_file{
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: #EDF4FD;
  padding: 0.5rem;
  cursor: pointer;
}
.file_name{
  color: #0094d3;
}
.complete_detail{
  min-height: 30px;
}
.complete_title{
  font-weight: 600;
}
</style>