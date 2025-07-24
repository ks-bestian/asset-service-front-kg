<script setup>
import { ref, computed, reactive, onMounted } from "vue";
import Dialog from 'primevue/dialog';
import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { FormField } from '@primevue/forms';
import { useConfirm } from "primevue";
import { useStore } from "@/store";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";
import BillFileInput from "../common/billFileInput.vue";
import { useI18n } from 'vue-i18n'
import BillFileList2 from "../common/billFileList2.vue";

const { t } = useI18n()

const props = defineProps({
	dialog: Boolean,
	legalActInfoList: Array,
	legalActInfo: Object
});

const emit = defineEmits(['close', 'reload']);

const router = useRouter();
const route = useRoute();
const confirm = useConfirm();
const store = useStore();
const visible = ref(props.dialog)
const comCodes1020 = store.getComCodes(1020);
const rsltDt = ref( dayjs(props.legalActInfo?.rsltDt).isValid() ? dayjs(props.legalActInfo?.rsltDt).format('YYYY-MM-DD') : '' );
const lglActRsltCode = ref(props.legalActInfo?.lglActRsltCode || '');
const files = ref();
const myFiles = ref();
const rmrkKg = ref(props.legalActInfo?.rmrkKg);
const rmrkRu = ref(props.legalActInfo?.rmrkRu);
const mainMtngList = ref([]);
const mtngId = ref(props.legalActInfo?.mtngId || '');
const ebsfileList = ref(props.legalActInfo?.ebsfileList);
const isPublic = ref(false);

const fileUploads = ref([]);

const FILE_KIND_CD = '250'; // Legal action



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

/** Save */
const fnSave = () => {
	const formData = new FormData();

	formData.append("billId", route.query.id);
	formData.append("taskId", route.query.taskId);

	formData.append("clsCd", '200');
	formData.append("rsltDt", rsltDt.value.replace(/-/g, ''));
	formData.append("lglActRsltCode", lglActRsltCode.value);
	if(rmrkKg.value) {
		formData.append("rmrkKg", rmrkKg.value);
	}
	if(rmrkRu.value) {
		formData.append("rmrkRu", rmrkRu.value);
	}
	formData.append("mtngId", mtngId.value);

	if(props.legalActInfo?.seq !== undefined) {
		formData.append("seq", props.legalActInfo?.seq);
	}

	// formData.append("fileKindCd","250");
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

	const apiUrl = '/bill/review/billMng/detail';
	store.API_SAVE_FILE(apiUrl, formData).then((data) => {
		fnClose(true);
	}).catch(({ message }) => {
		console.log("message : ", message);
	})

}

const getMainMtngList = () => {
	let params = {};
	params.billId = route.query.id;
	params.mtngTypeCd = '2'; //Plenary


	const apiUrl = `/bill/mtng/all/bybill`;
	store.API_LIST(apiUrl, params).then((data) => {
		mainMtngList.value = data.data.data;
		for(var i = 0; i < mainMtngList.value?.length; ++i) {
			const mtng = mainMtngList.value[i];
			for(var j = 0; j < props.legalActInfoList?.length; ++j) {
				const legalAct = props.legalActInfoList[j];
				if(mtng.mtngId == legalAct.mtngId) {
					mtng.legalActRegistered = true;
					break;
				}
			}
		}
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

	if(!mtngId.value) {
		errors.mtngId = [{ message: 'required.' }];
	}
	if(!rsltDt.value) {
		errors.rsltDt = [{ message: 'required.' }];
	}
	if(!lglActRsltCode.value) {
		errors.lglActRsltCode = [{ message: 'required.' }];
	}

    return {
        errors
    };
};

onMounted(() => {
	getMainMtngList();
})

</script>
<template>
	<!-- Layer pop -up (new folder) -->
	<Dialog v-model:visible="visible" modal :style="{ width: '45vw', height: '65vh' }" @hide="emit('close')">

		<template #header>
			<div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
				<h2 class="popup_tit">{{ t('10230') }}</h2>
			</div>
		</template>

		<div class="flex items-center gap-4 mb-4">
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
											<th scope="row">{{ t('10046') }}<span class="text_red">*</span></th>
											<td colspan="3">
												<FormField v-slot="$field" name="mtngId" initialValue="" style="flex-grow: 1;">
													<select class="form_control" v-model="mtngId">
														<option value="" disabled hidden>{{ t('10224') }}</option>
														<option v-for="mtng in mainMtngList" :value="mtng.mtngId" :disabled="mtng.legalActRegistered">
															{{ `${t('10046')} ${mtng.ageCd || ' '}${t('10584')} ${mtng.sessionNo || ' '}${t('10585')} ${mtng.sessionOrd || ' '}${t('10586')}` }}
														</option>
													</select>
													<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
												</FormField>
											</td>
										</tr>
										<tr>
											<th scope="row">{{ t('10144') }}<span class="text_red">*</span></th>
											<td>
												<FormField v-slot="$field" name="rsltDt" initialValue="" style="flex-grow: 1;">
													<input type="date" class="form_control" v-model="rsltDt">
													<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
												</FormField>
											</td>
											<th scope="row">{{ t('10136') }}<span class="text_red">*</span></th>
											<td>
												<FormField v-slot="$field" name="lglActRsltCode" initialValue="" style="flex-grow: 1;">
													<select class="form_control" v-model="lglActRsltCode">
														<option value="" disabled hidden>{{ t('10224') }}</option>
														<option v-for="code in comCodes1020" :value="code.codeId">{{ code.codeNm }}</option>
													</select>
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
								<button type="submit" class="v_btn btn_outline_primary btn_md"
									@click="fnConfirm">{{ t('10174') }}</button>
								<button type="button" class="v_btn btn_primary btn_md" @click="emit('close')">{{ t('10163') }}</button>
							</div>
						</div>
					</Form>
				</div>
			</div>
		</div>
	</Dialog>
</template>

<style>
.file_attatch {
	margin: 0.5rem;
}
</style>
