<script setup>
import { ref, defineProps, defineEmits, computed, onMounted, watch } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useStore } from "@/store";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emit = defineEmits(["close", "save"]);
const props = defineProps({
  isOpen: Boolean,
  memberList: Object,
});
const store = useStore();
const items = ref([{ deptCd: '', deptNm1: t('10066'), deptNm2: t('10066'), deptNm3: t('10066') }]);
const setPoly = ref('');
const checkedItems = ref([]);
const selectedItems = ref([]);
const deleteItems = ref([]);
const polyMemberList = ref([]);
const loginInfo = store.loginInfo;

/** Modal */
const closeModal = () => {
  emit("close"); 
};

/** Additional lawmakers */
const fnSave = () => {
  emit("save", selectedItems.value); 
}

/** Party inquiry */
const fnSearchPoly = () => {
  let params = {};
  const apiUrl = 'admin/dept';
  store.API_LIST(apiUrl, params).then((data) => {
    items.value.push(...data.data.data.filter(data => data.uprDeptCd == 'poly'));
  }).catch(({ message }) => {
    console.log("message : ", message);
  })
}

/** Political party inquiry */
const fnSearch = () => {
  let params = {};
  const apiUrl = `admin/poly/member`;
  params.polyCd = setPoly.value;
  store.API_LIST(apiUrl, params).then((data) => {
    polyMemberList.value = data.data.data.filter(member => member.memberId !== loginInfo.memberId);
  }).catch(({ message }) => {
    console.log("message : ", message);
  })
}

/** Political party */
const fnSetPoly = (item) => {
  setPoly.value = item;
}

const filteredData = computed(() => {
  if (setPoly.value === "") return polyMemberList.value;
  return polyMemberList.value.filter((item) => item.polyCd === setPoly.value);
});

/** Clinic choice */
const fnAddMember = () => {
  checkedItems.value.forEach(item => {
    if (!selectedItems.value.some(selected => (selected.proposerId != null ? selected.proposerId : selected.memberId) === (item.proposerId != null ? item.proposerId : item.memberId))) {
      selectedItems.value.push(item); 
    }
  });
  checkedItems.value = [];
};

/** Delete selection */
const fnDeleteMember = () => {
  const deleteIds = deleteItems.value.map((item) => item.proposerId != null ? item.proposerId : item.memberId);
  
  selectedItems.value = selectedItems.value.filter(
    (item) => !deleteIds.includes(item.proposerId != null ? item.proposerId : item.memberId)
  );
  
  deleteItems.value = [];
};

/** reset */
const fnInit = () => {
  fnSearchPoly();
  fnSearch();
}

onMounted(() => {
  fnInit();
})

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    setPoly.value = '';
    checkedItems.value = [];
    selectedItems.value = [];
    deleteItems.value = [];

    selectedItems.value = props.memberList;
  }
});

</script>
<template>
    <div class="layer_popup popup_inquiry1 show" id="layer_inquiry1">
      <div class="popup_inner">
        <div class="popup_header">
          <h2 class="popup_tit text_center">{{ t('10085') }}</h2><!--National Assembly inquiry by political party-->
        </div>
        <div class="popup_body">
          <div class="popup_cont">
            <div class="content_row authority_wrap">
              <div class="col_item_fit">
                <h3 class="v_tit">{{ t('10073') }}</h3><!--political party-->
                <ul class="check_list scrollable-text">
                  <li v-for="(item, index) in items">
                    <a 
                      href="javascript:void(0)" 
                      class="v_btn" 
                      :class="{ on: setPoly === item.deptCd }"  
                      @click="fnSetPoly(item.deptCd)">
                      {{ item.deptNm1 }}
                    </a>
                  </li>
                </ul>
              </div>
              <div class="col_item">
                <div class="v_table table_list type2 fixed_header">
                  <DataTable 
                      :value="filteredData"
                      scrollable
                      scrollHeight="270px"
                      style="min-height: 270px"
                      v-model:selection="checkedItems">
                      <Column field="selection" selectionMode="multiple" class="text_center"></Column>
                      <Column field="polyNm" :header="t('10073')" class="text_center"></Column>
                      <Column field="memberNmKg" :header="t('10074')" class="text_center"></Column>
                      <template #empty>
                        <div class="no_data">
                          <i class="v_ico ico_error"></i>
                          <span class="text_msg">{{ t('10075') }}</span><!--There is no data.-->
                        </div>
                      </template>
                  </DataTable>
                </div>
              </div>
            </div>
            <div class="btn_group mt_4">
              <div class="center">
                <button type="button" class="v_btn btn_text_primary" @click="fnAddMember"><span>{{ t('10087') }}</span><i class="v_ico ico_move_down_primary"></i></button><!--Selection-->
                <button type="button" class="v_btn btn_text_gray" @click="fnDeleteMember"><span>{{ t('10088') }}</span><i class="v_ico ico_move_up"></i></button><!--Selection deletion-->
              </div>
            </div>
            <div class="v_table table_list type2 fixed_header mt_4">
              <DataTable 
                  :value="selectedItems"
                  scrollable
                  scrollHeight="300px"
                  v-model:selection="deleteItems">
                  <Column field="selection" selectionMode="multiple" class="text_center"></Column>
                  <Column field="polyNm" :header="t('10073')" class="text_center"></Column><!--political party-->
                  <Column field="memberNmKg" :header="t('10074')" class="text_center"></Column><!--Parliamentary-->
                  <template #empty>
                    <div class="no_data">
                      <i class="v_ico ico_error"></i>
                      <span class="text_msg">{{ t('10075') }}</span><!--There is no data.-->
                    </div>
                  </template>
              </DataTable>
            </div>
          </div>
          <div class="popup_footer">
            <div class="btn_group">
              <button type="button" class="v_btn btn_primary btn_md" @click="fnSave">{{ t('10089') }}</button><!--check-->
              <button type="button" class="v_btn btn_outline_neutral btn_md" @click="closeModal">{{ t('10163') }}</button><!--cancellation-->
            </div>
          </div>
        </div> 
        <button type="button" class="btn btn_close_popup" @click="closeModal"><i class="v_ico ico_close_white"></i></button>
      </div>
    </div>
</template>

<style>
/* Checkbox size adjustment */
.p-checkbox {
  width: 20px !important; /* Set to the desired size */
  height: 20px !important;
}

.p-checkbox-box {
  width: 20px !important; /* Set to the desired size */
  height: 20px !important;
  font-size: 20px !important; /* Check mark size adjustment */
}

.p-checkbox-box .p-checkbox-icon {
  font-size: 86px !important;
  width: 1.2rem !important;
  height: 1.2rem !important;
  border-color: transparent !important;
  background: rgba(0, 0, 0, 0) url(@/assets/images/common/ico_checkbox_checked.png) no-repeat 50% 50% !important;
}

.scrollable-text {
  max-width: 46rem; /* The desired width setting */
  max-height: 22rem; /* Setting the desired height */
  overflow-y: scroll; /* Vertical scroll disabled */
  border: 1px solid #ccc; /* Scroll area visual distinction */
  padding: 5px;
}

.no_data {
  display: flex;
  justify-content: center; 
  align-items: center;
  flex-direction: column;
  text-align: center;
  height: 16rem; 
}

</style>
