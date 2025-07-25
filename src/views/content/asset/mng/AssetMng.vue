<script setup>
import { ref, onMounted } from "vue"
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import TitleComp from "@/components/TitleComp.vue";
import Column from 'primevue/column';
import 'primeicons/primeicons.css'
import { useFormStore, useStore } from "@/store";
import { useRouter } from "vue-router";
import VideoModal from '@/views/content/asset/manul/VideoModal.vue'
import QnaSample from "./QnaSample.vue";

const router = useRouter();
const store = useStore();
const formStore = useFormStore();
const tab = ref('aa') /* todo 임시 tab value 값 수정하기*/
const list = ref([])
const dialog = ref(false)
const dialogQna = ref(false)

//검색 조건 보류
const searchBz = ref('')
const searchEq = ref('')

const fnTabChange = () => { //todo
    if (tab.value === 'bb') {
        list.value = []
    } else {
        fnSearch();
    }
}

const fnSearch = () => {
    let params = {
        searchEq: searchEq.value,
    }

    store.API_LIST('equip', params).then((data) => {
        list.value = data.data.data
    }).catch(({ message }) => {
        console.error(message)
    })
}

const fnGoDetail = (e) => {
    router.push({ name: 'asset.mng.dtl', params: { eqpmntId: e.data.eqpmntId } })
}

const fnReset = () => {
    searchEq.value = '';
    fnSearch();
}

const fnVideoModal = () => {
    dialog.value = true;

}

onMounted(() => {
    fnSearch();
});
</script>

<template>
    <div class="content_inner">

        <TitleComp />

        <!-- 본문 영역 -->
        <div class="content_section">
            <nav class="tab_menu type2 mb_6">
                <ul class="tab_list">
                    <li :class="{ on: tab == 'aa' }" @click="tab = 'aa'; fnTabChange()"><a href="javascript:void(0)">{{
                            '전체' }}</a></li>
                    <li :class="{ on: tab == 'bb' }" @click="tab = 'bb'; fnTabChange()"><a href="javascript:void(0)">{{
                            '마이크' }}</a></li>
                    <li :class="{ on: tab == 'cc' }" @click="tab = 'cc'; fnTabChange()"><a href="javascript:void(0)">{{
                            '카메라' }}</a></li>
                    <!-- <li :class="{ on: tab == 'dd' }" @click="tab = 'dd'; fnTabChange()"><a href="javascript:void(0)">{{
                            '카메라' }}</a></li>
                    <li :class="{ on: tab == 'ee' }" @click="tab = 'ee'; fnTabChange()"><a href="javascript:void(0)">{{
                            '소프트웨어' }}</a></li> -->
                </ul>
            </nav>



             <div class="board_search">
                <div class="search_inner">
                    <div class="form_row">
                        <div class="input_item">
                            <label class="form_label">{{ "장비명" }}</label>
                            <input type="text" class="form_control" v-model="searchEq" @keydown.enter="fnSearch">
                        </div>

                        <!-- <div class="input_item">
                            <label class="form_label">{{ "업체명" }}</label>
                            <input type="text" class="form_control" v-model="searchBz" @keydown.enter="fnSearch">
                        </div> -->
                    </div>
                </div>

                <div class="search_btn">
                    <button type="button" class="v_btn btn_primary btn_md">
                        <i class="v_ico ico_search_white" @click="fnSearch"></i><span>{{ "검색" }}</span></button>
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
                        <button type="button" class="v_btn btn_outline_primary btn_sm"
                            @click="$router.push({ name: 'asset.mng.form', params: { type: 'create', eqpmntId: 'new' } })">{{ "신규" }}</button>
                        <!-- <button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnDelete">{{ "선택 삭제"
                            }}</button> -->
                    </div>
                </div>
            </div>


            <!-- <div class="board_info">
                <div class="left" style="display: flex;">
                    <div class="total_num">Total <span class="text_primary">{{ list.length }}</span></div>
                    <input type="text" class="form_control" style="margin-left: 5rem;" placeholder="검색어를 입력하세요.">
                    <div class="search_btn ml_3">
                        <button type="button" class="v_btn btn_primary btn_sm"><i
                                class="v_ico ico_search_white"></i></button>
                    </div>
                </div>
                <div class="right">
                    <button type="button" class="v_btn btn_outline_primary btn_sm sideBtn"
                        @click="$router.push({ name: 'asset.mng.form', params: { type: 'create', eqpmntId: 'new' } })">{{
                        '등록' }}</button>
                </div>
            </div> -->

            <div class="v_table table_list">
                <DataTable :value="list" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
                    @row-click="fnGoDetail" tableStyle="min-width: 50rem;">
                    <Column field="eqpmntCd" header="장비코드" class="text_center" style="width: 8%;"></Column>
                    <Column field="img" header="이미지" class="text_center">
                        <template #body="{ data }">
                            <img src="@/assets/images/common/ico_cannon.png" alt="" style="width: 14rem;">
                        </template>
                    </Column>
                    <Column field="eqpmntNm" header="장비명" class="text_center"></Column>
                    <Column field="expln" header="설명" style="width: 40%;"></Column>
                    <Column field="eqpmntSeNm" header="제품구분" class="text_center"></Column>
                    <Column field="bzentyNm" header="업체명" class="text_center" style="width: 10%;"></Column>
                    <Column field="mnl" header="메뉴얼" class="text_center" style="width: 3%;">
                        <template #body="{ data }">
                            <img src="@/assets/images/common/ico_file_pdf.png" alt="" style="width: 25px;">
                        </template>
                    </Column>
                    <Column field="video" header="비디오" class="text_center" style="width: 5%;">
                        <template #body="{ data }">
                            <Button severity="danger" @click="fnVideoModal"><i class="pi pi-play-circle"></i><span
                                    style="font-size: 1.2rem;" >Play</span></Button>
                        </template>
                    </Column>
                    <Column field="qna" header="Q&A" class="text_center" style="width: 7%;">
                        <template #body="{ data }">
                            <Button severity="info" rounded @click="dialogQna = true"><i class="pi pi-question-circle"></i><span
                                    style="font-size: 1.2rem;">Question</span></Button>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
        <!-- // 본문 영역 -->
    </div>
    <VideoModal v-if="dialog" @close="dialog=false" :dialog="dialog"/>
    <QnaSample v-if="dialogQna" @close="dialogQna=false" :dialog="dialogQna"/>
</template>

<style scoped>
.sideBtn {
    margin-left: 1rem;
}
</style>