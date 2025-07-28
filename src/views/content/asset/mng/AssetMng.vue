<script setup>
import { ref, onMounted } from "vue"
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import 'primeicons/primeicons.css'
import { useFormStore, useStore } from "@/store";
import { useRouter } from "vue-router";
import VideoModal from '@/views/content/asset/manul/VideoModal.vue'
import QnaModal from "../faq/QnaModal.vue";
import SelectButton from 'primevue/selectbutton';
import TitleComp from "@/components/TitleComp.vue";

const layout = ref('list');
const options = ref(['list', 'grid']);
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
    searchEq.value = ''
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
                </ul>
            </nav>

            <div class="board_search">
                <div class="search_inner">
                    <div class="form_row">
                        <div class="input_item">
                            <label class="form_label">{{ "제품구분" }}</label>
                            <select class="form_control">
                                <option>하드웨어</option>
                                <option>소프트웨어</option>
                            </select>
                        </div>

                        <div class="input_item">
                            <label class="form_label">{{ "장비명" }}</label>
                            <input type="text" class="form_control" v-model="searchEq" @keydown.enter="fnSearch">
                        </div>
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

                        <button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnExcelDownload"><i
                                class="v_ico ico_download_secondary"></i><span>{{ '엑셀 다운로드' }}</span></button>

                        <button type="button" class="v_btn btn_outline_primary btn_sm mb_3"
                            @click="$router.push({ name: 'asset.mng.form', params: { type: 'create', eqpmntId: 'new' } })">{{
                                "신규" }}</button>
                        <!-- <button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnDelete">{{ "선택 삭제" }}</button> -->

                    </div>
                </div>
            </div>

            <!-- list -->
            <div class="board_info">
                <div class="flex justify-end right">
                    <SelectButton v-model="layout" :options="options" :allowEmpty="false">
                        <template #option="{ option }">
                            <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']"></i>
                        </template>
                    </SelectButton>
                </div>
            </div>

            <div class="v_table table_list" v-if="layout === 'list'">
                <DataTable :value="list" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
                    @row-click="fnGoDetail" tableStyle="min-width: 50rem;">
                    <Column field="img" header="이미지" class="text_center">
                        <template #body="{ data }">
                            <img src="@/assets/images/common/ico_cannon.png" alt=""
                                style="width: 28rem; height: 15rem;">
                        </template>
                    </Column>
                    <Column field="eqpmntCd" header="장비코드" class="text_center" style="width: 8%;"></Column>
                    <Column field="eqpmntNm" header="장비명" class="text_center"></Column>
                    <Column field="expln" header="설명" style="width: 40%;"></Column>
                    <Column field="eqpmntSeNm" header="제품구분" class="text_center" style="width: 6%;"></Column>
                    <Column field="bzentyNm" header="업체명" class="text_center" style="width: 7%;"></Column>
                    <Column field="mnl" header="메뉴얼" class="text_center" style="width: 3%;">
                        <template #body="{ data }">
                            <img src="@/assets/images/common/ico_file_pdf.png" alt="" style="width: 25px;">
                        </template>
                    </Column>
                    <Column field="video" header="비디오" class="text_center" style="width: 5%;">
                        <template #body="{ data }">
                            <Button severity="danger" @click="fnVideoModal"><i class="pi pi-play-circle"></i><span
                                    style="font-size: 1.2rem;">Play</span></Button>
                        </template>
                    </Column>
                    <Column field="qna" header="FAQ" class="text_center" style="width: 7%;">
                        <template #body="{ data }">
                            <Button severity="info" rounded @click="dialogQna = true"><i
                                    class="pi pi-question-circle"></i>
                                <span style="font-size: 1.2rem;">FAQ</span>
                            </Button>
                        </template>
                    </Column>
                </DataTable>
            </div>

            <!-- grid -->
            <div style="display: flex; flex-wrap: wrap; justify-content: flex-start; gap: 16px;"
                v-if="layout === 'grid'">
                <div v-for="(item, j) in list" :key="j" class="col_class v_box mt_3"
                    @click="$router.push({ name: 'asset.mng.dtl', params: { eqpmntId: item.eqpmntId } })">
                    <img src="@/assets/images/common/ico_cannon.png" :alt="item.name"
                        style="height: 230px; width: 100%;" />
                    <sapn style="display: flex; justify-content: center;">{{ `${item.eqpmntCd} | ${item.eqpmntSeNm}` }}
                    </sapn>

                    <div style="display: flex;justify-content: flex-end;">
                        <Button severity="info" rounded @click.stop="dialogQna = true"><i class="pi pi-question-circle"></i>
                            <span style="font-size: 1.2rem;">FAQ</span>
                        </Button>
                    </div>

                    <div class="text_xl text_bold m_2">{{ item.eqpmntNm }}</div>
                    <div class="text_lg m_2"><span class="info_text">{{ '업체명' }}</span>{{ item.bzentyNm }}</div>
                    <div class="text_lg m_2"><span class="info_text">{{ '메뉴얼' }}</span>{{ item.instlYmd }}</div>
                    <div class="text_lg m_2"><span class="info_text">{{ '영상메뉴얼' }}</span>{{ item.dscdYmd }}</div>
                </div>
            </div>

        </div>
        <!-- // 본문 영역 -->
    </div>
    <VideoModal v-if="dialog" @close="dialog = false" :dialog="dialog" />
    <QnaModal v-if="dialogQna" @close="dialogQna = false" :dialog="dialogQna" />
</template>

<style scoped>
.sideBtn {
    margin-left: 1rem;
}

.col_class {
    flex: 0 0 calc(25% - (3 * 16px / 4));
    max-width: calc(25% - (3 * 16px / 4));
    -webkit-box-flex: 0 !important;
    -ms-flex: 0 0 calc(25% - (3 * 16px / 4)) !important;
}

.col_class:hover {
    cursor: pointer;
    background-color: #F5FBFE;
}

.info_text {
    color: #929292;
    font-size: 1.5rem;
    font-weight: 800;
    margin-right: 20px;
    display: inline-block;
    min-width: 5rem;
}
</style>