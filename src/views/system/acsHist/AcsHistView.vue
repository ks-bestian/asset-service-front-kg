<script setup>
import { ref, onMounted } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useStore } from "@/store";
import dayjs from "dayjs";
import { isEmpty, replace } from 'lodash';
import TitleComp from "@/components/TitleComp.vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore();
const list = ref([]);
const searchNm = ref('');
const searchUrl = ref('');

const stDt = ref(dayjs().subtract(1, 'month').format('YYYY-MM-DD'));
const edDt = ref(dayjs().format('YYYY-MM-DD'));

const fnSearch = () => {

    if (isEmpty(stDt.value) || isEmpty(edDt.value)) {
        alert(t('10673'));
        return;
    }

    let param = {
        lang: localStorage.getItem('languageType'),
        memberNm: searchNm.value,
        url: searchUrl.value,
        stDt: replace(stDt.value, /-/g, ''),
        edDt: replace(edDt.value, /-/g, '')
    }

    store.API_LIST('/api/admin/acsHist', param).then((data) => {
        list.value = data.data.data
    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnExcelDownload = () => {
    // Header designation to include

    const selectedHeaders = ["memberNm", "regId", "reqUrl", "acsIp", 'regDt'];
    const wsCols = [t('10377'), t('10324'), t('10381'), t('10382'), t('10380')]; // Heather name array


    const title = t('10036') + t('10084');

    const data = list.value.map(item => ({
        ...item,
        regDt: dayjs(item.regDt).isValid() ? dayjs(item.regDt).format('DD/MM/YYYY HH:MM') : ''
    }))

    store.fnExcelDownload(data, selectedHeaders, wsCols, title);
};

const fnReset = () => {
    searchNm.value = '';
    searchUrl.value = '';
    stDt.value = dayjs().subtract(1, 'month').format('YYYY-MM-DD');
    edDt.value = dayjs().format('YYYY-MM-DD');
}

onMounted(() => {
    fnSearch();
})
</script>

<template>
    <div class="content_inner">
        <TitleComp />
        <!-- Main area -->
        <div class="content_section">
            <div class="board_search">
                <div class="search_inner">
                    <div class="form_row">
                        <div class="input_item">
                            <label class="form_label">{{ t('10152') }}</label>
                            <input type="text" class="form_control" v-model="searchNm" @keydown.enter="fnSearch">
                        </div>
                        <div class="input_item">
                            <label class="form_label">{{ t('10376') }}</label>
                            <!-- input type="date" -->
                            <input type="text" class="form_control" v-model="searchUrl" @keydown.enter="fnSearch">
                        </div>
                        <div class="input_item">
                            <label class="form_label">{{ t('10102') }}</label>
                            <input type="date" class="form_control" v-model="stDt">
                            <input type="date" class="form_control" v-model="edDt">
                        </div>
                    </div>
                </div>
                <div class="search_btn">
                    <button type="button" class="v_btn btn_primary btn_md" @click="fnSearch"><i
                            class="v_ico ico_search_white"></i><span>{{ t('10053') }}</span></button>
                    <button type="button" @click="fnReset" class="v_btn btn_outline_primary btn_md"><i
                            class="v_ico ico_reset_primary"></i><span></span></button>
                </div>
            </div>
            <nav class="tab_menu type2 mt_6">
            </nav>
            <div class="board_info">
                <div class="left">
                    <div class="total_num">{{ t('10104') }} <span class="text_primary">{{ list.length }}</span></div>
                </div>

                <div class="right">
                    <div class="btn_wrap">
                        <button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnExcelDownload"><i
                                class="v_ico ico_download_secondary"></i><span>{{ t('10055') }}</span></button>
                    </div>
                </div>
            </div>

            <div class="v_table table_list">
                <DataTable :value="list" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" :rowHover="false"
                    tableStyle="min-width: 50rem;"
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                    :pt="{ pcPaginator: {}, }">
                    <Column field="memberNm" :header="t('10377')" style="width: 7.8%;" class="text_center" sortable></Column>
                    <Column field="regId" :header="t('10324')" style="width: 10%;" class="text_center" sortable></Column>
                    <Column field="reqUrl" :header="t('10381')" style="width: 14%;" class="text_center"></Column>
                    <Column field="acsIp" :header="t('10382')" style="width: 10.4%;" class="text_center"></Column>
                    <Column field="regDt" :header="t('10380')" style="width: 16.9%;" class="text_center" sortable>
                        <template #body="{ data }">
                            {{ dayjs(data.regDt).isValid() ? dayjs(data.regDt).format('DD/MM/YYYY HH:mm:ss') : '' }}
                        </template>
                    </Column>
                    <template #empty>
                        <div class="no_data">
                            <i class="v_ico ico_error"></i>
                            <span class="text_msg">{{ t('10075') }}</span>
                        </div>
                    </template>
                </DataTable>
            </div>
        </div>
        <!-- // Main area -->
    </div>
</template>

<style scoped>
.no_data {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    height: 16rem;
}

::v-deep(.p-datatable .p-datatable-tbody > tr:hover td) {
  background-color: transparent !important;
  cursor: default !important;
}


</style>
