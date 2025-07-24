<script setup>
import { ref } from 'vue'
import BzentyInfoComp from '@/views/content/bzenty/BzentyInfoComp.vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store';
const router = useRouter();



</script>
<template>
    <div class="content_inner">
        <!-- 본문 영역 -->
        <div class="content_section">

            <BzentyInfoComp :bzentyId="id" :mode="detail"/>
        </div>
        <div class="btn_group_fixed">
            <button type="submit" class="v_btn btn_primary btn_md" @click="fnGoUpdate">{{ '수정' }}</button>
            <button type="button" class="v_btn btn_outline_primary btn_md" @click="router.push({name: 'asset.bzenty'})">{{ '목록' }}</button>
        </div>
    </div>

</template>