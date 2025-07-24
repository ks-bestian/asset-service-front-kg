<script setup>
import documentComponent from "@/components/approve/list/DocumentComponent.vue"
import infoComponent from "@/components/approve/list/InfoComponent.vue"
import peopleComponent from "@/components/approve/list/PeopleComponent.vue"
import historyComponent from "@/components/approve/list/HistoryComponent.vue"
import LinkDocumentComponent from "@/components/approve/list/LinkDocumentComponent.vue"
import router from "@/router/index.js";
import { useI18n } from 'vue-i18n'
import { computed, ref, watch } from "vue";
import { useStore } from "@/store/index.js";
const { t } = useI18n()

const store = useStore();
const props = defineProps(['data', 'fileTab'])
const emits = defineEmits(['set_fileTab'])
const docData = ref();
const tabClick = (f) => {
  emits("set_fileTab", f);
}

const goBill = (billId) => {
  window.open("/main/billMng/billSearch/billMonitorList/dtl/" + billId, '_blank');
}
const getDocData = (docId) => {

  store.API_LIST("/eas/document/" + docId)
    .then(success => {
      docData.value = success.data.data;
    })
}
const getOfficialDocument = computed(() => {
  if (docData) {
    return {
      fileType: 'EFT02',
      orgFileNm: "Official Document.pdf",
      fileId: docData.value.aarsPdfFileId,
      filePath: docData.value.aarsPdfFileId
    }
  }
})
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
watch(() => props.data, (newValue) => {
  if (newValue) {
    getDocData(newValue)
  } else {
    docData.value = null;
  }
}, { immediate: true })

</script>

<template>
  <div class="area" v-if="docData">
    <div class="main_info">
      <span class="main_type">{{ store.getCodeNm('1022', docData.docTypeCd) }}</span>
      <div class="is_digital" v-if="docData.digitalYn = 'Y'">
        {{ t('10650') }}
      </div>
      <div class="is_digital" v-else>
        {{ t('10485') }}
      </div>
      <div v-if="docData.billNo">{{ t('10292') }}:
        <span class="main_bill_id" @click="goBill(docData.billId)">{{ docData.billNo }}</span>
      </div>
    </div>
    <div class="main_sub_info">
      <span class="main_regDt">{{ t('10100') }}: {{ store.formatLocalDateTime(docData.regDtm, 'dateTime') }}</span>
      <div class="deadline" v-if="docData.tmlmtDtm">
        {{ t('10484') }}:
        <div :class="getDeadlineColor(docData.tmlmtDtm)">
          {{ store.formatLocalDateTime(docData.tmlmtDtm, "date") }}
        </div>
      </div>
    </div>

    <div class="document_title">
      {{ docData.docSubtle }}
    </div>
    <div class="tab_area">
      <div class="tab" :class="{ tab_on: fileTab === 'basic' }" @click="tabClick('basic')"><i class="pi pi-eye"></i>
      </div>
      <div class="tab" :class="{ tab_on: fileTab === 'info' }" @click="tabClick('info')"><i
          class="pi pi-info-circle"></i></div>
      <div class="tab" :class="{ tab_on: fileTab === 'users' }" @click="tabClick('users')"><i class="pi pi-users"></i>
      </div>
      <div class="tab" :class="{ tab_on: fileTab === 'history' }" @click="tabClick('history')"><i
          class="pi-history pi"></i></div>
      <div class="tab" :class="{ tab_on: fileTab === 'link' }" @click="tabClick('link')"><i class="pi-link pi"></i>
      </div>
    </div>
    <div class="tab_main">
      <!-- Change screen for each tab -->
      <div v-show="fileTab === 'basic'" class="">
        <document-component :officialDocument=getOfficialDocument :files=docData.files></document-component>
      </div>
      <div v-if="fileTab === 'info'">
        <info-component :data="docData"></info-component>
      </div>
      <div v-else-if="fileTab === 'users'">
        <people-component :docId="docData.docId"></people-component>
      </div>
      <div v-else-if="fileTab === 'history'">
        <history-component :docId="docData.docId"></history-component>
      </div>
      <div v-else-if="fileTab === 'link'">
        <link-document-component :docId="docData.docId"></link-document-component>
      </div>
    </div>
  </div>
  <div v-else class="no_data">
    {{ t('10075') }}
  </div>
</template>

<style scoped>
.is_digital {
  background-color: #EDF4FD;
  padding: 0 10px 0 10px;
  color: #1453AE;
  font-weight: 600;
  border-radius: 1rem;
  width: fit-content;
}

.main_info {
  display: flex;
  gap: 1rem;
  align-items: end;
}

.main_regDt {
  font-size: 1.2rem;
}

.main_type,
.main_id {
  color: #1453AE;
  font-weight: 700;
}

.tab_on {
  color: #0094d3;
  background-color: white;
}

.tab:hover {
  color: #0094d3;
  background-color: white;
}

.tab {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  cursor: pointer;
  min-height: 36px;
}

.document_title {
  padding: 5px;
  height: 3.2rem;
  font-weight: 600;
  font-size: 1.6rem;
}

.tab_area {
  display: flex;
  min-height: 36px;
  background-color: #EDF4FD;
  align-items: center;
}

.main_bill_id {
  color: #0094d3;
  font-weight: 600;
  cursor: pointer;
}

.area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.no_data {
  display: flex;
  justify-content: center;
  font-size: 1.5rem;
}

.main_sub_info {
  display: flex;
  gap: 1rem
}

.orange {
  background-color: orangered;
  color: white;
  padding: 0 5px 0 5px;
  border-radius: 1rem;
  font-weight: bold;
}

.red {
  background-color: red;
  color: white;
  padding: 0 5px 0 5px;
  border-radius: 1rem;
  font-weight: bold;
}

.green {
  background-color: green;
  color: white;
  padding: 0 5px 0 5px;
  border-radius: 1rem;
  font-weight: bold;
}

.deadline {
  display: flex;
  gap: 5px;
}
</style>