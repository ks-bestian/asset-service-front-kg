<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter, useRoute } from 'vue-router'
import { useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import { isEmpty , replace} from 'lodash';
import dayjs from "dayjs";

import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

import billAllInfoInc from "@/views/content/billMng/common/billAllInfoInc.vue";
import TitleComp from "@/components/TitleComp.vue";
import BillFileInput from "../common/billFileInput.vue";
import { useI18n } from 'vue-i18n'

import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { FormField } from '@primevue/forms';
import Textarea from 'primevue/textarea';
import BillFileList2 from "../common/billFileList2.vue";

const { t } = useI18n()

const router = useRouter();
const route = useRoute();
const store = useStore();
const confirm = useConfirm();

const userInfo = store.loginInfo;
const lang = localStorage.getItem("languageType");
const processVo = ref({});
const billLegalReviewVo = ref({});
const billIdRef = ref(route.query.id);
const billAllInfoIncRef = ref(null);
const billFileInputRef = ref();
const billFileInputRef2 = ref();
const toDate = ref(dayjs().format('YYYY-MM-DD'));

const FILE_KIND_CD = '190'; // Legal review document


// const files = ref();
// const myFiles = ref();

const isPublic = ref(false);

const fileUploads = ref([]);

/** Buttons */
const btnSave = ref(false);//save

const btnDelete = ref(false);//delete

const btnReport = ref(false);//Report


const ebsFileListKg = computed(() => {
	if(billLegalReviewVo.value && billLegalReviewVo.value.ebsfileList) {
		return billLegalReviewVo.value.ebsfileList.filter(file => file.lngType == 'lng_type_1');
	}
	return [];
})
const ebsFileListRu = computed(() => {
	if(billLegalReviewVo.value && billLegalReviewVo.value.ebsfileList) {
		return billLegalReviewVo.value.ebsfileList.filter(file => file.lngType == 'lng_type_2');
	}
	return [];
})

const fnAuthSetup = () => {

	console.log('billLegalReviewVo.value', billLegalReviewVo.value);

	let taskStatus = processVo.value.taskStatus;
	if(taskStatus != 'C') {//Unless it's completed


		if(isEmpty(billLegalReviewVo.value)) {
			btnSave.value = true;
			btnDelete.value = false;
			btnReport.value = false;
		} else {
			btnSave.value = true;
			btnDelete.value = true;
			btnReport.value = true;
		}

	}
};

const fnGoList = () => {
	router.push({ name: 'billMng.lgReviewMng.billMngList' });
};

/** Confirmation window */
const fnConfirm = (event) => {
    confirm.require({
        target: event.currentTarget,
        message: t('10175'),
        accept: () => {
			if(billLegalReviewVo.value.lglRvwRsltCode == '1') { //progress

				fnNextProcess();
			}
			else { //refusal

				fnNextProcess2();
			}
        },
        reject: () => {
        }
    });
}


/** Process progress */
const fnNextProcess = () => {

	const jsonData = {
		billId: route.query.id,
		stepId: '1300',
		taskId: route.query.taskId
	};

	const apiUrl = `/process/processMng/handleProcessStep`;
	store.API_SAVE(apiUrl, jsonData).then((data) => {
		fnGoList();
	}).catch(({ message }) => {
		console.log("message : ", message);
	})
}

/** Process progression (refusal) */
const fnNextProcess2 = () => {

	const jsonData = {
		billId: route.query.id,
		taskId: route.query.taskId,
		taskStatus: 'C'
	};

	const apiUrl = `/process/taskMng/taskUpdate`;
	store.API_SAVE(apiUrl, jsonData).then((data) => {
		fnGoList();
	}).catch(({ message }) => {
		console.log("message : ", message);
	});
}

/** save */
const fnSave = () => {

	if(!fnValidate()) {
		return;
	}

	confirm.require({
        target: event.currentTarget,
        message: t('10155'),
        accept: () => {

			console.log('billLegalReviewVo.value.seq', billLegalReviewVo.value.seq);

			const formData = new FormData();
			
			formData.append("billId", route.query.id);
			formData.append("deptCd", userInfo.deptCd);

			if(billLegalReviewVo.value.lglRvwRsltCode == '1') {
				billLegalReviewVo.value.rmrkKg = '';
				billLegalReviewVo.value.rmrkRu = '';
			}

			formData.append("rmrkKg", billLegalReviewVo.value.rmrkKg);
			formData.append("rmrkRu", billLegalReviewVo.value.rmrkRu);
			formData.append("rsltDt", isEmpty(billLegalReviewVo.value.rsltDt) ? '' : replace(billLegalReviewVo.value.rsltDt, /-/g, ''));
			formData.append("rsltCode", billLegalReviewVo.value.lglRvwRsltCode);
			formData.append("lglRvwRsltCode", billLegalReviewVo.value.lglRvwRsltCode);
			if(billLegalReviewVo.value.seq !== undefined) {
				formData.append("seq", billLegalReviewVo.value.seq);
			}
			formData.append("clsCd", '110'); //legal review result
			// formData.append("fileKindCd", '190'); //legal review document
			// for (var i = 0; i < files.value?.length; ++i) {
			// 	formData.append("files", files.value[i]);
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

			const apiUrl = `/bill/review/billMng/detail`;
			store.API_SAVE_FILE(apiUrl, formData).then((data) => {
				fnSearch();
				billAllInfoIncRef.value.fnSearch();
			}).catch(({ message }) => {
				console.log("message : ", message);
			});	
        },
        reject: () => {
        }
    });
}

/** delete */
const fnDelete = () => {

	confirm.require({
        target: event.currentTarget,
        message: t('10201'),
        accept: () => {

			let params = {};
			params.billId = route.query.id;
			params.seq = billLegalReviewVo.value.seq;
			params.detailSeq = billLegalReviewVo.value.seq;
			const apiUrl = `/bill/review/deleteCmtReview`;
			store.API_UPDATE(apiUrl, params).then((data) => {
				fnSearch();
				billAllInfoIncRef.value.fnSearch();
			}).catch(({ message }) => {
				console.log("message : ", message);
			});

        },
        reject: () => {
        }
    });

}

/** check */
const fnSearch = () => {

    let params = {};
	params.lang = lang;
	params.billId = route.query.id;
	params.clsCd = '110';
	params.taskId = route.query.taskId;
	params.assignedTo = userInfo.deptCd;
	const apiUrl = `/bill/review/billBillEtcInfo`;
	store.API_LIST(apiUrl, params).then((data) => {

		processVo.value = data.data.data.processVo;

		if(isEmpty(data.data.data.billlegalReviewVo)) {
			billLegalReviewVo.value = {};
		} else {
			billLegalReviewVo.value = data.data.data.billlegalReviewVo;
			billLegalReviewVo.value.rsltDt = dayjs(billLegalReviewVo.value.rsltDt).format('YYYY-MM-DD');
		}

		fnAuthSetup();

		fileUploads.value = [];
		// files.value = null;
		// myFiles.value = null;

		billFileInputRef.value.reset();
		billFileInputRef2.value.reset();

	}).catch(({ message }) => {
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
				// const index = billLegalReviewVo.value.ebsfileList.findIndex(file => file.orgFileId == orgFileId);
				// if (index !== -1) {
				// 	billLegalReviewVo.value.ebsfileList.splice(index, 1);
				// }


				fnSearch();
				billAllInfoIncRef.value.fnSearch();
				
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
    if (!billLegalReviewVo.value.lglRvwRsltCode) {
        errors.lglRvwRsltCode = [{ message: 'billLegalReviewVo is required.' }];
    }
    if (!billLegalReviewVo.value.rsltDt) {
        errors.rsltDt = [{ message: 'rsltDt is required.' }];
    }
	if(billLegalReviewVo.value.lglRvwRsltCode == '2') {
		if (!billLegalReviewVo.value.rmrkKg) {
			errors.rmrkKg = [{ message: 'rmrkKg is required.' }];
		}
		if (!billLegalReviewVo.value.rmrkRu) {
			errors.rmrkRu = [{ message: 'rmrkRu is required.' }];
		}
		// if(!isFileIncluded()) {
		// 	errors.file = [{ message: 'required.' }];
		// }

		if(!isFileIncludedKg()) {
			errors.fileKg = [{ message: 'required.' }];
		}
		if(!isFileIncludedRu()) {
			errors.fileRu = [{ message: 'required.' }];
		}
	}

	console.log('errors', errors);

    return {
        errors
    };
};

const isFileIncludedKg = () => {
	if(ebsFileListKg.value?.length) {
		return true;
	}
	return fileUploads.value.filter(fileUpload => fileUpload.lngType == 'lng_type_1').length > 0
}

const isFileIncludedRu = () => {
	if(ebsFileListRu.value?.length) {
		return true;
	}
	return fileUploads.value.filter(fileUpload => fileUpload.lngType == 'lng_type_2').length > 0
}

// const isFileIncluded = (fileKindCd) => {
// 	if(billLegalReviewVo.value.ebsfileList?.length) {
// 		return true;
// 	}
// 	if(files.value?.length) {
// 		return true;
// 	}
// 	if(myFiles.value?.length) {
// 		return true;
// 	}
// 	return false;
// }



onMounted(() => {
	
	fnSearch();
})

</script>

<template>
<div class="content_inner">
<TitleComp />
<!-- Main area -->
<Form v-slot="$form" :resolver="resolver">
	<div class="content_section">

		<h3 class="v_tit1">{{ t('10166') }}</h3>
		<billAllInfoInc ref="billAllInfoIncRef" :billId="billIdRef"/>

		<h3 class="v_tit1">{{ t('10058') }}</h3>
		<div class="v_table">
					<table>
				<colgroup>
					<col style="width: 16.3%;">
					<col>
					<col style="width: 16.3%;">
					<col style="width: 33.7%;">
				</colgroup>
				<tbody>
					<tr>
						<th scope="row">{{ t('10136') }}<span class="text_red">*</span></th>
						<td>
							<FormField v-slot="$field" name="lglRvwRsltCode" initialValue="" style="flex-grow: 1;">
								<div class="check_area">
									<span class="check_item">
										<input type="radio" name="inputRadio1" id="inputRadio1_1" value="1" v-model="billLegalReviewVo.lglRvwRsltCode">
										<label for="inputRadio1_1">{{ t('10167') }}</label>
									</span>
									<span class="check_item">
										<input type="radio" name="inputRadio1" id="inputRadio1_2" value="2" v-model="billLegalReviewVo.lglRvwRsltCode">
										<label for="inputRadio1_2">{{ t('10168') }}</label>
									</span>
								</div>
								<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
							</FormField>
						</td>
						<th scope="row">{{ t('10148') }}<span class="text_red">*</span></th>
						<td>
							<FormField v-slot="$field" name="rsltDt" initialValue="" style="flex-grow: 1;">
								<InputText type="date" class="form_control" size="large" v-model="billLegalReviewVo.rsltDt" />
								<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
							</FormField>
						</td>
					</tr>
					<tr>
						<th scope="row">{{ t('10076') }}<span class="text_red" v-if="billLegalReviewVo.lglRvwRsltCode == '2'">*</span></th>
						<td colspan="3">
							<BillFileList2 :fileList="ebsFileListKg" :deletable="processVo.taskStatus != 'C'" @delete="delFile" />
							<FormField v-slot="$field" name="fileKg" initialValue="" style="flex-grow: 1;">
								<BillFileInput multiple button-name="file" @change="(selection, type, _isPublic) => onFileChange(FILE_KIND_CD, selection, type, _isPublic, 'lng_type_1')" ref="billFileInputRef" />
								<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
							</FormField>	
						</td>
					</tr>
					<tr>
						<th scope="row">{{ t('10077') }}<span class="text_red" v-if="billLegalReviewVo.lglRvwRsltCode == '2'">*</span></th>
						<td colspan="3">
							<BillFileList2 :fileList="ebsFileListRu" :deletable="processVo.taskStatus != 'C'" @delete="delFile" />
							<FormField v-slot="$field" name="fileRu" initialValue="" style="flex-grow: 1;">
								<BillFileInput multiple button-name="file" @change="(selection, type, _isPublic) => onFileChange(FILE_KIND_CD, selection, type, _isPublic, 'lng_type_2')" ref="billFileInputRef2" />
								<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
							</FormField>	
						</td>
					</tr>
					<tr v-if="billLegalReviewVo.lglRvwRsltCode == '2'">
						<th scope="row">{{ t('10170') }}<span class="text_red">*</span></th>
						<td colspan="3">
							<FormField v-slot="$field" name="rmrkKg" initialValue="" style="flex-grow: 1;">
								<Textarea v-model="billLegalReviewVo.rmrkKg" class="form_control full" size="large" style="width: 100%; line-height: 1.5;"></Textarea>
								<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
							</FormField>
							<!-- <textarea row="2" class="form_control full" v-model="billLegalReviewVo.rmrkKg"></textarea> -->
						</td>
					</tr>
					<tr v-if="billLegalReviewVo.lglRvwRsltCode == '2'">
						<th scope="row">{{ t('10171') }}<span class="text_red">*</span></th>
						<td colspan="3">
							<FormField v-slot="$field" name="rmrkRu" initialValue="" style="flex-grow: 1;">
								<Textarea v-model="billLegalReviewVo.rmrkRu" class="form_control full" size="large" style="width: 100%; line-height: 1.5;"></Textarea>
								<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
							</FormField>
							<!-- <textarea row="2" class="form_control full" v-model="billLegalReviewVo.rmrkRu"></textarea> -->
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="btn_group_fixed">
			<button type="button" class="v_btn btn_outline_primary btn_md" @click="fnGoList">{{ t('10084') }}</button>
			<button type="submit" class="v_btn btn_primary btn_md"  @click="fnSave" v-if="btnSave">{{ t('10174') }}</button>
			<a href="javascript:void(0)" class="v_btn btn_primary btn_md"  @click="fnDelete" v-if="btnDelete">{{ t('10173') }}</a>
			<a href="javascript:void(0)" class="v_btn btn_primary btn_md"  @click="fnConfirm" v-if="btnReport">{{ t('10172') }}</a>
		</div>
	</div>
</Form>
<!-- // Main area -->
</div>
</template>

<style>
.file_attatch {
	margin: 0.5rem;
}
</style>
