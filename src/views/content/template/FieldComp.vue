<script setup>
import { defineProps,defineEmits } from "vue";
import Column from "primevue/column";
import  DataTable  from "primevue/datatable";
import { computed } from "vue";
import {useI18n} from "vue-i18n";
import { useStore } from "@/store";

const store = useStore();
const { t } = useI18n()

const props = defineProps({
    fieldList: Array,
});
const emit = defineEmits(['update-fieldList']);

const comCodeDetail = store.getComCodes('1032');

//computed getter/setter
const localFieldList = computed({
    get: () => props.fieldList,
    set: (val) => emit('update-fieldList', val)
});

const deleteRow = (slotProps) => {
    const updatedList = [...localFieldList.value];
    updatedList.splice(slotProps.index, 1);
    localFieldList.value = updatedList;
};

</script>

<template>
    <div class="col_6d v_box" style="height: 250px; overflow: scroll;">
    <div class="v_table table_list type2">
        <DataTable :value="localFieldList">
            <Column :header="t('10606')">
                <template #body="slotProps">
                    <input v-model="slotProps.data.field_nm" type="text" 
                    class="form_control full" :placeholder="t('10146')" 
                    :readonly="!!slotProps.data.formId" />
                </template>
            </Column>
            <Column :header="t('10672')">
                <template #body="slotProps">
                    <input v-model="slotProps.data.field_value" type="text" 
                        class="form_control full" :placeholder="t('10146')" 
                        :readonly="!!slotProps.data.formId" />
                </template>
            </Column>
            <Column :header="t('10608')" >  
                <template #body="slotProps">
                    <select v-model="slotProps.data.field_type" 
                        class="form_control full" 
                        :disabled="!!slotProps.data.formId">
                        <option 
                            v-for="i in comCodeDetail"
                            :key="i.codeId"
                            :value="i.codeId">
                            {{ i.codeNm3 }}
                        </option>
                    </select>
                </template>
            </Column>
            <Column :header="t('10607')" style="text-align: center;" >
                <template #body="slotProps">
                    <input type="checkbox" class="checkbox-bigger"
                        v-model="slotProps.data.required_yn" 
                        true-value="Y" false-value="N"
                        v-if="!slotProps.data.formId" />
                    <span v-else-if="slotProps.data.formId && slotProps.data.required_yn === 'Y' " class="required-sign">*</span> 
                </template>
            </Column>
            <Column :header="t('10173')" style="text-align: center;"> 
                <template #body="slotProps">
                    <i class="pi pi-trash" @click="!slotProps.data.formId && deleteRow(slotProps)"></i> 
                </template>
            </Column>
        </DataTable>
    </div>
    </div>
</template>

<style>
.pi-trash {
    font-size: large;
}
.pi-trash:hover{
    cursor: pointer;
}
.v_box {
	padding: 1.2rem;
	border-radius: 0.5rem;
}
.checkbox-bigger {
    width: 1.8rem;
    height: 1.8rem;
}
.required-sign {
    color:#ff000086;
    font-size:x-large;
}
.full {
    width: 100%;
}
</style>


