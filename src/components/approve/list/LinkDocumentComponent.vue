<script setup>
import {onMounted, ref, watch} from "vue";

import { useI18n } from 'vue-i18n'
import { useStore } from "@/store/index.js";
import DocumentDetail from "@/views/content/approve/DocumentDetail.vue";

const dialog = ref(false);
const { t } = useI18n()
const store = useStore();
const data = ref();
const count = ref(0);
const props = defineProps(['docId'])
const add_linkDocument = () => {

}
const getData = () => {
  store.API_LIST("/eas/linkDocument/" + props.docId)
    .then(res => {
      data.value = res.data.data;
      count.value = res.data.data.length;
    })
}

const fn_go = (docId) => {
  window.open(`/letter/modal?docId=${docId}`, "_blank", "width=900, height=1200, left=1000, top=50");
}


onMounted(() => {
  getData()
})
watch(()=> props.docId, ()=>{
  getData()
})
</script>

<template>
  <div class="link_document_are">
    <div class="link_document_top_area">
      <div class="title">{{ t('10466') }} - {{ count }}</div>
      <div class="add_link_document" @click="add_linkDocument"><i class="pi pi-plus"></i> {{ t('10467') }}</div>
    </div>
    <div class="link_document_main_area">

      <div class="documents" v-for="d in data" :key="d.linkId" @click="fn_go(d.linkedDocId)">
        {{ d.docSubtle }}
      </div>
      <div v-if="count === 0">
        {{ t('10468') }}
      </div>
    </div>
    <DocumentDetail v-if="dialog" :dialog="dialog" @close="dialog=false" :docId="props.docId"/>
  </div>
</template>

<style scoped>
.title {
  font-size: 1.6rem;
  font-weight: bold;
  color: #1453AE;
}

.link_document_top_area {
  display: flex;
  justify-content: space-between;
  padding: 0 10px 0 10px;
}

.link_document_are {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.add_link_document {
  color: #0094d3;
  font-weight: 600;
  cursor: pointer;
}

.link_document_main_area {
  border: 1px solid #DCE0E5;
  padding: 1rem;
  border-radius: 1rem;
}

.link_document_main_area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.documents {
  cursor: pointer;
}

.documents:hover {
  color: #0094d3;
}
</style>