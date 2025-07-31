<script setup>
import { ref, onMounted, defineProps } from 'vue'
import Divider from 'primevue/divider';
import { object } from 'yup';
import { useStore } from '@/store';
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
const store = useStore()
const product = ref([])
const props = defineProps({
    videoList: Array,
    eqpmntInfo: Object
})
const lang = ref(localStorage.getItem("languageType"));


const fnGetVideoList = () => {

}

onMounted(() => {
    fnGetVideoList();
    product.value.push(
        {
            title: '카메라 조작 메뉴얼 카메라 조작 메뉴얼 카메라 조작 메뉴얼 카메라 조작 메뉴얼 카메라 조작 메뉴얼',
            time: '02:48:55'
        },
        {
            title: '카메라 저장 영상 mp4 변환 메뉴얼',
            time: '02:48:55'
        },
        {
            title: '회의 내용을 자동 녹화 메뉴얼',
            time: '02:48:55'
        },
        {
            title: '자막이 화면에 나타나지 않을 때 메뉴얼',
            time: '02:48:55'
        }
    )
})
</script>

<template>
    <div class="content_row">
        <div class="col_9 v_box">
            
            <div class="tit_header mb_4">
                <div class="left">
                    <h4 class="v_tit m_2">{{ eqpmntInfo.eqpmntNm }}</h4>
                    <span class="e_info m_2 text_lg">{{ eqpmntInfo.eqpmntCd + ' | ' + ((lang === 'lng_type_1') ? eqpmntInfo.eqpmntSeNm1 : (lang === 'lng_type_2') ? eqpmntInfo.eqpmntSeNm2 : eqpmntInfo.eqpmntSeNm3) }}</span>
                </div>
            </div>

            <div>
                <video controls width="100%" height="700px" :src="`http://localhost:8081/mnul/preview/${props.eqpmntInfo.eqpmntId}`"
                    style="border-radius: 1rem;"></video>

                    <div class="mt_4 ml_1 text_xl">{{ '카메라 조작 메뉴얼 카메라 조작 메뉴얼 카메라 조작 메뉴얼 카메라 조작 메뉴얼 카메라 조작 메뉴얼  [02:48:55]' }}</div>
            </div>
        </div>

        <div class="col_3 v_box">
            <!-- <div class="text_xl text_bold mb_3">{{ eqpmntInfo.eqpmntCd + ' | ' + eqpmntInfo.eqpmntSeNm + ' 메뉴얼'}}</div> -->
            <template v-for="(item, i) in product" :key="i">
                <div class="m1_5" style="display: flex; align-items: center; ">
                    <i class="pi pi-play-circle mr_1 " style="font-size: 1.8rem;"></i>
                    <button type="button" class="m_1 text_xl text_bold" style="text-align: left;">{{ item.title }}</button>
                    <span class="m_1 text_lg">{{ item.time }}</span>
                    <i class="pi pi-download" style="margin-left: auto;"></i>
                </div>
                <Divider />
            </template>
        </div>
    </div>
</template>


<style scoped>
.v_box {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.e_info {
    color: #3b3b3b;
}
</style>