<script setup>
import { ref, onMounted } from 'vue'
import EqpmntCreateTab from '@/views/content/asset/equipment/EqpmntCreateTab.vue'
import VideoMnlCreateTab from '@/views/content/asset/manul/VideoMnlCreateTab.vue'
import InstlCreateTab from '@/views/content/asset/install/InstlCreateTab.vue'
import FaqCreateTab from '@/views/content/asset/faq/FaqCreateTab.vue'
import { useRouter, useRoute } from 'vue-router'
import TitleComp from "@/components/TitleComp.vue";
import { useStore, useFormStore } from '@/store';
import { useI18n } from 'vue-i18n'
import { formSchemas } from '@/schemas/AssetSchemas'

const store = useStore();
const formStore = useFormStore();
const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const tab = ref('productInf')
formStore.apiPath = "/equip"
const instlField = ref(formSchemas.installVo.fields.flatMap(row => row.map(col => col.name)));
const mnulField = ref(formSchemas.mnulVo.fields.flatMap(row => row.map(col => col.name)))
const faqField = ref(formSchemas.faqVo.fields.flatMap(row => row.map(col => col.name)))
const type = ref(route.params.type)
const equipDetailVo = ref({})
const mnulList = ref([])
const installList = ref([])
const faqList = ref([])
const eqpmntId = ref(route.params.eqpmntId);
const fnSave = async () => {
    let mnulVo = []
    let installVo = []
    let faqVo = []
    let params = {}
    const formData = new FormData();

    formStore.fieldArr.forEach((item) => {
        const obj = {};
        let isInstall = false;
        let isManual = false;
        let isFaq = false;


        Object.entries(item).forEach(([key, value]) => {
            if (mnulField.value.includes(key)) {
                if (key === 'videoFile1' || key === 'videoFile2') {
                    if (value.value) {
                        for (var i = 0; i < value.value.length; i++) {
                            formData.append('videoFiles', value.value[i])
                        }
                    }
                }

                obj[key] = value.value;
                isManual = true;
            } else if (instlField.value.includes(key)) {
                obj[key] = value.value;
                isInstall = true;
            } else if (faqField.value.includes(key)) {
                obj[key] = value.value;
                isFaq = true;
            } else {
                if (key === 'files' || key === 'dtlImg') {
                    if (value) {
                        for (var i = 0; i < value.length; i++) {
                            formData.append(key, value[i])
                        }
                    }
                } else {
                    formData.append(key, value)
                }
            }
        })

        if (isInstall) installVo.push(obj);
        if (isManual) mnulVo.push(obj);
        // if (isFaq) faqVo.push(obj);
    })

    const sendData = {
        // ...params,
        mnulVoList: mnulVo,
        installVoList: installVo,
        // faqVoList: faqVo
    }

    for (const key in sendData) {
        const value = sendData[key]
        if (typeof value === 'object' && value !== null) {
            formData.append(key, JSON.stringify(value))
        }
    }


    formStore.fnSubmit().then((result) => {
        if (result) {
            if (type.value === 'create') {
                store.API_SAVE_FILE('/equip', formData).then((data) => {
                    router.push({ name: 'asset.mng' });
                    formStore.fieldArr = [];
                }).catch(({ message }) => {
                    console.log(message)
                })
            } else if (type.value === 'update') {
                router.push({ name: 'asset.mng.dtl', params: { eqpmntId: eqpmntId.value } })
            }
        }
    })
}


const fnDetail = () => {
    formStore.fieldArr = []
    let params = {
        eqpmntId: eqpmntId.value
    }
    store.API_LIST('equip/detail', params).then((data) => {
        equipDetailVo.value = data.data.data.equipDetailVo
        mnulList.value = data.data.data.mnulList
        installList.value = data.data.data.installList
        faqList.value = data.data.data.faqList
    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnDelete = () => {
    const deleteItems = []
    deleteItems.push(eqpmntId.value)

    store.API_DELETE('equip', deleteItems).then((data) => {
        router.push(({ name: 'asset.mng' }))
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
            <nav class="tab_menu type2 mb_6">
                <ul class="tab_list">
                    <li :class="{ on: tab == 'productInf' }" @click="tab = 'productInf'"><a href="javascript:void(0)">{{
                        t('10732') }}</a></li>
                    <li :class="{ on: tab == 'manual' }" @click="tab = 'manual'"><a href="javascript:void(0)">{{
                        t('10733') }}</a></li>
                    <li :class="{ on: tab == 'installInf' }" @click="tab = 'installInf'"><a href="javascript:void(0)">{{
                        t('10734') }}</a></li>
                    <li :class="{ on: tab == 'faq' }" @click="tab = 'faq'"><a href="javascript:void(0)">{{ '문의' }}</a>
                    </li>
                </ul>
            </nav>
            <EqpmntCreateTab :show="tab === 'productInf'" :detailDatas="equipDetailVo" :type="type" />
            <VideoMnlCreateTab :show="tab === 'manual'" :detailDatas="mnulList" :type="type" />
            <InstlCreateTab :show="tab === 'installInf'" :detailDatas="installList" :type="type" />
            <FaqCreateTab :show="tab === 'faq'" :detailDatas="faqList" :type="type" />
        </div>
        <div class="btn_group_fixed">
            <button type="submit" class="v_btn btn_primary btn_md" @click="fnSave">{{ t('10743') }}</button><!-- 저장 -->
            <button type="button" class="v_btn btn_outline_secondary btn_md" v-if="type === 'update'"
                @click="fnDelete">{{ t('10745') }}</button><!-- 삭제 -->
            <button type="button" class="v_btn btn_outline_primary btn_md"
                @click="router.push({ name: 'asset.mng' }); formStore.fieldArr = [];">{{ t('10750') }}</button>
            <!-- 목록 -->
        </div>
    </div>

</template>

<style scoped></style>