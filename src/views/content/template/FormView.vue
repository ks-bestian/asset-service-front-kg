<script setup>
import FormList from './FormList.vue';
import FormDetailComp from "./FormDetailComp.vue";
import { ref } from "vue";
import TitleComp from '@/components/TitleComp.vue';

const selectedFormId = ref('');
const selectedFileNm = ref('');
const selectedPdfFileId = ref('');

const emit = defineEmits(['selectForm']);

const onSelectForm = ({ formId, fileNm, pdfFileId }) => {
  selectedFormId.value = formId;
  selectedFileNm.value = fileNm;
  selectedPdfFileId.value = pdfFileId;
};

const onFormDeleted = () => {
  selectedFormId.value = '';
  selectedFileNm.value = '';
  selectedPdfFileId.value = '';
};
</script>

<template>
  <div class="title_area">
    <TitleComp></TitleComp>
  </div>  
  <div class="main_area">
    <div class="list_section">
      <FormList 
        @selectForm="onSelectForm" 
        @formDeleted="onFormDeleted">
      </FormList>
    </div>
    <div class="doc_section">
      <FormDetailComp 
        :form-id="selectedFormId" 
        :file-nm="selectedFileNm" 
        :pdf-file-id="selectedPdfFileId">
      </FormDetailComp>
    </div> 
  </div>
</template>

<style>
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
    border-radius: 2rem;
    justify-content: space-between;
  }
  .list_section {
    background-color: white;
    border : 1px solid #DCE0E5;
    width: 55%;
    padding: 1rem;
  }
  .doc_section{
    width: 45%;
    background-color: white;
    border : 1px solid #DCE0E5;
    padding: 1rem;
  }
  .title_area{
    background-color: #fff;
    border-radius: 1rem 1rem 0 0 ;
    padding: 2.5rem;
    padding-bottom: 0;
  }

</style>
