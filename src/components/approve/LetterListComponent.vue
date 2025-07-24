<script setup>
import { ref, watch} from "vue";
import SearchFilter from "@/components/approve/list/SearchFilterComponent.vue";
import { useI18n } from 'vue-i18n'
import {useStore} from "@/store/index.js";
const { t } = useI18n()
const store = useStore();
const searchContent = ref();
const props = defineProps(['data', 'totalCount', 'searchType'])
const emits = defineEmits(['select', 'fn_search'])
const selectedId = ref();

const lists = ref([]);
const searchItem = ref([]);
const isSearchFilter = ref(false);

const isEmergency = (docAttrbCd)=>{
  if(docAttrbCd !== null){
    let listAttribute = docAttrbCd?.split(',');
    return listAttribute.includes('DMA01')
  }
}

const addSearchItem = (data)=>{
  if(data && data.length){
    for(let i=0 ; i<data.length; i++){
      const index = searchItem.value.findIndex(sr => sr.codeNm == data[i].codeNm);

      if(index === -1){
        searchItem.value.push(data[i]);
      }else{
        searchItem.value[index] = data[i];
      }

    }
  }
  fn_search();
}
const deleteSearchItem = (id) => {
  const index = searchItem.value.findIndex(sr => sr.value == id);
  if (index !== -1) {
    searchItem.value.splice(index, 1);
  }
  fn_search();
}
const set_isSearchFilter= (data)=>{
  isSearchFilter.value = data
}

const fn_select = (data)=>{
  selectedId.value = data;
  emits('select', data);
}

const fn_search = ()=>{
  const data = {
    searchContent: searchContent.value ?searchContent.value : null ,
  }
  if(searchItem.value.length > 0 ){
    for(let item of searchItem.value){
      data[item.codeNm] = item.value;
    }
  }
  emits('fn_search', data);
}

watch(()=> props.data, ()=>{
  lists.value = props.data;
})
</script>

<template>
  <div class="search_area">
    <div class="search_form">
      <button type="button" @click="fn_search"><i class="v_ico ico_search"></i></button>
      <input class="search_input" type="text" :placeholder="t('10053')" v-model="searchContent" />
      <button type="button" @click="set_isSearchFilter(!isSearchFilter)"><i class="pi pi-filter-fill" :class="{'pi-filter' : !isSearchFilter}" style="color: #0094d3"></i></button>
    </div>
    <SearchFilter
        @addSearchItem="addSearchItem"
        :is-search-filter="isSearchFilter"
        @set_isSearchFilter="set_isSearchFilter"
        :search-type = "searchType"
    ></SearchFilter>
    <div class="search_results">
      <div class="search_result" v-for="sr in searchItem">
        {{sr?.typeNm ? sr.typeNm :sr.value}}
        <button type="button" @click="deleteSearchItem(sr.value)"><i class="v_ico ico_delete"></i></button>
      </div>
    </div>
  </div>
  <div class="list_area">
    <div class="lists">
      <template v-if="lists.length !== 0">
        <template v-for="list in lists" :key="list.docId">
          <div class="list"
               :class="[{ read: list.checkDtm != null }, { on: list.docId === selectedId }]"
               @click="fn_select(list.docId)">
            <div class="list_header">
              <i class="pi pi-circle-fill emergency" v-if="isEmergency(list.docAttrbCd)"></i>
              {{list.docSubtle}}
            </div>
            <div class="list_main">
              {{t('10275')}}: <span>{{list.senderNm}}</span>
            </div>
            <div class="list_footer">
              <div v-if="list.rcvDtm">{{store.formatLocalDateTime(list.rcvDtm, 'dateTime')}}</div>
              <div v-else-if="list.resDtm">{{store.formatLocalDateTime(list.resDtm, 'dateTime')}}</div>
              <div v-if="list.docNo">№{{list.docNo}}</div>
            </div>
          </div>
        </template>
      </template>
      <template v-else>
        <div class="no_data">
          {{ t('10075') }}
        </div>
      </template>
    </div>
  </div>

</template>

<style scoped>
.search_form{
  width: 100%;
  border-bottom: 1px solid #DCE0E5;
  background-color: white;
  display: flex;
  align-items: center;
  padding: 1rem;
  height: 55px;
}
.search_input{
  border: none;
  width: 100%;
  height: 24px;
  padding: 5px;
}
.search_input:focus{
  outline: none;
}
.search_results{
  width: 100%;
  display: flex;
  padding: 1rem;
  background-color: #f3f5f6 ;
  gap: 1rem;
  flex-wrap: wrap;
}
.search_result{
  background-color: white;
  padding: 0 0.5rem  0 0.5rem;
  border: 1px solid #DCE0E5;
  border-radius: 4rem;
}
.list_area{
  height: 85%;
  border: 1px solid #DCE0E5;
}
.list{
  padding: 0.5rem;
  border-bottom: 1px solid #DCE0E5;
  cursor:pointer;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.lists{
  height: 100%;
  overflow-y: scroll;
}
.read{
  background-color: #EAF9FF;
}
.on{
  background-color: #A4E1FB;
  cursor: default;
}
.list_footer{
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
}
.list_header{
  font-weight: bold;
}
.list:hover {
  background-color: #A4E1FB;
}
.emergency{
  color: red;
  font-size: 0.5rem;
  display: flex;
  flex-direction: column;
}
</style>