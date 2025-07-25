<script setup>
import { ref, onMounted } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import TitleComp from "@/components/TitleComp.vue";
import { useStore } from "@/store";
import { useRouter } from 'vue-router'
import msg from '@/utils/message'
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
                            <label class="form_label">{{ "업체명" }}</label>
                            <input type="text" class="form_control" v-model="searchBzentyNm" @keydown.enter="fnSearch">
                        </div>
                    </div>
                </div>

                <div class="search_btn">
                    <button type="button" class="v_btn btn_primary btn_md" @click="fnSearch">
                        <i class="v_ico ico_search_white"></i><span>{{ "검색" }}</span></button>
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
                        <button type="button" class="v_btn btn_outline_primary btn_sm" @click="fnRouteCreate">{{ "신규" }}</button>
                        <!--
                        <button type="button" class="v_btn btn_outline_secondary btn_sm">{{ "선택 삭제" }}</button>
                        -->
                        <!--
                        <button type="button" class="v_btn btn_outline_secondary btn_sm">
                            <i class="v_ico ico_download_secondary"></i><span>{{ "엑셀 다운로드" }}</span></button>
                            -->
                    </div>
                </div>
            </div>


            <div class="v_table table_list">
                <DataTable :value="list" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
                    tableStyle="min-width: 50rem;" @row-dblclick="fnGoDetail" >
                    <Column :field="lang === 'lng_type_1' ? 'bzentyNm1' : (lang === 'lng_type_2' ? 'bzentyNm2' : 'bzentyNm3')" header="업체명" class="text_center" sortable></Column>
                    <Column field="telno" header="전화번호" class="text_center" style="width: 9%;" sortable></Column>
                    <Column field="eml" header="담당자 이메일" class="text_center" sortable></Column>
                    <Column field="picNm" header="담당자" class="text_center" sortable></Column>
                    <template #empty>
                        <div class="no_data">
                            <i class="v_ico ico_error"></i>
                            <span class="text_msg">데이터가 없습니다</span>
                        </div>
                    </template>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style>
.no_data {
    display: flex;
    /* 플렉스 박스 사용 */
    justify-content: center;
    /* 가로 가운데 정렬 */
    align-items: center;
    flex-direction: column;
}
</style>