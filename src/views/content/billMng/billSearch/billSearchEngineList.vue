<script setup>
import TitleComp from "@/components/TitleComp.vue";
import Chip from 'primevue/chip';
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { isEmpty } from 'lodash';
import axiosExt from "axios";//For external calls for search side

import axiosExt2 from "axios";//For external calls for search side

import dayjs from "dayjs";
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import Panel from 'primevue/panel';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter();
const route = useRoute()
const searchItem = ref('')
//const SEARCH_ENG_URL = 'http://43.203.192.251:6501/search/searchApi.jsp';
//const SEARCH_EN_FV_URL = 'http://43.203.192.251:6501/search/api/popQuery.jsp?type=PWW&pretty=y';

//const SEARCH_ENG_URL = '/vite_search/searchApi.jsp';
//const SEARCH_EN_FV_URL = '/vite_search/api/popQuery.jsp?type=PWW&pretty=y';


const schResultItems = ref([]);
const schFavoriteItems = ref([]);
const schTtotalCnt = ref(0);
let currentPage = 1;
const selectedIndex = ref(null);
const enterSearch = ref('');
const nPage = ref(1)
const addBtnYn = ref(false);
const searchCondition = ref(true)

const fnSearch = (keywordNew = true) => {

    if (searchItem.value.trim().length <= 1) {
        searchCondition.value = false;
        return;
    } else {
        searchCondition.value = true;
    }


    if (!keywordNew) {
        nPage.value = 1
    }
    const indexsize = 10
    const index = schFavoriteItems.value.findIndex(
        item => item.word === searchItem.value
    );

    if (index !== -1) {
        selectedIndex.value = index;
    } else if (index === -1) {
        selectedIndex.value = null;
    }

    // schResultItems.value = [];

    currentPage = nPage.value;
    let searchQuery = "";
    if (isEmpty(searchItem.value)) {
        enterSearch.value = '';
        schResultItems.value = []
        addBtnYn.value = false
        return;
    } else {
        searchQuery = searchItem.value;
        enterSearch.value = searchItem.value;
    }

    const searchEngnUrl = import.meta.env.VITE_SEARCH_ENG_URL + "?pretty=y&query=" + searchQuery + "&page=" + nPage.value + "&indexsize=" + indexsize;

    axiosExt.get(searchEngnUrl).then(data => {
        const resultObj = data.data;
        if (resultObj.isOk) {
            schTtotalCnt.value = resultObj.totalCount;
            if (resultObj.totalCount > 0) {
                addBtnYn.value = true;

                if (resultObj.result[0].items.length < 10) {
                    addBtnYn.value = false;
                }

                if (keywordNew) {
                    schResultItems.value = [...schResultItems.value, ...resultObj.result[0].items];
                } else {
                    schResultItems.value = resultObj.result[0].items
                }

            } else {
                addBtnYn.value = false
                console.log("No Data....");
            }
        } else {
            addBtnYn.value = false
            console.log("errro...");
        }
    }).catch(error => {
        console.error(error);
    });
}

const fnAddList = () => {
    nPage.value = nPage.value + 1
    fnSearch()
}

const fnSearchFavorite = () => {

    const searchEngnUrl = import.meta.env.VITE_SEARCH_EN_FV_URL;

    import.meta.env.VITE_API_BASE_URL

    axiosExt.get(searchEngnUrl, {
        params: {
            type: 'PWD',
            pretty: 'y'
        }
    }).then(response => {
        schFavoriteItems.value = response.data.result;

    }).catch(error => {
        console.error('error:', error);
    });

};

const fnGoDetail = (item) => {
    router.push({ name: 'billMng.billSearch.billSearchEngineList.dtl', params: { billId: item.id, searchWord: searchItem.value } });
}


const fnFvSearch = (item, i) => {
    searchItem.value = item.word;
    selectedIndex.value = i;
    searchCondition.value = true;
    fnSearch(false);
}


const fnPrintTitle = (item, idx) => {
    let ppslDt = dayjs(item.ppsl_dt).isValid() ? dayjs(item.ppsl_dt).format('DD/MM/YYYY') : '';
    let titleHtml = idx + ". " + item.bill_name;
    let infoHtml = `<span class='titleInfo'>[${t('10196')} :  ${item.ppsr_nm} , ${t('10051')} :  ${ppslDt} ]</span>`;

    return titleHtml + infoHtml;
}


const fnPrintBody = (item) => {
    let bodyHtml = "" + item.etc;
    return bodyHtml;
}


watch(() => route.query.key, (newkey) => {
    searchItem.value = newkey || '';
    fnSearch(false);
    fnSearchFavorite();
})

const handleClick = (event, item) => {
    if (event.target.closest('svg.p-icon.p-button-icon')) return;
    fnGoDetail(item);
}

onMounted(() => {
    searchItem.value = route.query.key || '';
    fnSearch();
    fnSearchFavorite();

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
                            <label class="form_label">{{ t('10319') }}</label>
                            <input type="text" @input="fnInput" class="form_control" @keydown.enter="fnSearch(false)"
                                :placeholder="t('10319')" v-model="searchItem"><!--Search term-->
                        </div>
                    </div>
                    <div v-if="!searchCondition" class="text_red mt_2 ml_14">{{ '*' + t('10644') }}</div>
                </div>
                <div class="search_btn">
                    <button @click="fnSearch(false)" type="button" class="v_btn btn_primary btn_md"><i
                            class="v_ico ico_search_white"></i><span>{{ t('10053') }}</span></button>
                </div>
            </div>



            <div class="board_info" style="margin-top: 2rem;">
                <div class="left">
                    <div class="total_num">
                        <span style="font-weight: 500;">{{ t('10318') }}</span><!--Popular search terms-->
                        <Button v-for="(item, i) in schFavoriteItems" :key="i" :label="item.word"
                            @click="fnFvSearch(item, i)" :severity="(selectedIndex !== i) ? 'secondary' : 'contrast'"
                            rounded :outlined="selectedIndex !== i"
                            style="margin-left: 6px; font-size: 14px; padding: 7px 13px;" size="large"></Button>
                    </div>
                </div>
            </div>

            <div class="board_info" style="margin-top: 2rem;">
                <div class="left">
                    <!-- <div v-html="fnPrintTotal()" class="total_num"></div> -->
                    <Tag style="padding: 6px 18px; font-size: 16px; font-weight: 300; background-color: #F5FBFE;"
                        rounded>
                        <span class="normalCn">{{ t('10320') + " :" }}</span><!--Search results-->
                        <span class="impCn">{{ "'" + enterSearch + "'" }}</span>
                        <span class="normalCn">{{ t('10321') }}</span><!--(U) gun-->
                        <span class="impCn">{{ enterSearch == '' ? 0 : schTtotalCnt }}</span>
                        <span class="normalCn">{{ t('10322') }}</span><!--This is searched.-->
                    </Tag>
                </div>
            </div>

            <div class="v_table table_list">
                <div class="vote_result_wrap mt_6">
                    <Panel header="" v-if="schTtotalCnt > 0" toggleable v-for="(item, index) in schResultItems"
                        :key="index" class="panelClass" style="cursor: pointer;" @click="handleClick($event, item)">
                        <template #header>
                            <div v-html="fnPrintTitle(item, index + 1)"
                                style="font-size: 16px; width: 100%; font-weight: 600;"></div>
                        </template>
                        <Divider />
                        <div style="font-size: 15px; font-weight: 400; width: 100%;">{{ item.etc }}</div>
                    </Panel>
                </div>
            </div>

            <div class="btn_group_fixed" v-if="addBtnYn">
                <button type="button" class="v_btn btn_outline_primary btn_md" @click="fnAddList"><i
                        class="pi pi-plus mr_1"></i> {{ t('10645') }}</button>
            </div>

        </div>
        <!-- // Main area -->
    </div>
</template>

<style>
.custom-chip {
    cursor: pointer;
    pointer-events: auto;
    /* 👈 It may be required */
}

.normalCn {
    color: #4b4b4b;
}

.impCn {
    color: #0c418b;
    font-weight: bold;
}

.titleInfo {
    color: #838383;
    margin-left: 1rem;
    font-weight: 500;
}

.panelClass:hover {
    background-color: #f3f3f3 !important;
}

.panelClass {
    margin-top: 2rem !important;
    padding: 8px !important;
    border-top: 2px solid #D8F3FF !important;
    background-color: #fdfeff !important;
}
</style>
