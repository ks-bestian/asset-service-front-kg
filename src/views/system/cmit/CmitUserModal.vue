<script setup>
import { computed, ref, defineEmits, defineProps, onMounted } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useStore } from "@/store";
import TreeSelect from 'primevue/treeselect';
import Dialog from 'primevue/dialog';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
    dialog: Boolean,
    cmitCd: String,
    userIds: Array
})
const visible = ref(props.dialog);
const store = useStore();
const selectTab = ref('member')
const selectUsers = ref([])
const searchNm = ref('')
const userList = ref([])
const deptList = ref([])
const polyList = ref([])
const polyCd = ref('')
const deptCd = ref({})
const cmitCd = ref('')

const emit = defineEmits(['close', 'rcvs'])

const fnTab = (val) => {
    selectTab.value = val;
    deptCd.value = '';
    polyCd.value = '';
    fnSearchUser();
}

const fnAddCmtUsers = () => {

    const jsondata = {
        deptList: [props.cmitCd],
        userList: selectUsers.value.map(item => item.userId).filter(userId => !props.userIds.includes(userId))
    }

    store.API_SAVE('admin/ccof/users', jsondata).then((data) => {
        emit('close')
    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnSearchUser = () => {
    let param = {
        searchNm: searchNm.value,
        lang: localStorage.getItem('languageType'),
        polyCd: polyCd.value,
        deptCd: Object.keys(deptCd.value)[0],
        cmitCd: cmitCd.value,
        selectTab: selectTab.value,
    }
    store.API_LIST('myPage/msg/user', param).then((data) => {
        userList.value = data.data.data
    }).catch(({ message }) => {
        console.log(message)
    })
}


const filteredData = computed(() => {
    if (selectTab.value === 'member') {
        return userList.value.filter((item) => item.isMember === 'Y')
    } else if (selectTab.value === 'user') {
        return userList.value.filter((item) => item.isMember === 'N')
    }
})


const fnGetData = () => {

    let param = {
        lang: localStorage.getItem('languageType'),
        searchYn: false
    }

    store.API_LIST('admin/dept/tree', param).then((data) => {
        deptList.value = data.data.data
    }).catch(({ message }) => {
        console.log(message)
    })
}


/** Division (party /committee) inquiry */
const fnSearchDept = () => {
    let params = {};
    const apiUrl = 'admin/dept';
    store.API_LIST(apiUrl, params).then((data) => {
        polyList.value.push(...data.data.data.filter(data => data.uprDeptCd == 'poly'));
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

onMounted(() => {
    fnGetData();
    fnSearchUser();
    fnSearchDept();

    selectUsers.value = props.selectUsers
})

</script>

<template>
    <Dialog v-model:visible="visible" modal :style="{ width: '55vw', height: '750px' }" @hide="emit('close')">
        <template #header>
            <div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
                <h2 class="popup_tit">{{ t('10343') }}</h2><!--User inquiry-->
            </div>
        </template>

        <!-- Layer pop -up (user association) -->
        <div class="flex items-center gap-4 mb-4">
            <div class="popup_inner">
                <div class="popup_body">
                    <div class="popup_cont">
                        <div class="form_col type4 mb_2">
                            <nav class="tab_menu type2">
                                <ul class="tab_list">
                                    <li class="on"><a href="javascript:void(0)" @click="fnTab('member')">{{ t('10344') }}</a>
                                    </li><!--member-->
                                    <li><a href="javascript:void(0)" @click="fnTab('user')">{{ t('10345') }}</a></li>
                                    <!--employee-->
                                </ul>
                            </nav>

                            <div class="board_search">
                                <div class="search_inner">
                                    <div class="form_row">
                                        <div class="input_item" v-if="selectTab === 'member'">
                                            <label class="form_label">{{ t('10073') }}</label><!--political party-->
                                            <select class="form_control" v-model="polyCd">
                                                <option value="">{{ t('10224') }}</option><!--Please select.-->
                                                <option v-for="(item, i) in polyList" :key="i" :value="item.deptCd">{{ item.deptNm }}</option>
                                            </select>
                                        </div>

                                        <div class="input_item" v-else-if="selectTab === 'user'">
                                            <label class="form_label">{{ t('10347') }}</label><!--department-->
                                            <TreeSelect :options="deptList" :placeholder="t('10224')"
                                                selectionMode="single"
                                                style="width: 100%; height: 4rem; padding-top: 5px; text-overflow: ellipsis;"
                                                v-model="deptCd" />
                                        </div>



                                        <div class="input_item">
                                            <label class="form_label">{{ t('10152') }}</label><!--name-->
                                            <input type="text" class="form_control" :placeholder="t('10146')"
                                                v-model="searchNm" @keydown.enter="fnSearchUser">
                                        </div>
                                    </div>
                                </div>
                                <div class="search_btn">
                                    <button type="button" class="v_btn btn_primary btn_sm" @click="fnSearchUser"><i
                                            class="v_ico ico_search_white"></i><span>{{ t('10053')
                                            }}</span></button><!--check-->
                                </div>
                            </div>


                            <div class="board_info">
                                <div class="left">
                                    <div class="total_num">Total <span class="text_primary">{{ filteredData.length
                                    }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="v_table table_list mb_1" v-if="selectTab === 'member'">
                                <DataTable :value="filteredData" scrollable scrollHeight="320px"
                                    v-model:selection="selectUsers" data-key="userId">
                                    <Column field="userId" selection-mode="multiple" style="width: 5%;"
                                        class="text_center">
                                    </Column>
                                    <Column field="userNm" :header="t('10152')" class="text_left" sortable></Column>
                                    <!--name-->
                                    <Column field="polyNm" :header="t('10346')" class="text_left"></Column>
                                    <template #empty>
                                        <div class="no_data">
                                            <i class="v_ico ico_error"></i>
                                            <span class="text_msg">{{ t('10075') }}</span><!--There is no data.-->
                                        </div>
                                    </template>
                                </DataTable>
                            </div>

                            <div class="v_table table_list mb_1" v-else-if="selectTab === 'user'">
                                <DataTable :value="filteredData" scrollable scrollHeight="320px" data-key="userId"
                                    v-model:selection="selectUsers">
                                    <Column field="userId" selection-mode="multiple" style="width: 5%;"
                                        class="text_center">
                                    </Column>
                                    <Column field="userNm" :header="t('10152')" class="text_left" sortable></Column>
                                    <Column field="deptNm" :header="t('10347')" class="text_left"></Column>
                                    <template #empty>
                                        <div class="no_data">
                                            <i class="v_ico ico_error"></i>
                                            <span class="text_msg">{{ t('10075') }}</span><!--There is no data.-->
                                        </div>
                                    </template>
                                </DataTable>
                            </div>


                        </div>
                    </div>
                    <div class="popup_footer">
                        <div class="btn_group">
                            <button type="button" class="v_btn btn_primary btn_md" @click="fnAddCmtUsers">{{ t('10089')
                                }}</button><!--check-->
                            <button type="button" class="v_btn btn_outline_primary btn_md" @click="emit('close')">{{
                                t('10163')
                                }}</button><!--cancellation-->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Dialog>
</template>

<style>
.p-treeselect-overlay {
    z-index: 100000 !important;
}

.no_data {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
</style>