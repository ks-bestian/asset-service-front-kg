<script setup>
import { ref, onMounted, watch, defineEmits } from 'vue'
import InstlPanel from "@/views/content/asset/install/InstlPanel.vue"
import { useStore } from '@/store'

const props = defineProps({
    show: Boolean,
    detailDatas: Array,
    type: String
})
const store = useStore();
const installList = ref([]);
const type = ref(props.type)

const fnAddInstall = () => {
    installList.value = []
    type.value = 'create'
    
    installList.value.push({
        instlId: String(Date.now() + Math.random())
    });

}

const fnDelInstall = (id) => {
    if (installList.value.length === 1) return;
    
    installList.value = installList.value.filter(item => item.instlId !== id)

    const deleteItems = []
    deleteItems.push(id)
    store.API_DELETE('/install', deleteItems).then((data) => {
    }).catch(({message}) => {
        console.error(message)
    })
};

watch(() => props.detailDatas, (newval) => {
    installList.value = [...newval]
})


onMounted(() => {
    
    if(props.type === 'create') {
        installList.value.push({
            instlId: '1'
        })
    }
        
})
</script>

<template>
    <div class="board_info" v-show="show">
        <div class="right">
            <button type="button" class="v_btn btn_primary btn_sm" @click="fnAddInstall">{{ '설치정보 추가' }}</button>
        </div>
    </div>
    <template  v-for="(item, i) in installList" :key="item.instlId">
        <InstlPanel :id="item.instlId" @del-install="fnDelInstall" :index="(i + 1)" v-show="show"
            :type="type" :detailDatas="item"/>
    </template>


</template>