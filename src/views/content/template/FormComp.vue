<script setup>
import { ref, defineProps, watch, defineEmits } from 'vue';
import {useI18n} from "vue-i18n";

const { t } = useI18n();
const props = defineProps({
    form: Object
});
const localForm = ref({});
const uploadedFile = ref(null); 
const isDragOver = ref(false);

const emit = defineEmits(['update-form']);

watch(() => props.form, (newVal) => {
  localForm.value = {...newVal };
  if (newVal?.file_nm) {
    uploadedFile.value = { name: newVal.file_nm};
  }
  }, {immediate: true});

const emitForm = () => {
    emit('update-form', getFormData());
};

const getFormData = () => ({
    ...localForm.value,
    uploadedFile: uploadedFile.value
});

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        localForm.value.file_nm = file.name;
        uploadedFile.value = file;
        emitForm();
    }
}

//drag and drop
const onDrop = (e) => {
  const files = e.dataTransfer.files;
  if(files.length > 0) {
    localForm.value.file_nm = files[0].name;
    uploadedFile.value = files[0];
    emitForm();
  }
  isDragOver.value = false;
}
const onDragOver = () => {
  isDragOver.value = true;
}
const onDragLeave = () =>{
  isDragOver.value = false;
}

defineExpose({
  getFormData,
  emitForm
});
</script>

<template>
    <div class="popup_cont"> 
        <div class="form_col type4 mb_3" style="overflow: hidden;">
            <div class="input_item">
                <div class="round-white"></div>
                <label class="form_label">{{t('10414')}}</label>
                <input type="text" v-model="localForm.form_title" 
                  class="form_control" 
                  :placeholder="t('10146')" 
                  :readonly="!!localForm.form_id"/>
            </div>
            <div class="input_item">
                <div class="round-white"></div>
                <label class="form_label">{{ t('10531') }}</label>
                <textarea rows="4" 
                  v-model="localForm.form_cn" 
                  class="form_control" 
                  :placeholder="t('10146')" 
                  :readonly="!!localForm.form_id">
                </textarea>
            </div>
            <div class="input_item"> 
                <div class="round-white"></div>
                <label class="form_label">{{ t('10160') }}</label>
                <div class="file_add_area" 
                  :class="{ dragover: isDragOver }"
                  @dragover.prevent="onDragOver"
                  @dragleave="onDragLeave"
                  @drop.prevent="onDrop"
                  >
                  <div v-if="uploadedFile" 
                    class="uploaded_file_name">
                    {{ uploadedFile.name }}
                    <input type="file" class="form_file" id="formFile" @change="handleFileUpload" hidden/>
                  </div>
                  <div v-else>{{ t('10504') }} 
                    <input type="file" class="form_file" id="formFile" @change="handleFileUpload" hidden/>
                  </div>
                  <div>
                    <label class="v_btn btn_lg btn_outline_secondary" for="formFile">
                      {{ t('10463') }} <i class="v_ico ico_upload_secondary"></i>
                    </label>
                  </div>
                </div>
            </div>
            <div class="input_item" >
                <div class="round-white"></div>
                <span class="form_label">{{ t('10195') }}</span> 
                <button type="button" class="v_btn btn_primary btn_md" @click="$emit('add-row')">{{ t('10195') }}</button> 
            </div>
        </div>
    </div>
</template>

<style>
.round-white{
  background-color: #ffffff;
  border: 4px solid #0094d3;
  width: 15px;
  height: 15px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1rem;
}

.left{
    display: flex;
    align-items: center ;
}
.row-title {
  max-width: 15rem;
  margin-right: 1.9rem;
  font-weight: 500;
}

.file_add_area {
  width: 90%;
  border: 3px #0094d3 dotted;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}
.form_file {
  visibility: hidden;
}

.v_btn.btn_lg {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}
.files {
  display: flex;
  background-color: #F3F5F6;
  flex-direction: column;
  gap: 10px;
  padding: 5px;
}
.file_area {
  border-radius: 20px;
  background-color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
}
.delete_icon {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.uploaded_file_name {
  margin-top: 0.5rem;
  margin-left: 1rem;
  font-weight: 500;
  color: #333;
}
.file_add_area.dragover { 
  background-color: aliceblue;
  border-color: solid cornflowerblue 3px;
}

</style>
