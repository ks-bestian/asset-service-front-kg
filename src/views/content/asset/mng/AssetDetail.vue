<script setup>
import { ref, onMounted } from 'vue'
import EqpmntDtlTab from '@/views/content/asset/equipment/EqpmntDtlTab.vue'
import VideoMnlDtlTab from '@/views/content/asset/manul/VideoMnlDtlTab.vue'
import InstlDtlTab from '@/views/content/asset/install/InstlDtlTab.vue'
import FaqDtlTab from '@/views/content/asset/faq/FaqDtlTab.vue'
import { useRouter, useRoute } from 'vue-router'
import TitleComp from "@/components/TitleComp.vue";
import { useStore, useFormStore } from '@/store';
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
const formStore = useFormStore();
const store = useStore()
const route = useRoute();
const router = useRouter();
const tab = ref('productInf')
const eqpmntId = route.params.eqpmntId
const eqpmntInfo = ref({})
const instlList = ref({})
const videoList = ref({})
const faqList = ref({})

const fnDetail = () => {
    let params = { eqpmntId: eqpmntId }
    store.API_LIST("equip/detail", params).then((data) => {
        eqpmntInfo.value = data.data.data.equipDetailVo
        instlList.value = data.data.data.installList
        videoList.value = data.data.data.mnulList
        faqList.value = data.data.data.faqList
    }).catch(({ message }) => {
        console.error(message)
    })
}

onMounted(() => {
    fnDetail();
})

</script>
<template>
    <div class="content_inner">

        <TitleComp />
<!--
        <div class="content_util">
            <div class="title_wrap">
                <h2 class="content_tit">{{ eqpmntInfo.eqpmntNm || '' }}</h2>
            </div>
        </div>
-->

        <!-- 본문 영역 -->
        <div class="content_section">
            <nav class="tab_menu type2 mb_6">
                <ul class="tab_list">
                    <li :class="{ on: tab == 'productInf' }" @click="tab = 'productInf'"><a href="javascript:void(0)">{{
                            t('10732') }}</a></li>
                    <li :class="{ on: tab == 'manual' }" @click="tab = 'manual'"><a href="javascript:void(0)">{{ t('10733') }}</a></li>
                    <li :class="{ on: tab == 'installInf' }" @click="tab = 'installInf'"><a href="javascript:void(0)">{{ t('10734') }}</a></li>
                    <li :class="{ on: tab == 'faq' }" @click="tab = 'faq'"><a href="javascript:void(0)">{{ '문의' }}</a></li>
                </ul>
            </nav>
            <EqpmntDtlTab v-if="tab == 'productInf'" :eqpmntInfo="eqpmntInfo" />
            <VideoMnlDtlTab v-if="tab == 'manual'" :videoList="videoList" :eqpmntInfo="eqpmntInfo" />
            <InstlDtlTab v-if="tab == 'installInf'" :instlList="instlList" />
            <FaqDtlTab v-if="tab == 'faq'" :faqList="faqList" />
        </div>
        <div class="btn_group_fixed">
            <button type="submit" class="v_btn btn_primary btn_md" v-if="tab == 'productInf'"
                @click="$router.push({ name: 'asset.mng.form', params: { type: 'update', eqpmntId: eqpmntId } })">{{ t('10744') }}</button>
            <button type="button" class="v_btn btn_outline_primary btn_md" @click="router.push({ name: 'asset.mng' })">{{ t('10750') }}</button>
        </div>
    </div>
</template>