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
    instlList: Array
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
    <DataView :value="props.instlList" :layout="layout" paginator :rows="8">
        <template #header>
            <div class="board_info ml_8">
                <div class="left">
                    <div class="total_num text_xl">{{ "Total" }} <span class="text_primary">{{ props.instlList.length
                            }}</span>
                    </div>
                </div>

                <div class="flex justify-end">
                    <SelectButton v-model="layout" :options="options" :allowEmpty="false">
                        <template #option="{ option }">
                            <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']"></i>
                        </template>
                    </SelectButton>
                </div>
            </div>
        </template>

        <template #list="slotProps">
            <template v-for="(item, index) in slotProps.items" :key="index">

                <div class="flex_container m_5">
                    <div>
                        <img :src="imgList[index]" :alt="item.name" style="width: 30rem; height: 20rem;" class="m_2" />
                        <span style="display: flex; justify-content: center;">{{ item.instlPicNm }}</span>
                    </div>

                    <div class="text_container m2">
                        <div class="header_item">
                            <div v-if="mdfyYn" class="text_xl text_bold m_2"><input type="text"
                                    class="form_control full" v-model="item.instlPlc"></div>
                            <div v-else class="text_xl text_bold m_2">
                                {{ `[${lang === 'lng_type_1' ? item.instlPlcNm1 :
                                        lang === 'lng_type_2' ? item.instlPlcNm2 :
                                                                item.instlPlcNm3}
                                ] ${lang === 'lng_type_1' ? item.instlPlcDtl1 :
                                    lang === 'lng_type_2' ? item.instlPlcDtl2 :
                                                            item.instlPlcDtl3}` 
                                }}
                            </div>
                            <!-- <i class="pi pi-pencil" style="font-size: 1.7rem;"></i> -->
                        </div>
                        <div class="text_lg m_2"><span class="info_text">{{ t('10099') }}</span>{{ lang === 'lng_type_1' ? item.regNm1 : item.regNm2 }}</div>
                        <div class="text_lg m_2"><span class="info_text">{{ t('10738') }}</span>{{ item.instlYmd }}</div>
                        <div class="text_lg m_2"><span class="info_text">{{ t('10740') }}</span>{{ item.dscdYmd }}</div>
                        <div class="text_lg m_2">
                            <span class="info_text">{{ t('10742') }}</span>
                            <input v-if="mdfyYn" type="text" class="form_control full" v-model="item.rmk">
                            <template v-else>{{ item.rmrk }}</template>
                        </div>

                        <div v-if="mdfyYn"><button type="button" class="v_btn btn_primary btn_md" @click="fnSave">
                            {{ t('10743') }}</button></div>
                        <!-- <div v-else class="installer text_lg m_2">{{ `${item.rgstId} [${item.instlYmd}]` }}</div> -->
                    </div>
                </div>
                <Divider v-if="index !== slotProps.items.length - 1" />
            </template>
        </template>



        <template #grid="slotProps">
            <div style="display: flex; flex-wrap: wrap; justify-content: flex-start; gap: 16px; " class="mb_3">
                <div v-for="(item, j) in slotProps.items" :key="j" class="col_class v_box mt_3">
                    <img :src="imgList[j]" :alt="item.name" style="height: 300px; width: 100%;" />
                        <span style="display: flex; justify-content: center;">{{ item.instlPicNm }}</span>

                    <div style="display: flex;justify-content: flex-end;">
                        <!-- <i class="pi pi-pencil mt_2" style="font-size: 1.7rem;"></i> -->
                    </div>
                    <div class="text_xl text_bold m_2">
                        {{ `[${lang === 'lng_type_1' ? item.instlPlcNm1 :
                                lang === 'lng_type_2' ? item.instlPlcNm2 :
                                                        item.instlPlcNm3}
                        ] ${lang === 'lng_type_1' ? item.instlPlcDtl1 :
                            lang === 'lng_type_2' ? item.instlPlcDtl2 :
                                                    item.instlPlcDtl3}` 
                        }}
                    </div>
                    <div class="text_lg m_2"><span class="info_text">{{ t('10099') }}</span>{{ lang === 'lng_type_1' ? item.regNm1 : item.regNm2 }}</div>
                    <div class="text_lg m_2"><span class="info_text">{{ t('10738') }}</span>{{ item.instlYmd }}</div>
                    <div class="text_lg m_2"><span class="info_text">{{ t('10740') }}</span>{{ item.dscdYmd }}</div>
                    <div class="text_lg m_2" style="display: flex;">
                        <span class="info_text">{{ t('10742') }}</span>
                        <div>{{ item.rmrk }}</div>
                    </div>
                </div>
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