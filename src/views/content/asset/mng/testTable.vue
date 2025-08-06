<script setup>
import ThumbnailUpload from "@/views/content/asset/equipment/ThumbnailUpload.vue";
import { useFormStore } from "@/store";
import { ref, onMounted, reactive, defineProps, computed, watch, toRaw } from 'vue';
import { createYupValidate, useYupForm } from '@/utils/YupValidate';
import FileUploadPanel from "@/views/content/asset/common/FileUploadPanel.vue";
// import useYupForm from '@/utils/UseYupForm';

const formStore = useFormStore();
const props = defineProps({
    fields: Array,
    type: String,
    detailDatas: Object
})


const fileUploadRefs = ref({});
const setFileUploadRef = (name) => (el) => {
  if (el) fileUploadRefs.value[name] = el;
};

const fieldStore = reactive({})
const files = reactive({});
const schema = createYupValidate(props.fields);
const initialValues = getInitialValuesFromFields(props.fields);
const formkey = ref(typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : generateUUID());

const { values, errors, defineField, validate, resetForm } = useYupForm(schema, initialValues);

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getInitialValuesFromFields(fields) {
  const result = {};
  fields.flat().forEach(field => {
    result[field.name] = field.default ?? '';
  });
  return result;
}


onMounted(() => {
    props.fields.forEach(item => {
        item.forEach(col => {
            const [value, attrs] = defineField(col.name)
            fieldStore[col.name] = { value, attrs }
        })
    })

    if (props.type === 'update') {
        resetForm({ values: { ...props.detailDatas } })
    } 

    formStore.fieldStore = fieldStore;
    formStore.fnRegister(formkey.value, validate, fieldStore)
})

defineExpose({
  fileUploadRefs,
});
</script>

<template>
    <template v-for="(row, i) in props.fields" :key="i">
        <tr>
            <template v-for="(field, j) in row" :key="j">
                <template v-if="fieldStore[field.name] && !field.hidden">

                    <th>{{ field.label }}<span class="text_red" v-if="field.required">*</span></th>
                    <td v-bind="(row.length === 1) ? { colspan: 3 } : {}">
                        <template v-if="field.type === 'select'">
                            <!--todo select list api_list -->
                            <select class="form_control" v-model="fieldStore[field.name].value" v-bind="fieldStore[field.name].attrs">
                                <option  value="">{{ field.label }}</option>
                                <option  v-for="(item, i) in field.items" :key="i" :value="item.codeId">{{ item.codeNm }}</option>
                            </select>
                        </template>

                        <template v-else-if="field.type === 'thumbnail'">
                            <ThumbnailUpload />
                        </template>

                        <template v-else-if="field.type === 'date'">
                            <input v-model="fieldStore[field.name].value" type="date"
                                class="form_datepicker form_control" style="width: 20rem;">
                        </template>

                        <template v-else-if="field.type === 'file'">
                            <FileUploadPanel
                            :ref="setFileUploadRef(field.name)"
                            :uploadedFilesFromDB="Array.isArray(fieldStore[field.name].value) ? [...fieldStore[field.name].value] : []"
                            />
                            <!--
                            <div class="file_attatch">
                                <div class="form_col type4">
                                    <div class="input_item">
                                        <div class="input_group"> 
                                            <input type="file" class="form_file" :id="`videoManual${field.name}${fileId}`" multiple
                                                @change="e => fieldStore[field.name].value = e.target.files"
                                                v-bind="fieldStore[field.name].attrs" :accept="(field.attachType === 'image') ? 'image/*' : (field.attachType === 'video') ? '.mp4' : '*/*'">
                                            <input type="text" class="form_control file_name">
                                            <span class="input_addon">
                                                <label :for="`videoManual${field.name}${fileId}`" class="v_btn btn_outline_secondary btn_sm" >file</label>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            -->
                        </template>

                        <template v-else-if="field.type === 'radio'">
                            <div class="check_area">
                                <span class="check_item">
                                    <input type="radio" id="inputRaio1" v-model="fieldStore[field.name].value"
                                        v-bind="fieldStore[field.name].attrs" value="Y" />
                                    <label for="inputRaio1">{{ 'Y' }}</label>
                                </span>

                                <span class="check_item">
                                    <input type="radio" id="inputRaio2" v-model="fieldStore[field.name].value"
                                        v-bind="fieldStore[field.name].attrs" value="N" />
                                    <label for="inputRaio2">{{ 'N' }}</label>
                                </span>
                            </div>
                        </template>

                        <template v-else-if="field.type === 'checkbox'">
                            <span class="check_item">
                                <input type="checkbox" id="inputCheckbox1" v-model="fieldStore[field.name].value"
                                    true-value="Y" false-value="N" v-bind="fieldStore[field.name].attrs">
                                <label for="inputCheckbox1"></label>
                            </span>
                        </template>

                        <template v-else-if="field.type === 'textarea'">
                            <textarea class="form_control" v-model="fieldStore[field.name].value"
                                v-bind="fieldStore[field.name].attrs"></textarea>
                        </template>

                        <template v-else-if="field.type === 'password'">
                            <input :type="field.type" class="form_control full" v-model="fieldStore[field.name].value"
                                v-bind="fieldStore[field.name].attrs" autocomplete="new-password"></input>
                            <!-- autocomplete 아이디, 비밀번호 자동완성기능 제거 -->
                        </template>

                        <template v-else>
                            <input :type="field.type" class="form_control full" v-model="fieldStore[field.name].value"
                                v-bind="fieldStore[field.name].attrs" autocomplete="off" :readonly="field.readonly && props.type === 'update'"></input>
                        </template>
                        <span v-if="errors[field.name]" class="text_red">{{ errors?.[field.name] }}</span>
                    </td>
                </template>
            </template>
        </tr>
    </template>
</template>

<style scoped></style>