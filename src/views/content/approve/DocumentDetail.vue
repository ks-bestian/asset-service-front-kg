<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import LetterDetailComponent from '@/components/approve/LetterDetailComponent.vue';
import Dialog from 'primevue/dialog';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const props = defineProps({
    dialog: Boolean,
    docId: String
})
const emit = defineEmits(['close'])
const route = useRoute();
const visible = ref(props.dialog);
const docId = route.query.docId;

const fileTab = ref('basic');

const set_fileTab = (tabName) => {
    fileTab.value = tabName;
}




</script>

<template>
  <div class="popup_wrap">
    <div class="popup_layer">
      <LetterDetailComponent :file-tab="fileTab" :modal-doc-id="docId" :data="docId"  @set_fileTab=set_fileTab
                             :modal="true" />
    </div>
  </div>


</template>

<style scoped>
.popup_wrap{
  display: flex;
  align-content: center;
  justify-content: center;
}
.popup_layer {
  width: 800px;
    background-color: white;
    padding: 50px;
    min-height: 100vh;
}
</style>