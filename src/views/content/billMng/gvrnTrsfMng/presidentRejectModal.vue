<script setup>
import { ref, computed } from "vue";
import Dialog from 'primevue/dialog';
import { useConfirm } from "primevue/useconfirm";
import { useStore } from "@/store";
import dayjs from "dayjs";
import BillFileInput from "../common/billFileInput.vue";
import { useI18n } from 'vue-i18n'
import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { FormField } from '@primevue/forms';
import { useRoute } from "vue-router";
import BillFileList2 from "../common/billFileList2.vue";

const { t } = useI18n()

const route = useRoute();
const store = useStore();
const confirm = useConfirm();
const emit = defineEmits(["close","reload"]);
const props = defineProps({
	id: String,
	dialog: Boolean,
	review: Object,
});

console.log("props.review : ", props.review);

const visible = ref(props.dialog);
const files = ref();
const myFiles = ref();
const rmrkKg = ref(props.review?.rmrkKg);
const rmrkRu = ref(props.review?.rmrkRu);
const ebsfileList = ref(props.review?.ebsfileList);
const prsdRjctDt = ref( dayjs(props.review?.prsdRjctDt).isValid() ? dayjs(props.review?.prsdRjctDt).format('YYYY-MM-DD') : '' );
const prsdRjctNo = ref(props.review?.prsdRjctNo);
const isPublic = ref(false);

const fileUploads = ref([]);

const FILE_KIND_CD = '290'; // Presidential Rejection Review Document


const ebsFileListKg = computed(() => {
	if(ebsfileList.value) {
		return ebsfileList.value.filter(file => file.lngType == 'lng_type_1');
	}
	return [];
})
const ebsFileListRu = computed(() => {
	if(ebsfileList.value) {
		return ebsfileList.value.filter(file => file.lngType == 'lng_type_2');
	}
	return [];
})

const fnClose = (reload) => {
	emit('close');
	if(reload) {
		emit('reload');
	}
}

/** Confirmation window */
const fnConfirm = (event) => {

	if(!fnValidate()) {
		return;
	}

    confirm.require({
        target: event.currentTarget,
        message: t('10155'),
        accept: () => {
			fnSave();	
        },
        reject: () => {
        }
    });
}

/** save */
const fnSave = () => {
	const formData = new FormData();

	formData.append("billId", route.query.id);
	formData.append("taskId", route.query.taskId);
	formData.append("prsdRjctDt", prsdRjctDt.value.replace(/-/g, ''));
	formData.append("prsdRjctNo", prsdRjctNo.value);
	// if(rmrkKg.value) {
	// 	formData.append("rmrkKg", rmrkKg.value);
	// }
	// if(rmrkRu.value) {
	// 	formData.append("rmrkRu", rmrkRu.value);
	// }

	formData.append("clsCd","330"); //Presidential rejection

	
	// formData.append("fileKindCd","290"); //presidential veto review document
	// for (var i = 0; i < files.value?.length; ++i) {
    //     formData.append("files", files.value[i]);
    // }
	// for(var i = 0; i < myFiles.value?.length; ++i) {
	// 	formData.append("myFileIds", myFiles.value[i].fileId);
	// }
	// formData.append("opbYn", isPublic.value ? "Y" : "N"); //file disclosure status


	for (var i = 0; i < fileUploads.value?.length; ++i) {
		if(fileUploads.value[i].file) {
			formData.append(`fileUploads[${i}].file`, fileUploads.value[i].file);
		}
		if(fileUploads.value[i].fileId) {
			formData.append(`fileUploads[${i}].fileId`, fileUploads.value[i].fileId);
		}
		if(fileUploads.value[i].fileKindCd) {
			formData.append(`fileUploads[${i}].fileKindCd`, fileUploads.value[i].fileKindCd);
		}
		if(fileUploads.value[i].opbYn) {
			formData.append(`fileUploads[${i}].opbYn`, fileUploads.value[i].opbYn);
		}
		if(fileUploads.value[i].lngType) {
			formData.append(`fileUploads[${i}].lngType`, fileUploads.value[i].lngType);
		}
	}

	if(props.review?.seq !== undefined) {
		formData.append("seq", props.review?.seq);
	}

	const apiUrl = '/bill/review/billMng/presidentReject';
	store.API_SAVE_FILE(apiUrl, formData).then((data) => {
		fnClose(true);
	}).catch(({message}) => {
		console.log("message : ", message);
	})

}

const onFileChange = (fileKindCd, selection, type, _isPublic, lngType) => {

	fileUploads.value = fileUploads.value.filter(fileUpload => fileUpload.lngType != lngType);

	if (type == 'file') {
		// files.value = selection;
		// myFiles.value = null;

		for(var i = 0; i < selection?.length; ++i) {
			fileUploads.value.push({
				file: selection[i],
				fileKindCd: fileKindCd,
				opbYn: _isPublic ? 'Y' : 'N',
				lngType: lngType
			});
		}
	}
	else {
		// files.value = null;
		// myFiles.value = selection;

		for(var i = 0; i < selection?.length; ++i) {
			fileUploads.value.push({
				fileId: selection[i].fileId,
				fileKindCd: fileKindCd,
				opbYn: _isPublic ? 'Y' : 'N',
				lngType: lngType
			});
		}
	}
	// isPublic.value = _isPublic;

}

const delFile = (orgFileId) => {

	confirm.require({
		target: event.currentTarget,
		message: t('10201'),
		accept: () => {
			let params = {};
			params.orgFileId = orgFileId;

			const apiUrl = '/bill/file/delete';
			store.API_UPDATE(apiUrl, params).then((data) => {
				const index = ebsfileList.value.findIndex(file => file.orgFileId == orgFileId);
				if (index !== -1) {
					ebsfileList.value.splice(index, 1);
				}
			}).catch(({ message }) => {
				console.log("message : ", message);
			})
		},
		reject: () => {
		}
	});

}

const fnValidate = () => {
	const {errors} = resolver();
	return Object.keys(errors).length === 0;
}

const resolver = () => {
    const errors = {};

	if(!prsdRjctDt.value) {
		errors.prsdRjctDt = [{ message: 'required.' }];
	}
	if(!prsdRjctNo.value) {
		errors.prsdRjctNo = [{ message: 'required.' }];
	}
	// if(!isFileIncluded()) {
	// 	errors.file = [{ message: 'required.' }];
	// }


    return {
        errors
    };
};

const isFileIncluded = () => {
	if(ebsfileList.value?.length) {
		return true;
	}
	if(files.value?.length) {
		return true;
	}
	if(myFiles.value?.length) {
		return true;
	}
	return false;
}

</script>

<template>
	<Dialog v-model:visible="visible" modal :style="{ width: '50vw', height: '55vh'}" @hide="emit('close')">
		<template #header>
			<div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
				<h2 class="popup_tit">{{ t('10064') }}</h2>
			</div>
		</template>
		<div class="popup_inner">
			<div class="popup_body">
				<Form v-slot="$form" :resolver="resolver">
					<div class="popup_cont">
						<div class="v_table">
							<table>
								<colgroup>
									<col>
									<col>
									<col>
									<col>
								</colgroup>
								<tbody>
									<tr>
										<th scope="row">{{ t('10102') }}<span class="text_red">*</span></th>
										<td colspan="3">
											<FormField v-slot="$field" name="prsdRjctDt" initialValue="" style="flex-grow: 1;">
												<input type="date" class="form_control" v-model="prsdRjctDt">
												<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
											</FormField>
										</td>
									</tr>
									<tr>
										<th scope="row">{{ t('10632') }}<span class="text_red">*</span></th>
										<td colspan="3">
											<FormField v-slot="$field" name="prsdRjctNo" initialValue="" style="flex-grow: 1;">
												<input type="text" class="form_control" v-model="prsdRjctNo">
												<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
											</FormField>
										</td>
									</tr>
									<tr>
										<th scope="row">{{ t('10076') }}</th>
										<td colspan="3">
											<BillFileList2 :fileList="ebsFileListKg" :deletable="true" @delete="delFile" />
											<div class="file_attatch">
												<BillFileInput multiple button-name="file" @change="(selection, type, isPublic) => onFileChange(FILE_KIND_CD, selection, type, isPublic, 'lng_type_1')" />
											</div>
										</td>
									</tr>
									<tr>
										<th scope="row">{{ t('10077') }}</th>
										<td colspan="3">
											<BillFileList2 :fileList="ebsFileListRu" :deletable="true" @delete="delFile" />
											<div class="file_attatch">
												<BillFileInput multiple button-name="file" @change="(selection, type, isPublic) => onFileChange(FILE_KIND_CD, selection, type, isPublic, 'lng_type_2')" />
											</div>
										</td>
									</tr>
									<!-- <tr>
										<th scope="row">{{ t('10069') }}</th>
										<td colspan="3">
											<textarea rows="2" class="form_control full" v-model="rmrkKg"></textarea>
										</td>
									</tr>
									<tr>
										<th scope="row">{{ t('10070') }}</th>
										<td colspan="3">
											<textarea rows="2" class="form_control full" v-model="rmrkRu"></textarea>
										</td>
									</tr> -->
								</tbody>
							</table>
						</div>
					</div>
					<div class="popup_footer">
						<div class="btn_group">
							<button type="submit" class="v_btn btn_primary btn_md" @click="fnConfirm">{{ t('10089') }}</button>
							<button type="button" class="v_btn btn_outline_primary btn_md" @click="emit('close')">{{ t('10163') }}</button>
						</div>
					</div>
				</Form>
			</div>
		</div>
	</Dialog>
</template>

<style scoped>
.no_data {
    display: flex; /* Flex box use */
    justify-content: center; /* Horizontal */
    align-items: center;
    flex-direction: column;
    height: 16rem; 
}

:deep(.p-datatable-table-container) {
    min-height: 40rem !important;
    overflow-y: auto;
}
.file_attatch {
	margin: 0.5rem;
}
</style>
