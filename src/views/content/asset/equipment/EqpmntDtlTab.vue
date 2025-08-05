<script setup>
import { ref, watch, onMounted, defineProps } from 'vue'
import Divider from 'primevue/divider';
import { useStore } from '@/store';
import { useRoute } from 'vue-router';
import Carousel from 'primevue/carousel';
import { useI18n } from 'vue-i18n'
import AssetFile from '@/views/content/asset/common/assetFile.vue';
import ImgView from '@/views/content/asset/img/ImgView.vue'

const { t } = useI18n();
const lang = ref(localStorage.getItem("languageType"));

const route = useRoute();
const store = useStore();
const props = defineProps(['eqpmntInfo'])
const eqpmntId = route.params.eqpmntId
const list = ref([]);
const fileMnls = ref([])

const imgList = ref([
]);

const fnGetImgList = () => {
    let params = { eqpmntId: eqpmntId }
    store.API_LIST('equip/img/list', params).then((data) => {
        list.value = data.data.data
    })
}

const fnDetail = () => {
    let params = { eqpmntId: route.params.eqpmntId }
    const apiUrl = `img/detail`;
    store.API_LIST(apiUrl, params).then((data) => {
        imgList.value = data.data.data;
    }).catch(({ message }) => {
        console.error(message)
    })
}

const fnGetPdfMnul = () => {
    let params = { eqpmntId: eqpmntId }
    store.API_LIST('mnul/file', params).then((data) => {
        fileMnls.value = data.data.data
    }).catch(({ message }) => {
        console.error(message)
    })
}


onMounted(() => {
    fnGetImgList();
    fnDetail();
    fnGetPdfMnul();
})

</script>

<template>

    <div class="board_info mt_6">
        <ImgView :imgVo="props.eqpmntInfo" :imgSe="'thumbnail'" :size="'large'" />

        <Divider layout="vertical" />

        <div class="text_info text_xl ml_4">
            <div class="text_bold mb_3 ml_2 text_xl">{{ props.eqpmntInfo.eqpmntNm }}</div>
            <div> <span class="info_text">{{ t('10725') }}</span>{{ props.eqpmntInfo.eqpmntCd }}</div><!--제품코드-->
            <div><span class="info_text">{{ t('10727') }}</span><!--제품구분-->
                {{
                    lang === 'lng_type_1' ? props.eqpmntInfo.eqpmntSeNm1 :
                        lang === 'lng_type_2' ? props.eqpmntInfo.eqpmntSeNm2 :
                            props.eqpmntInfo.eqpmntSeNm3
                }}
            </div>
            <div> <span class="info_text">{{ t('10752') }}</span><!--업체명-->
                {{ lang === 'lng_type_1' ? props.eqpmntInfo.bzentyNm1 :
                    lang === 'lng_type_2' ? props.eqpmntInfo.bzentyNm2 :
                        props.eqpmntInfo.bzentyNm3
                }}
            </div>
            <!--
            담당부서는 사용 안될거같다.
            <div class="border_class"> <span class="info_text ">{{ '담당부서 |' }}</span> {{ props.eqpmntInfo.tkcgDeptId }}
            </div>
            -->
        </div>
        <!--
        <button class="qna_btn v_btn btn_primary btn_sm">{{ 'Question' }}</button>
        -->
    </div>

    <div class="v_table mt_8 text_lg">
        <table>
            <colgroup>
                <col style="width: 10%;">
                <col>
            </colgroup>
            <tbody>
                <tr>
                    <th scope="row">{{ t('10728') }}</th>
                    <td>
                        {{ props.eqpmntInfo.expln }}
                    </td>
                </tr>
                <tr>
                    <th scope="row">{{ t('10755') }}</th>
                    <td>
                        <AssetFile :fileList="fileMnls" />
                    </td>
                </tr>
                <tr>
                    <th scope="row">{{ t('10754') }}</th>
                    <td>
                        <!-- <div v-for="(item, i) in list" :key="i">
                            <div class="p_1">{{ item.fileNm }}</div>
                        </div> -->

                        <AssetFile :fileList="list" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="card mt_10">
        <template v-if="imgList.length <= 4" v-for="(item, i) in imgList" :key="i">
            <img class="v_box col_class" :src="`/equip/img/${item.imgId}`"></img>
        </template>

        <Carousel v-else :value="imgList" :numVisible="4" :numScroll="4" >
            <template #item="slotProps">
                <div class="mr_4 ml_4">
                    <ImgView :imgVo="slotProps.data" :imgSe="'detail'" :size="'medium'"/>
                </div>
            </template>
            <template #empty>
                <div class="no_data">
                    <i class="v_ico ico_error"></i>
                    <span class="text_msg">{{ t('10785') }}</span><!--상세이미지가 없습니다.-->
                </div>
            </template>
        </Carousel>
    </div>
</template>


<style scoped>
.col_class {
    flex: 0 0 calc(25% - (3 * 16px / 4));
    max-width: calc(25% - (3 * 16px / 4));
    -webkit-box-flex: 0 !important;
    -ms-flex: 0 0 calc(25% - (3 * 16px / 4)) !important;
}

.text_info {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.board_info {
    position: relative;
}

.qna_btn {
    position: absolute;
    right: 0;
}

.more_img {
    display: flex;
    justify-content: center;
    flex: 1;
}


.info_text {
    color: #929292;
    font-size: 1.5rem;
    font-weight: 800;
    margin-right: 20px;
    display: inline-block;
    width: 7rem;
    margin: 10px;
}

.border_class {
    border: 1px solid #e5e5e5;
    padding: 1px 15px 1px 0;
}

</style>