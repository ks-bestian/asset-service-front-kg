<script setup>
import { useI18n } from 'vue-i18n'
import {ref, watch} from "vue";
const { t } = useI18n()

const props = defineProps(['isWrite'])
const emits = defineEmits(['fn_enterCommand','set_isWrite'])

const content = ref();
const file =ref();


const fn_register = ()=>{
  let data = {
    "content" : content.value,
    "file" : file.value
  }
  emits('fn_enterCommand', data);
  close()
}
const clear = ()=>{
  content.value = "";
  file.value = "";
}
const close = ()=>{
  emits('set_isWrite', false);
  clear();
}
const change_file = (data)=>{
   file.value = data.target.files[0];
}
const getExt = (fileName) => {
  let ext = fileName.split('.').pop();
  switch(ext) {
    case 'docx':
      return 'doc';
    case 'xlsx':
      return 'xls';
    case 'pptx':
      return 'ppt';
    default:
      return ext;
  }
}


</script>

<template>
  <div class="write_section" v-if="isWrite">
    <div class="write_area">
      <textarea rows="3" class="form_control complete_form" :placeholder="t('10488')" v-model="content"></textarea>
      <div class="button_group">
        <button type="button" class="v_btn btn_outline_neutral btn_md" @click="fn_register">{{t('10103')}}</button>
        <input type="file" class="form_file" id="inputFile" @change="change_file"/>
        <label class="v_btn btn_outline_primary btn_sm btn_file" for="inputFile">
          {{ t('10160') }}
        </label>
      </div>
    </div>
    <div class="file_area" v-if="file">
      <div>
        <template v-if="getExt(file?.name) === 'pdf'"><i class="v_ico ico_file_pdf_sm"></i></template>
        <template v-else-if="getExt(file?.name) === 'xls'"><i class="v_ico ico_file_xlsx_sm"></i></template>
        <template v-else-if="getExt(file?.name) === 'doc'"><i class="v_ico ico_file_doc_sm"></i></template>
        <template v-else-if="getExt(file?.name) === 'ppt'"><i class="v_ico ico_file_ppt_sm"></i></template>
        <template v-else-if="getExt(file?.name) === 'hwp'"><i class="v_ico ico_file_hwp_sm"></i></template>
      </div>
      <div class="file_name">
        {{file?.name}}
      </div>
    </div>

  </div>

</template>

<style scoped>
.form_file{
  display: none;
}
.button_group{
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.complete_form{
  width: 100%;
  height: 100%;
}
.write_section{
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.write_area{
  display: flex;
  justify-content: space-between;
  gap: 5px;
  background-color: white;
  width: 100%;
}
.file_area{
  display: flex;
  gap: 5px;
  background-color: white;
}
.file_area{
  display: flex;
  padding-left: 10px;
  background-color: #EDF4FD;
}
</style>