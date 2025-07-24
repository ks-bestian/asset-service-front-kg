<script setup>
import { ref, onMounted } from "vue";
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import DeptSaveModal from "@/views/system/dept/DeptSaveModal.vue";
import CmitUsers from "@/views/system/cmit/CmitUsers.vue";
import CmitInfo from "@/views/system/cmit/CmitInfo.vue";
import { useStore } from "@/store";
import TitleComp from "@/components/TitleComp.vue";
import { useI18n } from 'vue-i18n'
import Listbox from 'primevue/listbox';

const { t } = useI18n()
const store = useStore();
const selectDept = ref(null)
const nodes = ref([]);
const dialog = ref(false);
const list = ref([])
const detail = ref({})
const searchNm = ref('')
const tabSelected = ref(0);
const selectedCmit = ref({})
const newYn = ref(true)



const fnGetData = (search) => {
    list.value = []
    selectDept.value = null;
    if (searchNm.value == '') {
        search = false;
    }

    let param = {
        lang: localStorage.getItem('languageType'),
        deptNm: searchNm.value,
        searchYn: search
    }

    store.API_LIST('admin/cmit', param).then((data) => {
        nodes.value = data.data.data
    }).catch(({ message }) => {
        console.log(message)
    })
}


onMounted(() => {
    fnGetData(false);
});
</script>

<template>
    <div class="content_inner">
        <TitleComp />
        <!-- Main area -->

        <div class="content_section">
            <div class="content_row department_wrap">
                <div class="col_6 v_box">

                    <div class="board_search mb_4">
                        <div class="search_inner">
                            <div class="form_row">
                                <div class="input_item col_12">
                                    <label class="form_label">{{ t('10135') }}</label><!--Committee-->
                                    <input type="text" class="form_control" placeholder="Кириңиз" v-model="searchNm"
                                        @keydown.enter="fnGetData(true)">
                                </div>
                            </div>
                        </div>
                        <div class="search_btn">
                            <button type="button" class="v_btn btn_primary btn_sm" @click="fnGetData(true)"><i
                                    class="v_ico ico_search_white"></i>{{ t('10053') }}</button><!--search-->
                        </div>
                    </div>
                    <div style="height: 80%;">
                        <Listbox :options="nodes" v-model="selectedCmit" option-label="deptNm" style="height: 100%;"
                            @change="newYn = false" />
                    </div>

                </div>
                <div class="col_6">
                    <div class="tit_header mb_4">
                        <div class="left">
                            <h4 class="v_tit">{{ selectedCmit?.deptNm }}</h4>
                        </div>
                    </div>

                    <Tabs value="0" v-model:value="tabSelected">
                        <TabList>
                            <Tab value="0">{{ t('10642') }}</Tab><!--Committee-->
                            <Tab value="1">{{ t('10641') }}</Tab><!--Membership list-->
                        </TabList>

                        <TabPanels>
                            <TabPanel value="0">
                                <!-- Committee -->
                                <CmitInfo :cmitInfo="selectedCmit" :newYn="newYn" v-if="selectedCmit"
                                    @reload="fnGetData(); selectedCmit = {}; newYn = true;" />
                                <CmitInfo v-else :newYn="true" />
                            </TabPanel>

                            <TabPanel value="1">
                                <!-- Membership list -->
                                <CmitUsers :cmitCd="selectedCmit.deptCd" v-if="selectedCmit" />
                                <template v-else>
                                    {{ t('10643') }}
                                </template>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </div>
            </div>
        </div>
        <!-- // Main area -->
    </div>
    <DeptSaveModal v-if="dialog" @close="dialog = false; fnGetData(false);" :deptCd="detail.deptCd" :dialog="dialog" />

</template>

<style scoped>
.v_table .form_control {
    width: 100%;
}

.no_data {
    display: flex;
    /* Flex box use */
    justify-content: center;
    /* Horizontal */
    align-items: center;
    flex-direction: column;
    height: 16rem;
}

:deep(.p-listbox-list-container) {
    max-height: 65vh !important;
}

:deep(.p-listbox) {
    border: none;
    box-shadow: none;
}
</style>
