<script setup>
import { ref, onMounted } from "vue"
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import 'primeicons/primeicons.css'
import { useFormStore, useStore } from "@/store";
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n'
import VideoModal from '@/views/content/asset/manul/VideoModal.vue'
import QnaSample from '@/views/content/asset/mng/QnaModal.vue'
import SelectButton from 'primevue/selectbutton';
import TitleComp from "@/components/TitleComp.vue";
const lang = ref(localStorage.getItem("languageType"));

const layout = ref('list');
const options = ref(['list', 'grid']);

const { t } = useI18n()

const router = useRouter();
const store = useStore();
const formStore = useFormStore();
const tab = ref('') /* todo 임시 tab value 값 수정하기*/
const list = ref([])
const dialog = ref(false)
const dialogQna = ref(false)

const eqpmntId = ref('');

const eqpmntSeList = store.getComCodes('1037');

//검색 조건 보류
const searchBz = ref('')
const searchEq = ref('')
const searchSe = ref('')


const fnTabChange = () => { //todo
    fnSearch();
}

const fnSearch = () => {
    let params = {
        searchEq: searchEq.value,
        searchSe: tab.value,
        searchBz: searchBz.value
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

                    
                    <li :class="{ on: tab == '' }" @click="tab = ''; fnTabChange()"><a href="javascript:void(0)">{{
                            t('10066') }}</a></li>

                    <template v-for="(item, i) in eqpmntSeList" :key="i">
                        <li :class="{ on: tab == item.codeId }" @click="tab = item.codeId; fnTabChange()"><a href="javascript:void(0)">{{item.codeNm }}</a></li>

                    </template>
                </ul>
            </nav>

            <div class="board_search">
                <div class="search_inner">
                    <div class="form_row">
                        
                        <div class="input_item">
                            <label class="form_label">{{ t("10752") }}</label>
                            <select class="form_control" v-model="searchBz">
                                <option  value="">{{ t("10752") }}</option>
                                <option  v-for="(item, i) in store.getBzentys()" :key="i" :value="item.codeId">{{ item.codeNm }}</option>
                            </select>
                        </div>
                        <!--                        <div class="input_item">
                            <label class="form_label">{{ t("10752") }}</label>
                            <input type="text" class="form_control" v-model="searchBz" @keydown.enter="fnSearch">
                        </div>
                        -->

                        <div class="input_item">
                            <label class="form_label">{{ t("10751") }}</label>
                            <input type="text" class="form_control" v-model="searchEq" @keydown.enter="fnSearch">
                        </div>
                    </div>
                </div>

                <div class="search_btn">
                    <button type="button" class="v_btn btn_primary btn_md">
                        <i class="v_ico ico_search_white" @click="fnSearch"></i><span>{{ t("10053") }}</span></button>
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
<!--
                        <button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnExcelDownload"><i
                                class="v_ico ico_download_secondary"></i><span>{{ '엑셀 다운로드' }}</span></button>
-->
                        <button type="button" class="v_btn btn_outline_primary btn_sm mb_3"
                            @click="$router.push({ name: 'asset.mng.form', params: { type: 'create', eqpmntId: 'new' } })">{{ t("10746") }}</button>
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
                    <Column field="img" :header="t('10729')" class="text_center">
                        <template #body="{ data }">
                            <img src="@/assets/images/common/ico_cannon.png" alt=""
                                style="width: 28rem; height: 15rem;">
                        </template>
                    </Column>
                    <Column field="eqpmntCd" :header="t('10725')" class="text_center" style="width: 8%;"></Column>
                    <Column field="eqpmntNm" :header="t('10751')" class="text_center"></Column>
                    <Column field="expln" :header="t('10728')" style="width: 33%;"></Column>
                    <Column :field="lang === 'lng_type_1' ? 'eqpmntSeNm1' : (lang === 'lng_type_2' ? 'eqpmntSeNm2' : 'eqpmntSeNm3')" :header="t('10727')" class="text_center" style="width: 6%;"></Column>
                    <Column :field="lang === 'lng_type_1' ? 'bzentyNm1' : (lang === 'lng_type_2' ? 'bzentyNm2' : 'bzentyNm3')" :header="t('10752')" class="text_center" style="width: 7%;"></Column>
                    <Column field="mnl" :header="t('10755')" class="text_center" style="width: 5%;">
                        <template #body="{ data }">
                            <img src="@/assets/images/common/ico_file_pdf.png" alt="" style="width: 25px;">
                        </template>
                    </Column>
                    <Column field="video" :header="t('10733')" class="text_center" style="width: 10%;">
                        <template #body="{ data }">
                            <Button severity="danger" @click="fnVideoModal"><i class="pi pi-play-circle"></i><span
                                    style="font-size: 1.2rem;">Play</span></Button>
                        </template>
                    </Column>
                    <Column field="qna" :header="t('10760')" class="text_center" style="width: 7%;">
                        <template #body="{ data }">
                            <Button severity="info" rounded @click="eqpmntId = data.eqpmntId; dialogQna = true; "><i
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
                    <span style="display: flex; justify-content: center;">
                        {{ `${item.eqpmntCd} | ${    lang === 'lng_type_1' ? item.eqpmntSeNm1 :
                                                    lang === 'lng_type_2' ? item.eqpmntSeNm2 :
                                                    item.eqpmntSeNm3}` }}
                    </span>

                    <div style="display: flex;justify-content: flex-end;">
                        <Button severity="info" rounded @click.stop="dialogQna = true"><i class="pi pi-question-circle"></i>
                            <span style="font-size: 1.2rem;">FAQ</span>
                        </Button>
                    </div>

                    <div class="text_xl text_bold m_2">{{ item.eqpmntNm }}</div>
                    <div class="text_lg m_2"><span class="info_text">{{ t('10752') }}</span>
                        {{  lang === 'lng_type_1' ? item.bzentyNm1 :
                            lang === 'lng_type_2' ? item.bzentyNm2 :
                                                    item.bzentyNm3 }}
                    </div>
                    <div class="text_lg m_2"><span class="info_text">{{ t('10755') }}</span>

                        {{ '카메라 동작법.pdf' }}
                            <img src="@/assets/images/common/ico_file_pdf.png" alt="" style="width: 25px;">
                    </div><!-- 메뉴얼로 바꿔야함-->
                    <div class="text_lg m_2"><span class="info_text">{{ t('10733') }}</span>
                        <Button severity="danger" @click="fnVideoModal"><i class="pi pi-play-circle"></i>
                            <span style="font-size: 1.2rem;">Play</span>
                        </Button>
                    </div><!-- 영상 메뉴얼로 바꿔야함-->
                </div>
            </div>

        </div>
        <!-- // 본문 영역 -->
    </div>
    <VideoModal v-if="dialog" @close="dialog = false" :dialog="dialog" />
    <QnaSample v-if="dialogQna" @close="dialogQna = false" :dialog="dialogQna" :eqpmntId="eqpmntId" />
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