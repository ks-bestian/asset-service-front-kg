<script setup>
import { ref, computed } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import PolyMemberModal from "@/components/modal/PolyMemberModal.vue";
import { useStore } from "@/store";
import { useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";

import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import MyFolderModal from "@/views/content/document/modal/MyFolderModal.vue";
import TitleComp from "@/components/TitleComp.vue";
import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { FormField } from '@primevue/forms';
import Textarea from 'primevue/textarea';
import BillFileInput from "@/views/content/billMng/common/billFileInput.vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter();
const store = useStore();
const tabVal = ref('');
const openModal = ref(false);
const billNameKg = ref(null);
const billNameRu = ref(null);
const etcKg = ref(null);
const etcRu = ref(null);
const memberList = ref([]);
// const fileItems = ref([]);

const lang = localStorage.getItem("languageType");
const confirm = useConfirm();
const ageObj = computed(() => store.getAgeObj);

// Add -In my documentation (20250221 Cho Jinho)
// conf myfoldermodal = ref ({});
// conf ([]);


const fileUploads = ref([]);

/** Confirmation window */
const fnConfirm = (event) => {

    if(!fnValidate()) {
		return;
	}

    confirm.require({
        target: event.currentTarget,
        message: t('10155'), // T('10155')

        accept: () => {
            fnSave();
        },
        reject: () => {
        }
    });
}

/** Tap setting */
const fnTab = (val) => {
    tabVal.value = val;
};

const filteredData = computed(() => {
  if (tabVal.value === "") return memberList.value;
  return memberList.value.filter((item) => item.polyCd === tabVal.value);
});

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
    formData.append("ppslKndCd", "1"); //1: Submission of Clinic

    formData.append("naTermCd", ageObj.value.naTermCd) ;
    memberList.value?.forEach((member) => {
        formData.append("proposerList", member.memberId);
    });

    // for (var i = 0; i < fileItems.value?.length; ++i) {
    //     formData.append("files", fileItems.value[i]);
    //     formData.append("fileKindCds", fileItems.value[i].kind);
    //     formData.append("opbYns", fileItems.value[i].isPublic ? "Y" : "N");
    // }


    // Add -In my documentation (20250221 Cho Jinho)

    // for (var i = 0; i < myFileItems.value?.length; ++i) {
    //     formData.append("myFileIds", myFileItems.value[i].fileId);
    //     formData.append("fileKindCds2", myFileItems.value[i].kind);
    //     formData.append("opbYns2", myFileItems.value[i].isPublic ? "Y" : "N");
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

    const apiUrl = '/bill/apply';
    store.API_SAVE_FILE(apiUrl, formData).then((data) => {
        fnGoList();
    }).catch(({ message }) => {
        console.log("message : ", message);
    });
    
}

/** List */
const fnGoList = () => {
    router.push({name: 'bill.apply'})
}

/** Modal window open */
const fnOpenModal = () => {
    openModal.value = true;
}

/** Clinic */
const fnSetMember = (item) => {
    memberList.value = item;
    openModal.value = false;
}

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
    if (!billNameKg.value) {
        errors.billNameKg = [{ message: 'billNameKg is required.' }];
    }
    if (!billNameRu.value) {
        errors.billNameRu = [{ message: 'billNameRu is required.' }];
    }
    // if(!isFileIncluded('110')) {
    //     errors.file110 = [{ message: 'required.' }];
    // }
    // if(!isFileIncluded('140')) {
    //     errors.file140 = [{ message: 'required.' }];
    // }

    
    if(!isFileIncluded('110', 'lng_type_1')) {
        errors.file110 = [{ message: 'required.' }];
    }
    if(!isFileIncluded('110', 'lng_type_2')) {
        errors.file140 = [{ message: 'required.' }];
    }

    return {
        errors
    };
};

const isFileIncluded = (fileKindCd, lngType) => {
    return fileUploads.value.find(fileUpload => fileUpload.fileKindCd == fileKindCd && fileUpload.lngType == lngType) !== undefined;
}

// const isFileIncluded = (kind) => {
//     const found1 = fileItems.value.find(f => f.kind == kind);
//     const found2 = myFileItems.value.find(f => f.kind == kind);
//     return found1 != null || found2 != null;
// }


// const onchange = (kind, selection, type, isPublic) => {


//     fileItems.value = fileItems.value.filter(f => f.kind !== kind);
//     myFileItems.value = myFileItems.value.filter(f => f.kind !== kind);


//     if (type == 'file') {
//         const file = selection[0];
//         if (file) {
//             file.kind = kind; //Add KIND properties to file objects
//             file.isPublic = isPublic;
//             fileItems.value.push(file);
//         }
//     }
//     else if (type == 'mydoc') {
//         const fileId = selection[0].fileId;
//         myFileItems.value.push({ fileId, kind, isPublic });
//     }
// }


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
        <!-- <div class="content_util">
            <div class="title_wrap">
                <h2 class="content_tit">Маселе сунуштоо</h2>
                <button type="button" class="v_btn btn_favorite"><i class="v_ico ico_bookmark"></i></button>
            </div>
            <nav class="v_breadcrumb">
                <ul class="path">
                    <li><i class="v_ico ico_home"></i></li>
                    <li>{{ t('10002') }}</li>
                    <li>{{t('10003')}}</li>
                </ul>
            </nav>
        </div> -->
        <TitleComp />
        <Form v-slot="$form" :resolver="resolver">
            <div class="content_section">
                <div class="v_table">
                    <table>
                        <colgroup>
                            <col style="width: 14%;">
                            <col>
                            <col style="width: 13%;">
                            <col style="width: 20.3%;">
                            <col style="width: 13%;">
                            <col style="width: 20.3%;">
                        </colgroup>
                        <tbody>
                            <tr>
                                <th scope="row">{{ t('10067') }}<span class="text_red">*</span></th>
                                <td colspan="5">
                                    <!-- <textarea row="2" class="form_control full" v-model="billNameKg"></textarea> -->
                                    <FormField v-slot="$field" name="billNameKg" initialValue="" style="flex-grow: 1;">
                                        <Textarea v-model="billNameKg" class="form_control" size="large" style="width: 100%; line-height: 1.5;"></Textarea>
                                        <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
                                    </FormField>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">{{ t('10068') }}<span class="text_red">*</span></th>
                                <td colspan="5">
                                    <!-- <textarea row="2" class="form_control full" v-model="billNameRu"></textarea> -->
                                    <FormField v-slot="$field" name="billNameRu" initialValue="" style="flex-grow: 1;">
                                        <Textarea v-model="billNameRu" class="form_control" size="large" style="width: 100%; line-height: 1.5;"></Textarea>
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
                                <th scope="row">{{ t('10071') }}</th>
                                <td colspan="5">
                                    <div class="mb_2">
                                        <a href="javascript:void(0)" class="v_btn btn_secondary btn_sm" @click="fnOpenModal"><i class="v_ico ico_search_white_sm"></i><span>{{ t('10072') }}</span></a>
                                    </div>
                                    <Tabs value="" scrollable>
                                        <TabList class="tab_list">
                                            <Tab @click="fnTab('')" value="" class="tab_menu type3">
                                                {{ t('10083') }}({{ memberList.length }})
                                            </Tab>
                                            <Tab v-for="tab in groupedPoly" :value="tab.polyCd" @click="fnTab(tab.polyCd)" class="tab_menu">
                                                {{ tab.polyNm }} ({{ tab.count }})
                                            </Tab>
                                        </TabList>
                                    </Tabs>
                                    <!-- <nav class="tab_menu type2">
                                        <ul class="tab_list">
                                            <li class="on"><a href="javascript:void(0)" @click="fnTab('')">{{ t('10083') }}({{ memberList.length }})</a></li>
                                            <li v-for="(data, index) in groupedPoly" :key="data.polyCd">
                                                <a href="javascript:void(0)" @click="fnTab(data.polyCd)">
                                                    {{ data.polyNm }} ({{ data.count }})
                                                </a>
                                            </li>
                                        </ul>
                                    </nav> -->
                                    <div class="v_table table_list type2 fixed_header">    
                                        <DataTable 
                                            :value="filteredData"
                                            scrollable
                                            scrollHeight="200px"
                                            style="min-height: 200px"
                                        >
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
                                                    <BillFileInput multiple @change="(selection, type, isPublic) => onFileChange('100', selection, type, isPublic, 'lng_type_1')" />
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
    </div>

    <PolyMemberModal v-show=openModal :isOpen="openModal" @close="openModal = false" :memberList="memberList" @save="fnSetMember"></PolyMemberModal>
    <!-- <MyFolderModal v-if="myFolderModal.open" :dialog="myFolderModal.open" @close="myFolderModal.open = false" @selectFile="selectFile" /> -->
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

.tab_menu.type3{
    font-weight: 500; 
    font-size: 1.7rem; 
    padding: 1.5rem;
}
</style>

