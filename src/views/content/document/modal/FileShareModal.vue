<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { DocumentService } from "../service/DocumentService";
import { Tab, TabList, TabPanel, TabPanels, Tabs, Tree } from "primevue";
import { useStore } from "@/store";
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
    file: Object,
	dialog: Boolean,
});

const emit = defineEmits(['close', 'reload']);

const visible = ref(props.dialog)
const store = useStore();
const deptTree = ref();
const userList = ref();
const selectedKey = ref({}); //Tree

const selectedRow = ref([]); //Table

const targetKind = ref('DEPT');
const sharedUserList = ref();
const sharedDeptList = ref();
const searchNm = ref();
const tabValue = ref('0');

const userId = store.loginInfo.userId;
const deptCd = store.loginInfo.deptCd;

watch([() => targetKind.value, () => tabValue.value], () => {
	searchNm.value = '';
	fnSearch();
})

const fnSearch = () => {
	if (tabValue.value == '0') { //Shared

		if (targetKind.value == 'DEPT') {
			getShareTargetsDept();
		}
		else {
			getShareTargetsIndv();
		}
	}
	else { //Shared user

		if(targetKind.value == 'DEPT') {
			getSharedDepts();
		}
		else {
			getSharedUsers();
		}
	}
}

const fnClose = (reload) => {
	// closeModal('#layer_folder_update');
	emit('close');
	if(reload) {
		emit('reload');
	}
}

const shareFile = (targetKind, targetId) => {

	const folderYn = props.file.folderYn;
	const folderId = props.file.folderYn == 'Y' ? props.file.folderId : null;
	const fileId = props.file.folderYn == 'N' ? props.file.fileId : null;

	DocumentService.shareFile(folderYn, folderId, fileId, targetKind, targetId).then(data => {
		fnSearch();
	})
}

const unshareFile = (targetKind, targetId) => {

	const folderYn = props.file.folderYn;
	const folderId = props.file.folderYn == 'Y' ? props.file.folderId : null;
	const fileId = props.file.folderYn == 'N' ? props.file.fileId : null;

	DocumentService.unshareFile(folderYn, folderId, fileId, targetKind, targetId).then(data => {
		fnSearch();
	})
}

const getShareTargets = () => {
	const folderYn = props.file.folderYn;
	const folderId = props.file.folderYn == 'Y' ? props.file.folderId : null;
	const fileId = props.file.folderYn == 'N' ? props.file.fileId : null;

	return DocumentService.getShareTargets(folderYn, folderId, fileId, targetKind.value);
}

const getSharedDepts = () => {
	const p1 = DocumentService.getDeptList();
	const p2 = getShareTargets();
	
	Promise.all([p1, p2]).then(([data1, data2]) => {
		const set = new Set();
		for(var i = 0; i < data2?.length; ++i) {
			const targetId = data2[i].targetId;
			set.add(targetId);
		}

		sharedDeptList.value = data1.filter(dept => set.has(dept.deptCd));
		sharedDeptList.value.forEach(dept => {
			dept.shareYn = 'Y';
		})
		console.log('getSharedDepts', sharedDeptList.value);
	});
}

const getSharedUsers = () => {
	const p1 = DocumentService.getUserList(searchNm.value);
	const p2 = getShareTargets();

	Promise.all([p1, p2]).then(([data1, data2]) => {
		const set = new Set();
		for(var i = 0; i < data2?.length; ++i) {
			const targetId = data2[i].targetId;
			set.add(targetId);
		}

		sharedUserList.value = data1.filter(user => set.has(user.userId));
		sharedUserList.value.forEach(user => {
			user.shareYn = 'Y'
		});
	});
}

const getShareTargetsDept = () => {
	const p1 = DocumentService.getDeptTree();
	const p2 = getShareTargets();
	
	Promise.all([p1, p2]).then(([data1, data2]) => {
		deptTree.value = data1;

		const set = new Set();
		for(var i = 0; i < data2?.length; ++i) {
			const targetId = data2[i].targetId;
			set.add(targetId);
		}

		const setShareYn = (arr) => {
			for(var i = 0; i < arr?.length; ++i) {
				arr[i].shareYn = set.has(arr[i].key) ? 'Y' : 'N';
				setShareYn(arr[i].children);
			}
		}

		setShareYn(deptTree.value);
	});
}



const getShareTargetsIndv = () => {
	const p1 = DocumentService.getUserList(searchNm.value);
	const p2 = getShareTargets();

	Promise.all([p1, p2]).then(([data1, data2]) => {
		userList.value = data1;

		const set = new Set();
		for(var i = 0; i < data2?.length; ++i) {
			const targetId = data2[i].targetId;
			set.add(targetId);
		}

		userList.value.forEach(user => {
			user.shareYn = set.has(user.userId) ? 'Y' : 'N';
		});
	});
}

onMounted(() => {
	fnSearch();
});

</script>
<template>
	<!-- Layer pop -up (shared) -->
	<Dialog v-model:visible="visible" modal :style="{ width: '45vw', height: '68vh' }" @hide="emit('close')">

		<template #header>
            <div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
                <h2 class="popup_tit">{{ t('10588') }}</h2>
            </div>
        </template>

		<div class="popup_inner">
			<div class="popup_body" style="max-height: 100%;">
				<div class="popup_cont">
					<div class="form_col type3 mb_4">
						<div class="input_item">
							<label class="form_label">{{ t('10592') }} <span class="text_red">*</span></label>
							<div class="check_area type2">
								<span class="check_item check_item_custom">
									<input type="radio" name="inputRadio1" id="inputRadio1_2" :checked="targetKind == 'DEPT'" @change="targetKind = 'DEPT'">
									<label for="inputRadio1_2">{{ t('10347') }}</label>
								</span>
								<span class="check_item check_item_custom">
									<input type="radio" name="inputRadio1" id="inputRadio1_3" :checked="targetKind == 'INDV'" @change="targetKind = 'INDV'">
									<label for="inputRadio1_3">{{ t('10593') }}</label>
								</span>
							</div>
						</div>
					</div>
					<Tabs v-model:value="tabValue">
                        <TabList>
                            <Tab value="0">{{ t('10594') }}</Tab>
                            <Tab value="1">{{ targetKind == 'DEPT' ? t('10595') : t('10596') }}</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel value="0">
								<div class="v_box" v-if="targetKind == 'DEPT'">
									<div class="scroll_inner">
										<Tree :value="deptTree" selectionMode="single" v-model:selectionKeys="selectedKey">
											<template v-slot:default="{ node }">
												<div>
													{{ node.label }}
													<span v-if="node.key != deptCd">
														<button type="button" class="v_btn btn_sort_file" style="margin-left: 1rem;" v-if="node.shareYn == 'N'" @click="shareFile('DEPT', node.key)">{{ t('10594') }}</button>		
														<button type="button" class="v_btn btn_sort_file on" style="margin-left: 1rem;" v-else @click="unshareFile('DEPT', node.key)">{{ t('10597') }}</button>		
													</span>
												</div>
											</template>
										</Tree>
									</div>
								</div>
								
								<div v-if="targetKind == 'INDV'">
									<div class="board_search mb_4">
										<div class="search_inner">
											<div class="form_row">
												<div class="input_item">
													<label class="form_label">{{ t('10377') }}</label>
													<input type="text" class="form_control" placeholder="" v-model="searchNm" @keydown.enter="getShareTargetsIndv">
												</div>
											</div>
										</div>
										<div class="search_btn">
											<button type="button" class="v_btn btn_primary btn_md"><i class="v_ico ico_search_white" @click="getShareTargetsIndv"></i><span>{{ t('10053') }}</span></button>
										</div>
									</div>
									<DataTable :value="userList" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
										paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
										tableStyle="min-width: 50rem;" v-model:selection="selectedRow" dataKey="userId">
										<Column selectionMode="multiple" style="width: 4.8%" class="text_center"></Column>
										<Column field="deptNm" :header="t('10363')" style="width: 30%;" class="text_center"></Column>
										<Column field="userNm" :header="t('10377')" class="text_center"></Column>
										<Column field="" header="" style="width: 9.6%;" class="text_center">
											<template #body="{ data }">
												<div v-if="data.userId != userId">
													<button type="button" class="v_btn btn_sort_file" v-if="data.shareYn == 'N'" @click="shareFile('INDV', data.userId)">{{ t('10594') }}</button>
													<button type="button" class="v_btn btn_sort_file on" v-else @click="unshareFile('INDV', data.userId)">{{ t('10597') }}</button>
												</div>
											</template>
										</Column>
									</DataTable>
								</div>
							</TabPanel>
							<TabPanel value="1">
								<div v-if="targetKind == 'DEPT'">
									<DataTable :value="sharedDeptList" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
										paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
										tableStyle="min-width: 50rem;"
										v-model:selection="selectedRow" dataKey="deptCd">
										<Column selectionMode="multiple" style="width: 4.8%" class="text_center"></Column>
										<Column field="deptNm" :header="t('10363')" class="text_center"></Column>
										<Column field="" header="" style="width: 9.6%;" class="text_center">
											<template #body="{ data }">
												<div v-if="data.deptCd != deptCd">
													<button type="button" class="v_btn btn_sort_file" v-if="data.shareYn == 'N'" @click="shareFile('DEPT', data.deptCd)">{{ t('10594') }}</button>
													<button type="button" class="v_btn btn_sort_file on" v-else @click="unshareFile('DEPT', data.deptCd)">{{ t('10597') }}</button>
												</div>
											</template>
										</Column>
									</DataTable>
								</div>
								
								<div v-if="targetKind == 'INDV'">
									<div class="board_search mb_4">
										<div class="search_inner">
											<div class="form_row">
												<div class="input_item">
													<label class="form_label">{{ t('10377') }}</label>
													<input type="text" class="form_control" placeholder="" v-model="searchNm" @keydown.enter="getSharedUsers">
												</div>
											</div>
										</div>
										<div class="search_btn">
											<button type="button" class="v_btn btn_primary btn_md"><i class="v_ico ico_search_white" @click="getSharedUsers"></i><span>{{ t('10053') }}</span></button>
										</div>
									</div>
									<DataTable :value="sharedUserList" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
										paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
										tableStyle="min-width: 50rem;"
										v-model:selection="selectedRow" dataKey="userId">
										<Column selectionMode="multiple" style="width: 4.8%" class="text_center"></Column>
										<Column field="deptNm" :header="t('10363')" style="width: 30%;" class="text_center"></Column>
										<Column field="userNm" :header="t('10377')" class="text_center"></Column>
										<Column field="" header="" style="width: 9.6%;" class="text_center">
											<template #body="{ data }">
												<div v-if="data.userId != userId">
													<button type="button" class="v_btn btn_sort_file" v-if="data.shareYn == 'N'" @click="shareFile('INDV', data.userId)">{{ t('10594') }}</button>
													<button type="button" class="v_btn btn_sort_file on" v-else @click="unshareFile('INDV', data.userId)">{{ t('10597') }}</button>
												</div>
											</template>
										</Column>
									</DataTable>
								</div>
							</TabPanel>
						</TabPanels>
					</Tabs>
				</div>
				<div class="popup_footer">
					<div class="btn_group">
						<button type="button" class="v_btn btn_outline_neutral btn_md" @click="fnClose(false)">{{ t('10153') }}</button>
						<!-- <button type="button" class="v_btn btn_primary btn_md" @click="fnSave">{{ t('10174') }}</button> -->
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
