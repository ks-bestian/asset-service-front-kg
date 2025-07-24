<script setup>
import Tree from 'primevue/tree';
import { computed, onMounted, ref, watch } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { DocumentService } from "./service/DocumentService";
import NewFolderModal from "./modal/NewFolderModal.vue";
import FileUploadModal from "./modal/FileUploadModal.vue";
import { useStore } from "@/store";
import { useRoute, useRouter } from "vue-router";
import MeterGroup from 'primevue/metergroup';
import TitleComp from "@/components/TitleComp.vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
    docKind: String,
    curFolder: Object,
    deptFolderTree: Object,
    myFolderTree: Object,
    fileList: Object,
})

const store = useStore();

const emit = defineEmits(['newFolder', 'searchFolder', 'uploadFolder', 'uploadFile'])

const fileTypeFilter = defineModel('fileTypeFilter');
const starFilter = defineModel('starFilter');

const router = useRouter();
const route = useRoute();

const searchby = ref(route.query.searchby || 'title');
const searchkey = ref(route.query.searchkey);
const selectedKeyDept = ref(null);
const selectedKeyMy = ref(null);
const expandedKeyDept = ref({});
const expandedKeyMy = ref({});

const searchkeyFolder = ref();

const viewType = ref('list');
const diskSpace = ref();

const thumbnailModalImgSrc = ref();
const diskSpaceLabel = computed(() => {
    if(!diskSpace.value) {
        return "";
    }
    const totalSpace = store.formatFileSize(diskSpace.value.totalSpace);
    const usedSpace = store.formatFileSize(diskSpace.value.usedSpace) || 0;
    return `${usedSpace} / ${totalSpace}`;
})

const meterValue = computed(() => {
    return [{value: diskSpace.value ? (diskSpace.value.usedSpace / diskSpace.value.totalSpace * 100) : 0, color: 'var(--p-primary-color)'}];
})

watch(() => props.curFolder, () => {
    setSelectedKey();
})

watch([() => route.query.searchby, () => route.query.searchkey], () => {
    searchby.value = route.query.searchby || 'title';
    searchkey.value = route.query.searchkey;
})

watch([() => props.fileList, () => viewType.value], () => {
    if(viewType.value === 'thumbnail') {
        props.fileList.forEach(file => {
            if(file.thumbnail && !file.thumbnailUrl) {
                DocumentService.getThumbnail(file);
            }
        });
    }
    getDiskSpace();
});

const setSelectedKey = () => {

    if(props.docKind == 'dept') {
        selectedKeyDept.value = {};
        if(props.curFolder != null) {
            selectedKeyDept.value[props.curFolder.folderId] = true;
        }
        expandUpwardDept(props.curFolder?.upperFolder)
    }
    else if(props.docKind == 'my') {
        selectedKeyMy.value = {};
        if(props.curFolder != null) {
            selectedKeyMy.value[props.curFolder.folderId] = true;
        }
        expandUpwardMy(props.curFolder?.upperFolder)
    }
}

const expandUpwardDept = (node) => {
    if(!node) {
        return;
    }
    expandedKeyDept.value[node.folderId] = true;
    expandUpwardDept(node.upperFolder);
}

const expandUpwardMy = (node) => {
    if(!node) {
        return;
    }
    expandedKeyMy.value[node.folderId] = true;
    expandUpwardMy(node.upperFolder);
}

const onUpdateSelectionKeys = (selectionKeys) => {
    setSelectedKey();
}

const onTreeNodeSelect = (node) => {
    router.push({params: {folderId: node.folderId}});
};

const search = () => {
    router.push({query: {searchby: searchby.value, searchkey: searchkey.value}});
}

const toggleFileTypeFilter = (fileType) => {
    if(fileType == 'ALL') {
        fileTypeFilter.value = [];
        starFilter.value = false;
        return;
    }
    const idx = fileTypeFilter.value.indexOf(fileType);
    if(idx != -1) {
        fileTypeFilter.value.splice(idx, 1);
    }
    else {
        fileTypeFilter.value.push(fileType);
    }
}

const openThumbnailModal = (file) => {
    // thumbnailModalImgSrc.value = file.thumbnailUrl;
    // openModal('#layer_thumnail', this);

}

const getDiskSpace = () => {
    DocumentService.getDiskSpace().then(data => {
        diskSpace.value = data;
    })
}

onMounted(() => {
    getDiskSpace();
});

</script>

<template>
    <div class="content_inner">
        <TitleComp />
        <!-- Main area -->
        <div class="content_section">
            <div class="content_row file_manage_wrap">
                <div class="col_item_fit v_box bg_primary">
                    <div class="dropdown_menu">
                        <button type="button" class="v_btn btn_secondary btn_xs dropdown_btn" @click="emit('newFolder')"><i class="v_ico ico_plus_white"></i><span>{{ t('10302') }}</span></button>
                        <!-- <div class="dropdown_cont">
                            <ul class="dropdown_list">
                                <li><button type="button" class="v_btn" @click="openModal('#layer_new_folder', this);"><i class="v_ico ico_folder_add"></i><span>{{ t('10302') }}</span></button></li>
                                <li><button type="button" class="v_btn" onclick="openModal('#layer_folder_upload', this);"><i class="v_ico ico_folder_upload"></i><span>Папканы каттоо</span></button></li>
                                <li><button type="button" class="v_btn" onclick="openModal('#layer_file_upload', this);"><i class="v_ico ico_file_upload"></i><span>Файлды каттоо</span></button></li>
                            </ul>
                        </div> -->
                    </div>
                    <div class="search_form">
                        <input type="text" class="form_control" placeholder="Search" v-model="searchkeyFolder" @keydown.enter="emit('searchFolder', searchkeyFolder)">
                        <button type="button" class="btn_search" @click="emit('searchFolder', searchkeyFolder)"><i class="v_ico ico_search"></i></button>
                    </div>
                    <div class="document_wrap">
                        <div class="document_item">
                            <button type="button" class="v_btn" :class="{on: props.docKind === 'dept'}" @click="router.push('/main/document/dept')">
                                <i class="v_ico ico_document1"></i><span>{{ t('10587') }}</span>
                                <slot name="auth-mapp"></slot>
                            </button>
                            <div class="document_cont">
                                <Tree :value="props.deptFolderTree" v-model:selectionKeys="selectedKeyDept" v-model:expanded-keys="expandedKeyDept" selectionMode="single" @node-select="onTreeNodeSelect"
                                    @update:selection-keys="onUpdateSelectionKeys"></Tree>
                            </div>

                            
                        </div>
                        <div class="document_item">
                            <button type="button" class="v_btn" :class="{on: props.docKind === 'my'}" @click="$router.push('/main/document/my')"><i class="v_ico ico_document2"></i><span>{{ t('10081') }}</span></button>
                            <div class="document_cont">
                                <Tree :value="props.myFolderTree" v-model:selectionKeys="selectedKeyMy" v-model:expanded-keys="expandedKeyMy" selectionMode="single" @node-select="onTreeNodeSelect"
                                    @update:selection-keys="onUpdateSelectionKeys"></Tree>
                            </div>
                        </div>
                        <div class="document_item">
                            <button type="button" class="v_btn" :class="{on: props.docKind === 'share'}" @click="$router.push('/main/document/share')"><i class="v_ico ico_document3"></i><span>{{ t('10304') }}</span></button>
                        </div>
                        <div class="document_item">
                            <button type="button" class="v_btn" :class="{on: props.docKind === 'star'}" @click="$router.push('/main/document/star')"><i class="v_ico ico_document4"></i><span>{{ t('10305') }}</span></button>
                        </div>
                        <div class="document_item">
                            <button type="button" class="v_btn" :class="{on: props.docKind === 'trash'}" @click="$router.push('/main/document/trash')"><i class="v_ico ico_document5"></i><span>{{ t('10306') }}</span></button>
                        </div>
                    </div>
                    <div style="margin-top: 2rem;">
                        <MeterGroup :value="meterValue">
                            <template #label="{ value }">
                                {{ diskSpaceLabel }}
                            </template>
                        </MeterGroup>
                    </div>
                </div>
                <div class="col_item">
                    <div class="board_sort mb_6">
                        <div class="left">
                            <div class="input_group">
                                <select class="form_control" style="width: 185px;" v-model="searchby">
                                    <option value="title">{{ t('10301') }}</option>
                                    <option value="regNm">{{ t('10099') }}</option>
                                </select>
                                <input type="text" class="form_control" v-model="searchkey" @keydown.enter="search">
                                <span class="input_addon">
                                    <button type="button" class="v_btn btn_primary btn_sm" @click="search"><i class="v_ico ico_search_white_xs"></i><span>{{ t('10053') }}</span></button>
                                </span>
                            </div>
                        </div>
                        <div class="right">
                            <div class="sort_wrap type1">
                                <button type="button" class="v_btn btn_sort_file" @click="starFilter = !starFilter"><i class="v_ico ico_star" :class="{on: starFilter}"></i></button>
                                <button type="button" class="v_btn btn_sort_file" :class="{on: fileTypeFilter.length === 0 && starFilter == false}" @click="toggleFileTypeFilter('ALL')"><span>ALL</span></button>
                                <button type="button" class="v_btn btn_sort_file" :class="{on: fileTypeFilter.includes('PDF')}" @click="toggleFileTypeFilter('PDF')"><i class="v_ico ico_file_pdf_sm"></i><span>PDF</span></button>
                                <button type="button" class="v_btn btn_sort_file" :class="{on: fileTypeFilter.includes('PPT')}" @click="toggleFileTypeFilter('PPT')"><i class="v_ico ico_file_ppt_sm"></i><span>PPT</span></button>
                                <button type="button" class="v_btn btn_sort_file" :class="{on: fileTypeFilter.includes('DOC')}" @click="toggleFileTypeFilter('DOC')"><i class="v_ico ico_file_doc_sm"></i><span>DOC</span></button>
                                <button type="button" class="v_btn btn_sort_file" :class="{on: fileTypeFilter.includes('XLS')}" @click="toggleFileTypeFilter('XLS')"><i class="v_ico ico_file_xlsx_sm"></i><span>XLS</span></button>
                                <button type="button" class="v_btn btn_sort_file" :class="{on: fileTypeFilter.includes('ZIP')}" @click="toggleFileTypeFilter('ZIP')"><i class="v_ico ico_file_zip_sm"></i><span>ZIP</span></button>
                                <button type="button" class="v_btn btn_sort_file" :class="{on: fileTypeFilter.includes('HWP')}" @click="toggleFileTypeFilter('HWP')"><i class="v_ico ico_file_hwp_sm"></i><span>HWP</span></button>
                                <button type="button" class="v_btn btn_sort_file" :class="{on: fileTypeFilter.includes('IMG')}" @click="toggleFileTypeFilter('IMG')"><i class="v_ico ico_file_img_sm"></i><span>IMG</span></button>
                                <button type="button" class="v_btn btn_sort_file" :class="{on: fileTypeFilter.includes('ETC')}" @click="toggleFileTypeFilter('ETC')"><i class="v_ico ico_file_etc_sm"></i><span>ETC</span></button>
                            </div>
                            <div class="sort_wrap type2">
                                <button type="button" class="v_btn btn_sort_list" :class="{active: viewType == 'list'}" @click="viewType = 'list'"><i class="v_ico ico_sort_list"></i></button>
                                <button type="button" class="v_btn btn_sort_gallery" :class="{active: viewType == 'thumbnail'}" @click="viewType = 'thumbnail'"><i class="v_ico ico_sort_gallery"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="board_info type2 mb_4">
                        <div class="left">
                            <div class="total_num">Total <span class="text_primary">{{ props.fileList.length }}</span></div>
                        </div>
                        <div class="right">
                            <div class="btn_wrap">
                                <!-- <button type="button" class="v_btn btn_outline_neutral btn_sm" onclick="openModal('#layer_delete', this);">Документти жок кылуу</button> -->
                                <!-- <button type="button" class="v_btn btn_outline_primary btn_sm" onclick="openModal('#layer_move', this);">Файлды жылдыруу</button> -->
                                <!-- <button type="button" class="v_btn btn_primary btn_sm" onclick="openModal('#layer_modify', this);">Документти түзөтүү</button> -->
                                <button type="button" class="v_btn btn_primary btn_sm" @click="emit('uploadFile')">{{ t('10309') }}</button>
                            </div>
                        </div>
                    </div>
                    <div class="v_table table_list" v-if="viewType == 'list'">
                        <slot name="data-table"></slot>
                    </div>
                        







                        

                        <!-- <div class="v_table table_list" v-if="curDocKind == 'my'">
                            <DataTable :value="myDocuments" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem;"
                                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                                v-model:selection="selectedRowMy" dataKey="id"
                            >
                                <Column selectionMode="multiple" style="width: 4.8%" class="text_center"></Column>
                                <Column field="title" header="Файлдын аталышы" class="text_left">
                                    <template #body="{ data }">
                                        <div class="file_stat">
                                            <div class="btn_wrap">
                                                <button type="button" class="v_btn btn_mark" :class="{on: data.starYn == 'Y'}"><i :class="`v_ico ${data.folderYn == 'Y' ? 'ico_folder' : 'ico_star'}`"></i></button>
                                            </div>
                                            <span>{{data.title}}</span>
                                        </div>
                                    </template>
                                </Column>
                                <Column field="fileSize" header="өлчөмү" style="width: 9%;" class="text_center"></Column>
                                <Column field="regNm" header="каттоочу" style="width: 9%;" class="text_center"></Column>
                                <Column field="regDt" header="дата" style="width: 11.6%;" class="text_center"></Column>
                                <Column field="file" header="файл" style="width: 7.6%;" class="text_center">
                                    <template #body="{ data }">
                                        <button type="button" class="v_btn btn_sort_file" v-if="data.folderYn == 'N'"><i class="v_ico ico_file_pdf_sm"></i><span>PDF</span></button>
                                    </template>
                                </Column>
                            </DataTable>
                        </div>

                        <div class="v_table table_list" v-else-if="curDocKind == 'star'">
                            <DataTable :value="starredDocuments" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem;"
                                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                                v-model:selection="selectedRowStar" dataKey="id"
                            >
                                <Column selectionMode="multiple" style="width: 4.8%" class="text_center"></Column>
                                <Column field="title" header="Файлдын аталышы" class="text_left">
                                    <template #body="{ data }">
                                        <div class="file_stat">
                                            <div class="btn_wrap">
                                                <button type="button" class="v_btn btn_mark" :class="{on: data.starYn == 'Y'}"><i :class="`v_ico ${data.folderYn == 'Y' ? 'ico_folder' : 'ico_star'}`"></i></button>
                                            </div>
                                            <span>{{data.title}}</span>
                                        </div>
                                    </template>
                                </Column>
                                <Column field="fileSize" header="өлчөмү" style="width: 9%;" class="text_center"></Column>
                                <Column field="regNm" header="каттоочу" style="width: 9%;" class="text_center"></Column>
                                <Column field="regDt" header="дата" style="width: 11.6%;" class="text_center"></Column>
                                <Column field="file" header="файл" style="width: 7.6%;" class="text_center">
                                    <template #body="{ data }">
                                        <button type="button" class="v_btn btn_sort_file" v-if="data.folderYn == 'N'"><i class="v_ico ico_file_pdf_sm"></i><span>PDF</span></button>
                                    </template>
                                </Column>
                            </DataTable>
                        </div>

                        <div class="v_table table_list" v-else-if="curDocKind == 'trash'">
                            <DataTable :value="trashedDocuments" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem;"
                                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                                v-model:selection="selectedRowTrash" dataKey="id"
                            >
                                <Column selectionMode="multiple" style="width: 4.8%" class="text_center"></Column>
                                <Column field="title" header="Файлдын аталышы" class="text_left">
                                    <template #body="{ data }">
                                        <div class="file_stat">
                                            <div class="btn_wrap">
                                                <button type="button" class="v_btn btn_mark" :class="{on: data.starYn == 'Y'}"><i :class="`v_ico ${data.folderYn == 'Y' ? 'ico_folder' : 'ico_star'}`"></i></button>
                                            </div>
                                            <span>{{data.title}}</span>
                                        </div>
                                    </template>
                                </Column>
                                <Column field="fileSize" header="өлчөмү" style="width: 9%;" class="text_center"></Column>
                                <Column field="regNm" header="каттоочу" style="width: 9%;" class="text_center"></Column>
                                <Column field="regDt" header="дата" style="width: 11.6%;" class="text_center"></Column>
                                <Column field="file" header="файл" style="width: 7.6%;" class="text_center">
                                    <template #body="{ data }">
                                        <button type="button" class="v_btn btn_sort_file" v-if="data.folderYn == 'N'"><i class="v_ico ico_file_pdf_sm"></i><span>PDF</span></button>
                                    </template>
                                </Column>
                            </DataTable>
                        </div> -->
                        <div class="gallery_list" v-if="viewType == 'thumbnail'">
                            <div class="gallery_item" v-for="file in props.fileList">
                                <div v-if="file.folderYn == 'Y'">
                                    <div class="thumnail_wrap" @dblclick="router.push({params: {folderId: file.folderId}})">
                                        <img src="@/assets/images/content/img_folder.png" alt="">
                                    </div>
                                    <span class="document_tit">{{ file.folderNm }}</span>
                                </div>
                                <div v-else>
                                    <div class="thumnail_wrap">
                                        <button type="button" @click="openThumbnailModal(file)">
                                            <img :src="file.thumbnailUrl" alt="" v-if="file.thumbnailUrl">
                                            <img src="@/assets/images/content/img_noimage.png" alt="" v-else>
                                        </button>
                                    </div>
                                    <span class="document_tit">{{ file.fileTitle }}</span>
                                    <button type="button" class="v_btn btn_down" @click="DocumentService.download(file)"><i class="v_ico ico_download"></i></button>    
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
        <!-- // Main area -->
    </div>

    <!-- Layer pop -up (thumbnail) -->
	<div class="layer_popup popup_thumnail hide" id="layer_thumnail">
		<div class="popup_inner">
			<div class="popup_body">
				<div class="popup_cont">
					<img :src="thumbnailModalImgSrc" alt="">
				</div>
			</div>
			<button type="button" class="btn btn_close_popup" onclick="closeModal('#layer_thumnail');"><i class="v_ico ico_close_white_lg"></i></button>
		</div>
	</div>

</template>

<style>
.btn_sort_file.on {
    color: #fff;
    background-color: #0094D3;
}
.ico_star.on {
    background: rgba(0, 0, 0, 0) url(@/assets/images/common/ico_star_on.png) no-repeat 50% 50% !important;
}
</style>
