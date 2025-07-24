<script setup>
import { computed, ref, defineEmits, defineProps, onMounted } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useStore } from "@/store";
import TreeSelect from 'primevue/treeselect';
import Dialog from 'primevue/dialog';
import { useI18n } from "vue-i18n";

const {t} = useI18n();
const props = defineProps({
  modalShow: Boolean
})
const store = useStore();
const selectTab = ref('member')
const selectUsers = ref([])
const searchNm = ref('')
const userList = ref([])
const deptList = ref([])
const polyList = ref([])
const polyCd = ref('')
const deptCd = ref({})
const visible = ref(props.modalShow)

const emit = defineEmits(['close', 'rcvs'])

const fnTab = (val) => {
  selectTab.value = val;
  deptCd.value = '';
  polyCd.value = '';
  fnSearchUser();
}

const fnAddRcv = () => {
  emit('rcvs', selectUsers.value)
}

const fnSearchUser = () => {
  let param = {
    searchNm: searchNm.value,
    lang: localStorage.getItem('languageType'),
    polyCd: polyCd.value,
    deptCd: Object.keys(deptCd.value)[0]
  }
  store.API_LIST('myPage/msg/user', param).then((data) => {
    userList.value = data.data.data
  }).catch(({ message }) => {
    console.log(message)
  })
}

const filteredData = computed(() => {
  return userList.value.filter((item) => item.type === selectTab.value)
})

const fnGetData = () => {
  let param = {
    lang: localStorage.getItem('languageType'),
    searchYn: false
  }

  store.API_LIST('admin/dept/tree', param).then((data) => {
    deptList.value = data.data.data
  }).catch(({ message }) => {
    console.log(message)
  })
}

/** Party inquiry */
const fnSearchPoly = () => {
  let params = { lang: localStorage.getItem('languageType') };
  const apiUrl = 'admin/dept';
  store.API_LIST(apiUrl, params).then((data) => {
    polyList.value.push(...data.data.data.filter(data => data.uprDeptCd == 'poly'));
  }).catch(({ message }) => {
    console.log("message : ", message);
  })
}


onMounted(() => {
  fnGetData();
  fnSearchUser();
  fnSearchPoly();
})

</script>
<template>


  <Dialog v-model:visible="visible" modal :style="{ width: '45vw', height: '60vh' }" @hide="emit('close')">
    <template #header>
      <div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
        <h2 class="popup_tit">{{ t('10343') }}</h2>
      </div>
    </template>

    <div class="flex items-center gap-4 mb-4">
      <div class="popup_inner">
        <div class="popup_body">
          <div class="popup_cont">
            <div class="form_col type4 mb_2">
              <nav class="tab_menu type2">
                <ul class="tab_list">
                  <li class="on"><a href="javascript:void(0)" @click="fnTab('member')">{{ t('10344') }}</a></li>
                  <li><a href="javascript:void(0)" @click="fnTab('user')">{{ t('10345') }}</a></li>
                </ul>
              </nav>

              <div class="board_search">
                <div class="search_inner">
                  <div class="form_row">
                    <div class="input_item">
                      <label class="form_label">{{ t('10152') }}</label>
                      <input type="text" class="form_control" :placeholder="t('10146')" v-model="searchNm"
                        @keydown.enter="fnSearchUser">
                    </div>

                    <div class="input_item" v-if="selectTab === 'member'">
                      <label class="form_label">{{ t('10073') }}</label>
                      <select class="form_control" v-model="polyCd">
                        <option disabled value="">{{ t('10224') }}</option>
                        <option v-for="(item, i) in polyList" :key="i" :value="item.deptCd">{{ item.deptNm }}</option>
                      </select>
                      <td>
                      </td>
                    </div>

                    <div class="input_item" v-else>
                      <label class="form_label">{{ t('10347') }}</label>
                      <TreeSelect :options="deptList" :placeholder="t('10224')" selectionMode="single"
                        v-model="deptCd" class="form_control" style="width: 300px;" />
                    </div>
                  </div>
                </div>
                <div class="search_btn">
                  <button type="button" class="v_btn btn_primary btn_sm" @click="fnSearchUser"><i
                      class="v_ico ico_search_white"></i><span>{{ t('10053') }}</span></button>
                </div>
              </div>

              <div class="v_table table_list mb_1" v-if="selectTab === 'member'">
                <DataTable :value="filteredData" scrollable scrollHeight="33vh" v-model:selection="selectUsers"
                  style="height: 33vh;" data-key="userId">
                  <Column field="selection" selection-mode="multiple" style="width: 5%;" class="text_center"></Column>
                  <Column field="userNm" :header="t('10152')" style="width: 30%;" class="text_center">
                    <template #body="slotProps">
                      {{ slotProps.data.userNm + "(" + slotProps.data.userId + ")" }}
                    </template>
                  </Column>
                  <Column field="polyNm" :header="t('10346')" style="width: 60%;" class="text_center"></Column>
                  <template #empty>
                    <div class="no_data" style="border-bottom: none; height: 11rem;">
                      <i class="v_ico ico_error"></i>
                      <span class="text_msg">{{ t('10075') }}</span>
                    </div>
                  </template>
                </DataTable>
              </div>

              <div class="v_table table_list mb_1" v-else>
                <DataTable :value="filteredData" scrollable style="height: 33vh" data-key="userId" scrollHeight="33vh"
                  v-model:selection="selectUsers">
                  <Column field="selection" selection-mode="multiple" style="width: 5%;" class="text_center"></Column>
                  <Column field="userNm" :header="t('10152')" style="width: 30%;" class="text_center">
                    <template #body="slotProps">
                      {{ slotProps.data.userNm + "(" + slotProps.data.userId + ")" }}
                    </template>
                  </Column>
                  <Column field="jobNm" :header="t('10361')" style="width: 60%;" class="text_center"></Column>
                  <template #empty>
                    <div class="no_data" style="border-bottom: none; height: 11rem;">
                      <i class="v_ico ico_error"></i>
                      <span class="text_msg">{{t('10075')}}</span>
                    </div>
                  </template>
                </DataTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="popup_footer">
      <div class="btn_group">
        <button type="button" class="v_btn btn_primary btn_md" @click="fnAddRcv">{{ t('10089') }}</button>
        <button type="button" class="v_btn btn_outline_primary btn_md" @clicsk="emit('close')">{{ t('10001') }}</button>
      </div>
    </div>
  </Dialog>
</template>

<style>
.no_data {
  display: flex;
  /* Flex box use */
  justify-content: center;
  /* Horizontal */
  align-items: center;
  flex-direction: column;
  height: 16rem;
}
</style>
