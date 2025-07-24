<script setup>
import { ref, defineEmits, defineProps, onMounted, watch } from "vue";
import { useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import Dialog from 'primevue/dialog';
import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { FormField } from '@primevue/forms';
import { useI18n } from 'vue-i18n'
import Tag from 'primevue/tag';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';


const { t } = useI18n()
const store = useStore()
const emit = defineEmits(['close']);
const list = ref([])
const props = defineProps({
    deptCd: String,
    dialog: Boolean
})

const visible = ref(props.dialog)

const fnUserInDept = () => {
    let param = {
        lang: localStorage.getItem('languageType'),
        deptCd: props.deptCd
    }

    store.API_LIST('user/dept', param).then((data) => {//User-Cumbers, Committee, Political Party, Department

        list.value = data.data.data
    }).catch(({ message }) => {
        console.log(message)
    })
}

onMounted(() => {
    fnUserInDept();
})


</script>

<template>
    <!-- Layer pop -up (department registration) -->
    <Dialog v-model:visible="visible" modal :style="{ width: '45vw', minHeight: '20vh'}" @hide="emit('close')">

        <template #header>
            <div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
                <h2 class="popup_tit">{{ t('10365') }}</h2><!--Department registration-->
            </div>
        </template>
            <div class="flex items-center gap-4 mb-4">
                <div class="popup_inner">
                    <div class="popup_body">
                        <div class="popup_cont">
                            <div id="tab_cont2" class="tab_cont">
                                <div class="v_table table_list type2">
                                    <div class="board_info">
                                        <div class="left">
                                            <div class="total_num">{{ t('10104') }} <span class="text_primary">{{ list.length }}</span></div>
                                        </div>
                                    </div>
                                    <DataTable :value="list" :rows="10" scrollable scroll-height="33vh">
                                        <Column field="userNm" :header="t('10152')" class="text_center" sortable></Column>
                                        <Column field="email" :header="t('10331')" class="text_center"></Column>
                                        <Column field="jobNm" :header="t('10361')" class="text_center"></Column>
                                        <template #empty>
                                            <div class="no_data">
                                                <i class="v_ico ico_error"></i>
                                                <span class="text_msg">{{ t('10075') }}</span>
                                            </div>
                                        </template>
                                    </DataTable>
                                </div>
                            </div>
                        </div>
                        <div class="popup_footer" >
                            <div class="btn_group">
                                <button type="button" class="v_btn btn_outline_primary btn_md" @click="emit('close')">{{ t('10153') }}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </Dialog>
</template>

<style>
.p-dialog-header {
    background-color: #0094D3;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
}
</style>