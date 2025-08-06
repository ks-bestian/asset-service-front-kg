<script setup>
import {  defineProps, computed, ref } from 'vue';
import testTable from './testTable.vue';
import testTableDtl from './testTableDtl.vue';

const props = defineProps({
  fields: Array,
  type: String,
  detailDatas: Object,
  codeList: Array,
})



// 자식에게 전달할 setter


// ✅ 최대 열 수 계산 (한 줄에 가장 많은 필드 개수)
const maxColumnCount = computed(() => {
  return Math.max(...props.fields.map(row => row.length));
});

// ✅ label + input 구성에 맞게 각 필드에 접근해서 width 추출
const colWidths = computed(() => {
  const firstFullRow = props.fields.find(row => row.length === maxColumnCount.value) || [];
  return firstFullRow.map(field => field.width || 'auto');
});

const tableRefs = ref({});

defineExpose({
  getAllFileUploadRefs: () => {
    return tableRefs.value?.fileUploadRefs || {};
  },
});

</script>


<template>
  <div class="v_table">
    <table>
      <colgroup>
        <template v-for="(width, i) in colWidths" :key="i">
          <col style="width: 10%;" />
          <col :style="{ width }" />
        </template>
      </colgroup>
      <tbody>
            <testTable 
              v-if="(Object.keys(props.detailDatas || {}).length > 0 && type === 'update') || type === 'create'" 
              :fields="props.fields" :type="props.type" 
              :detailDatas="props.detailDatas"  
              :ref="el => { tableRefs.value = el }"/>
            <testTableDtl :fields="props.fields" :type="props.type" :detailDatas="props.detailDatas" v-else-if="(Object.keys(props.detailDatas || {}).length > 0 && type === 'detail')"/>
      </tbody>
    </table>
  </div>
</template>
