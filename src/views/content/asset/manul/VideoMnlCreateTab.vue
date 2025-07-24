<script setup>
import { ref, defineProps, onMounted, watch, defineEmits } from 'vue'
import VideoPanel from '@/views/content/asset/manul/VideoPanel.vue'
import { useStore, useFormStore } from '@/store'

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

    // formStore.fieldArr.forEach((item) => {
    //     Object.entries(item).forEach(([key, value]) => {
    //         if (key === 'mnlId') {
    //             if (value.value === id) {
    //                 formStore.fieldArr = formStore.fieldArr.filter(item => { return item.mnlId !== id })
    //             }
    //         }
    //     })
    // })


    store.API_DELETE('/mnul', deleteItems).then((data) => {
    }).catch(({ message }) => {
        console.error(message)
    })
}
watch(() => props.detailDatas, (val) => {
    manualList.value = [...val].sort((a, b) => a.seq - b.seq)
})


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
            <button type="button" class="v_btn btn_primary btn_sm" @click="fnAddManual">{{ '메뉴얼 추가' }}</button>
        </div>
    </div>
    <template v-for="(item, i) in manualList" :key="item.mnlId">
        <VideoPanel :id="item.mnlId" @del-manual="fnDelManual" :index="(i + 1)" v-show="show" :type="props.type"
            :detailDatas="item" />
    </template>
</template>

<style scoped></style>