<script setup>
import { ref } from 'vue';
import { usePrimeVue } from 'primevue/config';
import FileUpload from 'primevue/fileupload';
import Button from 'primevue/button';


const $primevue = usePrimeVue();

const totalSize = ref(0);
const files = ref([]);


const onSelectedFiles = (event) => {
    files.value = event.files;
    files.value.forEach((file) => {
        totalSize.value += parseInt(formatSize(file.size));
    });
};


const formatSize = (bytes) => {
    const k = 1024;
    const dm = 3;
    const sizes = $primevue.config.locale.fileSizeTypes;

    if (bytes === 0) {
        return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
};
</script>

<template>
    <div class="col_6">
        <FileUpload accept="image/*" :maxFileSize="1000000" @select="onSelectedFiles">
            <template #header="{ chooseCallback }" v-if="files.length === 0">
                <Button @click="chooseCallback()" rounded outlined severity="secondary"><i class="pi pi-image"
                        style="font-size: 2rem;"></i> <span>Choose Image</span></Button>
            </template>
            <template #header="{ chooseCallback }" v-else>
                {{ '' }}
            </template>


            <!-- <template #content="{ files, removeFileCallback }">
                <div v-for="(file, index) of files" :key="file.name + file.type + file.size"
                    class="p-8 rounded-border flex flex-col border border-surface items-center gap-4">
                    <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" />
                    <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{
                        file.name }}</span>
                    <span>{{ formatSize(file.size) }}</span>
                    <Button icon="pi pi-times" @click="onRemoveTemplatingFile(file, removeFileCallback, index)" outlined
                        rounded severity="danger" variant="text"></Button>
                </div>
            </template> -->



            <template #empty>
                <div class="pb_2 text_xl form_col flex_align_center">
                    <i class="pi pi-cloud-upload" style="font-size: 3rem;"></i>
                    <span>Drag and drop files to here to upload.</span>
                </div>
            </template>
        </FileUpload>
    </div>

</template>

<style>
.p-badge-warn {
    display: none !important;
}

.p-fileupload-file-thumbnail {
    width: 220px;
}
</style>
