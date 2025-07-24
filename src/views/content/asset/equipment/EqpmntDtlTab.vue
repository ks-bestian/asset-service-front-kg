<script setup>
import { ref, watch, onMounted, defineProps } from 'vue'
import Divider from 'primevue/divider';
import { useStore } from '@/store';
import caimg from '@/assets/images/content/카메라상세.jpg'
import caimg1 from '@/assets/images/content/카메라상세1.jpg'
import ci1 from '@/assets/images/content/ci1.jpg'
import { useRoute } from 'vue-router';
import Carousel from 'primevue/carousel';


const route = useRoute();
const store = useStore();
const posts = ref([{ userImage: caimg1 }])
const moreYn = ref(true)
const eqpmntId = route.params.eqpmntId
const eqpmntInfo = ref({})
const props = defineProps(['eqpmntInfo'])
const imgList = ref([
    { id: ci1 },
    { id: caimg },
    { id: caimg1 },
    { id: caimg },
    { id: ci1 },
    { id: ci1 },
]);

const fnMorImg = () => {
    posts.value.push({ userImage: caimg })
}

watch(() => posts.value.length, (newval) => {
    if (newval >= 1) {
        moreYn.value = false
    }
})

onMounted(() => {
})

</script>

<template>

    <div class="board_info mt_6">
        <img src="@/assets/images/common/ico_cannon.png" alt="" style="width: 50rem;">
        <Divider layout="vertical" />

        <div class="text_info text_xl ml_4">
            <div class="text_bold mb_3 ml_2 text_xl">{{ props.eqpmntInfo.eqpmntNm }}</div>
            <div> <span class="info_text">{{ '제품코드' }}</span>{{ props.eqpmntInfo.eqpmntCd }}</div>
            <div><span class="info_text">{{ '제품구분' }}</span>{{ props.eqpmntInfo.eqpmntSeNm }}</div>
            <div> <span class="info_text">{{ '업체명' }}</span>{{ props.eqpmntInfo.bzentyNm }}</div>
            <div class="border_class"> <span class="info_text ">{{ '담당부서 |' }}</span> {{ props.eqpmntInfo.tkcgDeptId }}
            </div>
        </div>
        <button class="qna_btn v_btn btn_primary btn_sm">{{ 'Question' }}</button>
    </div>

    <div class="v_table mt_8 text_lg">
        <table>
            <colgroup>
                <col style="width: 10%;">
                <col>
            </colgroup>
            <tbody>
                <tr>
                    <th scope="row">{{ '설명' }}</th>
                    <td>
                        {{ props.eqpmntInfo.expln }}
                    </td>
                </tr>
                <tr>
                    <th scope="row">{{ 'PDF 메뉴얼' }}</th>
                    <td>
                        <div style="display: flex; align-items: center;">
                            {{ '캐논 카메라 매뉴얼.pdf' }}
                            <img src="@/assets/images/common/ico_file_pdf.png" alt="">
                        </div>

                    </td>
                </tr>
                <tr>
                    <th scope="row">{{ '상세 이미지' }}</th>
                    <td>
                        <div>
                            <div class="pb_2">{{ '캐논 카메라 전면.jpg' }}</div>
                            <div class="pb_2">{{ '캐논 카메라 측면.jpg' }}</div>
                            <div>{{ '캐논 카메라 장착법.jpg' }}</div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="card mt_10">
        <Carousel :value="imgList" :numVisible="4" :numScroll="4">
            <template #item="slotProps">
                <div class="mr_4 ml_4" >
                    <img class="v_box" :src="slotProps.data.id" :alt="slotProps.data.id" style="width: 100%; height: 35rem;">
                </div>
            </template>
        </Carousel>
    </div>



    <!-- <template v-for="(item, i) in posts" :key="i">
        <div class="m_4 more_img">
            <img :src="item.userImage" style="height: 35rem; width: 55rem;">
        </div>
    </template>
    <div class="btn_group_fixed">
        <button class="v_btn btn_outline_primary btn_sm" @click="fnMorImg" v-if="moreYn">{{ '+더보기' }}</button>
    </div> -->
</template>


<style scoped>
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