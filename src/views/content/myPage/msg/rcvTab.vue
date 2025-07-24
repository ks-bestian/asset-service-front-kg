<script setup>
import { ref, onMounted, computed } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useRouter } from "vue-router";
import { useStore, usePageStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import dayjs from "dayjs";
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast';

const { t } = useI18n()
const confirm = useConfirm();
const store = useStore();
const pageStore = usePageStore();
const router = useRouter();
const list = ref([]);
const search = ref(pageStore.getSearchParams.search || '')
const searchNm = ref(pageStore.getSearchParams.searchNm || '')
const selectMsgId = ref([])
const rows = computed(() => pageStore.getRows)
const firstIndex = ref(pageStore.getStartIndex)
const toast = useToast();
const status = ref('')

const fnGoDetail = (e) => {
    router.push({
        path: '/myPage/msg/detail',
        query: { key: 'rcv' },
        state: { data: { ...e.data } }
    })
}

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
        message: t('10431'), //'Would you like to delete?',

        accept: () => {
            fnDelete();
        },
    });
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
        sendNm: searchNm.value,
        lang: localStorage.getItem('languageType'),
        // status: status.value

    }

    pageStore.fnSaveParams({ 'search': search.value, 'searchNm': searchNm.value })

    store.API_LIST('/myPage/msg/rcv', param).then((data) => {
        list.value = data.data.data
        console.log(list.value)
    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnExcelDownload = () => {
    // Header designation to include

    const selectedHeaders = ["msgSj", "sendNm", "status", "sendDt", "rcvDt"];
    const wsCols = [t('10049'), t('10275'), t('10056'), t('10340'), t('10339')]; // Heather name array


    const title = t('10519')//"Message Receive List";


    const data = list.value.map(item => ({
        ...item,
        status: item.rcvDt ? t('10089') : t('10337'), //'Confirm': 'Unidentified',

        rcvDt: dayjs(item.rcvDt).isValid() ? dayjs(item.rcvDt).format('DD/MM/YYYY HH:mm') : '',
        sendDt: dayjs(item.sendDt).isValid() ? dayjs(item.sendDt).format('DD/MM/YYYY HH:mm') : '',
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

const fnMsgWrite = () => {
    router.push({ name: 'myPage.msg.save' })
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
                    <label class="form_label">{{ t('10049') }}</label>
                    <input type="text" class="form_control" :placeholder="t('10146')" v-model="search"
                        @keydown.enter="firstIndex = 0; fnSearch()">
                </div>

                <div class="input_item">
                    <label class="form_label">{{ t('10275') }}</label><!--Sender-->
                    <input type="text" class="form_control" :placeholder="t('10146')" v-model="searchNm"
                        @keydown.enter="firstIndex = 0; fnSearch()">
                </div>

                <!-- <div class="input_item">
                    <label class="form_label">{{ t('10056') }}</label>
                    <select class="form_control" v-model="status">
                        <option value="">{{ t('10066') }}</option>
                        <option value="confirm">{{ t('10089') }}</option>
                        <option value="unconfirm">{{ t('10337') }}</option>
                    </select>
                </div> -->
            </div>
        </div>
        <div class="search_btn">
            <button type="button" class="v_btn btn_primary btn_md" @click="fnSearch"><i class="v_ico ico_search_white"></i><span>{{ t('10053') }}</span></button>
            <button type="button" @click="fnReset" class="v_btn btn_outline_primary btn_md"><i class="v_ico ico_reset_primary"></i><span></span></button>
        </div>
    </div>
    <nav class="tab_menu type2 mt_6">
    </nav>
    <div class="board_info">
        <div class="left">
            <div class="total_num">Total <span class="text_primary">{{ list.length }}</span></div>
        </div>
        <div class="right">
            <div class="btn_wrap">
                <a href="javascript:void(0)" class="v_btn btn_secondary btn_sm" @click="fnMsgWrite">{{ t('10341') }}</a>
                <!--Message-->
                <button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnRequireDel">{{ t('10336')
                    }}</button><!--Selection deletion-->
                <button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnExcelDownload"><i
                        class="v_ico ico_download_secondary"></i><span>{{ t('10055') }}</span></button>
            </div>
        </div>
    </div>

    <div class="v_table table_list">
        <DataTable :value="list" paginator :rows="rows" v-model:first="firstIndex" :rowsPerPageOptions="[5, 10, 20, 50]"
            tableStyle="min-width: 50rem;" @row-dblclick="fnGoDetail" v-model:selection="selectMsgId" @page="fnPage"
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink" :pt="{ pcPaginator: {}, }">
            <Column field="selection" selectionMode="multiple" style="width: 4%;" class="text_center"></Column>
            <Column field="msgSj" :header="t('10049')" sortable><!--title--></Column>
            <Column field="sendNm" :header="t('10275')" style="width: 17%;" class="text_center" sortable></Column>
            <Column field="status" :header="t('10056')" style="width: 13%;" class="text_center">
                <template #body="{ data }">
                    <span v-if="data.rcvDt != null">{{ t('10089') }}</span><!--check-->
                    <span v-else>{{ t('10337') }}</span><!--Unidentified-->
                </template>
            </Column>
            <Column field="sendDt" :header="t('10338')" style="width: 10%;" class="text_center" sortable><!--Reception-->
                <template #body="{ data }">
                    {{ dayjs(data.sendDt).isValid() ? dayjs(data.sendDt).format('DD/MM/YYYY HH:mm') : '' }}
                </template>
            </Column>
            <Column field="rcvDt" :header="t('10339')" style="width: 10%;" class="text_center" sortable><!--Confirmation date and time-->
                <template #body="{ data }">
                    {{ dayjs(data.rcvDt).isValid() ? dayjs(data.rcvDt).format('DD/MM/YYYY HH:mm') : '' }}
                </template>
            </Column>
            <template #empty>
                <div class="no_data">
                    <i class="v_ico ico_error"></i>
                    <span class="text_msg">{{ t('10075') }}</span><!--There is no data.-->
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