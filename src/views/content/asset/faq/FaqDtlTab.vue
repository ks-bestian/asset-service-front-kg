<script setup>
import { ref, onMounted, defineProps } from 'vue'
import DataView from 'primevue/dataview';
import Divider from 'primevue/divider';
import img1 from '@/assets/images/content/회의1.png'
import img2 from '@/assets/images/content/회의2.png'
import img3 from '@/assets/images/content/회의3.png'
import SelectButton from 'primevue/selectbutton';
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
const lang = ref(localStorage.getItem("languageType"));

const props = defineProps({
    faqList: Array
})
const mdfyYn = ref(false)
const layout = ref('grid');
const options = ref(['list', 'grid']);
const imgList = ref([img1, img2, img3, img1, img2, img3])

const fnSave = () => {
    mdfyYn.value = false;
}
</script>

<template>
    <DataView :value="props.faqList" :layout="layout">
        <template #header>
            <div class="board_info ml_8">
                <div class="left">
                    <div class="total_num text_xl">{{ "Total" }} <span class="text_primary">{{ props.faqList.length }}</span>
                    </div>
                </div>


            </div>
        </template>

            <template v-for="(item, index) in props.faqList" :key="index">

                <div class="flex_container m_5">


                    <div class="text_container m2">

                        <div class="text_lg m_2">
                            <span class="info_text">{{'질문'}}</span>
                            <input v-if="mdfyYn" type="text" class="form_control full" v-model="item.qstn">
                            <template>{{ item.qstn }}</template>
                        </div>
                        
                        <div class="text_lg m_2">
                            <span class="info_text">{{'답변'}}</span>
                            <input v-if="mdfyYn" type="text" class="form_control full" v-model="item.ans">
                            <template>{{ item.ans }}</template>
                        </div>

                        <div v-if="mdfyYn"><button type="button" class="v_btn btn_primary btn_md" @click="fnSave">
                            {{ t('10743') }}</button></div>
                        <!-- <div v-else class="installer text_lg m_2">{{ `${item.rgstId} [${item.instlYmd}]` }}</div> -->
                    </div>
                </div>
                <Divider />
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