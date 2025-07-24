<script setup>
import { computed } from "vue";
import rcvTab from '@/views/content/myPage/msg/rcvTab.vue'
import sendTab from '@/views/content/myPage/msg/sendTab.vue'
import { useRouter, useRoute } from "vue-router";
import TitleComp from "@/components/TitleComp.vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter();
const route = useRoute();
const tabType = computed(() => route.query.key || 'rcv')

const fnTab = (tabname) => {
    router.push({
        path: '/myPage/msg',
        query: { key: tabname }
    })
}

const fnMsgWrite = () => {
    router.push({ name: 'myPage.msg.save' })
}

</script>

<template>
    <div class="content_inner">
        <TitleComp />
        <!-- Main area -->
        <div class="content_section">
            <nav class="tab_menu type2 mb_6">
                <ul class="tab_list" style="display: flex;">
                    <li :class="{ on: tabType == 'rcv' }"><a href="javascript:void(0)" @click="fnTab('rcv')">{{
                        t('10334') }}</a></li><!--Received message-->
                    <li :class="{ on: tabType == 'send' }"><a href="javascript:void(0)" @click="fnTab('send')">{{
                        t('10335') }}</a></li><!--Sent message-->
                    <!-- <a href="javascript:void(0)" style="margin-left: auto;" class="v_btn btn_secondary btn_sm" @click="fnMsgWrite">{{ t('10341') }}</a> -->
                    <!--Message-->
                </ul>
            </nav>
            <rcvTab v-if="tabType === 'rcv'" />
            <sendTab v-else-if="tabType === 'send'" />
        </div>
        <!-- // Main area -->
    </div>
</template>

<style></style>