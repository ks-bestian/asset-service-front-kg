<script setup>
import { ref, defineEmits, onMounted, computed } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useRouter } from 'vue-router'
import { useStore, usePageStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
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
const emit = defineEmits(["close"]);
const search = ref(pageStore.getSearchParams.search || '')
const searchNm = ref(pageStore.getSearchParams.searchNm || '')
const selectMsgId = ref([])
const rows = computed(() => pageStore.getRows)
const firstIndex = ref(pageStore.getStartIndex)

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
        message: t('10201'),//'Would you like to delete?',

        accept: () => {
            fnDelete();
        },
    });
}


const fnGoDetail = (e) => {
    router.push({
        path: '/myPage/msg/detail',
        query: { key: "send" },
        state: { data: { ...e.data } }
    })
}

const fnMsgWrite = () => {
    router.push({ name: 'myPage.msg.save' })
}

const fnDelete = () => {
    const deleteItems = [];
    selectMsgId.value.forEach((item) => {
        deleteItems.push(item.msgId)
    })

    if(deleteItems.length === 0) {
        toast.add({ severity: 'warn', summary: t('10505'), detail: t('10505'), life: 3000 });
        return;
    }

    store.API_DELETE('myPage/msg', deleteItems).then((data) => {
        fnSearch();
    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnSearch = () => {
    let param = {
        msgSj: search.value,
        rcvNm: searchNm.value,
        lang: localStorage.getItem('languageType')
    }

    pageStore.fnSaveParams({ 'search': search.value, 'searchNm': searchNm.value })

    store.API_LIST(`/myPage/msg/send`, param).then((data) => {
        list.value = data.data.data

    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnExcelDownload = () => {
    // Header designation to include

    const selectedHeaders = ["msgSj", "rcvNm", "status", "sendDt", "rcvDt"];
    const wsCols = [t('10049'), t('10250'), t('10056'), t('10340'), t('10339')]; // Heather name array


    const title = t('10519'); 

    const data = list.value.map(item => ({
        ...item,
        status: item.rcvDt ? t('10089') : t('10337'), //'Confirm': 'Unidentified',

        sendDt: dayjs(item.sendDt).isValid() ? dayjs(item.sendDt).format('DD/MM/YYYY HH:mm') : '',
        rcvDt: dayjs(item.rcvDt).isValid() ? dayjs(item.rcvDt).format('DD/MM/YYYY HH:mm') : ''
    }))

    store.fnExcelDownload(data, selectedHeaders, wsCols, title);
};

const fnReset = () => {
    search.value = ''
    searchNm.value = ''
}

const fnPage = (e) => {
    pageStore.fnSavePage(e.page, e.rows)
}

onMounted(() => {
    fnSearch();
})
</script>

<template>
    <div class="board_search">
        <div class="search_inner">
            <div class="form_row">
                <div class="input_item">
                    <label class="form_label">{{ t('10049') }}</label><!--title-->
                    <input type="text" class="form_control" :placeholder="t('10146')" v-model="search"
                        @keydown.enter="firstIndex = 0; fnSearch()">
                </div>

                <div class="input_item">
                    <label class="form_label">{{ t('10250') }}</label><!--Recipient-->
                    <input type="text" class="form_control" :placeholder="t('10146')" v-model="searchNm"
                        @keydown.enter="firstIndex = 0; fnSearch()">
                </div>
            </div>
        </div>
        <div class="search_btn">
            <button type="button" class="v_btn btn_primary btn_md" @click="fnSearch"><i
                    class="v_ico ico_search_white"></i><span>{{ t('10053') }}</span></button><!--check-->
            <button type="button" @click="fnReset" class="v_btn btn_outline_primary btn_md"><i
                    class="v_ico ico_reset_primary"></i><span></span></button>
        </div>
    </div>
    <nav class="tab_menu type2 mt_6"></nav>
    <div class="board_info">
        <div class="left">
            <div class="total_num">Total <span class="text_primary">{{ list.length }}</span></div>
        </div>
        <div class="right">
            <div class="btn_wrap">
                <a href="javascript:void(0)" class="v_btn btn_secondary btn_sm" @click="fnMsgWrite">{{ t('10341') }}</a>
                <!--Message-->
                <button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnRequireDel">{{ t('10336') }}</button><!--Selection deletion-->
                <button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnExcelDownload">
                    <i class="v_ico ico_download_secondary"></i><span>{{ t('10055') }}</span></button><!--Excel download-->
            </div>
        </div>
    </div>

    <div class="v_table table_list">
        <DataTable :value="list" paginator :rows="rows" v-model:first="firstIndex" :rowsPerPageOptions="[5, 10, 20, 50]" @row-dblclick="fnGoDetail" @page="fnPage"
            tableStyle="min-width: 50rem;" v-model:selection="selectMsgId"
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink" :pt="{ pcPaginator: {},}">
            <Column field="selection" selectionMode="multiple" style="width: 4%;" class="text_center"></Column>
            <Column field="msgSj" sortable :header="t('10049')"></Column><!--title-->
            <Column field="rcvNm" sortable :header="t('10250')" style="width: 17%;" class="text_center"></Column>
            <Column field="status" :header="t('10056')" style="width: 13%;" class="text_center">
                <template #body="{ data }">
                    <span v-if="data.rcvDt != null">{{ t('10089') }}</span><!--check-->
                    <span v-else>{{ t('10474') }}</span><!--Unidentified-->
                </template>
            </Column>
            <Column field="sendDt" sortable :header="t('10340')" style="width: 10%;" class="text_center">
                <template #body="{ data }">
                    {{ dayjs(data.sendDt).isValid() ? dayjs(data.sendDt).format('DD/MM/YYYY HH:mm') : '' }}
                </template>
            </Column>
            <Column field="rcvDt" sortable :header="t('10339')" style="width: 10%;" class="text_center">
                <template #body="{ data }">
                    {{ dayjs(data.rcvDt).isValid() ? dayjs(data.rcvDt).format('DD/MM/YYYY HH:mm') : '' }}
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