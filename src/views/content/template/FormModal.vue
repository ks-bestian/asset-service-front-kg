<script setup>
import FormComp from "./FormComp.vue";
import FieldComp from "./FieldComp.vue";
import { ref, defineProps, defineEmits,watch } from "vue";
import Dialog from 'primevue/dialog';
import {useI18n} from "vue-i18n";

const { t } = useI18n()
const props = defineProps({
    form: Object,
    dialog: Boolean
});
const visible = ref(props.dialog);
const fieldList = ref([]);
const formCompRef = ref(null);

const emit = defineEmits(['close', 'save']);

watch(() => props.form, (newVal) => {
    fieldList.value = newVal?.fields ? [...newVal.fields] : [];
}, {immediate: true})

//add field row
const addRow = () => {
   const newField = {
    field_value: '',
    field_nm: '',
    field_type: '',
    required_yn: 'N'
  };
  fieldList.value.unshift(newField);
};

//save  
const fnSave = () => {
    formCompRef.value.emitForm(); //trigger formComp to emit its internal form state
    const formData = formCompRef.value?.getFormData();
    emit('save', {
        ...formData,
        fields: fieldList.value
    });
}
//cancel
const fnCancel = () => {
    emit("close");
};

</script>

<template> 
    <Dialog v-model:visible="visible" 
        :style="{ width: '40vw', height: '80vh', overflow: 'hidden'}" 
        contentStyle="overflow: hidden" 
        @hide="fnCancel"> 
        <template #header>
            <div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
                <h2 class="popup_tit">{{ props.form.form_id ? t('10605') : t('10604') }}</h2>
            </div>
        </template>

        <div class="popup_inner"> 
            <div class="popup_body">
                
                <!--components-->
                <FormComp 
                    :form="props.form"
                    ref="formCompRef"
                    @add-row="addRow" />
                <FieldComp 
                    :fieldList="fieldList"
                    @update-fieldList="fieldList = $event"
                 />

                <!--footer-->
                <div class="popup_footer"> 
                    <div class="btn_group" v-if="!props.form.form_id">
                        <button type="button" class="v_btn btn_primary btn_md" @click="fnSave" >{{ t('10493') }}</button>
                        <button type="button" class="v_btn btn_outline_neutral btn_md" @click="fnCancel">{{ t('10001') }}</button>
                    </div>
                </div>

            </div>
        </div>
    </Dialog>
</template>
