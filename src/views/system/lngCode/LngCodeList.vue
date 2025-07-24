<script setup>
import { ref, onMounted, computed } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useRouter } from "vue-router";
import { usePageStore, useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import TitleComp from "@/components/TitleComp.vue";
import dayjs from "dayjs";
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast';

const { t } = useI18n()
const confirm = useConfirm();
const store = useStore();
const toast = useToast();
const pageStore = usePageStore();
const router = useRouter();
const list = ref([]);
const popType = ref('')
const search = ref(pageStore.getSearchParams.search || '')
const searchCode = ref(pageStore.getSearchParams.searchCode || '')
const selectLngCd = ref([])
const rows = computed(() => pageStore.getRows)
const startIndex = ref(pageStore.getStartIndex)


const fnRequireDel = (event) => {
    confirm.require({
        rejectProps: {
            severity: 'secondary',
            outlined: true,
            size: 'large'
        },
        acceptProps: {
            size: 'large'
        },
        target: event.currentTarget,
        message: t('10201'), //'Would you like to delete?',

        accept: () => {
            fnDelete();
        },
    });
}

const fnDetail = (e) => {
    popType.value = "detail"
    router.push({ path: '/main/system/lngCode/detail', query: { key: popType.value }, state: { dataObj: { ...e.data } } })
}

const fnNew = (e) => {
    popType.value = "new"
    router.push({ path: '/main/system/lngCode/detail', query: { key: popType.value }, state: { dataObj: null } })
}

const fnDelete = () => {
    const deleteItems = []
    deleteItems.push(...selectLngCd.value.map((item) => item.lngId))

    if(deleteItems.length === 0) {
        store.toast.add({ severity: 'warn', summary: t('10505'), detail: t('10505'), life: 3000 });
        return;
    }

    store.API_DELETE('/admin/lngCode', deleteItems).then((data) => {
        fnSearch();
    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnSearch = () => {
    let params = {
        search: search.value,
        codeId: Number(searchCode.value),
        lang: localStorage.getItem('languageType')
    }

    pageStore.fnSaveParams({ 'searchCode': searchCode.value, 'search': search.value })


    store.API_LIST('admin/lngCode', params).then((data) => {
        list.value = data.data.data
        list.value.forEach((item) => { item.regDt = item.regDt.slice(0, 10) })
    }).catch(({ message }) => {
        console.log(message)
    })
}


const fnExcelDownload = () => {
    // Header designation to include

    const selectedHeaders = ["lngId", "lngTy1", "lngTy2", "regDt"];
    const wsCols = [t('10418'), t('10412') + t('10372'), t('10412') + t('10373'), t('10100')];

    const title = t('10238') + t('10084')//Language List;


    list.value.map(item => {
        item.regDt = dayjs(item.regDt).isValid ? dayjs(item.regDt).format('DD/MM/YYYY') : '';
    })

    store.fnExcelDownload(list.value, selectedHeaders, wsCols, title);
};

const fnReset = () => {
    search.value = ''
    searchCode.value = ''
}

const fnPage = (e) => {
    pageStore.fnSavePage(e.page, e.rows)
};


onMounted(() => {
    fnSearch();
});
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
                            <label class="form_label">{{ t('10418') }}</label><!--Language code-->
                            <input type="text" class="form_control" :placeholder="t('10146')" @keydown.enter="startIndex = 0; fnSearch();" v-model="searchCode">
                        </div>

                        <div class="input_item">
                            <label class="form_label">{{ t('10412') }}</label><!--designation-->
                            <input type="text" class="form_control" :placeholder="t('10146')" @keydown.enter="startIndex = 0; fnSearch();" v-model="search">
                        </div>
                    </div>
                </div>
                <div class="search_btn">
                    <button type="button" class="v_btn btn_primary btn_md" @click="startIndex = 0; fnSearch();"><i class="v_ico ico_search_white"></i><span>{{ t('10053') }}</span></button><!--check-->
                    <button type="button" @click="fnReset" class="v_btn btn_outline_primary btn_md"><i class="v_ico ico_reset_primary"></i><span></span></button>
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
                        <a href="javascript:void(0)" class="v_btn btn_outline_primary btn_sm" @click="fnNew">{{
                            t('10353')
                            }}</a>
                        <a href="javascript:void(0)" class="v_btn btn_outline_secondary btn_sm" @click="fnRequireDel">{{
                            t('10336') }}</a><!--Selection deletion-->
                        <button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnExcelDownload"><i
                                class="v_ico ico_download_secondary"></i><span>{{ t('10055') }}</span></button>
                    </div>
                </div>
            </div>

            <div class="v_table table_list">
                <DataTable :value="list" paginator :rows="rows" v-model:first="startIndex"
                    :rowsPerPageOptions="[5, 10, 20, 50]" @page="fnPage" tableStyle="min-width: 50rem;"
                    @row-dblclick="fnDetail" v-model:selection="selectLngCd" data-key="lngId"
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                    :pt="{ pcPaginator: {}, }">
                    <Column field="selection" selectionMode="multiple" style="width: 4%;" class="text_center"></Column>
                    <Column field="lngId" :header="t('10418')" style="width: 5%;" class="text_center" sortable></Column>
                    <!--Language code-->
                    <Column field="lngTy1" :header="t('10412') + t('10372')" style="width: 21.5%;" class="text_center"
                        sortable></Column><!--Name (Kirki)-->
                    <Column field="lngTy2" :header="t('10412') + t('10373')" style="width: 21.5%;" class="text_center"
                        sortable></Column><!--Name (Russian)-->
                    <Column field="lngTy3" :header="t('10412') + t('10419')" style="width: 21.5%;" class="text_center"
                        sortable></Column><!--Name (Korean)-->
                    <Column field="regDt" :header="t('10100')" style="width: 10.4%;" class="text_center"><!--Registration date-->
                        <template #body="{ data }">
                            {{ dayjs(data.regDt).isValid ? dayjs(data.regDt).format('DD/MM/YYYY') : '' }}
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

<style>
.no_data {
    display: flex;
    /* Flex box use */
    justify-content: center;
    /* Horizontal */
    align-items: center;
    flex-direction: column;
}
</style>