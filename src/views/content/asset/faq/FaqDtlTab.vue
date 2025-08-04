<script setup>
import { ref, onMounted, defineProps, computed, watch } from 'vue'
import DataView from 'primevue/dataview';
import FaqPanel from "@/views/content/asset/faq/FaqPanel.vue"
import { useI18n } from 'vue-i18n'
import { useStore } from "@/store";
const { t } = useI18n();
const store = useStore();
const lang = ref(localStorage.getItem("languageType"));
const faqFilter = ref('')
const props = defineProps({
    faqList: Array
})
const mdfyYn = ref(false)
const layout = ref('list');

const fnSave = () => {
    mdfyYn.value = false;
}

const filteredFaqList = computed(() => {
    if (!faqFilter.value) return props.faqList
    return props.faqList.filter(item => item.faqSe === faqFilter.value)
})



</script>



<template>
    <DataView :value="filteredFaqList" :layout="layout" paginator :rows="5">
        <template #header>
            <div class="board_info ml_8">
                <div class="left">
                    <div class="total_num text_xl">{{ "Total" }} <span class="text_primary">{{ filteredFaqList.length
                    }}</span>
                    </div>
                </div>
                <div class="right">
                    <div class="input_item">
                        <label class="form_label">{{ t('10778') }}</label>
                        <select class="form_control ml_2" v-model="faqFilter">
                            <option value="">{{ t('10778') }}</option>
                            <option v-for="(item, i) in store.getComCodes('1040')" :key="i" :value="item.codeId">{{
                                item.codeNm }}</option>
                        </select>
                    </div>
                </div>

            </div>
        </template>
        <template #list="slotProps">

            <template v-for="(item, index) in slotProps.items" :key="index" class="mt_3">
                <FaqPanel :id="item.faqId" :index="(index + 1)" :type="'detail'" :detailDatas="item" />

            </template>

        </template>
        <template #empty>
            <div class="no_data">
                <i class="v_ico ico_error"></i>
                <span class="text_msg">{{ t('10075') }}</span><!--There is no data.-->
            </div>
        </template>
    </DataView>
</template>


<style scoped>
.col_class {
    flex: 0 0 calc(25% - (3 * 16px / 4));
    max-width: calc(25% - (3 * 16px / 4));
    -webkit-box-flex: 0 !important;
    -ms-flex: 0 0 calc(25% - (3 * 16px / 4)) !important;
}

.text_container {
    display: flex;
    flex-direction: column;
    flex: 1;
    position: relative;
}

.installer {
    position: absolute;
    bottom: 0;
    right: 0;
}

.header_item {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.info_text {
    color: #929292;
    font-size: 1.5rem;
    font-weight: 800;
    margin-right: 20px;
    display: inline-block;
    min-width: 5rem;
}
</style>