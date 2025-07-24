<script setup>
import { ref, onMounted, defineProps, watch } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useStore } from "@/store";
import { useI18n } from 'vue-i18n'
import CmitUserModal from "@/views/system/cmit/CmitUserModal.vue";
import { useConfirm } from "primevue/useconfirm";

const props = defineProps({
    cmitCd: String
})
const { t } = useI18n()
const confirm = useConfirm();
const store = useStore();
const list = ref([])
const userIds = ref([])
const dialogUser = ref(false)
const selectUsers = ref([])
const jobList = ref([])

const fnUserInDept = () => {
    let param = {
        lang: localStorage.getItem('languageType'),
        deptCd: props.cmitCd
    }

    store.API_LIST('user/dept', param).then((data) => {//User-Cumbers, Committee, Political Party, Department

        list.value = data.data.data
        userIds.value = data.data.data.map(item => item.userId);
    }).catch(({ message }) => {
        console.log(message)
    })
}

watch(() => props.cmitCd, (newval, oldval) => {
    if (newval !== oldval && newval !== undefined) {
        fnUserInDept();
    } else if (newval === undefined) {
        list.value = [];
    }
})


const fnRequireDel = (event) => {
    confirm.require({
        rejectProps: {
            severity: 'secondary',
            outlined: true,
            size: 'large'
        },
        acceptProps: {
            size: 'large'
        },
        target: event.currentTarget,
        message: t('10431'), //'Would you like to delete?',

        accept: () => {
            fnDelete();
        },
    });
}

const fnDelete = () => {

    const deleteItems = [];
    deleteItems.push(...selectUsers.value.map(item => item.userId))

    store.API_DELETE(`admin/ccof/${props.cmitCd}`, deleteItems).then(() => {
        fnUserInDept();
    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnJobCd = () => {
    let param = {
        grpCode: '1012'
    }
    store.API_LIST('/admin/comCode', param).then((data) => {
        jobList.value = data.data.data
    }).catch(({ message }) => {
        console.log(message);
    })
}

const fnSaveJocCd = (jobCd, userId) => {
    let param = {
        userId: userId,
        jobCd: jobCd
    }

    store.API_UPDATE(`admin/user/job`, param).then(() => {
        fnUserInDept();
    }).catch(({ message }) => {
        console.log(message)
    })
}

onMounted(() => {
    fnJobCd();
})
</script>


<template>

    <div class="btn_group" style="display: flex; justify-content: flex-end;">
        <button type="button" class="v_btn btn_secondary btn_sm" @click="dialogUser = true">{{
            t('10640') }}</button><!--Committee member registration-->
        <button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnRequireDel">{{ t('10336')
        }}</button><!--Selection deletion-->
    </div>

    <div id="tab_cont2" class="tab_cont">
        <div class="v_table table_list type2">
            <div class="board_info">
                <div class="left">
                    <div class="total_num">{{ t('10104') }} <span class="text_primary">{{ list.length }}</span></div>
                </div>
            </div>
            <DataTable :value="list" :rows="10" scrollable scroll-height="42vh" v-model:selection="selectUsers">
                <Column field="selection" selectionMode="multiple" style="width: 6%;" class="text_center"></Column>
                <Column field="userNm" :header="t('10152')" class="text_center"></Column>
                <Column field="email" :header="t('10331')" class="text_center"></Column>
                <Column field="jobNm" :header="t('10361')" class="text_center">
                    <template #body="{ data }">
                        <select class="form_control" v-model="data.jobCd" @change="fnSaveJocCd(data.jobCd, data.userId)"
                            v-if="data.isMember === 'N'">
                            <option value="">{{ t('10224') }}</option><!--Please select.-->
                            <option v-for="(item, i) in jobList" :key="i" :value="item.codeId">{{ item.codeNm }}
                            </option>
                        </select>
                        <span v-else>{{ "-" }}</span>
                    </template>
                </Column>
                <template #empty>
                    <div class="no_data">
                        <i class="v_ico ico_error"></i>
                        <span class="text_msg">{{ t('10075') }}</span>
                    </div>
                </template>
            </DataTable>
        </div>
    </div>
    <CmitUserModal v-if="dialogUser" @close="dialogUser = false; fnUserInDept();" :dialog="dialogUser" :cmitCd="cmitCd"
        :userIds="userIds" />
</template>

<style scoped></style>