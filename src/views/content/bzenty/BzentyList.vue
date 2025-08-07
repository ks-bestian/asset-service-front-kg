<script setup>
import { ref, onMounted } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import TitleComp from "@/components/TitleComp.vue";
import { useStore } from "@/store";
import { useRouter } from 'vue-router'
import msg from '@/utils/message'
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
const router = useRouter();
const store = useStore();
const lang = ref(localStorage.getItem("languageType"));
const list = ref([]);
const searchBzentyNm = ref('');

const fnBzentyList = () => {
    let param = {
        lang: lang.value,
        bzentyNm: searchBzentyNm.value
    }
    store.API_LIST('/asset/bzenty', param).then((data) => {
        list.value = data.data.data;
        console.log(list.value)
    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnSearch = () => {
    fnBzentyList();
}

const fnRouteCreate = () => {
    router.push({name : 'asset.bzenty.form', params: { type: 'create', bzentyId: 'new' }});
}

const fnGoDetail = (e) => {
    console.log('e :: ',e)
    router.push({
        name : 'asset.bzenty.detail', params: { bzentyId: e.data.bzentyId }
    })
}

const fnReset = () => {
    searchBzentyNm.value = '';
    fnSearch();
}

const fnExcelDownload = () => {
    // Header designation to include

    const selectedHeaders = [ lang === 'lng_type_1' ? 'bzentyNm1' : (lang === 'lng_type_2' ? 'bzentyNm2' : 'bzentyNm3'), "telno", "eml", "picNm" ];
    const wsCols = [t('10752'), t('10358'), t('10359'), t('10759')];
    const title = t('10789')
    store.fnExcelDownload(list.value, selectedHeaders, wsCols, title);
};

onMounted(() => {
    //const nameError = msg.validation.missing('이름');
    //alert(nameError);
    
    fnBzentyList();
})
</script>

<template>
    <div class="content_inner">

        <TitleComp />

        <div class="content_section">
            <div class="board_search">
                <div class="search_inner">
                    <div class="form_row">

                        <div class="input_item">
                            <label class="form_label">{{ t('10752') }}</label>
                            <input type="text" class="form_control" v-model="searchBzentyNm" @keydown.enter="fnSearch">
                        </div>
                    </div>
                </div>

                <div class="search_btn">
                    <button type="button" class="v_btn btn_primary btn_md" @click="fnSearch">
                        <i class="v_ico ico_search_white"></i><span>{{ t("10053") }}</span></button>
                    <button type="button" @click="fnReset" class="v_btn btn_outline_primary btn_md">
                        <i class="v_ico ico_reset_primary"></i><span></span></button>
                </div>
            </div>


            <div class="board_info mt_6">
                <div class="left">
                    <div class="total_num">{{ "Total" }} <span class="text_primary">{{ list.length }}</span></div>
                </div>
                <div class="right">
                    <div class="btn_wrap">
                        <button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnExcelDownload">
                            <i class="v_ico ico_download_secondary"></i><span>{{ t('10055') }}</span>
                        </button>  
                        <button type="button" class="v_btn btn_outline_primary btn_sm" @click="fnRouteCreate">{{ t("10746") }}</button>
                        <!-- <button type="button" class="v_btn btn_outline_secondary btn_sm">{{ "선택 삭제" }}</button> -->
                         
                    </div>
                </div>
            </div>

            <div class="v_table table_list">
                <DataTable :value="list" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
                    tableStyle="min-width: 50rem;" @row-dblclick="fnGoDetail">
                    <Column :field="lang === 'lng_type_1' ? 'bzentyNm1' : (lang === 'lng_type_2' ? 'bzentyNm2' : 'bzentyNm3')" :header="t('10752')" class="text_center" sortable></Column>
                    <Column field="telno" :header="t('10358')" class="text_center" style="width: 9%;" sortable></Column>
                    <Column field="eml" :header="t('10359')" class="text_center" sortable></Column>
                    <Column field="picNm" :header="t('10759')" class="text_center" sortable></Column>
                    <template #empty>
                        <div class="no_data">
                            <i class="v_ico ico_error"></i>
                            <span class="text_msg">No data.</span>
                        </div>
                    </template>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style scoped>
.no_data {
    display: flex;
    /* 플렉스 박스 사용 */
    justify-content: center;
    /* 가로 가운데 정렬 */
    align-items: center;
    flex-direction: column;
}

:deep(.p-datatable-paginator-bottom) {
    border-style: none !important;
}
</style>