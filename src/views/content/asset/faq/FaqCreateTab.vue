<script setup>
import { ref, onMounted, watch, defineEmits } from 'vue'
import FaqPanel from "@/views/content/asset/faq/FaqPanel.vue"
import { useStore, useFormStore } from '@/store'
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
const props = defineProps({
    show: Boolean,
    detailDatas: Array,
    type: String
})
const store = useStore();
const faqList = ref([]);
const type = ref(props.type)

const formStore = useFormStore();


const fnAddFaq = () => {
    faqList.value.push({
        faqId: String(Date.now() + Math.random())
    });

}

const fnDelFaq = (id) => {
    if (faqList.value.length === 1) return;

    faqList.value = faqList.value.filter(item => item.faqId !== id)

    const deleteItems = []
    deleteItems.push(id)
    store.API_DELETE('/faq', deleteItems).then((data) => {
        formStore.fieldArr = formStore.fieldArr.filter(item => {
            return item.faqId?.value !== id
        })
    }).catch(({ message }) => {
        console.error(message)
    })
};

watch(() => props.detailDatas, (newval) => {
    faqList.value = [...newval]
})



onMounted(() => {
    
    if(props.type === 'create') {

        faqList.value.push({
            faqId: '1'
        })
    }
        
})
</script>

<template>
    <div class="board_info" v-show="show">
        <div class="right">
            <button type="button" class="v_btn btn_primary btn_sm" @click="fnAddFaq">{{ 'FAQ 추가' }}</button>
        </div>
    </div>

    <template  v-for="(item, i) in faqList" :key="item.faqId">
        <FaqPanel :id="item.faqId" @del-faq="fnDelFaq" :index="(i + 1)" v-show="show"
            :type="type" :detailDatas="item"/>

    </template>


</template>