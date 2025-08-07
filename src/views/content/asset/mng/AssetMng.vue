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
import ImgView from '@/views/content/asset/img/ImgView.vue'
import DataView from 'primevue/dataview';

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
const bzentyId = ref('')
const eqpmntId = ref('');
const videoMnlId = ref('')
const eqpmntSeList = store.getComCodes('1037');
const eqpmntInfo = ref({})
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
    searchBz.value = ''
    fnSearch();
}

const fnVideoModal = (data) => {
    dialog.value = true;
    videoMnlId.value = data.videoMnlId
    eqpmntInfo.value = data
}

function joinPath(...segments) {
    return segments
        .map(s => s.replace(/^\/+|\/+$/g, '')) // 앞뒤 슬래시 제거
        .filter(Boolean)
        .join('/');
}

const fnDownPdf = (eqpmntId) => {
    let params = {
        eqpmntId: eqpmntId
    }
    store.API_LIST('mnul/file', params).then((data) => {
        const file = data.data.data[0]
        const fileNm = file.orgnlFileNm + '.' + file.fileExtn;
        const filePath = joinPath(file.filePath, `${file.fileNm}.${file.fileExtn}`)
        store.API_FILE_DOWN(filePath, fileNm);
    }).catch(({ message }) => {
        console.error(message)
    })
}

const fnExcelDownload = () => {
    // Header designation to include

    const selectedHeaders = ["eqpmntCd", "eqpmntNm", "expln", (lang.value === 'lng_type_1') ? 'eqpmntSeNm1' : (lang.value === 'lng_type_2') ? 'eqpmntSeNm2' : 'eqpmntSeNm3', (lang.value === 'lng_type_1') ? 'bzentyNm1' : (lang.value === 'lng_type_2') ? 'bzentyNm2' : 'bzentyNm3'];
    const wsCols = [t('10725'), t('10751'), t('10728'), t('10727'), t('10752')];

    const title = t('10787')

    store.fnExcelDownload(list.value, selectedHeaders, wsCols, title);
};


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
                    <li :class="{ on: tab == '' }" @click="tab = ''; fnTabChange()"><a href="javascript:void(0)">{{ t('10066') }}</a></li>
                    <template v-for="(item, i) in eqpmntSeList" :key="i">
                        <li :class="{ on: tab == item.codeId }" @click="tab = item.codeId; fnTabChange()"><a
                                href="javascript:void(0)">{{ item.codeNm }}</a></li>
                    </template>
                </ul>
            </nav>

            <div class="board_search">
                <div class="search_inner">
                    <div class="form_row">

                        <div class="input_item">
                            <label class="form_label">{{ t("10752") }}</label>
                            <select class="form_control" v-model="searchBz">
                                <option value="">{{ t("10752") }}</option>
                                <option v-for="(item, i) in store.getBzentys()" :key="i" :value="item.codeId">{{
                                    item.codeNm }}
                                </option>
                            </select>
                        </div>

                        <div class="input_item">
                            <label class="form_label">{{ t("10751") }}</label>
                            <input type="text" class="form_control" v-model="searchEq" @keydown.enter="fnSearch">
                        </div>
                    </div>
                </div>

                <div class="search_btn">
                    <button type="button" class="v_btn btn_primary btn_md" @click="fnSearch">
                        <i class="v_ico ico_search_white" ></i><span>{{ t("10053") }}</span></button>
                    <button type="button" @click="fnReset" class="v_btn btn_outline_primary btn_md">
                        <i class="v_ico ico_reset_primary"></i><span></span></button>
                </div>
            </div>


            <div class="board_info mt_6">
                <div class="right">
                    <div class="btn_wrap">
                        <button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnExcelDownload">
                            <i class="v_ico ico_download_secondary"></i><span>{{ t('10055') }}</span></button>

                        <button type="button" class="v_btn btn_outline_primary btn_sm mb_3"
                            @click="$router.push({ name: 'asset.mng.form', params: { type: 'create', eqpmntId: 'new' } })">{{
                                t("10746") }}</button>
                    </div>
                </div>
            </div>

            <DataView :value="list" :layout="layout" :paginator="layout === 'grid' && list.length > 0" :rows="8"
                hoverableRow :rowsPerPageOptions="[4, 8, 20, 50]">
                <template #header>
                    <div class="board_info ml_8">
                        <div class="left">
                            <div class="total_num text_xl">{{ "Total" }} <span class="text_primary">{{ list.length }}</span></div>
                        </div>

                        <div class="flex justify-end">
                            <SelectButton v-model="layout" :options="options" :allowEmpty="false">
                                <template #option="{ option }">
                                    <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']"></i>
                                </template>
                            </SelectButton>
                        </div>
                    </div>
                </template>

                <template #list="slotProps">
                    <DataTable :value="slotProps.items" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
                        @row-click="fnGoDetail" tableStyle="min-width: 50rem;">
                        <Column field="img" :header="t('10729')" class="text_center">
                            <template #body="{ data }">
                                <ImgView :imgVo="data" :imgSe="'thumbnail'" :size="'small'" />
                            </template>
                        </Column>
                        <Column field="eqpmntCd" :header="t('10725')" class="text_center" style="width: 8%;" sortable>
                        </Column>
                        <Column field="eqpmntNm" :header="t('10751')" class="text_center" sortable></Column>
                        <Column field="expln" :header="t('10728')" style="width: 33%;"></Column>
                        <Column
                            :field="lang === 'lng_type_1' ? 'eqpmntSeNm1' : (lang === 'lng_type_2' ? 'eqpmntSeNm2' : 'eqpmntSeNm3')"
                            :header="t('10727')" class="text_center" style="width: 6%;" sortable></Column>
                        <Column
                            :field="lang === 'lng_type_1' ? 'bzentyNm1' : (lang === 'lng_type_2' ? 'bzentyNm2' : 'bzentyNm3')"
                            :header="t('10752')" class="text_center" style="width: 7%;" sortable></Column>
                        <Column field="mnl" :header="t('10755')" class="text_center" style="width: 5%;">
                            <template #body="{ data }">
                                <i class="pi pi-file" v-if="data.fileNm" src="@/assets/images/common/ico_file_pdf.png"
                                    alt="" style="font-size: 2rem;" @click.stop="fnDownPdf(data.eqpmntId)"></i>
                                <!-- <img v-if="data.fileExist" src="@/assets/images/common/ico_file_pdf.png" alt=""
                                    style="width: 25px;" @click.stop="fnDownPdf(data.eqpmntId)"> -->
                                <template v-else>{{ '-' }}</template>
                            </template>
                        </Column>
                        <Column field="video" :header="t('10733')" class="text_center" style="width: 5.5%;">
                            <template #body="{ data }">
                                <Button severity="danger" @click="fnVideoModal(data)"><i
                                        class="pi pi-play-circle"></i><span
                                        style="font-size: 1.2rem;">Play</span></Button>
                            </template>
                        </Column>
                        <Column field="qna" :header="t('10760')" class="text_center" style="width: 7%;">
                            <template #body="{ data }">
                                <Button severity="info" rounded
                                    @click="eqpmntId = data.eqpmntId; dialogQna = true; bzentyId = data.bzentyId"><i
                                        class="pi pi-question-circle"></i>
                                    <span style="font-size: 1.2rem;">FAQ</span>
                                </Button>
                            </template>
                        </Column>
                        <template #empty>
                            <div class="no_data">
                                <i class="v_ico ico_error"></i>
                                <span class="text_msg">{{ t('10075') }}</span>
                            </div>
                        </template>
                    </DataTable>
                </template>

                <template #grid="slotProps">
                    <div style="display: flex; flex-wrap: wrap; justify-content: flex-start; gap: 16px; " class="mb_3">

                        <div v-for="(item, j) in slotProps.items" :key="j" class="col_class v_box mt_3"
                            @click="$router.push({ name: 'asset.mng.dtl', params: { eqpmntId: item.eqpmntId } })">
                            <ImgView :imgVo="item" :imgSe="'thumbnail'" :size="'medium'" />

                            <span style="display: flex; justify-content: center;">
                                {{ `${item.eqpmntCd} | ${lang === 'lng_type_1' ? item.eqpmntSeNm1 :
                                    lang === 'lng_type_2' ? item.eqpmntSeNm2 :
                                        item.eqpmntSeNm3}` }}
                            </span>

                            <div style="display: flex;justify-content: flex-end;">
                                <Button severity="info" rounded
                                    @click.stop="dialogQna = true; eqpmntId = item.eqpmntId; bzentyId = item.bzentyId"><i class="pi pi-question-circle"></i>
                                    <span style="font-size: 1.2rem;">FAQ</span>
                                </Button>
                            </div>

                            <div class="text_xl text_bold m_2 mb_4">{{ item.eqpmntNm }}</div>
                            <div class="text_lg m_2">
                                <span class="info_text">{{ t('10752') }}</span>
                                {{ lang === 'lng_type_1' ? item.bzentyNm1 : lang === 'lng_type_2' ? item.bzentyNm2 : item.bzentyNm3 }}
                            </div>

                            <div class="text_lg m_2" style="display: flex; align-items: center;">
                                <span class="info_text">{{ t('10755') }}</span>
                                <div v-if="item.fileNm" style="display: flex; align-tiems: center;"
                                    @click.stop="fnDownPdf(item.eqpmntId)">
                                    <!-- {{ item.fileNm }}
                                    <i class="pi pi-file ml_2" src="@/assets/images/common/ico_file_pdf.png" alt=""
                                        style="font-size: 2rem;"></i> -->

                                    <Button severity="secondary" size="large">
                                        <i class="pi pi-file"></i>
                                        <span style="font-size: 1.3rem;">{{ item.fileNm }}</span>
                                    </Button>
                                </div>
                                <template v-else>{{ '-' }}</template>
                            </div>

                            <div class="text_lg m_2"><span class="info_text">{{ t('10733') }}</span>
                                <Button severity="danger" @click.stop="fnVideoModal(item)"><i
                                        class="pi pi-play-circle"></i>
                                    <span style="font-size: 1.2rem;">Play</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </template>

                <template #empty>
                    <div class="no_data">
                        <i class="v_ico ico_error"></i>
                        <span class="text_msg">{{ t('10075') }}</span><!--There is no data.-->
                    </div>
                </template>
            </DataView>
        </div>
        <!-- // 본문 영역 -->
    </div>
    <VideoModal v-if="dialog" @close="dialog = false" :dialog="dialog" :videoMnlId="videoMnlId"
        :eqpmntInfo="eqpmntInfo" />
    <QnaSample v-if="dialogQna" @close="dialogQna = false" :dialog="dialogQna" :eqpmntId="eqpmntId"
        :bzentyId="bzentyId" />
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
    min-width: 7rem;
}

:deep(.p-datatable-paginator-bottom) {
    border-style: none !important;
}

:deep(.p-row-even):hover {
    cursor: pointer;
    background-color: #F5FBFE;
}

:deep(.p-row-odd):hover {
    cursor: pointer;
    background-color: #F5FBFE;
}
</style>