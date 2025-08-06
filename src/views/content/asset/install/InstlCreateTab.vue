<script setup>
import { ref, onMounted, watch, defineEmits } from 'vue'
import InstlPanel from "@/views/content/asset/install/InstlPanel.vue"
import { useStore, useFormStore } from '@/store'
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
const props = defineProps({
    show: Boolean,
    detailDatas: Array,
    type: String
})
const store = useStore();
const installList = ref([]);
const type = ref(props.type)
const formStore = useFormStore();

const fnAddInstall = () => {
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
        formStore.fieldArr = formStore.fieldArr.filter(item => {
            return item.instlId?.value !== id
        })
    }).catch(({ message }) => {
        console.error(message)
    })
};
/*
watch(() => props.detailDatas, (newval) => {
    installList.value = [...newval]
})
*/
watch(() => props.detailDatas, (newval) => {
    if (newval && newval.length) {
        installList.value = [...newval];
    }
}, { immediate: true, deep: true });


onMounted(() => {
    if (props.type === 'create') {
        installList.value.push({
            instlId: '1'
        })
    }
})

const formRef = ref(null);

defineExpose({
  getUploadSummaryMap: () => {
    return formRef.value?.getAllFileUploadRefs?.();
  },
});
</script>

<template>
    <div class="board_info" v-show="show">
        <div class="right">
            <button type="button" class="v_btn btn_primary btn_sm" @click="fnAddInstall">{{ t('10748') }}</button><!--설치정보추가-->
        </div>
    </div>
    <template v-for="(item, i) in installList" :key="item.instlId">
        <InstlPanel :ref="formRef" :id="item.instlId" @del-install="fnDelInstall" :index="(i + 1)" v-show="show" :type="type"
            :detailDatas="item"  />
    </template>
</template>