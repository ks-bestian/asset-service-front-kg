<script setup>
import {ref, onMounted, defineEmits} from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import FormModal from './FormModal.vue';
import { useStore } from '@/store';
import {useI18n} from "vue-i18n";
import { useConfirm } from "primevue/useconfirm";

const { t } = useI18n()
const store = useStore();
const confirm = useConfirm();

const list = ref([]);
const form = ref(null);
const showModal = ref(false);
//const uploadedFiles = ref([]);
const currentRow = ref(null);

const emit = defineEmits(['selectForm', 'formDeleted']); 

//new form
const fnCreate = () => {
    form.value = {
        form_id: '',
        file_nm: '',
        form_title: '',
        form_cn: '',
        fields: []
    };  
    showModal.value = true;
}

//get data 
const fnGetList = () => {
    store.API_LIST("/form").then((data) => {
        list.value = data.data.data;
    });
    currentRow.value = null;
};

//open detail form modal
const fnGetData = (event) => {
    const apiUrl = `/formWithFields/detail/${event.data.formId}`;

    store.API_LIST(apiUrl).then((data) => {
    const result = data.data.data;
  
    form.value = {
        form_id: result.formId,
        file_id: result.fileId,
        file_nm: result.fileNm,
        form_title: result.formTitle,
        form_cn: result.formCn,
        fields: result.fields || []
    };
    showModal.value = true;

    }).catch(({message}) => {
        console.log("message:", message);
    });
};

const fnFormDetail = ({ data }) => {
    currentRow.value = data.formId;
  
    emit('selectForm', {
        formId: data.formId,
        fileNm: data.fileNm,
        pdfFileId: data.pdfFileId
  });
};

/*confirmation */
const fnConfirm = (savedData) => {
    confirm.require({
        message: t('10155'),
        accept: () => {
            fnSave(savedData);
        },
        reject: () => {
        }
    });
}
const fnRequireDel = (event) => {
    confirm.require({
        target: event.currentTarget,
        message: t('10201'),
        accept: () => {
            fnDelete();
        },
        reject: () => {
        }
    })
}
//save callback
const fnSave = async (savedData) => {
    let fileId = '';
    let pdfFileId = '';

    //uploading the file
    if (savedData.uploadedFile && savedData.uploadedFile instanceof File) {
        try {
            const formData = new FormData();
            formData.append("file", savedData.uploadedFile);
            const uploadRes = await store.API_SAVE_FILE("/com/file/upload", formData);

            fileId = uploadRes?.data?.data?.fileId;
            pdfFileId = uploadRes?.data.data?.pdfFileId;
        } catch (err) {
            console.error("File upload failed:", err);
        }
    }
    const jsonData = {
        formId: savedData.form_id,
        fileId: fileId,
        fileNm: savedData.file_nm,
        formTitle: savedData.form_title,
        formCn: savedData.form_cn,
        fields: savedData.fields,
        pdfFileId: pdfFileId
    };
    // Save the form
    await store.API_SAVE("/formWithFields", jsonData);
    showModal.value = false;
    fnGetList();
}

//delete form
const fnDelete = async() => {
    if (currentRow.value) {
         await store.API_DELETE(`/form?formId=${currentRow.value}`).then(() => {
            emit('formDeleted');
            currentRow.value = null;
        }).catch(({ message }) => {
            console.log("message:", message);    
        });
        fnGetList();
    }
};

//close callback
const fnClose = () => {
    showModal.value = false;
}

// current row background 
const currentRowClass = (data) => {
    return data.formId === currentRow.value ? 'current-row' : '';
}

onMounted(() => {
    fnGetList();
});
</script>

<template>
    <div class="content_inner">
        <div class="content_section">

            <div class="board_info">
                <div class="left">
                    <div class="total_num">{{ t('10104') }} <span class="text_primary">{{  list.length }}</span></div>
                </div>
                <div class="right">
                    <div class="btn_wrap">
                        <button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnCreate"><span>{{ t('10103') }}</span></button>
                        <button type="button" class="v_btn btn_outline_primary btn_sm" @click="fnRequireDel"><span>{{ t('10173') }}</span></button>
                    </div>
                </div>
            </div>

            <div class="v_table table_list">
                <DataTable 
                    @row-dblclick="fnGetData" 
                    :value="list"
                    @row-click="fnFormDetail" 
                    :row-class="currentRowClass"
                    
                    paginator :rows="10" :rowsPerPageOptions="[5,10,20,50]" 
                    tableStyle="min-width: 50rem;"
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink prevPageLink PageLinks NextPageLink LastPageLink">
                    <Column field="ord" header="No" style="width: 10%;" class="text_center"></Column>  
                    <Column field="formTitle" :header="t('10414')" class="text_center"></Column>
                    <Column field="formCn" :header="t('10531')" class="text_center"></Column>
                    <Column field="fileNm" :header="t('10532')" class="text_center"></Column>
            
                    <template #empty>
                        <div class="no_data">
                            <i class="v_ico ico_error"></i>
                            <span class="text_msg">No templates</span>
                        </div>
                    </template>
                    
                </DataTable>        
            </div>
        </div>
    
        <FormModal
            v-if="showModal"
            :dialog="showModal"
            :form="form"
            @save="fnConfirm"
            @close="fnClose"
        /> 
    </div>

</template>


<style>
.no_data {
    display: flex;
    justify-content: center; 
    align-items: center;
    flex-direction: column;
    text-align: center;
    height: 16rem; 
}
.current-row {
    background-color: #e0f3ff !important; 
}

</style>
