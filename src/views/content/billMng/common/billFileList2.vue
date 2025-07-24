<script setup>
import { useStore } from "@/store";
import { onMounted, ref, getCurrentInstance } from "vue";
import Checkbox from 'primevue/checkbox';
import { useI18n } from "vue-i18n";
/** Variable declaration */
const store = useStore();
const {t} = useI18n();
const emit = defineEmits(['delete'])

const props = defineProps({
    fileList: Array,
    deletable: Boolean,
})

const checkboxId = ref();

const changepublic = (e, fileId) => {
    const checked = e.target.checked;
    fnUpdateFileIsPublic(fileId, checked);
}

/** Modify whether the file is disclosed */
const fnUpdateFileIsPublic = (fileId, isPublic) => {
    let params = {};
    params.orgFileId = fileId;
    params.opbYn = isPublic ? 'Y' : 'N';

    const apiUrl = '/bill/file/updateopen';
    store.API_UPDATE(apiUrl, params).then((data) => {

    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

onMounted(() => {
    const instance = getCurrentInstance();
    checkboxId.value = `checkbox${instance.uid}`
})
</script>

<template>
    <div class="file_attatch" v-for="file in props.fileList" :key="file.orgFileId">
        <div class="input_item">
            <div class="input_group">
                <input type="text" class="form_control" :value="file.orgFileNm" readonly>
                <span class="input_addon">
                    <button type="button" class="v_btn" @click="store.API_FILE_DOWN(file.orgFileId, file.orgFileNm);"><i class="v_ico ico_download"></i></button>
                    <button type="button" class="v_btn" @click="emit('delete', file.orgFileId)"><i class="v_ico ico_trashcan" v-if="props.deletable"></i></button>
                </span>
                <span class="input_addon">
                    <Checkbox v-model="file.opbYn" :inputId="checkboxId" binary @change="e => changepublic(e, file.orgFileId)" true-value="Y"  false-value="N" />
                    <label :for="checkboxId">{{ t('10626') }} </label>
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>
