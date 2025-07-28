<script setup>
import {  defineProps, computed } from 'vue';
import testTable from './testTable.vue';
import testTableDtl from './testTableDtl.vue';

const props = defineProps({
  fields: Array,
  type: String,
  detailDatas: Object,
  codeList: Array
})

// ✅ 최대 열 수 계산 (한 줄에 가장 많은 필드 개수)
const maxColumnCount = computed(() => {
  return Math.max(...props.fields.map(row => row.length));
});

// ✅ label + input 구성에 맞게 각 필드에 접근해서 width 추출
const colWidths = computed(() => {
  const firstFullRow = props.fields.find(row => row.length === maxColumnCount.value) || [];
  return firstFullRow.map(field => field.width || 'auto');
});

//const isReady = computed(() => colWidths.value.length > 0);

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
            <testTable :fields="props.fields" :type="props.type" :detailDatas="props.detailDatas" v-if="(props.detailDatas.bzentyId && type === 'update') || type === 'create'"/>
            <testTableDtl :fields="props.fields" :type="props.type" :detailDatas="props.detailDatas" v-else-if="(props.detailDatas.bzentyId && type === 'detail')" :codeList="codeList"/>
      </tbody>
    </table>
  </div>
</template>
