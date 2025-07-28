<script setup>
import { ref, onMounted, watch, defineEmits } from 'vue'
import InstlPanel from "@/views/content/asset/install/InstlPanel.vue"
import { useStore, useFormStore } from '@/store'

const store = useStore();
const formStore = useFormStore();
const faqList = ref([])

const fnAddFaq = () => {
    faqList.value.push({
        faqId: String(Date.now() + Math.random())
    });
}



</script>


<template>
    <div class="board_info" v-show="show">
        <div class="right">
            <button type="button" class="v_btn btn_primary btn_sm" @click="fnAddFaq">{{ 'FAQ정보 추가' }}</button>
        </div>
    </div>
    <template v-for="(item, i) in installList" :key="item.instlId">
        <InstlPanel :id="item.instlId" @del-install="fnDelInstall" :index="(i + 1)" v-show="show" :type="type"
            :detailDatas="item" :codeList="codeList" />
    </template>
</template>

<style scoped></style>