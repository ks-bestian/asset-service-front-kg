<script setup>
import { ref, computed, reactive, onMounted } from "vue";
import { DocumentService } from "../service/DocumentService";
import Dialog from 'primevue/dialog';
import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { FormField } from '@primevue/forms';
import { useConfirm } from "primevue";
import { useStore } from "@/store";
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
    folder: Object,
	dialog: Boolean,
});

const emit = defineEmits(['close', 'reload']);

const store = useStore();
const visible = ref(props.dialog)
const searchNm = ref();
const userList = ref();
const selectedRow = ref([]); //Table

const deptHeadYn = store.loginInfo?.deptHeadYn;
const userId = store.loginInfo?.userId;

const fnClose = (reload) => {
	// closeModal('#layer_new_folder');
	emit('close');
	if(reload) {
		emit('reload');
	}
}

const fnSearch = () => {
	DocumentService.getFolderAuthMapp(props.folder?.folderId, searchNm.value).then(data => {
		userList.value = data;
		console.log(userList.value);
	})
}

const fnSave = (e) => {
	const authMapp = userList.value.filter(data => data.dirty).map(data => {

		return {
			folderId: props.folder.folderId,
			deptCd: props.folder.deptCd,
			userId: data.userId,
			searchYn: data.searchYn,
			createFolderYn: data.createFolderYn,
			createFileYn: data.createFileYn,
			updateYn: data.updateYn,
			deleteYn: data.deleteYn,
		}
	})

	DocumentService.saveFolderAuthMapp(authMapp).then(data => {
		fnSearch();
	})
}

const checkAll = (e, field) => {
	const checked = e.target.checked;
	for(var i = 0; i < userList.value.length; i++) {
		const user = userList.value[i];
		if(user.deptHeadYn == 'Y' || props.folder.regId == user.userId) {
			continue;
		}
		if(user[field] != checked) {
			user[field] = checked;
			user.dirty = true;
		}
	}
}

onMounted(() => {
	fnSearch();
});

</script>
<template>
  <!-- Layer pop -up (folder rights) -->
  	<Dialog v-model:visible="visible" modal :style="{ width: '45vw', height: '68vh' }" @hide="emit('close')">

		<template #header>
            <div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
                <h2 class="popup_tit">{{ t('10589') }}({{ props.folder.folderNm }})</h2>
            </div>
        </template>

		<div class="popup_inner">
			<div class="popup_body" style="max-height: 100%;">
				<div class="popup_cont">
					<div class="board_search mb_4">
						<div class="search_inner">
							<div class="form_row">
								<div class="input_item">
									<label class="form_label">{{ t('10377') }}</label>
									<input type="text" class="form_control" placeholder="" v-model="searchNm" @keydown.enter="fnSearch">
								</div>
							</div>
						</div>
						<div class="search_btn">
							<button type="button" class="v_btn btn_primary btn_md"><i class="v_ico ico_search_white" @click="fnSearch"></i><span>{{ t('10053') }}</span></button>
						</div>
					</div>
					<DataTable :value="userList" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
						paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
						tableStyle="min-width: 50rem;"
						v-model:selection="selectedRow" dataKey="userId">
						<Column selectionMode="multiple" style="width: 5%" class="text_center"></Column>
						<Column field="deptNm" :header="t('10363')" style="width: 20%;" class="text_center"></Column>
						<Column field="userNm" :header="t('10377')" style="width: 20%;" class="text_center"></Column>
						<Column field="searchYn" :header="t('10053')" style="width: 11%;" class="text_center">
							<template #header>
								<input type="checkbox" @change="e => checkAll(e, 'searchYn')" />
							</template>
							<template #body="{ data }">
								<input type="checkbox" v-model="data.searchYn" @change="data.dirty = true" :disabled="data.deptHeadYn == 'Y' || props.folder.regId == data.userId" />
							</template>
						</Column>
						<!-- <Column field="createYn" :header="t('10103')" class="text_center">
							<template #body="{ data }">
								<input type="checkbox" v-model="data.createYn" @change="data.dirty = true" :disabled="data.deptHeadYn == 'Y' || props.folder.regId == data.userId" />
							</template>
						</Column> -->
						<Column field="createFolderYn" :header="t('10671')" style="width: 11%;" class="text_center">
							<template #header>
								<input type="checkbox" @change="e => checkAll(e, 'createFolderYn')" />
							</template>
							<template #body="{ data }">
								<input type="checkbox" v-model="data.createFolderYn" @change="data.dirty = true" :disabled="data.deptHeadYn == 'Y' || props.folder.regId == data.userId" />
							</template>
						</Column>
						<Column field="createFileYn" :header="t('10670')" style="width: 11%;" class="text_center">
							<template #header>
								<input type="checkbox" @change="e => checkAll(e, 'createFileYn')" />
							</template>
							<template #body="{ data }">
								<input type="checkbox" v-model="data.createFileYn" @change="data.dirty = true" :disabled="data.deptHeadYn == 'Y' || props.folder.regId == data.userId" />
							</template>
						</Column>
						<Column field="updateYn" :header="t('10157')" style="width: 11%;" class="text_center">
							<template #header>
								<input type="checkbox" @change="e => checkAll(e, 'updateYn')" />
							</template>
							<template #body="{ data }">
								<input type="checkbox" v-model="data.updateYn" @change="data.dirty = true" :disabled="data.deptHeadYn == 'Y' || props.folder.regId == data.userId" />
							</template>
						</Column>
						<Column field="deleteYn" :header="t('10173')" style="width: 11%;" class="text_center">
							<template #header>
								<input type="checkbox" @change="e => checkAll(e, 'deleteYn')" />
							</template>
							<template #body="{ data }">
								<input type="checkbox" v-model="data.deleteYn" @change="data.dirty = true" :disabled="data.deptHeadYn == 'Y' || props.folder.regId == data.userId" />
							</template>
						</Column>
					</DataTable>
				</div>
				<div class="popup_footer">
					<div class="btn_group">
						<button type="button" class="v_btn btn_outline_neutral btn_md" @click="fnClose(false)">{{ t('10153') }}</button>
						<button type="submit" class="v_btn btn_primary btn_md" @click="fnSave">{{ t('10174') }}</button>
					</div>
				</div>
			</div>
		</div>
	</Dialog>
</template>

<style>
</style>
