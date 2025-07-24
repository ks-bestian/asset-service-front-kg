<script setup>
  import letterDetailComponent from "@/components/approve/LetterDetailComponent.vue"
  import {ref} from "vue";
  import LetterDetailComponent from "@/components/approve/LetterDetailComponent.vue";
  import AddRecipientComponent from "@/components/approve/insert/AddRecipientComponent.vue";
  import AddDragAndDropFileComponent from "@/components/approve/insert/AddDragAndDropFileComponent.vue";
  import RejectModal from "@/components/modal/approve/RejectModal.vue";

  import router from "@/router/index.js";
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()
  const props = defineProps(['externalId'])

  const data = {
    icon1: "bookmark",
    icon2: "info",
    regDt: "03.04.2024 16:03",
    id : "№01-2-6508",
    type : "Мыйзам долбоор",
    job : "Payment request",
    name : "№ 175-ӨК тескемеси",
    deadLine : "06.02.2024",
    color: "blue"
  }
  const recipients = ref([{}]);
  const isRejectModal= ref();
  const fileTab = ref('basic');

  const features = ref();
  const type = ref();
  const hasDeadline =ref();
  const deadline = ref();
  const language = ref({
    "kg" : false,
    "ru" : false,
    "other" : false
  });
  const subTitle = ref();
  const officialDocument = ref();
  const attachDocument = ref();

  const set_isRejectModal = (data)=>{
    isRejectModal.value= data
  }
  const set_officialDocument = (data)=>{
    officialDocument.value = data
  }
  const set_attachDocument = (data)=>{
    attachDocument.value =data
  }
  const set_fileTab = (tabName)=>{
    fileTab.value = tabName;
  }
  const add_recipient = ()=>{
    recipients.value.push({});
  }
  const change_recipient = (data)=>{
    recipients.value[data.index] = {"is_external" : data.is_external , "recipient" : data.recipient, "index" : data.index, "recipientValue" : data.recipientValue}
  }
  const goBack = ()=>{
    router.push('/main/letter/external/receive')
  }
  const fn_register = ()=>{
    alert(t('10454'))
    router.push('/main/letter/external/receive')
  }
</script>

<template>
  <div class="main_area">
    <div class="left_section">
      <LetterDetailComponent
          v-if="props.externalId"
          :data = data
          :fileTab = fileTab
          @set_fileTab = set_fileTab
      ></LetterDetailComponent>
      <div v-else>
        <div>
          {{t('10271')}}
        </div>
        <div>
          <add-drag-and-drop-file-component
              :type="'official'"
              @changeFile="set_officialDocument"
          ></add-drag-and-drop-file-component>
        </div>
        <div>
          {{ t('10257') }}
        </div>
        <div>
          <add-drag-and-drop-file-component
              :type="'attach'"
              @changeFile="set_attachDocument"
          ></add-drag-and-drop-file-component>
        </div>
      </div>
    </div>
    <div class="right_section">
      <div class="feature_section">
        <div class="feature_area">
          <div>{{ t('10236') }}</div>
          <div class="features">
            <div class="check_item">
              <input type="checkbox" id="managedLetter" v-model="features" >
              <label for="managedLetter">{{ t('10239') }}</label>
            </div>
          </div>
        </div>
        <div class="type_area">
          <div>{{ t('10237') }}</div>
          <div class="check_area">
            <div class="check_item">
              <input type="radio" id="radio2" value="dmt02" v-model="type" >
              <label for="radio2">{{ t('10243') }}</label>
            </div>
            <div class="check_item">
              <input type="radio" id="radio3" value="dmt01" v-model="type" >
              <label for="radio3">{{ t('10244') }}</label>
            </div>
          </div>
          <div v-if="type && type !== 'dmt02' " class="deadline_check_area">
            <div>
              <input type="date" class="form_datepicker form_control" v-model="deadline" :disabled="hasDeadline">
            </div>
            <div class="check_item">
              <input type="checkbox" id="hasDeadline" value="dmt01" v-model="hasDeadline" >
              <label for="hasDeadline">{{t('10265')}}</label>
            </div>
          </div>
        </div>
        <div class="language_area">
          <div>{{ t('10238') }}</div>
          <div class="languages">
            <div class="check_item">
              <input type="checkbox" id="languageKg" value="Kry" v-model="language.kg" >
              <label for="languageKg">{{ t('10501') }}</label>
            </div>
            <div class="check_item">
              <input type="checkbox" id="languageRu" value="Ru" v-model="language.ru" >
              <label for="languageRu">{{t('10502')}}</label>
            </div>
            <div class="check_item">
              <input type="checkbox" id="languageOther" value="Other" v-model="language.other" >
              <label for="languageOther">{{ t('10503') }}</label>
            </div>
          </div>
        </div>
      </div>
      <div class="main_section">
        <div class="sub_title_area">
          <div class="form_label">{{ t('10249') }}</div>
          <div>
            <input type="text" class="form_control full" v-model='subTitle'/>
          </div>
        </div>
        <div class="recipient_area">
          <div class="recipient_top">
            <div>{{ t('10487') }}</div>
            <button class="text_blue" @click="add_recipient"><i class="pi pi-plus"></i> {{ t('10251') }}</button>
          </div>
          <div class="recipients">
            <add-recipient-component
                v-for="(r, i) in recipients" :key="i"
                :index="i"
                @change_recipient="change_recipient"
            ></add-recipient-component>
          </div>
        </div>
      </div>
      <div class="btn_group">
        <button class="v_btn btn_md btn_outline_primary" @click="fn_register">{{ t('10493') }}</button>
        <button class="v_btn btn_md btn_outline_neutral" @click="goBack">{{ t('10001') }}</button>
        <button class="v_btn btn_md btn_outline_error " @click="set_isRejectModal(true)">{{ t('10269') }}</button>
      </div>
    </div>
  </div>
  <RejectModal
      :isRejectModal="isRejectModal"
      @set_isRejectModal="set_isRejectModal"
  ></RejectModal>
</template>

<style scoped>
.main_area{
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
.left_section{
  background-color: #fff;
  width: 49%;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.right_section{
  width: 49%;
  border-radius: 1rem;
}
.left_section div{
  padding: 1rem;
}
.right_section div{
  padding: 0.5rem;
}
.feature_section, .main_section, .approve_section{
  margin:0 0 1rem 0 ;
  background-color: #fff;
  width: 100%;
  border-radius: 1rem;
}
.feature_section{
  display: grid;
  grid-template-columns: 25% 35% 40%;
}
.features, .deadline_check_area, .languages{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.recipients{
  display: flex;
  flex-direction:column;
  gap: 20px;
}
.recipient_top{
  display: flex;
  justify-content: space-between;
}
</style>