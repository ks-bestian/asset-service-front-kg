<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from 'vue-router'
import { useStore } from "@/store";

const router = useRouter();
const route = useRoute();
const store = useStore();

const title = computed(() => {
    let ret = '';
    for(var i = 0; i < store.menuList?.length; ++i) {
        const t = getTitle(store.menuList[i], route.path, []);
        if(t) {
            ret = t;
        }
    }
    return ret;
})

const breadcrumb = ref([]);
const menuId = ref();

const isFavorite = computed(() => {
    for(var i = 0; i < store.quickMenuList?.length; ++i) {
        const quickmenu = store.quickMenuList[i];
        if(quickmenu.menuId == menuId.value) {
            return true;
        }
    }
    return false;
})

const getTitle = (node, path, arr) => {
    if(node === undefined) {
        return;
    }
    arr.push(node);
    if(node.menuPath && path.startsWith(node.menuPath)) {
        breadcrumb.value = arr;
        menuId.value = node.key;
        return node.label;
    }
    for(var i = 0; i < node.children?.length; ++i) {
        const child = node.children[i];
        const ret = getTitle(child, path, arr);
        if(ret) {
            return ret;
        }
    }
    arr.pop();
}

const toggleQuickMenu = () => {
    if(menuId.value === undefined) {
        return;
    }
    if(isFavorite.value) {
        store.deleteQuickMenu(menuId.value);  
    }
    else {
        store.addQuickMenu(menuId.value);
    }
}

onMounted(() => {
})
</script>

<template>
    <div class="content_util">
        <div class="title_wrap">
            <h2 class="content_tit">{{ title }}</h2>
            <!-- <button type="button" class="v_btn btn_favorite" :class="{on: isFavorite}" @click="toggleQuickMenu"><i class="v_ico ico_bookmark"></i></button> -->
        </div>
        <nav class="v_breadcrumb">
            <ul class="path">
                <li><i class="v_ico ico_home"></i></li>
                <li v-for="b in breadcrumb" :key="b.key">{{ b.label }}</li>
            </ul>
        </nav>
    </div>
</template>

<style>
.content_util{
  margin-bottom: 0;
  padding: 2rem;
}
</style>
