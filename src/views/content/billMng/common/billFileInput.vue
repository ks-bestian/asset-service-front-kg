<script setup>
import { ref, computed, onMounted, getCurrentInstance, watch } from "vue";
import { useStore } from "@/store";
import { useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
import MyFolderModal from "@/views/content/document/modal/MyFolderModal.vue";
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';

const props = defineProps({
	multiple: Boolean,
    buttonName: String,
    hideMyDocument: Boolean,
    filename: String,
    isPublic: {type: Boolean, default: true},
    setPublic: {type: Boolean, default: true},
});

watch(() => props.filename, () => {
    fileInputText.value = props.filename;
})
watch(() => props.isPublic, () => {
    isPublic.value = props.isPublic;
});

const store = useStore();
const emit = defineEmits(['change', 'delete'])

// Add -In my documentation (20250221 Cho Jinho)

const myFolderModal = ref({});
const inputFileId = ref();
const fileInputText = ref();
const fileInputRef = ref();
const checkboxId = ref();
const isPublic = ref(props.isPublic);

const selection = ref();
const type = ref();

/** Pile */
const onchange = (e) => {
    selection.value = e.target.files;
    type.value = 'file';
    emit('change', selection.value, type.value, isPublic.value);

    let inputText = '';
    for (var i = 0; i < selection.value?.length; ++i) {
        const file = selection.value[i];
        if(i > 0) {
            inputText += ', ';
        }
        inputText += file.name;
    }
    fileInputText.value = inputText;
};

const onchangeopen = (e) => {
    emit('change', selection.value, type.value, isPublic.value);
}

// Add -In my documentation (20250221 Cho Jinho)

const fnOpenMyFolderModal = () => {
    myFolderModal.value.open = true;
}

const selectFile = (mydocSelection) => {

    const fileInput = document.querySelector(`#${inputFileId.value}`);
    fileInput.value = '';

    let inputText = '';
    for (var i = 0; i < mydocSelection?.length; ++i) {
        let filename = mydocSelection[i].fileTitle;
        if (mydocSelection[i].fileType) {
            filename += '.' + mydocSelection[i].fileType;
        }
        if(i > 0) {
            inputText += ', ';
        }
        inputText += filename;
    }
    fileInputText.value = inputText;

    // $(`#${inputFileId.value}`).next('.file_name').val(inputText);

    selection.value = mydocSelection;
    type.value = 'mydoc';
    emit('change', selection.value, type.value, isPublic.value);
}

const reset = () => {
    console.log('reseting!');
    fileInputRef.value.value = null;
    fileInputText.value = '';
}

onMounted(() => {
	const instance = getCurrentInstance()
    inputFileId.value = `inputFile${instance.uid}`
    checkboxId.value = `checkbox${instance.uid}`
});

defineExpose({ reset });

</script>

<template>
    <div class="file_attatch">
        <div class="input_group">
            <input type="file" class="form_file" :multiple="props.multiple" :id="inputFileId" @change="onchange" ref="fileInputRef"
                :disabled="props.filename !== '' && props.filename !== undefined && props.filename !== null">
            <InputText type="text" class="form_control file_name" size="large" :value="fileInputText" readonly />
            <span class="input_addon" v-if="props.filename">
                <label class="v_btn btn_outline_secondary btn_sm btn_file"
                    @click="$emit('delete')">{{ t('10173') }}</label><!--delete-->
            </span>
            <template v-else>
                <span class="input_addon">
                    <label class="v_btn btn_outline_secondary btn_sm btn_file" :for="inputFileId">{{ props.buttonName || 'file' }}</label>
                </span>
                <span class="input_addon" v-if="!props.hideMyDocument">
                    <label class="v_btn btn_outline_secondary btn_sm btn_file" for=""
                        @click="fnOpenMyFolderModal()">{{ t('10081') }}</label><!--My documentation-->
                </span>
            </template>
            <span class="input_addon" v-if="setPublic && fileInputText">
                <Checkbox v-model="isPublic" :inputId="checkboxId" binary @change="onchangeopen" />
                <label :for="checkboxId" style="margin-left: 0.3rem;">{{ t('10626') }}</label>
            </span>
        </div>
    </div>
    <MyFolderModal v-if="myFolderModal.open" :dialog="myFolderModal.open" :multiple="props.multiple" @close="myFolderModal.open = false"
        @selectFile="selectFile" />
</template>

<style></style>
