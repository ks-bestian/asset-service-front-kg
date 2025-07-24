<script setup>
import {computed, onMounted, ref, watch} from "vue";
import { useI18n } from 'vue-i18n'
import {useStore} from "@/store/index.js";
const { t } = useI18n()
const store = useStore();
const props = defineProps(['docId']);
const historyList = ref();
const getData = ()=>{
  store.API_LIST("/eas/history/" + props.docId)
      .then(res=>{
        historyList.value = res.data.data;
      })
}

const groupedData = computed(()=>{
  return historyList.value?.reduce((grouped, item) => {
    const date = item.actDtm.split(' ')[0];
    const formattedDate = formatDate(date);
    if (!grouped[formattedDate]) {
      grouped[formattedDate] = [];
    }
    grouped[formattedDate].push(item);
    return grouped;
  }, {});
})

const formatDate = (dateStr) => {
  const [year, month, day] = dateStr.split("T")[0].split("-");
  return `${day}.${month}.${year}`;
};
onMounted(()=>{
  getData()
})
watch(()=> props.docId, ()=>{
  getData()
})
</script>

<template>
  <div class="title">
<!--    History of document-->
    {{t('10278')}}
  </div>
  <div class="history_area">
    <template v-for="(items, data) in groupedData" :key="historyList">
      <div class="date">{{ data }}</div>
      <div v-for="(item, index) in items" :key="index" class="history">
        <div class="time">{{item.actDtm?.split("T")[1].split(".")[0]}}</div>
        <div><span class="user_name"></span>{{item.actDetail}}</div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.title{
  font-size:1.6rem;
  font-weight: bold;
  color:#1453AE;
  height: 30px;
}
.date{
  background-color: #DCE0E5;
  color: #3B4044;
  padding: 5px;
  width: fit-content;
  border-radius: 1rem;
}
.time{
  font-weight: bold;
  padding: 5px;
}
.history{
  display: flex;
  gap: 20px;
  height: 40px;
  align-items: center;
  border-bottom: 1px solid #DCE0E5;
}
.history_area{
  display: flex;
  flex-direction: column;
  gap:5px;
}
.user_name{
  color: #0094d3;
  font-weight: bold;
  cursor:pointer;
}
</style>