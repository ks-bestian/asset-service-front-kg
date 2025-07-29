<script setup>
import { ref, defineProps, onMounted, watch, defineEmits } from 'vue'
import VideoPanel from '@/views/content/asset/manul/VideoPanel.vue'
import { useStore, useFormStore } from '@/store'
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
const props = defineProps({
    show: Boolean,
    detailDatas: Array,
    type: String
})

const formStore = useFormStore();
const store = useStore()
const manualList = ref([])

const fnAddManual = () => {
    manualList.value.push({ mnlId: String(Date.now() + Math.random()) })
}

const fnDelManual = (id) => {
    if (manualList.value.length === 1) return;

    manualList.value = manualList.value.filter(item => item.mnlId !== id)

    const deleteItems = []
    deleteItems.push(id)
    store.API_DELETE('/mnul', deleteItems).then((data) => {
        formStore.fieldArr = formStore.fieldArr.filter(item => {
            return item.mnlId?.value !== id
        })
    }).catch(({ message }) => {
        console.error(message)
    })
}

watch(() => props.detailDatas, (newval) => {
    if (newval && newval.length) {
        manualList.value = [...newval].sort((a, b) => a.seq - b.seq)
    }
}, { immediate: true, deep: true });


onMounted(() => {
    if (props.type === 'create') {
        manualList.value.push({
            mnlId: '1'
        })
    }
})

</script>

<template>
    <div class="board_info" v-show="show">
        <div class="right">
            <button type="button" class="v_btn btn_primary btn_sm" @click="fnAddManual">{{ t('10749') }}</button>
        </div>
    </div>
    <template v-for="(item, i) in manualList" :key="item.mnlId">
        <VideoPanel :id="item.mnlId" @del-manual="fnDelManual" :index="(i + 1)" v-show="show" :type="props.type"
            :detailDatas="item" />
    </template>
</template>

<style scoped></style>