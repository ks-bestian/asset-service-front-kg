<script setup>
import { ref, onMounted, watch } from "vue";
import { useStore } from "@/store";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const {t} = useI18n();
const store = useStore();

const fnList = () => {
    store.getQuickMenuList();
}

onMounted(() => {
    fnList();
});
</script>

<template>
    <div id="v_quickmenu" class="close" style="z-index: 1000;">
        <!-- <button type="button" class="btn_quickmenu">Quick</button> -->
        <div class="quick_wrap">
            <div class="quick_header">
                <span class="quick_tit">{{ t('10649') }}</span>
                <button type="button" class="btn_quick_close"><i class="v_ico ico_close_white"></i></button>
            </div>
            <div class="link_wrap">
                <div class="link_item" v-for="quickmenu in store.quickMenuList" :key="quickmenu.menuId">
                    <a href="javascript:void(0)" @click="$router.push(`${quickmenu.menuPath}`)">{{ quickmenu.menuNm }}</a>
                    <button type="button" class="v_btn btn_delete" @click="store.deleteQuickMenu(quickmenu.menuId)"><i class="v_ico ico_delete"></i></button>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>
