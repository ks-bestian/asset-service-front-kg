<script setup>
import {  defineProps } from 'vue';
import testTable from './testTable.vue';
import testTableDtl from './testTableDtl.vue';

const props = defineProps({
  fields: Array,
  type: String,
  detailDatas: Object,
  codeList: Array
})

</script>


<template>
  <div class="v_table" >
    <table>
      <colgroup>
        <col style="width: 10%;">
        <col>
        <col style="width: 10%;">
        <col>
      </colgroup>
      <tbody>
            <testTable :fields="props.fields" :type="props.type" :detailDatas="props.detailDatas" v-if="(props.detailDatas.bzentyId && type === 'update') || type === 'create'" :codeList="codeList"/>
            <testTableDtl :fields="props.fields" :type="props.type" :detailDatas="props.detailDatas" v-else-if="(props.detailDatas.bzentyId && type === 'detail')" :codeList="codeList"/>
      </tbody>
    </table>
  </div>
</template>
