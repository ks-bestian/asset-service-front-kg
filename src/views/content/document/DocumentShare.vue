<script setup>
import { useStore } from "@/store";
import dayjs from "dayjs";
import { useConfirm } from "primevue";
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import DocumentMng from "./DocumentMng.vue";
import FileUpdateModal from "./modal/FileUpdateModal.vue";
import FileUploadModal from "./modal/FileUploadModal.vue";
import FolderUpdateModal from "./modal/FolderUpdateModal.vue";
import NewFolderModal from "./modal/NewFolderModal.vue";
import { DocumentService } from "./service/DocumentService";
import FileShareModal from "./modal/FileShareModal.vue";
import { unescape } from "lodash";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
    folderId: String,
})

const documents = ref([]);
const selectedRow = ref([]);
const confirm = useConfirm();
const router = useRouter();
const route = useRoute();
const folderTree = ref([]);
const curFolder = ref();
const folderUpdateModal = ref({});
const fileUpdateModal = ref({});
const fileUploadModal = ref({});
const fileShareModal = ref({});
const newFolderModal = ref({});
const DEPT_ROOT_FOLDER_NM = t('10587');
const fileTypeFilter = ref([]);
const starFilter = ref(false);

const store = useStore();

const documentsFiltered = computed(() => {
    let ret = documents.value;
    if (starFilter.value) {
        ret = ret.filter(item => {
            return item.favoriteYn == 'Y';
        });
    }
    if (fileTypeFilter.value.length) {
        ret = ret.filter(item => {
            const t = DocumentService.getFileTypeText(item.fileType);
            return fileTypeFilter.value.includes(t);
        });
    }
    return ret;
})

watch([() => props.folderId, () => route.query.searchby, () => route.query.searchkey], () => {
    // curFolder.value = DocumentService.findNode(folderTree.value, props.folderId);
    reloadFolder();
})

const newFolder = () => {
    // openModal('#layer_new_folder', this);
    newFolderModal.value.open = true;
}

const uploadFile = () => {
    // openModal('#layer_file_upload', this);
    fileUploadModal.value.open = true;
}

const init = () => {
    // DocumentService.getDeptFolderTree().then(data => {
    //     folderTree.value = data;

    //     curFolder.value = DocumentService.findNode(folderTree.value, props.folderId);
    //     reloadFolder();
    // })
    reloadFolder();
}

const reloadFolder = () => {
    const folderId = props.folderId;
    const title = route.query.searchby == 'title' ? route.query.searchkey : null;
    const regNm = route.query.searchby == 'regNm' ? route.query.searchkey : null;

    if(folderId) {
        DocumentService.getShareFoldersAndFilesByFolderId(folderId, title, regNm).then(ff => {
            documents.value = ff;
            console.log('reloadFolder', ff);
        })
    }
    else {
        DocumentService.getShareFoldersAndFiles(title, regNm).then(ff => {
            documents.value = ff;
            console.log('reloadFolder', ff);
        })   
    }
}

const toggleStar = (file) => {
    const favoriteYn = file.favoriteYn == 'Y' ? 'N' : 'Y';
    DocumentService.updateFileStar(file.fileId, favoriteYn).then(res => {
        reloadFolder();
    })
}

// const updateFolder = (folder) => {
//     folderUpdateModal.value.open = true;
//     folderUpdateModal.value.folderId = folder.folderId;
//     folderUpdateModal.value.folderNm = folder.folderNm;
//     // openModal('#layer_folder_update', this);
// }

// const updateFile = (file) => {
//     fileUpdateModal.value.open = true;
//     fileUpdateModal.value.fileId = file.fileId;
//     fileUpdateModal.value.fileTitle = file.fileTitle;
//     fileUpdateModal.value.favoriteYn = file.favoriteYn;
//     fileUpdateModal.value.folderNm = file.folderNm || ROOT_FOLDER_NM;
// }

// const deleteFolder = (event, folder) => {

//     confirm.require({
//         target: event.currentTarget,
//         message: t('10201'),
//         accept: () => {
//             DocumentService.deleteFolder(folder.folderId).then(res => {
//                 init();
//             })
//         },
//         reject: () => {
//         }
//     });
// }

// const deleteFile = (event, file) => {

//     confirm.require({
//         target: event.currentTarget,
//         message: t('10201'),
//         accept: () => {
//             DocumentService.deleteFile(file.fileId).then(res => {
//                 reloadFolder();
//             })
//         },
//         reject: () => {
//         }
//     });
// }

// const shareFile = (file) => {
//     console.log('shareFile', file);
//     fileShareModal.value.open = true;
//     fileShareModal.value.file = file;
// }

// const searchFolder = (searchkey) => {
//     const curFolderId = curFolder.value?.folderId;
//     const id = DocumentService.searchFolder(folderTree.value, searchkey, curFolderId);
//     console.log('searchFolder', id);
//     if(id != null) {
//         router.push({params: {folderId: id}});
//     }
// }

const onRowDblclick = (e) => {
    if(e.data.folderYn == 'Y') {
        router.push({params: {folderId: e.data.folderId}});
    }
}

onMounted(() => {

    init();
    
});

</script>

<template>
    <DocumentMng :doc-kind="'share'" :cur-folder="curFolder" :file-list="documentsFiltered"
        v-model:fileTypeFilter="fileTypeFilter" v-model:starFilter="starFilter" 
        @newFolder="newFolder" @uploadFile="uploadFile">
        <template #data-table>
            <DataTable :value="documentsFiltered" 
                tableStyle="min-width: 50rem;"
                v-model:selection="selectedRow" dataKey="id" @row-dblclick="onRowDblclick">
                <Column selectionMode="multiple" style="width: 4.8%" class="text_center"></Column>
                <Column field="title" :header="t('10310')" class="text_left">
                    <template #body="{ data }">
                        <div class="file_stat">
                            <div class="btn_wrap">
                                <button type="button" class="v_btn btn_mark" v-if="data.folderYn == 'Y'">
                                    <i :class="`v_ico ico_folder`"></i></button>
                                <!-- <button type="button" class="v_btn btn_mark" :class="{on: data.favoriteYn == 'Y'}" v-if="data.folderYn == 'N'" @click="toggleStar(data)"> -->
                                <button type="button" class="v_btn btn_mark" :class="{on: data.favoriteYn == 'Y'}" v-if="data.folderYn == 'N'">
                                    <i :class="`v_ico ico_star`"></i></button>
                            </div>
                            <span>{{data.title}}</span>
                        </div>
                    </template>
                </Column>
                <Column field="fileSize" :header="t('10311')" style="width: 9%;" class="text_center">
                    <template #body="{ data }">
                        {{ store.formatFileSize(data.fileSize) }}
                    </template>
                </Column>
                <Column field="regNm" :header="t('10099')" style="width: 9%;" class="text_center"></Column>
                <Column field="regDt" :header="t('10050')" style="width: 11.6%;" class="text_center">
                    <template #body="{ data }">
                        {{ dayjs(data.regDt).format('DD/MM/YYYY HH:mm:ss') }}
                    </template>
                </Column>
                <Column field="file" :header="t('10122')" style="width: 7.6%;" class="text_center">
                    <template #body="{ data }">
                        <button type="button" class="v_btn btn_sort_file" v-if="data.folderYn == 'N'" @click="DocumentService.download(data)"><i
                                :class="DocumentService.getFileIconClass(data.fileType)"></i><span>{{ DocumentService.getFileTypeText(data.fileType) }}</span></button>
                    </template>
                </Column>
                <Column field="" header="" style="width: 9.6%;" class="text_center">
                    <template #body="{ data }">
                        <!-- <div v-if="data.folderYn == 'Y'">
                            <i class="pi pi-share-alt" v-tooltip.bottom="{ value: t('10588'), showDelay: 300, hideDelay: 100 }" @click="shareFile(data)"></i>
                            <i class="pi pi-pencil" v-tooltip.bottom="{ value: t('10157'), showDelay: 300, hideDelay: 100 }" @click="updateFolder(data)"></i>
                            <i class="pi pi-trash" v-tooltip.bottom="{ value: t('10173'), showDelay: 300, hideDelay: 100 }" @click="e => deleteFolder(e, data)"></i>
                        </div>
                        <div v-if="data.folderYn == 'N'">
                            <i class="pi pi-share-alt" v-tooltip.bottom="{ value: t('10588'), showDelay: 300, hideDelay: 100 }" @click="shareFile(data)"></i>
                            <i class="pi pi-pencil" v-tooltip.bottom="{ value: t('10157'), showDelay: 300, hideDelay: 100 }" @click="updateFile(data)"></i>
                            <i class="pi pi-trash" v-tooltip.bottom="{ value: t('10173'), showDelay: 300, hideDelay: 100 }" @click="e => deleteFile(e, data)"></i>
                        </div> -->
                    </template>
                </Column>
            </DataTable>
        </template>
    </DocumentMng>
    <NewFolderModal v-if="newFolderModal.open" :upper-folder-id="-1" :dialog="newFolderModal.open"
        :upper-folder-nm="DEPT_ROOT_FOLDER_NM" :dept-folder-yn="'Y'" @reload="router.push('/main/document/dept')" @close="newFolderModal.open = false" />
    <FileUploadModal v-if="fileUploadModal.open" id="layer_file_upload" :folder-id="-1" :dialog="fileUploadModal.open"
        :folder-nm="DEPT_ROOT_FOLDER_NM" :dept-file-yn="'Y'" @reload="router.push('/main/document/dept')" @close="fileUploadModal.open = false" />
</template>

<style>
.pi-pencil,
.pi-trash,
.pi-share-alt {
    padding: 0.8rem;
}
.pi-pencil:hover,
.pi-trash:hover,
.pi-share-alt:hover {
    background-color: lightgray;
    border-radius: 2rem;
}
</style>
