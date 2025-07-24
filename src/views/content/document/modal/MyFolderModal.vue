<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { DocumentService } from "../service/DocumentService";
import { Tab, TabList, TabPanel, TabPanels, Tabs, Tree } from "primevue";
import { useStore } from "@/store";
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import dayjs from "dayjs";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
	dialog: Boolean,
	multiple: Boolean,
});

const emit = defineEmits(['close', 'reload', 'selectFile']);

const visible = ref(props.dialog)
const store = useStore();

const folderTree = ref([]);
const selectedKey = ref(null);
const expandedKey = ref({});
const curFolderId = ref();
const curFolder = ref();
const documents = ref([]);
const ROOT_FOLDER_NM = t('10081');

const selectedRow = ref([]); //Table


watch(() => curFolderId.value, () => {
    curFolder.value = DocumentService.findNode(folderTree.value, curFolderId.value);
	setSelectedKey();
    reloadFolder();

	selectedRow.value = [];
})

const fnClose = (reload) => {
	// closeModal('#layer_folder_update');
	emit('close');
	if(reload) {
		emit('reload');
	}
}

const init = () => {
    DocumentService.getMyFolderTree().then(data => {
		const root = {};
		root.folderId = -1;
		root.key = -1;
		root.label = ROOT_FOLDER_NM;
		root.icon = "pi pi-fw pi-folder";
		root.children = data;
		for(var i = 0; i < root.children.length; ++i) {
			root.children[i].upperFolder = root;
		}
        folderTree.value = [root];
		
		curFolderId.value = -1;
    })
}

const reloadFolder = () => {
    const folderId = curFolderId.value || -1;
    DocumentService.getMyFoldersAndFiles(folderId).then(ff => {
        documents.value = ff;
    })
}

const setSelectedKey = () => {
	selectedKey.value = {};
	if (curFolderId.value != null) {
		selectedKey.value[curFolderId.value] = true;
	}
	expandUpward(curFolder.value?.upperFolder)
}

const expandUpward = (node) => {
	if (!node) {
		return;
	}
	expandedKey.value[node.folderId] = true;
	expandUpward(node.upperFolder);
}

const onUpdateSelectionKeys = (selectionKeys) => {
	setSelectedKey();
}

const onTreeNodeSelect = (node) => {
    curFolderId.value = node.folderId;
};

const onRowDblclick = (e) => {
    if(e.data.folderYn == 'Y') {
		curFolderId.value = e.data.folderId;
    }
	else {
		fnSelect();
	}
}

const onRowClick = (e) => {
	selectedRow.value = [e.data];
}

const fileSelected = computed(() => {

	if(selectedRow.value?.length) {
		const selected = selectedRow.value.filter(row => row.folderYn == 'N');
		return selected?.length > 0
	}
	return false;
});

const fnSelect = () => {
	if(!fileSelected.value) {
		return;
	}
	const selected = selectedRow.value.filter(row => row.folderYn == 'N');
	emit('selectFile', selected);
	fnClose(false);
}

onMounted(() => {
	init();
});

</script>
<template>
	<!-- Layer pop -up (shared) -->
	<Dialog v-model:visible="visible" modal :style="{ width: '65vw', height: '78vh' }" @hide="emit('close')">

		<template #header>
            <div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
                <h2 class="popup_tit">{{ t('10081') }}</h2>
            </div>
        </template>

		<div class="popup_inner">
			<div class="popup_body" style="max-height: 100%;">
				<div class="popup_cont">
					<div class="content_row" style="width: 100%;">
						<div class="v_box" style="width: 25%;">
							<div class="scroll_inner">
								<Tree :value="folderTree" v-model:selectionKeys="selectedKey" v-model:expanded-keys="expandedKey" selectionMode="single" @node-select="onTreeNodeSelect"
									@update:selection-keys="onUpdateSelectionKeys"></Tree>
							</div>
						</div>
						<div class="table_list" style="flex-grow: 1;">
							<DataTable :value="documents" 
								tableStyle="min-width: 50rem;"
								:selectionMode="props.multiple ? 'multiple' : ''" :metaKeySelection="props.multiple"
								v-model:selection="selectedRow" dataKey="id" @row-dblclick="onRowDblclick" @row-click="onRowClick">
								<!-- <Column selectionMode="multiple" style="width: 4.8%" class="text_center"></Column> -->
								<Column field="title" :header="t('10310')" class="text_left">
									<template #body="{ data }">
										<div class="file_stat">
											<div class="btn_wrap">
												<button type="button" class="v_btn btn_mark" v-if="data.folderYn == 'Y'">
													<i :class="`v_ico ico_folder`"></i></button>
												<button type="button" class="v_btn btn_mark" :class="{on: data.favoriteYn == 'Y'}" v-if="data.folderYn == 'N'">
													<i :class="`v_ico ico_star`"></i></button>
											</div>
											<span>{{data.title}}</span>
										</div>
									</template>
								</Column>
								<Column field="fileSize" :header="t('10311')" style="width: 10%;" class="text_center">
									<template #body="{ data }">
										{{ store.formatFileSize(data.fileSize) }}
									</template>
								</Column>
								<!-- <Column field="regNm" :header="t('10099')" style="width: 9%;" class="text_center"></Column> -->
								<Column field="regDt" :header="t('10050')" style="width: 21.6%;" class="text_center">
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
							</DataTable>
						</div>
					</div>			
				</div>
				<div class="popup_footer">
					<div class="btn_group">
						<button type="button" class="v_btn btn_primary btn_md" @click="fnSelect" :disabled="!fileSelected">{{ t('10177') }}</button>
						<button type="button" class="v_btn btn_outline_neutral btn_md" @click="fnClose(false)">{{ t('10153') }}</button> 
					</div>
				</div>
			</div>
		</div>
	</Dialog>
</template>

<style>
.btn_sort_file.on {
	background-color: #0094D3;
}
</style>
