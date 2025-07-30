<script setup>
import ThumbnailUpload from "@/views/content/asset/equipment/ThumbnailUpload.vue";
import { useFormStore, useStore } from "@/store";
import { ref, onMounted, reactive, defineProps, computed, watch, toRaw } from 'vue';
import { createYupValidate, useYupForm } from '@/utils/YupValidate';
// import useYupForm from '@/utils/UseYupForm';
const store = useStore();
const formStore = useFormStore();
const props = defineProps({
    fields: Array,
    type: String,
    detailDatas: Object,
    codeList: Array
})


const fieldStore = reactive({})
const initialValues = ref({})
const files = reactive({});
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getCodeName(items, code) {
    const match = items.find(item => item.codeId === code);
    return match ? match.codeNm : '-'; // 일치하는 항목 없을 시 대시(-) 처리
}

function getRadioLabel(value) {
    return value === 'Y' ? 'Y' : value === 'N' ? 'N' : '-';
}

const formkey = ref(typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : generateUUID());
const schema = createYupValidate(props.fields);
const { values, errors, defineField, validate, resetForm } = useYupForm(schema, initialValues);

onMounted(() => {
    props.fields.forEach(item => {
        item.forEach(col => {
            const [value, attrs] = defineField(col.name)
            fieldStore[col.name] = { value, attrs }
        })
    })

    resetForm({ values: { ...props.detailDatas } })

    formStore.fieldStore = fieldStore;
    formStore.fnRegister(formkey.value, validate, fieldStore)

    
})
</script>

<template>
    <template v-for="(row, i) in props.fields" :key="i">
        <tr>
            <template v-for="(field, j) in row" :key="j">
                <template v-if="fieldStore[field.name] && !field.hidden">

                    <th>{{ field.label }}</th>
                    <td v-bind="(row.length === 1) ? { colspan: 3 } : {}">
                        <template v-if="field.type === 'select'">
                            <!--todo select list api_list -->
                            {{ getCodeName(field.items, fieldStore[field.name].value) }}
                            
                        </template>

                        <template v-else-if="field.type === 'date'">
                            {{ fieldStore[field.name].value }}
                        </template>

                        <template v-else-if="field.type === 'radio'">
                            {{ getRadioLabel(fieldStore[field.name].value) }}
                        </template>


                        <template v-else-if="field.type === 'textarea'">
                            {{ fieldStore[field.name].value }}
                        </template>


                        <template v-else>
                            
                            {{ fieldStore[field.name].value }}

                        </template>
                        <span v-if="errors[field.name]" class="text_red">{{ errors?.[field.name] }}</span>
                    </td>
                </template>
            </template>
        </tr>
    </template>
</template>

<style scoped></style>