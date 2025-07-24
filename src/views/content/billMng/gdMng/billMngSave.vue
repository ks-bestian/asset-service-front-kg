<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import PolyMemberModal from "@/components/modal/PolyMemberModal.vue";
import ConfirmModal from '@/components/modal/confirmModal.vue';
import TitleComp from "@/components/TitleComp.vue";
// import SearchMemberModal from "./searchMemberModal.vue";
import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { FormField } from '@primevue/forms';
import Textarea from 'primevue/textarea';
import BillFileInput from "@/views/content/billMng/common/billFileInput.vue";
import { useConfirm } from "primevue";
import { useStore } from "@/store";
import { isEmpty , replace} from 'lodash';
import dayjs from "dayjs";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const openModal = ref(false);
const confirmDialog = ref(null);
const tableDatas = ref([]);
const tabVal = ref('');
const lang = localStorage.getItem("languageType");
const router = useRouter();
const memberList = ref([]);
const billNameKg = ref(null);
const billNameRu = ref(null);
const etcKg = ref(null);
const etcRu = ref(null);
const rcpDt = ref(dayjs().format('YYYY-MM-DD'));
// const fileItems = ref([]);
// const myFileItems = ref([]);

const ageObj = computed(() => store.getAgeObj);
const confirm = useConfirm();
const store = useStore();
const selectedProposer = ref();
const comCodes1005 = store.getComCodes(1005); //Bearter Type

const ppslKndCd = ref('2');

const fileUploads = ref([]);

/** Confirmation window */
const fnConfirm = (event) => {

	if (!fnValidate()) {
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

    formData.append("billNameKg", billNameKg.value);
    formData.append("billNameRu", billNameRu.value);
    if(etcKg.value) {
        formData.append("etcKg", etcKg.value);
    }
    if(etcRu.value) {
        formData.append("etcRu", etcRu.value);
    }
    formData.append("ppslKndCd", ppslKndCd.value);
    formData.append("naTermCd", ageObj.value.naTermCd);
    memberList.value?.forEach((member) => {
        formData.append("proposerList", member.memberId);
    });

	if(selectedProposer.value) {
		formData.append("ppsrId", selectedProposer.value.memberId);
	}

    // for (var i = 0; i < fileItems.value?.length; ++i) {
    //     formData.append("files", fileItems.value[i]);
    //     formData.append("fileKindCds", fileItems.value[i].kind);
	// 	formData.append("opbYns", fileItems.value[i].isPublic ? "Y" : "N");
    // }


    // // Add -In my documentation (20250221 Cho Jinho)

    // for (var i = 0; i < myFileItems.value?.length; ++i) {
    //     formData.append("myFileIds", myFileItems.value[i].fileId);
    //     formData.append("fileKindCds2", myFileItems.value[i].kind);
	// 	formData.append("opbYns2", myFileItems.value[i].isPublic ? "Y" : "N");
    // }


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

	formData.append("rcpDt", isEmpty(rcpDt.value) ? '': replace(rcpDt.value, /-/g, ''));
	formData.append("stepId", '1200');

    const apiUrl = '/bill/apply/register';
    store.API_SAVE_FILE(apiUrl, formData).then((data) => {

		store.toast.add({ severity: 'success', summary: 'Success', detail: `${t('10664')} : ${data.data.data.billNo}.`, life: 60000 });

        fnGoList();
    }).catch(({ message }) => {
        console.log("message : ", message);
    });
    
}

const fnGoList = () => {
	router.push({ name: 'billMng.gdMng.billMngRcList' });
};

/** Clinic */
const fnSetMember = (item) => {
    memberList.value = item;
    openModal.value = false;

	if(memberList.value?.length) {
		selectedProposer.value = memberList.value[0];
	}
}

/** Tap setting */
const fnTab = (val) => {
	tabVal.value = val;
};

const filteredData = computed(() => {
	if (tabVal.value === "") return memberList.value;
	return memberList.value.filter((item) => item.polyCd === tabVal.value);
});

/** Party group */
const groupedPoly = computed(() => {
    const map = new Map();

    memberList.value.forEach(member => {
        if (!map.has(member.polyCd)) {
            map.set(member.polyCd, { polyCd: member.polyCd, polyNm: member.polyNm, count: 0 });
        }
        map.get(member.polyCd).count++;
    });

    return Array.from(map.values());
});


const fnValidate = () => {
	const {errors} = resolver();
	return Object.keys(errors).length === 0;
}

const resolver = () => {
    const errors = {};
	
	if (!rcpDt.value) {
        errors.rcpDt = [{ message: 'rcpDt is required.' }];
    }
    if (!billNameKg.value) {
        errors.billNameKg = [{ message: 'billNameKg is required.' }];
    }
    if (!billNameRu.value) {
        errors.billNameRu = [{ message: 'billNameRu is required.' }];
    }
    if(!isFileIncluded('110', 'lng_type_1')) {
        errors.file110 = [{ message: 'required.' }];
    }
    if(!isFileIncluded('110', 'lng_type_2')) {
        errors.file140 = [{ message: 'required.' }];
    }

	if(ppslKndCd.value == '1' && !memberList.value?.length) {
		errors.proposerList = [{ message: 'proposerList is required.' }];
	}

    return {
        errors
    };
};

const isFileIncluded = (fileKindCd, lngType) => {
    return fileUploads.value.find(fileUpload => fileUpload.fileKindCd == fileKindCd && fileUpload.lngType == lngType) !== undefined;
}

const onFileChange = (fileKindCd, selection, type, _isPublic, lngType) => {

	fileUploads.value = fileUploads.value.filter(fileUpload => !(fileUpload.fileKindCd == fileKindCd && fileUpload.lngType == lngType));

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

</script>

<template>
	<div class="content_inner">
		<TitleComp />
		<!-- Main area -->
		<Form v-slot="$form" :resolver="resolver">
			<div class="content_section">
				<div class="v_table">
					<table>
						<colgroup>
							<col style="width: 13%;">
							<col>
							<col style="width: 13%;">
							<col style="width: 13.3%;">
							<col style="width: 13%;">
							<col style="width: 20.3%;">
						</colgroup>
						<tbody>
							<tr>
								<th scope="row">{{ t('10280') }}<span class="text_red">*</span></th>
								<td colspan="2">
									<select class="form_control" v-model="ppslKndCd">
										<option v-for="code in comCodes1005" :key="code.codeId" :value="code.codeId">{{ code.codeNm }}</option>
									</select>
									<select class="form_control" style="margin-left: 1rem;" v-if="ppslKndCd == '2'">
										<option hidden>{{ t('10177') }}</option>
										<option>{{ t('10684') }}</option>
									</select>
								</td>
								<!-- <th scope="row">{{ t('10292') }}</th>
								<td colspan="2">
									<input type="text" class="form_control" disabled>
									<span>{{ t('10685') }}</span>
								</td> -->
								<th scope="row">{{ t('10148') }}<span class="text_red">*</span></th>
								<td colspan="2">
									<FormField v-slot="$field" name="rcpDt" initialValue="" style="flex-grow: 1;">
										<!-- <input type="date" class="form_control" value="" v-model="rcpDt"> -->
										<InputText type="date" class="form_control" size="large" v-model="rcpDt" />
										<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
									</FormField>
								</td>
							</tr>
				
							<tr>
								<th scope="row">{{ t('10067') }}<span class="text_red">*</span></th>
								<td colspan="5">
									<!-- <textarea row="2" class="form_control full"></textarea> -->
									<FormField v-slot="$field" name="billNameKg" initialValue="" style="flex-grow: 1;">
										<Textarea v-model="billNameKg" class="form_control" size="large" style="width: 100%; line-height: 1.5;"></Textarea>
										<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
									</FormField>
								</td>
							</tr>
							<tr>
								<th scope="row">{{ t('10068') }}<span class="text_red">*</span></th>
								<td colspan="5">
									<!-- <textarea row="2" class="form_control full"></textarea> -->
									<FormField v-slot="$field" name="billNameRu" initialValue="" style="flex-grow: 1;">
										<Textarea v-model="billNameRu" class="form_control" size="large" style="width: 100%; line-height: 1.5;"></Textarea>
										<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
									</FormField>
								</td>
							</tr>
							<tr v-if="ppslKndCd == '1'">
								<th scope="row">{{ t('10121') }}<span class="text_red" v-if="ppslKndCd == '1'">*</span></th>
								<td colspan="5">
									<div class="mb_2">
										<a href="javascript:void(0)" @click="openModal = true" class="v_btn btn_secondary btn_sm"><i class="v_ico ico_search_white_sm"></i><span>{{ t('10072') }}</span></a>
									</div>
									<nav class="tab_menu type2">
										<ul class="tab_list">
											<li class="on"><a href="javascript:void(0)" @click="fnTab('')">ALL({{ memberList.length }})</a></li>
											<li v-for="(data, index) in groupedPoly" :key="data.polyCd">
												<a href="javascript:void(0)" @click="fnTab(data.polyCd)">
													{{ data.polyNm }} ({{ data.count }})
												</a>
											</li>
										</ul>
									</nav>
									<div class="v_table table_list type2 fixed_header">    
										<DataTable 
											:value="filteredData"
											scrollable
											scrollHeight="200px"
											style="min-height: 200px"
											v-model:selection="selectedProposer"
										>
											<Column :header="t('10106')" selectionMode="single" class="text_center" style="width: 20%;" ></Column>
											<Column field="polyNm" :header="t('10073')" class="text_center"></Column>
											<Column v-if="lang == 'langTy1'" field="memberNmKg" :header="t('10074')" class="text_center"></Column>
											<Column v-else field="memberNmRu" :header="t('10074')" class="text_center"></Column>
											<template #empty>
												<td class="no_data" style="border-bottom: none; height: 11rem;">
													<i class="v_ico ico_error"></i>
													<span class="text_msg">{{ t('10075') }}</span>
												</td>
											</template>
										</DataTable>
									</div>
									<FormField v-slot="$field" name="proposerList" initialValue="" style="flex-grow: 1;">
										<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
									</FormField>
								</td>
							</tr>
							<tr>
								<th scope="row">{{ t('10069') }}</th>
								<td colspan="5">
									<textarea row="2" class="form_control full" v-model="etcKg"></textarea>
								</td>
							</tr>
							<tr>
								<th scope="row">{{ t('10070') }}</th>
								<td colspan="5">
									<textarea row="2" class="form_control full" v-model="etcRu"></textarea>
								</td>
							</tr>

							<tr>
								<th scope="row">{{ t('10076') }}</th>
								<td colspan="5">
									<div class="file_attatch">
										<div class="form_row">
											<div class="input_item">
												<span class="form_label">{{ t('10078') }}<span class="text_red">*</span></span>
												<FormField v-slot="$field" name="file110" initialValue="" style="flex-grow: 1;">
													<BillFileInput @change="(selection, type, isPublic) => onFileChange('110', selection, type, isPublic, 'lng_type_1')" />
													<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
												</FormField>
											</div>
										</div>
										<div class="form_row">
                                            <div class="input_item">
                                                <span class="form_label">{{ t('10079') }}</span>
                                                <FormField v-slot="$field" name="file120" initialValue="" style="flex-grow: 1;">
                                                    <BillFileInput @change="(selection, type, isPublic) => onFileChange('120', selection, type, isPublic, 'lng_type_1')" />
                                                    <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
                                                </FormField>
                                            </div>
                                        </div>
                                        <div class="form_row">
                                            <div class="input_item">
                                                <span class="form_label">{{ t('10080') }}</span>
                                                <FormField v-slot="$field" name="file130" initialValue="" style="flex-grow: 1;">
                                                    <BillFileInput @change="(selection, type, isPublic) => onFileChange('130', selection, type, isPublic, 'lng_type_1')" />
                                                    <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
                                                </FormField>
                                            </div>
                                        </div>
										<div class="form_row">
                                            <div class="input_item">
                                                <span class="form_label">{{ t('10638') }}</span>
                                                <FormField v-slot="$field" name="file135" initialValue="" style="flex-grow: 1;">
                                                    <BillFileInput @change="(selection, type, isPublic) => onFileChange('100', selection, type, isPublic, 'lng_type_1')" />
                                                    <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
                                                </FormField>
                                            </div>
                                        </div>
									</div>
								</td>
							</tr>
							<tr>
								<th scope="row">{{ t('10077') }}</th>
								<td colspan="5">
									<div class="file_attatch">
                                        <div class="form_row">
                                            <div class="input_item">
                                                <span class="form_label">{{ t('10078') }}<span class="text_red">*</span></span>
                                                <FormField v-slot="$field" name="file140" initialValue="" style="flex-grow: 1;">
                                                    <BillFileInput @change="(selection, type, isPublic) => onFileChange('110', selection, type, isPublic, 'lng_type_2')" />
                                                    <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
                                                </FormField>
                                            </div>
                                        </div>
                                        <div class="form_row">
                                            <div class="input_item">
                                                <span class="form_label">{{ t('10079') }}</span>
                                                <FormField v-slot="$field" name="file150" initialValue="" style="flex-grow: 1;">
                                                    <BillFileInput @change="(selection, type, isPublic) => onFileChange('120', selection, type, isPublic, 'lng_type_2')" />
                                                    <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
                                                </FormField>
                                            </div>
                                        </div>
                                        <div class="form_row">
                                            <div class="input_item">
                                                <span class="form_label">{{ t('10080') }}</span>
                                                <FormField v-slot="$field" name="file160" initialValue="" style="flex-grow: 1;">
                                                    <BillFileInput @change="(selection, type, isPublic) => onFileChange('130', selection, type, isPublic, 'lng_type_2')" />
                                                    <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
                                                </FormField>
                                            </div>
                                        </div>
										<div class="form_row">
                                            <div class="input_item">
                                                <span class="form_label">{{ t('10638') }}</span>
                                                <FormField v-slot="$field" name="file165" initialValue="" style="flex-grow: 1;">
                                                    <BillFileInput @change="(selection, type, isPublic) => onFileChange('100', selection, type, isPublic, 'lng_type_2')" />
                                                    <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
                                                </FormField>
                                            </div>
                                        </div>
                                    </div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div class="btn_group_fixed">
				<button type="submit" class="v_btn btn_primary btn_md" @click="fnConfirm">{{ t('10174') }}</button>
				<a href="javascript:void(0)" class="v_btn btn_outline_primary btn_md" @click="fnGoList">{{ t('10084') }}</a>
			</div>
		</Form>
		<!-- // Main area -->
	</div>
		<!-- <SearchMemberModal  id="searchMember"/> -->
		<!-- <ConfirmModal ref="confirmDialog" /> -->
		<PolyMemberModal v-show=openModal :isOpen="openModal" @close="openModal = false" :memberList="memberList" @save="fnSetMember"></PolyMemberModal>
	

</template>

<style>
.no_data {
    display: flex; /* Flex box use */
    justify-content: center; /* Horizontal */
    align-items: center;
    flex-direction: column;
    height: 16rem; 
}

.p-datatable-scrollable > .p-datatable-table-container > .p-datatable-table > .p-datatable-thead {
    z-index: 0 !important;
    background: #F3F5F6 !important;
}
</style>
