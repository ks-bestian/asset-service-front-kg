<script setup>
import { ref, defineProps } from 'vue';
import testform from '../mng/testform.vue';
import { formSchemas } from '@/schemas/AssetSchemas';

const props = defineProps({
  show: Boolean,
  detailDatas: Object,
  type: String
})

//(설정) 해당 필드 가져오기
const fields = ref(formSchemas.equipment.fields);
</script>


<template>
  <testform :fields="fields" v-show="show" :type="type" :detailDatas="props.detailDatas" />
</template>


<style scoped></style>