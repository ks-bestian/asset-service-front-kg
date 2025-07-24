<script setup>
import { useStore } from "@/store";
import { Form, FormField } from '@primevue/forms';
import Dialog from 'primevue/dialog';
import Message from 'primevue/message';
import { useConfirm } from "primevue/useconfirm";
import { computed, defineEmits, defineExpose, ref } from "vue";
import { useI18n } from 'vue-i18n';
import BillFileInput from "../common/billFileInput.vue";

const { t } = useI18n()

const store = useStore();
const confirm = useConfirm();
const userInfo = store.loginInfo;

const emits = defineEmits(['fnReviewCallback']); // Event definition to parents

const visible = ref(false);
const billId = ref('');
const rmrkKg = ref();
const rmrkRu = ref();
const files = ref();
const myFiles = ref();
const cmtSeCd = ref();
const isPublic = ref(false);

const fileUploads = ref([]);

const FILE_KIND_CD = computed(() => {
	return cmtSeCd.value == 'M' ? '230' : '240'; // 230: Communication Documents, 240: Related Witness Documents

});

const fnSave = (event) => {

	if(!fnValidate()) {
		return;
	}

    confirm.require({
        target: event.currentTarget,
        message: t('10155'),
        accept: () => {
			
			const formData = new FormData();
			formData.append("billId", billId.value);
			formData.append("deptCd", userInfo.deptCd);
			if(rmrkKg.value) {
				formData.append("rmrkKg", rmrkKg.value);
			}
			if(rmrkRu.value) {
				formData.append("rmrkRu", rmrkRu.value);
			}
			// for (var i = 0; i < files.value?.length; ++i) {
			// 	formData.append("files", files.value[i]);
			// }
			// for(var i = 0; i < myFiles.value?.length; ++i) {
			// 	formData.append("myFileIds", myFiles.value[i].fileId);
			// }
			formData.append("opbYn", isPublic.value ? "Y" : "N"); //file access permission
			// const fileKindCd = cmtSeCd.value == 'M' ? '230' : '240'; //review document of the competent committee/review document of the relevant committee
			// formData.append("fileKindCd", fileKindCd);


			const clsCd = cmtSeCd.value == 'M' ? '160' : '190'; //Results of the Commission/Committee related to the committee

			formData.append("clsCd", clsCd);

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
			
			const apiUrl = '/bill/review/cmtMeetingRvReport';
			store.API_SAVE_FILE(apiUrl, formData).then((data) => {

				emits('fnReviewCallback');
				fnCancel();

			}).catch(({ message }) => {
				console.log("message : ", message);
			});


        },
        reject: () => {
        }
    });
};

const fnOpen = (_billId, _cmtSeCd) => {
    billId.value = _billId;
	cmtSeCd.value = _cmtSeCd;
    visible.value = true;
};

const fnCancel = () => {
    visible.value = false;
};

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

const fnValidate = () => {
	const {errors} = resolver();
	return Object.keys(errors).length === 0;
}

const resolver = () => {
    const errors = {};

	if(!isFileIncludedKg()) {
		errors.fileKg = [{ message: 'required.' }];
	}
	if(!isFileIncludedRu()) {
		errors.fileRu = [{ message: 'required.' }];
	}

	console.log('errors', errors);

    return {
        errors
    };
};

const isFileIncludedKg = () => {
	return fileUploads.value.filter(fileUpload => fileUpload.lngType == 'lng_type_1').length > 0
}

const isFileIncludedRu = () => {
	return fileUploads.value.filter(fileUpload => fileUpload.lngType == 'lng_type_2').length > 0
}

// const isFileIncluded = () => {
// 	if(files.value?.length) {
// 		return true;
// 	}
// 	if(myFiles.value?.length) {
// 		return true;
// 	}
// 	return false;
// }


defineExpose({ fnOpen });

</script>

<template>
    <Dialog v-model:visible="visible" modal  :style="{ width: '50vw', height: '54vh'}">
		<template #header>
			<div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
				<h2 class="popup_tit">{{ t('10205') }}</h2>
			</div>
		</template>
		<div class="popup_inner">
			<div class="popup_body">
				<Form v-slot="$form" :resolver="resolver">
					<div class="popup_cont">
						<div class="form_col type4 mb_2">
							<div class="input_item">
								<label class="form_label">{{ t('10076') }}<span class="text_red">*</span></label>
								<FormField v-slot="$field" name="fileKg" initialValue="" style="flex-grow: 1;">
									<BillFileInput multiple button-name="file" @change="(selection, type, isPublic) => onFileChange(FILE_KIND_CD, selection, type, isPublic, 'lng_type_1')" />
									<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
								</FormField>
							</div>
							<div class="input_item">
								<label class="form_label">{{ t('10077') }}<span class="text_red">*</span></label>
								<FormField v-slot="$field" name="fileRu" initialValue="" style="flex-grow: 1;">
									<BillFileInput multiple button-name="file" @change="(selection, type, isPublic) => onFileChange(FILE_KIND_CD, selection, type, isPublic, 'lng_type_2')" />
									<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
								</FormField>
							</div>
							<div class="input_item">
								<label class="form_label">{{ t('10069') }}</label>
								<textarea row="2" class="form_control full" style="height: 8rem;" v-model="rmrkKg"></textarea>
							</div>
							<div class="input_item">
								<label class="form_label">{{ t('10070') }}</label>
								<textarea row="2" class="form_control full" style="height: 8rem;" v-model="rmrkRu"></textarea>
							</div>
						</div>
					</div>
					<div class="popup_footer">
						<div class="btn_group">
							<button type="submit" class="v_btn btn_primary btn_md" @click="fnSave">{{ t('10174') }}</button>
							<button type="button" class="v_btn btn_outline_primary btn_md" @click="fnCancel">{{ t('10163') }}</button>
						</div>
					</div>
				</Form>
			</div>
		</div>
	</Dialog>
</template>

<style scoped>

</style>
