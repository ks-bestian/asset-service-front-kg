<script setup>
import { ref, defineEmits } from "vue";
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button';
import AutoCompleteUserInput from "@/components/approve/insert/AutoCompleteUserInput.vue";
const { t } = useI18n()
const props = defineProps(['index', 'crApId', 'length'])
const emits = defineEmits(['change_approval', 'delete_approval'])



const change_apvl = (user) => {
  let data = {
    "index": props.index,
    "approval": user.userId
  }
  emits('change_approval', data);
}
const fnDelete = () => {
  emits('delete_approval', props.crApId)
}
</script>

<template>
  <div class="approve">
    <div class="round" :class="{last_num: props.length === (props.index+1)}">{{ index + 1 }}</div>
    <button><i class="pi pi-arrows-alt drag"></i></button>
    <auto-complete-user-input
        class="full"
        @change_user="change_apvl"
    ></auto-complete-user-input>
    <Button icon="pi pi-trash delete_icon" variant="text" @click="fnDelete" severity="contrast"></Button>
  </div>
</template>

<style scoped>
.round {
  width: 2.4rem;
  height: 2.4rem;
  border: 1px solid black;
  border-radius: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.approve {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
}

.full {
  width: 100%;
}

.last_num {
  color: white;
  background-color: #0094D3;
  border: 1px solid #0094D3;

}
</style>