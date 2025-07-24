<script setup>
import { ref, defineEmits, onMounted, defineExpose } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useStore } from "@/store";
import Dialog from 'primevue/dialog';
import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { FormField } from '@primevue/forms';

const store = useStore();
const emit = defineEmits(["sendList"]);

const polyItems = ref([]);
const deptList = ref([]);
const checkedItems = ref([]);
const selectedItemsRef = ref([]);
const deleteItems = ref([]);
const lang = localStorage.getItem("languageType");
const serachPolyCd = ref('');
const searchNm = ref('');
const visible = ref(false);
const tables = ref([]);
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const fnOpen = () => {
    visible.value = true;
    selectedItemsRef.value = [];
};

const fnClose = () => {
  visible.value = false;
};

const fnSendList = () => {

  if(!fnValidate()) {
    return;
  }

  for(let i = selectedItemsRef.value.length - 1; i >= 0; --i) {
    if(selectedItemsRef.value[i].isNew) {
      const {polyNm, memberNm, atdtPosition} = selectedItemsRef.value[i];
      if(!memberNm) {
        selectedItemsRef.value.splice(i, 1);
        continue;
      }
      else {
        selectedItemsRef.value[i].memberId = `${polyNm}_${memberNm}_${atdtPosition}`;  
      }
    }
  }
  emit('sendList', selectedItemsRef.value);
  visible.value = false;
}

const fnAddMember = () => {
  selectedItemsRef.value = [...new Map([...selectedItemsRef.value, ...checkedItems.value].map(item => [item.memberId, item])).values()];
  checkedItems.value = [];
};

const fnDeleteMember = () => {

  const deleteIds = deleteItems.value.map((item) => item.memberId);
  selectedItemsRef.value = selectedItemsRef.value.filter(
    (item) => !deleteIds.includes(item.memberId)
  );
  deleteItems.value = [];
};

const fnGetDeptList = () => {

    let params = {};
    params.lang = lang;
    const apiUrl = `/bill/mtng/from/dept`;
    store.API_LIST(apiUrl, params).then((data) => {
      deptList.value = data.data.data;
      polyItems.value = [{deptCd:'', deptNm: t('10066')}, ...deptList.value.filter(item => item.uprDeptCd === 'poly')];
      fnGetMemberList();
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

const fnGetMemberList = () => {

    let params = {};
    params.lang = lang;
    params.polyCd = serachPolyCd.value;
    params.memberNm = searchNm.value;
    const apiUrl = `/bill/mtng/from/member`;
    store.API_LIST(apiUrl, params).then((data) => {
      tables.value = data.data.data;
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

const fnAddRow = () => {
  const newIndex = selectedItemsRef.value.length + 1; 
  selectedItemsRef.value.push({
    atdtDivCd: null,
    polyNm: '',
    deptNm: '',
    memberNm: '',
    memberId: 'newMember_' + newIndex, 
    atdtKind: 'ATT03',
    atdtPosition: '',
    isNew: true
  });
};

const fnValidate = () => {
	const {errors} = resolver();
	return Object.keys(errors).length === 0;
}

const resolver = () => {
  const errors = {};

  for (let i = 0; i < selectedItemsRef.value.length; i++) {
    if (selectedItemsRef.value[i].isNew) {
      const { polyNm, memberNm, atdtPosition } = selectedItemsRef.value[i];
      if ((polyNm || atdtPosition) && !memberNm) {
        errors[`memberNm${i}`] = [{ message: 'required.' }];
      }
    }
  }

  return {
    errors
  };
};

onMounted(() => {
  fnGetDeptList();
})

defineExpose({ fnOpen });

</script>
<template>
  <Dialog v-model:visible="visible" modal :style="{ width: '90vw', height: '90vh'}" @hide="fnClose">
    <!-- Layer pop -up -->
    <template #header>
      <div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
        <h2 class="popup_tit text_center">{{ t('10194') }}</h2><!--Participant inquiry-->
      </div>
    </template>
      <div class="popup_inner">
        <div class="popup_body">
          <Form v-slot="$form" :resolver="resolver">
            <div class="popup_cont">
              <div class="content_row authority_wrap" style="gap: 0rem; width: 95%;">
                <div class="col_item  col_6">
                  <div class="v_box">

                    <div class="board_search mb_4">
                        <div class="search_inner">
                            <div class="form_row">
                                <div class="input_item col_12">
                                  <label class="form_label">{{ t('10073') }}</label><!--political party-->
                                  <select class="form_control" v-model="serachPolyCd" @change="fnGetMemberList">
                                    <option v-for="item in polyItems" :value="item.deptCd">{{ item.deptNm }}</option>
                                  </select>
                                </div>
                            </div>
                            <div class="form_row">
                                <div class="input_item col_12">
                                    <label class="form_label">{{ t('10152') }}</label><!--name-->
                                    <input type="text" class="form_control"  v-model="searchNm" @keyup.enter="fnGetMemberList">
                                </div>
                            </div>
                        </div>
                        <div class="search_btn">
                            <button type="button" class="v_btn btn_primary btn_sm" @click="fnGetMemberList"><i class="v_ico ico_search_white"></i>{{ t('10053') }}</button>
                        </div>
                    </div>
                    <div class="v_table table_list type2 fixed_header">
                      <DataTable 
                          content_row 
                          :value="tables"
                          scrollable
                          scrollHeight="390px"
                          style="min-height: 390px"
                          v-model:selection="checkedItems">
                          <Column field="selection" selectionMode="multiple" class="text_center" style="width: 10%;"></Column>
                          <Column field="polyNm" :header="t('10073')" class="text_center" style="width: 25%;"></Column>
                          <Column field="memberNm" :header="t('10152')" class="text_center"></Column>
                          <template #empty>
                            <div class="no_data" style="min-height: 31rem;">
                              <i class="v_ico ico_error"></i>
                              <span class="text_msg">{{ t('10075') }}</span>
                            </div>
                          </template>
                      </DataTable>
                    </div>
                  </div>
                </div>
                <div class="col_item buttons-column col_0" style="margin-left: 2rem;margin-right: 2rem;">
                    <button type="button" class="v_btn btn_text_primary" @click="fnAddMember"><i class="v_ico ico_move_down_primary  rotate-90"></i></button>
                    <button type="button" class="v_btn btn_text_gray" @click="fnDeleteMember"><i class="v_ico ico_move_up  rotate-90"></i></button>
                </div>
                <div class="col_item col_6">
                  <div class="v_box" style="display: flex; flex-direction: column;">
                    <button type="button" class="v_btn btn_primary btn_md" @click="fnAddRow" style="margin-left: auto; margin-bottom: 1rem;">{{ t('10195') }}</button><!--addition-->
                    <div class="v_table table_list type2 fixed_header">
                      <DataTable 
                          :value="selectedItemsRef"
                          scrollable
                          scrollHeight="500px"
                          style="min-height: 460px"
                          v-model:selection="deleteItems">
                          <Column field="selection" selectionMode="multiple" class="text_center" style="width: 10%;"></Column>
                          <Column field="polyNm" :header="`${t('10073')}(${t('10634')})`" class="text_center">
                            <template #body="slotProps">
                              <div v-if="slotProps.data.isNew">
                                <FormField v-slot="$field" :name="`polyNm${slotProps.index}`" initialValue="" style="flex-grow: 1;">
                                  <InputText type="text" v-model="slotProps.data.polyNm" size="large" class="form_control" />
                                  <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
                                </FormField>
                              </div>
                              <div v-else>
                                {{ slotProps.data.polyNm }}
                              </div>
                            </template>
                          </Column>
                          <Column field="memberNm" :header="t('10152')" class="text_center">
                            <template #body="slotProps">
                              <div v-if="slotProps.data.isNew">
                                <FormField v-slot="$field" :name="`memberNm${slotProps.index}`" initialValue="" style="flex-grow: 1;">
                                  <InputText type="text" v-model="slotProps.data.memberNm" size="large" class="form_control" />
                                  <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
                                </FormField>
                              </div>
                              <div v-else>
                                {{ slotProps.data.memberNm }}
                              </div>
                            </template>
                          </Column>
                          <Column field="atdtPosition" :header="t('10635')" class="text_center">
                            <template #body="slotProps">
                              <div v-if="slotProps.data.isNew">
                                <FormField v-slot="$field" :name="`atdtPosition${slotProps.index}`" initialValue="" style="flex-grow: 1;">
                                  <InputText type="text" v-model="slotProps.data.atdtPosition" size="large" class="form_control" />
                                  <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
                                </FormField>
                              </div>
                              <div v-else>
                                {{ slotProps.data.atdtPosition }}
                              </div>
                            </template>
                          </Column>
                          <template #empty>
                            <div class="no_data" style="min-height: 47rem;">
                              <i class="v_ico ico_error"></i>
                              <span class="text_msg">{{ t('10075') }}</span><!--There is no data.-->
                            </div>
                          </template>
                      </DataTable>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="popup_footer">
              <div class="btn_group">
                <button type="sutmit" class="v_btn btn_primary btn_md" @click="fnSendList">{{ t('10089') }}</button><!--check-->
                <button type="button" class="v_btn btn_outline_neutral btn_md" @click="fnClose">{{ t('10163') }}</button> <!--cancellation-->
              </div>
            </div>
          </Form>
        </div>
      </div>
  </Dialog>  
</template>

<style scoped>
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
.no_data {
    display: flex; /* Flex box use */
    justify-content: center; /* Horizontal */
    align-items: center;
    flex-direction: column;
}
.scrollable-text {
  max-width: 46rem; /* The desired width setting */
  max-height: 22rem; /* Setting the desired height */
  overflow-y: scroll; /* Vertical scroll disabled */
  border: 1px solid #ccc; /* Scroll area visual distinction */
  padding: 5px;
}
.text-ellipsis {
  white-space: nowrap; /* Keep in one line */
  overflow-x: hidden; /* Hidden */
  text-overflow: ellipsis; /* Speech shortness (...) */
  max-width: 44rem; /* The desired width setting */
}

.buttons-column {
    display: flex;
    flex-direction: column; /* Vertical alignment */
    gap: 10px; /* Add button spacing */
    align-items: center; /* Central alignment (optional) */
    margin: auto;
}
.col_0 {
  -webkit-box-flex: 0 !important;
      -ms-flex: 0 0 3% !important;
          flex: 0 0 3% !important;
  max-width: 3% !important;
}

.rotate-90 {
    transform: rotate(-90deg); /* 90 degrees rotation */
    display: inline-block; /* Rotation */
}
</style>
