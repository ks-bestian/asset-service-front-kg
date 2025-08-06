<script setup>
import { ref, onMounted } from 'vue'
import BzentyInfoComp from '@/views/content/bzenty/BzentyInfoComp.vue'
import TitleComp from "@/components/TitleComp.vue";
import { useRouter, useRoute } from 'vue-router'
import { useStore, useFormStore } from '@/store';
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const store = useStore();
const formStore = useFormStore();
const type = ref(route.params.type)
const bzentyId = ref(route.params.bzentyId)
const bzenty = ref({});


const fnSave = async () => {
    formStore.apiPath = "/asset/bzenty";

    let params = {}

    formStore.fieldArr.forEach((item) => {
        Object.entries(item).forEach(([key, value]) => {
            params[key] = value.value;
        })
    })

    if (type.value === 'create') {
        formStore.apiMethod = "API_SAVE"
    } else if (type.value === 'update') {
        formStore.apiMethod = "API_UPDATE"
    }

    formStore.fnSubmit().then((result) => {
        if (result) {
            formStore.fnSave().then(r => {
                if(type.value === 'update') {
                router.push({ name: 'asset.bzenty.detail', params: {bzentyId: bzentyId.value} })
                } else {
                    router.push({ name: 'asset.bzenty'})
                }
            })
        }
    })
}

const fnDetail = () => {
    let params = {
        bzentyId: bzentyId.value
    }
    store.API_LIST('/asset/bzenty/detail', params).then((data) => {
        bzenty.value = data.data.data;
    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnDelete = () => {
    const deleteItems = []
    deleteItems.push(bzentyId.value)

    store.API_DELETE('/asset/bzenty', deleteItems).then((data) => {
        router.push(({ name: 'asset.bzenty' }))
    }).catch(({ message }) => {
        console.log(message)
    })
}

onMounted(() => {
    if (type.value === 'update') {
        fnDetail();
    }
})
</script>
<template>
    <div class="content_inner">
        <TitleComp />

        <!-- 본문 영역 -->

        <div class="content_section">
            <BzentyInfoComp :show="true" :detailDatas="bzenty" :type="type"/>
        </div>
        <div class="btn_group_fixed">
            <button type="submit" class="v_btn btn_primary btn_md" @click="fnSave">{{ t('10743') }}</button>
            <button type="button" class="v_btn btn_outline_secondary btn_md" v-if="type === 'update'" @click="fnDelete">{{ t('10745') }}</button>
            <button type="button" class="v_btn btn_outline_primary btn_md" @click="router.push({name: 'asset.bzenty'})">{{ t('10750') }}</button>
        </div>
    </div>

</template>