<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "@/store";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import AuthUserModal from '@/views/system/auth/authUser/AuthUserModal.vue';
import { useConfirm } from "primevue/useconfirm";
import TitleComp from "@/components/TitleComp.vue";
import { useI18n } from "vue-i18n";

const {t} = useI18n();
const confirm = useConfirm();
const store = useStore();
const nodes = ref([]);
const authList = ref([]);
const detail = ref({})
const selectedKey = ref(null);
const detailYn = ref(false);
const lang = ref(localStorage.getItem('languageType'))
const selUser = ref([])
const modalShow = ref(false)


const fnAuth = () => { //Authority

    let params = { lang: localStorage.getItem('languageType') }
    store.API_LIST('/admin/auth', params).then((data) => {
        authList.value = data.data.data//.slice (0, 8) //ToDo modification

    }).catch(({ message }) => {
        console.log(message);
    })
}

const fnRequire = (event) => {
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
        message: t('10155'),
        accept: () => {
            fnSave();
        },
    });
}


const fnDetail = (item) => {
    selectedKey.value = {};
    detail.value = item;
    detailYn.value = true;

    let param = {
        lang: lang.value
    }
    store.API_LIST(`/admin/authUser/${item.authId}`, param).then((data) => { //Personal use of permissions

        nodes.value = data.data.data
    }).catch(({ message }) => {
        console.log(message);
    })
}


const fnDelete = () => {
    nodes.value = nodes.value.filter(item => !selUser.value.some(existing => existing.userId === item.userId))
}


const fnSave = () => {
    if (nodes.value.length == 0) {
        const deleteItems = []
        deleteItems.push(detail.value.authId)

        store.API_DELETE('admin/authUser', deleteItems).then((data) => {
        }).catch(({ message }) => {
            console.log(message)
        })
    } else {
        const jsonData = {
            authId: detail.value.authId,
            userIds: nodes.value.map(item => item.userId)
        }
        store.API_SAVE('admin/authUser', jsonData)
    }

}

const fnRcvs = (rcvs) => {
    nodes.value = [
        ...nodes.value,
        ...rcvs.filter(newRcv => !nodes.value.some(existing => existing.userId === newRcv.userId))
    ];
    modalShow.value = false;
}

onMounted(() => {
    fnAuth();
});

</script>

<template>
    <div class="content_inner">
        <TitleComp />
        <!-- Main area -->
        <div class="content_section">
            <div class="content_row authority_wrap">
                <div class="col_4">
                    <div class="col_item_fit">
                        <ul class="check_list">
                            <li v-for="(item, index) in authList">
                                <a href="javascript:void(0)" class="v_btn"
                                    :class="{ on: detail.authNm === item.authNm }" @click="fnDetail(item)">{{
                                        item.authNm }}</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="col_8">
                    <div class="col_item v_box">
                        <div class="v_table table_list type2">
                            <div class="left">
                                <h4 class="v_tit">{{ detail.authNm }}</h4>
                            </div>
                            <div class="tit_header mb_4" v-show="detailYn">
                                <div class="right">
                                    <div class="btn_group">
                                        <button type="button" class="v_btn btn_primary btn_sm"
                                            @click="modalShow = true">{{ t('10195') }}</button>
                                        <button type="button" class="v_btn btn_primary btn_sm"
                                            @click="fnRequire">{{ t('10000') }}</button>
                                        <button type="button" class="v_btn btn_outline_primary btn_sm"
                                            @click="fnDelete">{{ t('10088') }}</button>
                                    </div>
                                </div>
                            </div>

                            <DataTable :value="nodes" :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" scrollable
                                 tableStyle="min-width: 50rem;" data-key="userId"
                                v-model:selection="selUser">
                                <Column selection-mode="multiple" style="width: 7%;" class="text_center"></Column>
                                <Column field="userNm" :header="t('10152')">
                                    <template #body="slotProps">
                                        {{ slotProps.data.userNm + '(' + slotProps.data.userId + ')' }}
                                    </template>
                                </Column>
                                <Column field="deptNm" :header="t('10328')">
                                    <template #body="slotProps">
                                        <template v-if="(slotProps.data.polyNm != null && slotProps.data.polyNm != '' && slotProps.data.polyNm != undefined)">
                                            {{ slotProps.data.polyNm }}
                                        </template>
                                        <template v-else>
                                            {{ slotProps.data.deptNm }}
                                        </template>
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
                </div>
            </div>
        </div>
        <!-- // Main area -->
    </div>
    <AuthUserModal v-if="modalShow" @close="modalShow = false;" :modalShow="modalShow" @rcvs="fnRcvs" />
</template>

<style scoped>
.board_form {
    margin-top: 50px;
}

.no_data {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
</style>
