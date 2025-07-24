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
import BillFileList2 from "../common/billFileList2.vue";

const { t } = useI18n()

const store = useStore();
const confirm = useConfirm();
const emit = defineEmits(["close","reload"]);
const props = defineProps({
	id: String,
	dialog: Boolean,
	review: Object,
});

const visible = ref(props.dialog);
const files = ref();
const myFiles = ref();
const rmrkKg = ref(props.review?.rmrkKg);
const rmrkRu = ref(props.review?.rmrkRu);
const ebsfileList = ref(props.review?.ebsfileList);
const rsltDt = ref( dayjs(props.review?.rsltDt).isValid() ? dayjs(props.review?.rsltDt).format('YYYY-MM-DD') : '' );
const isPublic = ref(false);

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

	formData.append("billId", props.id);
	formData.append("rsltDt", rsltDt.value.replace(/-/g, ''));
	if(rmrkKg.value) {
		formData.append("rmrkKg", rmrkKg.value);
	}
	if(rmrkRu.value) {
		formData.append("rmrkRu", rmrkRu.value);
	}
	formData.append("fileKindCd","280"); //Government review document

	formData.append("clsCd","325"); //Government transfer

	for (var i = 0; i < files.value?.length; ++i) {
        formData.append("files", files.value[i]);
    }
	for(var i = 0; i < myFiles.value?.length; ++i) {
		formData.append("myFileIds", myFiles.value[i].fileId);
	}
	formData.append("opbYn", isPublic.value ? "Y" : "N"); //File disclosure


	if(props.review?.seq !== undefined) {
		formData.append("seq", props.review?.seq);
	}

	const apiUrl = '/bill/review/billMng/detail';
	store.API_SAVE_FILE(apiUrl, formData).then((data) => {
		fnClose(true);
	}).catch(({message}) => {
		console.log("message : ", message);
	})

}

const onFileChange = (selection, type, _isPublic) => {
	if (type == 'file') {
		files.value = selection;
		myFiles.value = null;
	}
	else {
		files.value = null;
		myFiles.value = selection;
	}
	isPublic.value = _isPublic;
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

	if(!rsltDt.value) {
		errors.rsltDt = [{ message: 'required.' }];
	}
	if(!isFileIncluded()) {
		errors.file = [{ message: 'required.' }];
	}

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
				<h2 class="popup_tit">{{ t('10234') }}</h2>
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
											<FormField v-slot="$field" name="rsltDt" initialValue="" style="flex-grow: 1;">
												<input type="date" class="form_control" v-model="rsltDt">
												<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
											</FormField>
										</td>
									</tr>
									<tr>
										<th scope="row">{{ t('10122') }}<span class="text_red">*</span></th>
										<td colspan="3">
											<BillFileList2 :fileList="ebsfileList" :deletable="true" @delete="delFile" />
											<!-- <div class="file_attatch" v-for="file in ebsfileList" :key="file.orgFileId">
												<div class="form_col type4">
													<div class="input_item">
														<div class="input_group">
															<input type="text" class="form_control" :value="file.orgFileNm" readonly>
															<span class="input_addon">
																<button type="button" class="v_btn" @click="store.API_FILE_DOWN(file.orgFileId, file.orgFileNm);"><i class="v_ico ico_download"></i></button>
																<button type="button" class="v_btn" @click="delFile(file.orgFileId)"><i class="v_ico ico_trashcan"></i></button>
															</span>
														</div>
													</div>
												</div>
											</div> -->
											<div class="file_attatch">
												<FormField v-slot="$field" name="file" initialValue="" style="flex-grow: 1;">
													<BillFileInput multiple button-name="file" @change="(selection, type, isPublic) => onFileChange(selection, type, isPublic)" />
													<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
												</FormField>
												
												<!-- <div class="form_col type4">
													<div class="input_item">
														<div class="input_group">
															<input type="file" class="form_file" id="inputFile1_1" multiple @change="e => files = e.target.files">
															<input type="text" class="form_control file_name">
															<span class="input_addon">
																<label class="v_btn btn_outline_primary btn_sm btn_file" for="inputFile1_1">{{ t('10122') }}</label>
															</span>
														</div>
													</div>
												</div> -->
											</div>
										</td>
									</tr>
									<tr>
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
									</tr>
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
