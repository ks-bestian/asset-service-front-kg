<script setup>
import 'primeicons/primeicons.css'
import {computed, onMounted, onUnmounted, ref} from "vue";
import AddRecipientComponent from "@/components/approve/insert/AddRecipientComponent.vue";
import AddDragAndDropFileComponent from "@/components/approve/insert/AddDragAndDropFileComponent.vue";
import AddApproveComponent from "@/components/approve/insert/AddApproveComponent.vue";
import ProgressSpinner from 'primevue/progressspinner';
import router from "@/router/index.js";
import {useAlarmStore, useStore} from "@/store/index.js";
import { useI18n } from 'vue-i18n'
import draggable from 'vuedraggable'
import axios from "@/axios";
import { v4 as uuidv4 } from 'uuid';
import {useOrgStore} from "@/store/organization.js";


const { t } = useI18n()
const store = useStore();
const orgStore = useOrgStore();
const alarmStore = useAlarmStore();
const props = defineProps(['billId', 'docId', 'rcvId', 'aarsDocId']);

/* data */
const aarsDocData = ref();
const types = ref();
const billId = ref();
const hasDeadline = ref(false);
const deadline = ref();
const file = ref([]);
const subTitle = ref();
const attributes = ref([]);
const language = ref([]);
// const recipients = ref([{ 'crId': crypto.randomUUID() }]);
// const approvals = ref([{ 'crApId': crypto.randomUUID() }]);
const recipients = ref([{ 'crId': uuidv4() }]);
const approvals = ref([{ 'crApId': uuidv4() }]);
const documentTypeList = store.getComCodes('1022');
const documentAttributeList = store.getComCodes('1023');
const documentLanguageList = store.getComCodes('1024');
const selectForm = ref(0);
const formList = ref();
const formData = ref();
const requestData = ref({});
const previewVo = ref();
const docFiles = ref();
const previewLoading = ref(false);
const editorConfig = {
  language: 'en',
  toolbar: [
    { name: 'clipboard', items: ['Undo', 'Redo'] },
    { name: 'styles', items: ['FontSize'] },
    { name: 'colors', items: ['TextColor'] },
    { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', '-', 'RemoveFormat'] },
    { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
    { name: 'insert', items: ['Table'] }
  ],
  defaultFont: 'Times New Roman',
  extraPlugins: 'font,colorbutton,justify',
  height: 300
};

/* data end */


/* function */

const getFormList = () => {
  store.API_LIST("/form")
      .then(res => {
        formList.value = res.data.data;
      })
}
const getFormDetail = () => {
  store.API_LIST("/formWithFields/detail/" + selectForm.value)
      .then(res => {
        formData.value = res.data.data;
      })
}
const createPdfViewerUrl = (pdfFileId) => {
  if (!pdfFileId) return '';

  const fileDownloadUrl = import.meta.env.VITE_FILE_DOWN_URL + '=' + pdfFileId;
  return import.meta.env.VITE_PDF_VIEWER_URL + '=' + fileDownloadUrl;
}

const getFormListPdfFileId = computed(() => {
  if (!formList.value || !selectForm.value) return '';

  const field = formList.value.find(f => f.formId === selectForm.value);
  return field?.pdfFileId || ''; // Use optional chaining

});

const add_recipient = () => {
  // recipients.value.push({ "crId": crypto.randomUUID() });
  recipients.value.push({ "crId": uuidv4() });
}
const change_recipient = (data) => {
  const current = recipients.value[data.index]
  recipients.value[data.index] = { ...current, "isExternal": data.is_external, "userId": data.userId, "userNm": data.userNm }
}
const delete_recipient = (item) => {
  recipients.value = recipients.value.filter(data => data.crId !== item)
}
const change_file = (data) => {
  file.value = data;
}
const add_approve = () => {
  // approvals.value.push({ 'crApId': crypto.randomUUID() })
  approvals.value.push({ 'crApId': uuidv4() })
}
const change_approve = (data) => {
  const current = approvals.value[data.index]
  approvals.value[data.index] = { ...current, "approval": data.approval }
}
const delete_approval = (item) => {
  approvals.value = approvals.value.filter(data => data.crApId !== item)
}
const goBack = () => {
  router.push('/main/letter/inbox')
}

const register = async () => {
  // todo 문서 연결하기

  // let docId = crypto.randomUUID()
  let docId = uuidv4()
  /** data Area **/
      //Todo 필수값 체크
  let data = {
        "docId": docId,
        "aarsDocId": previewVo.value?.aarsDocId,
        "docTypeCd": types.value,
        "docAttrbCd": attributes.value,
        "billId": billId.value,
        "tmlmtYn": hasDeadline.value && hasDeadline.value !== false ? "Y" : "N",
        "tmlmtDtm": deadline.value,
        "docLng": language.value,
        "docSubtle": subTitle.value,
        "approvalIds": approvals.value.map(a => a.approval),
        "receiverIds": recipients.value,
      }
  const formData = new FormData();
  if (file.value.length > 0) {
    formData.append('docId', docId);
    formData.append('fileType', 'EFT01');
    for (let i = 0; i < file.value.length; ++i) {
      formData.append("files", file.value[i]);
    }
  }
  /** data Area **/
  if(!previewVo.value) {
    let previewVo = await preview();
    console.log(previewVo);
    data.aarsDocId = previewVo.aarsDocId;
  }

  if (props.rcvId) {
    data.fromDocId = props.docId;
    data.rcvId = props.rcvId;
    data.alreadyUploadFiles = docFiles.value.map(f => f.fileId);
    await store.API_SAVE("/eas/document/reply", data)
    if (file.value.length > 0) {
      await store.API_SAVE_FILE("/eas/file", formData);
    }
  } else if (props.aarsDocId) {
    data.fromDocId = props.docId;
    data.alreadyUploadFiles = docFiles.value.map(f => f.fileId);
    await store.API_SAVE("/eas/document/rewrite", data)
    if (file.value.length > 0) {
      await store.API_SAVE_FILE("/eas/file", formData);
    }
  } else {
    await store.API_SAVE("/eas/document", data);
    if (file.value.length > 0) {
      await store.API_SAVE_FILE("/eas/file", formData);
    }
  }
  alert(t('10454'));
  await router.push('/main/letter/draftsInbox');
}
const preview = async() => {

  const receivers = recipients.value.map(r => r.userNm).join(', ');
  const fieldNm = formData.value.fields.find(f => f.field_type === 'FT07')?.field_value;
  if (fieldNm) {
    requestData.value = { ...requestData.value, [fieldNm]: receivers }
  }
  previewLoading.value = true;

  try{
    // store 사용시 다른 화면이 같이 멈추어 axios로 사용
    const res = await axios.post("/eas/draftDocument/" + selectForm.value, requestData.value,{ headers: { 'Content-Type': 'application/json' } })
    previewVo.value = res.data.data
    return res.data.data;
  }catch(e){
    return null;
  }finally{
    previewLoading.value = false;
  }
}

const getDocSenderInfo = () => {
  store.API_LIST("/eas/document/" + props.docId)
    .then(res => {
      recipients.value[0] = {
        // "crId": crypto.randomUUID(),
        "crId": uuidv4(),
        "isExternal": res.data.data.externalYn ? res.data.data.externalYn : "N",
        "userId": res.data.data.senderId,
        "userNm": res.data.data.senderNm
      };
    })
}
const getDocWorkResponseFiles = () => {
  store.API_LIST("/eas/file/workResponse/" + props.docId)
    .then(res => {
      docFiles.value = res.data.data;
    })
}
// Delete files already uploade
const deleteDocFile = (fileId) => {
  const index = docFiles.value.findIndex(f => f.fileId !== fileId);
  docFiles.value.splice(index, 1);
}
// Delete files this time
const deleteFile = (index) => {
  file.value.splice(index, 1);
}
const getAarsDocData = () => {
  store.API_LIST("/eas/draftDocument/" + props.aarsDocId)
    .then(res => {
      aarsDocData.value = res.data.data;
      selectForm.value = res.data.data.formId;
      getFormDetail();
      console.log(selectForm.value);
    })
}
const getDraftData = () => {
  store.API_LIST("/eas/draftData/" + props.aarsDocId)
    .then(res => {
      console.log(res.data.data)
      res.data.data.forEach(d => {
        if (d.fieldType !== 'FT07') {
          requestData.value[d.fieldValue] = d.dataCn;
        }
      })
    })
}
const getDocumentDetail = () => {
  if (props.docId == null) return;
  store.API_LIST("/eas/document/" + props.docId)
    .then(res => {
      const data = res.data.data;
      subTitle.value = data.docSubtle;
      attributes.value = data.docAttrbCd.split(',');
      billId.value = data.billId;
      types.value = data.docTypeCd;
      language.value = data.docLng.split(',');
      docFiles.value = data.files;
    })
}
/* function */
/* mounted */
onMounted(() => {
  orgStore.setOrganization();
  getFormList();
  if (props.rcvId) {
    getDocSenderInfo()
    getDocWorkResponseFiles()
    types.value = 'DMT02';
  }
  if (props.billId) {
    billId.value = props.billId;
    attributes.value = ['DMA03'];
  }
  if (props.aarsDocId) {
    getAarsDocData();
    getDraftData();
    getDocumentDetail();
  }
})
onUnmounted(() => {
  if(store.loginInfo){
    alarmStore.getAllCount();
  }
})
/* mounted */
</script>

<template>
  <div class="main_area">
    <div class="left_section">
      <div class="document_type_area">
        <div>{{ t('10235') }}</div>
        <select class="form_control full" v-model="selectForm" @change="getFormDetail">
          <option disabled hidden value="0">{{ t('10656') }}</option>
          <template v-for="list in formList" :key="list.formId">
            <option :value="list.formId">{{ list.formTitle }}</option>
          </template>
        </select>
      </div>
      <div class="document_preview_area">
        <div v-if="previewLoading" class="preview_wrap">
          <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" />
        </div>
        <template v-else>
          <div v-if="selectForm && previewVo" class="preview">
            <iframe class="iframe" :src="createPdfViewerUrl(previewVo?.aarsPdfFileId)" />
          </div>
          <div v-else-if="aarsDocData" class="preview">
            <iframe class="iframe" :src="createPdfViewerUrl(aarsDocData.aarsPdfFileId)" />
          </div>
          <div v-else-if="selectForm" class="preview">
            <iframe class="iframe" :src="createPdfViewerUrl(getFormListPdfFileId)" />
          </div>
          <div v-else-if="!selectForm">
            <div>{{ t('10657') }}</div>
          </div>
        </template>
      </div>
    </div>
    <div class="right_section">
      <div class="feature_section">
        <div class="type_area">
          <div>{{ t('10237') }}<span class="text_red">*</span></div>
          <div class="check_area">
            <template v-for="type in documentTypeList" :key="type.codeId">
              <div class="check_item">
                <input type="radio" :id="type.codeId" :value="type.codeId" v-model="types">
                <label :for="type.codeId">{{ type.codeNm }}</label>
              </div>
            </template>
          </div>
          <div v-if="types && !types.includes('DMT02')" class="deadline_check_area">
            <div>
              <input type="date" class="form_datepicker form_control" v-model="deadline" :disabled="hasDeadline">
            </div>
            <div class="check_item">
              <input type="checkbox" id="hasDeadline" v-model="hasDeadline">
              <label for="hasDeadline">{{ t('10265') }}</label>
            </div>
          </div>
        </div>
        <div class="feature_area">
          <div>{{ t('10236') }}</div>
          <div class="features">
            <template v-for="attr in documentAttributeList" :key="attr.codeId">
              <div class="check_item">
                <input type="checkbox" :id="attr.codeId" :value="attr.codeId" v-model="attributes">
                <label :for="attr.codeId">{{ attr.codeNm }}</label>
              </div>
            </template>
          </div>
          <div v-if="attributes.includes('DMA03')">
            <input type="text" class="form_control" :placeholder="t('10500')" v-model="billId">
          </div>
        </div>
        <div class="language_area">
          <div>{{ t('10238') }}</div>
          <div class="languages">
            <template v-for="lan in documentLanguageList" :key="lan.codeId">
              <div class="check_item">
                <input type="checkbox" :id="lan.codeId" :value="lan.codeId" v-model="language">
                <label :for="lan.codeId">{{ lan.codeNm }}</label>
              </div>
            </template>
          </div>
        </div>
        <div class="sub_title_area">
          <div>
            {{ t('10249') }}
            <span class="text_red">*</span>
          </div>
          <div>
            <input type="text" class="form_control full" v-model='subTitle' />
          </div>
        </div>
      </div>
      <div class="document_section">
        <template v-if="formData">
          <template v-for="field in formData.fields">
            <template v-if="field.field_type === 'FT01'">
              <!--    TEXT   -->
              <div class="common_area">
                <div class="common_top">
                  <div>{{ field.field_nm }}</div><span v-if="field.required_yn === 'Y'" class="text_red">*</span>
                </div>
                <div class="common_main">
                  <input type="text" class="form_control full" v-model='requestData[field.field_value]' />
                </div>
              </div>
            </template>
            <template v-else-if="field.field_type === 'FT02'">
              <!--    TEXTAREA   -->
              <div class="common_area">
                <div>{{ field.field_nm }}<span v-if="field.required_yn === 'Y'" class="text_red">*</span></div>
                <div>
                  <ckeditor :config="editorConfig" v-model="requestData[field.field_value]"></ckeditor>
                </div>
              </div>
            </template>
            <template v-else-if="field.field_type === 'FT03'">
              <!--    NUMBER   -->
              <div class="common_area">
                <div class="common_top">
                  <div>{{ field.field_nm }}</div><span v-if="field.required_yn === 'Y'" class="text_red">*</span>
                </div>
                <div class="common_main">
                  <input type="number" class="form_control" v-model='requestData[field.field_value]' />
                </div>
              </div>
            </template>
            <template v-else-if="field.field_type === 'FT04'">
              <!--    DATE   -->
              <div class="common_area">
                <div class="common_top">
                  <div>{{ field.field_nm }}</div><span v-if="field.required_yn === 'Y'" class="text_red">*</span>
                </div>
                <div class="common_main">
                  <input type="date" class="form_control" v-model='requestData[field.field_value]' />
                </div>
              </div>
            </template>
            <template v-else-if="field.field_type === 'FT05'">
              <!--    TIME   -->
              <div class="common_area">
                <div class="common_top">
                  <div>{{ field.field_nm }}</div><span v-if="field.required_yn === 'Y'" class="text_red">*</span>
                </div>
                <div class="common_main">
                  <input type="time" class="form_control" v-model='requestData[field.field_value]' />
                </div>
              </div>
            </template>
            <template v-else-if="field.field_type === 'FT06'">
              <!--    DATETIME   -->
              <div class="common_area">
                <div class="common_top">
                  <div>{{ field.field_nm }}</div><span v-if="field.required_yn === 'Y'" class="text_red">*</span>
                </div>
                <div class="common_main">
                  <input type="datetime-local" class="form_control" v-model='requestData[field.field_value]' />
                </div>
              </div>
            </template>
            <template v-else-if="field.field_type === 'FT07'">
              <!--    RECEIVE_USER   -->
              <div class="recipient_area">
                <div class="recipient_top">
                  <div>{{ field.field_nm }}<span v-if="field.required_yn === 'Y'" class="text_red">*</span></div>
                  <button class="text_blue" @click="add_recipient"><i class="pi pi-plus"></i> {{ t('10195') }}</button>
                </div>
                <div class="recipients">
                  <add-recipient-component
                      v-for="(r, i) in recipients"
                      :key="r.crId"
                      :user-nm="r?.userNm"
                      :index="i"
                      :id="r.crId"
                      @change_recipient="change_recipient"
                      @delete_recipient="delete_recipient"
                  ></add-recipient-component>
                </div>
              </div>
            </template>
          </template>
        </template>
      </div>
      <div class="file_section">
        <div class="file_area">
          <div>{{ t('10257') }}</div>
          <add-drag-and-drop-file-component :uploaded-files="docFiles" type="attach" @change-file="change_file"
                                            @delete-doc-file="deleteDocFile" @deleteFile="deleteFile"></add-drag-and-drop-file-component>
        </div>
      </div>
      <div class="approve_section">
        <div class="approve_top">
          <div>{{ t('10259') }}</div>
          <button class="text_blue" @click="add_approve"><i class="pi pi-plus"></i> {{ t('10260') }}</button>
        </div>

        <draggable v-model="approvals" item-key="crApId" handle=".drag">
          <template #item="{ element, index }">
            <AddApproveComponent
                :cr-ap-id="element.crApId"
                :approval="element.approval"
                :index="index"
                :length="approvals.length"
                @change_approval="change_approve"
                @delete_approval="delete_approval" />
          </template>
        </draggable>
      </div>
      <div class="btn_group">
        <button class="v_btn btn_md btn_neutral" @click="preview">{{ t('10262') }}</button>
        <button class="v_btn btn_md btn_primary" @click="register">{{ t('10493') }}</button>
        <button class="v_btn btn_md btn_neutral" @click="goBack">{{ t('10001') }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main_area {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  padding: 1rem;
  border-radius: 2rem;
  justify-content: space-between;
}

.left_section {
  background-color: #fff;
  width: 49%;
  border-radius: 1rem;
  padding: 1.5rem;
}

.right_section {
  width: 49%;
  border-radius: 1rem;
}

.left_section div {
  padding: 1rem;
}

.right_section div {
  padding: 0.5rem;
}

.document_preview_area {
  width: 100%;
  height: 85%;
  background-color: #F6F9FD;
  border-radius: 1rem;
  display: flex;
  justify-content: center;
}

.btn_group {
  display: flex;
  background-color: #ffffff;
  border-radius: 5px;
}

.feature_section,
.document_section,
.approve_section,
.file_section {
  margin: 0 0 1rem 0;
  background-color: #fff;
  width: 100%;
  border-radius: 1rem;
}

.feature_section {
  display: grid;
  grid-template-columns: 40% 30% 30%;
  grid-template-rows: 1fr 0.5fr;
  grid-template-areas: "type attribute language" "sub_title sub_title sub_title";
}

.features,
.deadline_check_area,
.languages {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.approve_top {
  display: flex;
  justify-content: space-between;
}

.text_blue {
  color: #0094d3;
}

.recipient_top {
  display: flex;
  justify-content: space-between;
}

.recipients {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.file_area {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.feature_area {
  grid-area: attribute;
}

.type_area {
  grid-area: type;
}

.language_area {
  grid-area: language;
}

.sub_title_area {
  grid-area: sub_title
}

.text_blue:hover {
  font-weight: bold;
}

.preview {
  width: 100%;
}

.iframe {
  width: 100%;
  height: 100%;
}

.common_area {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.common_top {
  display: flex;
}
.preview_wrap{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>