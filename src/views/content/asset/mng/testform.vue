<script setup>
import {  defineProps } from 'vue';
import testTable from './testTable.vue';

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
            <testTable :fields="props.fields" :type="props.type" :detailDatas="props.detailDatas" v-if="Object.keys(props.detailDatas).length > 0 || type === 'create'" :codeList="codeList"/>
      </tbody>
    </table>
  </div>
</template>
