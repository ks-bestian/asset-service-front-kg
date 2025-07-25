<script setup>
import { ref, onMounted } from 'vue'
import BzentyInfoComp from '@/views/content/bzenty/BzentyInfoComp.vue'
import TitleComp from "@/components/TitleComp.vue";
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '@/store';
const store = useStore();
const router = useRouter();
const route = useRoute();
const type = ref(route.params.type)
const bzentyId = ref(route.params.bzentyId)
const bzenty = ref({});

const fnDetail = () => {
    let params = {
        bzentyId: bzentyId.value
    }
    store.API_LIST('/asset/bzenty/detail', params).then((data) => {
        bzenty.value = data.data.data;
        console.log('bzenty.value',bzenty.value)
    }).catch(({ message }) => {
        console.log(message)
    })
}

onMounted(() => {
    fnDetail();
})

</script>
<template>
    <div class="content_inner">
        <TitleComp />
        <!-- 본문 영역 -->
        <div class="content_section">

            <BzentyInfoComp v-if="bzenty.bzentyId" :show="true" :detailDatas="bzenty" :type="'detail'"/>
        </div>
        <div class="btn_group_fixed">
            <button type="submit" class="v_btn btn_primary btn_md" @click="router.push({ name: 'asset.bzenty.form', params: { type: 'update', bzentyId: bzentyId } })">{{ '수정' }}</button>
            <button type="button" class="v_btn btn_outline_primary btn_md" @click="router.push({name: 'asset.bzenty'})">{{ '목록' }}</button>
        </div>
    </div>

</template>