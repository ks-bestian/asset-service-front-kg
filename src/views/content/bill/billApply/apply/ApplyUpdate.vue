<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router'
import { useStore } from "@/store";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import PolyMemberModal from "@/components/modal/PolyMemberModal.vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import TitleComp from "@/components/TitleComp.vue";
import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { FormField } from '@primevue/forms';
import Textarea from 'primevue/textarea';
import BillFileInput from "@/views/content/billMng/common/billFileInput.vue";
import { useI18n } from 'vue-i18n'
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import BillFileList2 from "@/views/content/billMng/common/billFileList2.vue";

const { t } = useI18n()

const store = useStore();
const router = useRouter();
const route = useRoute();
const list = ref([]);
const applyDetail = ref([]);
const tabVal = ref('');
const openModal = ref(false);
const proposerList = ref([]);
const fileList = ref([]);
// const fileItems = ref([]);
// const myFileItems = ref([]);

const confirm = useConfirm();
const toast = useToast();
const lang = localStorage.getItem('languageType');

const fileUploads = ref([]);

const kgFileItems = [
    { id: 'inputFile1_1', kindCd: '110', label: t('10078'), lngType: 'lng_type_1', name: '110'},
    { id: 'inputFile1_2', kindCd: '120', label: t('10079'), lngType: 'lng_type_1', name: '120'},
    { id: 'inputFile1_3', kindCd: '130', label: t('10080'), lngType: 'lng_type_1', name: '130'},
    { id: 'inputFile1_4', kindCd: '100', label: t('10638'), lngType: 'lng_type_1', name: '135'}
];
const ruFileItems = [
    { id: 'inputFile2_1', kindCd: '110', label: t('10078'), lngType: 'lng_type_2', name: '140'},
    { id: 'inputFile2_2', kindCd: '120', label: t('10079'), lngType: 'lng_type_2', name: '150'},
    { id: 'inputFile2_3', kindCd: '130', label: t('10080'), lngType: 'lng_type_2', name: '160'},
    { id: 'inputFile2_4', kindCd: '100', label: t('10638'), lngType: 'lng_type_2', name: '165'}
];

/** Tap setting */
const fnTab = (val) => {
    tabVal.value = val;
};

const filteredData = computed(() => {
  if (tabVal.value === "") return proposerList.value;
  return proposerList.value.filter((item) => item.polyCd === tabVal.value);
});

/** Party group */
const groupedPoly = computed(() => {
  const map = new Map();
  
  proposerList.value.forEach(member => {
    if (!map.has(member.polyCd)) {
        map.set(member.polyCd, { polyCd: member.polyCd, polyNm: member.polyNm, count: 0 });
    }
    map.get(member.polyCd).count++;
  });

  return Array.from(map.values());
});

const fnRequireUpdate = (event) => {

    if(!fnValidate()) {
        console.log('!fnValidate');
		return;
	}

    confirm.require({
        target: event.currentTarget,
        message: t('10155'),
        accept: () => {
            fnUpdate();
        },
        reject: () => {
            toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
}

/** Save (fix) */
const fnUpdate = () => {
    const formData = new FormData();
    formData.append("billNameKg", applyDetail.value.billNameKg);
    formData.append("billNameRu", applyDetail.value.billNameRu);
    if(applyDetail.value.etcKg) {
        formData.append("etcKg", applyDetail.value.etcKg);
    }
    if(applyDetail.value.etcRu) {
        formData.append("etcRu", applyDetail.value.etcRu);
    }
    proposerList.value?.forEach((item) => {
        formData.append("proposerList", item.proposerId != null ? item.proposerId : item.memberId);
    });
    // for (var i = 0; i < fileItems.value?.length; ++i) {
    //     formData.append("files", fileItems.value[i]);
    //     formData.append("fileKindCds", fileItems.value[i].kind);
    //     formData.append("opbYns", fileItems.value[i].isPublic ? "Y" : "N");
    // }
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

    const apiUrl = `/bill/apply/update/${route.query.id}`;
    store.API_SAVE_FILE(apiUrl, formData).then((data) => {
        fnGoDetail(route.query.id);
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

/** particular */
const fnGoDetail = (billId) => {
    router.push({name: 'bill.apply.dtl', query: { id: billId }});
}

/** Modal Open */
const fnOpenModal = () => {
    openModal.value = true;
}

/** Details */
const fnSearch = () => {
    let params = {};
    params.lang = lang;

    const apiUrl = `/bill/apply/${route.query.id}`
    store.API_LIST(apiUrl, params).then((data) => {
        applyDetail.value = data.data.data.applyDetail;
        proposerList.value = data.data.data.proposerList.filter(data => data.proposerId !== applyDetail.value.ppsrId);
        fileList.value = data.data.data.applyFileList;

    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

/** List */
const fnGoList = () => {
    router.push({name: 'bill.apply'});
}

/** Initial inquiry */
const fnInit = () => {
    fnSearch();
}

/** Member modification */
const fnSetPropser = (item) => {
    proposerList.value = item;
    openModal.value = false;
}

/**File inquiry */
// const getFileByKind = (fileKindCd, lngType) => {
//   const file = fileList.value.find(data => data.fileKindCd === fileKindCd && data.lngType === lngType);


//   return file ? file.orgFileNm : '';
// };


// const getIsPublicByKind = (fileKindCd, lngType) => {
//   const file = fileList.value.find(data => data.fileKindCd === fileKindCd && data.lngType === lngType);


//   const ret = file && file.opbYn == 'Y';
//   return ret;
// };


const getFileList = (fileKindCd, lngType) => {
    if(!fileList.value) {
        return [];
    }
    return fileList.value.filter(data => data.fileKindCd === fileKindCd && data.lngType === lngType);
}

const fnRequireDel = (fileKindCd, lngType) => {
    confirm.require({
        target: event.currentTarget,
        message: t('10201'),
        accept: () => {
            fnDeleteFile(fileKindCd, lngType);
        },
        reject: () => {
            
        }
    });
}

/** File deletion */
const fnDeleteFile = (fileKindCd, lngType) => {
    const file = fileList.value.find(data => data.fileKindCd === fileKindCd && data.lngType === lngType);

    let params = {};
    params.orgFileId = file.orgFileId;

    const apiUrl = '/bill/file/delete';
    store.API_UPDATE(apiUrl, params).then((data) => {
        const index = fileList.value.findIndex(data => data.fileKindCd === fileKindCd && data.lngType === lngType);
        if (index !== -1) {
            fileList.value.splice(index, 1);
        }
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

/** Modify whether the file is disclosed */
const fnUpdateFileIsPublic = (fileKindCd, lngType, isPublic) => {
    const file = fileList.value.find(data => data.fileKindCd === fileKindCd && data.lngType === lngType);

    let params = {};
    params.orgFileId = file.orgFileId;
    params.opbYn = isPublic ? 'Y' : 'N';

    const apiUrl = '/bill/file/updateopen';
    store.API_UPDATE(apiUrl, params).then((data) => {

    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

const fnValidate = () => {
	const {errors} = resolver();
    console.log('errors', errors);
	return Object.keys(errors).length === 0;
}

const resolver = () => {
    const errors = {};
    if (!applyDetail.value.billNameKg) {
        errors.billNameKg = [{ message: 'billNameKg is required.' }];
    }
    if (!applyDetail.value.billNameRu) {
        errors.billNameRu = [{ message: 'billNameRu is required.' }];
    }
    // if(!getFileByKind('110') && !isFileIncluded('110')) {
    //     errors.file110 = [{ message: 'required.' }];
    // }
    // if(!getFileByKind('140') && !isFileIncluded('140')) {
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
    if(getFileList(fileKindCd, lngType).length) {
        return true;
    }
    return fileUploads.value.find(fileUpload => fileUpload.fileKindCd == fileKindCd && fileUpload.lngType == lngType) !== undefined;
}

// const isFileIncluded = (kind) => {
//     const found1 = fileItems.value.find(f => f.kind == kind);
//     const found2 = myFileItems.value.find(f => f.kind == kind);
//     return found1 != null || found2 != null;
// }


// const onchange = (kind, selection, type, isPublic) => {


//     if(!selection && !type) {
//         fnUpdateFileIsPublic(kind, isPublic);
//         return;
//     }


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
//     else if(type == 'mydoc') {
//         const fileId = selection[0].fileId;
//         myFileItems.value.push({ fileId, kind, isPublic });
//     }
// }


const onFileChange = (fileKindCd, selection, type, _isPublic, lngType) => {

    if(!selection && !type) {
        fnUpdateFileIsPublic(fileKindCd, lngType, _isPublic);
        return;
    }

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


onMounted(() => {
    fnInit();
})
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
                    <li>{{ t('10003') }}</li>
                </ul>
            </nav>
        </div> -->
        <TitleComp />
        <!-- Main area -->
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
                                <th scope="row">{{ t('10090') }}</th>
                                <td colspan="2">{{ applyDetail.sclDscRcpNmb }}</td>
                                <th scope="row">{{ t('10100') }}</th>
                                <td colspan="2">{{ applyDetail.regDate }}</td>
                            </tr>
                            <tr>
                                <th scope="row">{{ t('10067') }}<span class="text_red">*</span></th>
                                <td colspan="5">
                                    <!-- <textarea row="2" class="form_control full" v-model="applyDetail.billNameKg"></textarea> -->
                                    <FormField v-slot="$field" name="billNameKg" initialValue="" style="flex-grow: 1;">
                                        <Textarea v-model="applyDetail.billNameKg" class="form_control" size="large" style="width: 100%; line-height: 1.5;"></Textarea>
                                        <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
                                    </FormField>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">{{ t('10068') }}<span class="text_red">*</span></th>
                                <td colspan="5">
                                    <!-- <textarea row="2" class="form_control full" v-model="applyDetail.billNameRu"></textarea> -->
                                    <FormField v-slot="$field" name="billNameRu" initialValue="" style="flex-grow: 1;">
                                        <Textarea v-model="applyDetail.billNameRu" class="form_control" size="large" style="width: 100%; line-height: 1.5;"></Textarea>
                                        <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
                                    </FormField>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">{{ t('10069') }}</th>
                                <td colspan="5">
                                    <textarea row="2" class="form_control full" v-model="applyDetail.etcKg"></textarea>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">{{ t('10070') }}</th>
                                <td colspan="5">
                                    <textarea row="2" class="form_control full" v-model="applyDetail.etcRu"></textarea>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">{{ t('10071') }}</th>
                                <td colspan="5">
                                    <div class="mb_2">
                                        <a href="javascript:void(0)" class="v_btn btn_secondary btn_sm" @click="fnOpenModal"><i class="v_ico ico_search_white_sm"></i><span>{{ t('10072') }}</span></a>
                                    </div>
                                    <!-- <nav class="tab_menu type2">
                                        <ul class="tab_list">
                                            <li class="on"><a href="javascript:void(0)" @click="fnTab('')">ALL({{ proposerList.length }})</a></li>
                                            <li v-for="(data, index) in groupedPoly" :key="data.polyCd">
                                                <a href="javascript:void(0)" @click="fnTab(data.polyCd)">
                                                    {{ data.polyNm }} ({{ data.count }})
                                                </a>
                                            </li>
                                        </ul>
                                    </nav> -->
                                    <Tabs value="" scrollable>
                                        <TabList class="tab_list">
                                            <Tab @click="fnTab('')" value="" class="tab_menu type3">
                                                {{ t('10083') }}({{ proposerList.length }})
                                            </Tab>
                                            <Tab v-for="tab in groupedPoly" :value="tab.polyCd" @click="fnTab(tab.polyCd)" class="tab_menu">
                                                {{ tab.polyNm }} ({{ tab.count }})
                                            </Tab>
                                        </TabList>
                                    </Tabs>
                                    <div class="v_table table_list type2 fixed_header"> 
                                        <DataTable 
                                            :value="filteredData"
                                            scrollable
                                            scrollHeight="200px"
                                            style="min-height: 200px"
                                        >
                                            <Column field="polyNm" :header="t('10073')" style="width: 30%;" class="text_center"></Column>
                                            <Column :field="lang === 'langTy1' ? 'memberNmKg' : 'memberNmRu'" :header="t('10074')" style="width: 60%;" class="text_center" />
                                            <template #empty>
                                                <div class="no_data" style="border-bottom: none; height: 11rem;">
                                                    <i class="v_ico ico_error"></i>
                                                    <span class="text_msg">{{ t('10075') }}</span>
                                                </div>
                                            </template>
                                        </DataTable>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">{{ t('10076') }}</th>
                                <td colspan="5">
                                    <div class="file_attatch">
                                        <div v-for="file in kgFileItems" :key="file.kindCd" class="form_row">
                                            <div class="input_item">
                                                <span class="form_label">{{ file.label }}<span class="text_red" v-if="file.kindCd == '110'">*</span></span>
                                                <div class="file_attatchments">
                                                    <BillFileList2 :fileList="getFileList(file.kindCd, file.lngType)" :deletable="true" @delete="fnRequireDel(file.kindCd, file.lngType)" />
                                                    <FormField v-slot="$field" :name="`file${file.name}`" initialValue="" style="flex-grow: 1;">
                                                        <BillFileInput @change="(selection, type, isPublic) => onFileChange(file.kindCd, selection, type, isPublic, file.lngType)" />
                                                        <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
                                                    </FormField>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">{{ t('10077') }}</th>
                                <td colspan="5">
                                    <div class="file_attatch">
                                        <div v-for="file in ruFileItems" :key="file.kindCd" class="form_row">
                                            <div class="input_item">
                                                <span class="form_label">{{ file.label }}<span class="text_red" v-if="file.kindCd == '110'">*</span></span>
                                                <div class="file_attatchments">
                                                    <BillFileList2 :fileList="getFileList(file.kindCd, file.lngType)" :deletable="true" @delete="fnRequireDel(file.kindCd, file.lngType)" />
                                                    <FormField v-slot="$field" :name="`file${file.name}`" initialValue="" style="flex-grow: 1;">
                                                        <BillFileInput @change="(selection, type, isPublic) => onFileChange(file.kindCd, selection, type, isPublic, file.lngType)" />
                                                        <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
                                                    </FormField>
                                                </div>
                                                
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
                <button type="submit" class="v_btn btn_primary btn_md" @click="fnRequireUpdate($event)">{{ t('10174') }}</button>
                <a href="javascript:void(0)" class="v_btn btn_outline_primary btn_md" @click="fnGoList">{{ t('10084') }}</a>
            </div>
        </Form>
        <!-- // Main area -->
    </div>
    <PolyMemberModal v-show=openModal :isOpen="openModal" @close="openModal = false" :memberList="proposerList" @save="fnSetPropser"></PolyMemberModal>
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
    background: #F3F5F6 !important;
    z-index: 0 !important;
}

.file_attatchments {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
}
</style>
