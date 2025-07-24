<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import TreeSelect from 'primevue/treeselect';
import { useConfirm } from "primevue/useconfirm";
import TitleComp from "@/components/TitleComp.vue";
import Button from 'primevue/button';
import { useI18n } from 'vue-i18n'
import OverlayPanel from 'primevue/overlaypanel'

const { t } = useI18n()
const confirm = useConfirm();
const store = useStore();
const router = useRouter();
const detail = ref({ jobCd: '' })
const treeData = ref([])
const jobList = ref([])
const ccofCd = ref({})
const deptCd = ref({})
const generatePswd = ref('')
const op = ref(null)
const btnOfs = ref(null)


const fnRequireUpdate = (event) => {
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
        message: t('10155'), //'Would you like to save?',

        accept: () => {
            fnUpdate();
        },
    });
}

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
        message: t('10201'), //'Would you like to delete?',

        accept: () => {
            fnDelete();
        },
    });
}

const fnRequireResetPswd = (event) => {
    btnOfs.value = event.currentTarget

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
        message: t('10619'),// Do you want to initialize?

        accept: () => {
            fnResetPswd();
        }
    })
}

const fnResetPswd = () => {
    let params = { userId: detail.value.userId }
    store.API_UPDATE('user/reset/pswd', params).then((data) => {
        generatePswd.value = data.data.data

        op.value.toggle({ currentTarget: btnOfs.value })

        setTimeout(() => {
            op.value.hide()
        }, 10000)

    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnDelete = () => {
    const deleteItems = []
    deleteItems.push(detail.value.userId)

    store.API_DELETE('admin/user', deleteItems).then((data) => {
        router.push({
            path: '/main/system/user',
            query: { key: 'user' }
        })
    }).catch(({ message }) => {
        console.log(message);
    })
}

const fnGetCcof = () => {
    let param = {
        lang: localStorage.getItem('languageType'),
        userId: detail.value.userId
    }

    store.API_LIST(`admin/ccof`, param).then((data) => {
        ccofCd.value = data.data.data.reduce((acc, item) => {
            acc[item.deptCd] = true;
            return acc;
        }, {});

    }).catch(({ message }) => {
        console.log(message)
    })
}


const fnUpdate = () => {
    detail.value.deptCd = Object.keys(deptCd.value)[0];
    detail.value.ccofCds = Object.keys(ccofCd.value)

    const deptCds = [detail.value.deptCd, ...detail.value.ccofCds].filter(code => code !== undefined)
    const uniqueCds = new Set(deptCds)

    if (uniqueCds.size !== deptCds.length) {
        alert(t('10509')) //There is a duplicate department.

    } else {
        store.API_UPDATE('admin/user', detail.value).then((data) => {
            router.push({
                path: '/main/system/user',
                query: { key: 'user' }
            })
        }).catch(({ message }) => {
            console.log(message)
        })
    }
}


const fnGetData = () => {
    let param = {
        lang: localStorage.getItem('languageType'),
        searchYn: false
    }

    store.API_LIST('admin/dept/tree', param).then((data) => {
        treeData.value = data.data.data

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

const fnCopy = async () => {
    await navigator.clipboard.writeText(generatePswd.value)
}


const selectLabels = computed(() => {
    const result = [];

    const search = (nodes) => {
        for (const node of nodes) {
            if (Object.keys(ccofCd.value).includes(node.key)) {
                // Result.push(node.label);

                result.push({
                    label: node.label,
                    key: node.key
                });
            }

            if (node.children) {
                search(node.children);
            }
        }
    };

    search(treeData.value);

    return result;
});

const fnRemoveCcof = (key) => {
    const result = {...ccofCd.value};
    delete result[key];
    ccofCd.value = result;
}


onMounted(() => {
    fnGetData();
    detail.value = { ...history.state.data }
    deptCd.value = { [detail.value.deptCd]: true };
    fnJobCd();
    fnGetCcof();
})

</script>

<template>
    <div class="content_inner">
        <TitleComp />
        <!-- Main area -->
        <div class="content_section">
            <div class="v_table">
                <table>
                    <colgroup>
                        <col style="width: 13%;">
                        <col>
                        <col style="width: 13%;">
                        <col style="width: 37%;">
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row">{{ t('10324') }}</th><!--Id-->
                            <td>
                                <div style="display: flex; align-items: center;">
                                    {{ detail.userId }}
                                    <button style="margin-left: auto;" type="button"
                                        class="v_btn btn_outline_primary btn_sm" @click="fnRequireResetPswd">{{
                                            t('10615') }}</button><!--Password initialization-->
                                    <OverlayPanel ref="op" style="font-size: 1.5rem;">{{ t('10613') + " : " }}
                                        <span style="color: red;">{{ generatePswd }}</span><i class="pi pi-copy"
                                            style="margin-left: 8px; font-size: 1.7rem; cursor: pointer;"
                                            v-tooltip.bottom="{ value: t('10620'), showDelay: 300, hideDelay: 100 }"
                                            @click="fnCopy"></i>
                                    </OverlayPanel>
                                </div>

                            </td>
                            <th scope="row">{{ t('10331') }}</th><!--Email-->
                            <td>
                                <input type="text" class="form_control" v-model="detail.email" maxlength="80">
                            </td>

                        </tr>
                        <tr>
                            <th scope="row">{{ t('10327') }}<span class="text_red">*</span></th><!--Name (Kyrgyz)-->
                            <td>
                                <input type="text" class="form_control" v-model="detail.userNmKg" maxlength="80">
                            </td>
                            <th scope="row">{{ t('10326') }}<span class="text_red">*</span></th><!--Name (Russian)-->
                            <td>
                                <input type="text" class="form_control" v-model="detail.userNmRu" maxlength="80">
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">{{ t('10361') }}</th><!--Position-->
                            <td colspan="3">
                                <select class="form_control" v-model="detail.jobCd" style="width: 41.8%;">
                                    <option disabled value="">{{ t('10224') }}</option>
                                    <option v-for="(item, i) in jobList" :key="i" :value="item.codeId">{{ item.codeNm }}
                                    </option>
                                </select>
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">{{ t('10347') }}<span class="text_red">*</span></th><!--department-->
                            <td>
                                <TreeSelect :options="treeData" :placeholder="t('10224')" selectionMode="single"
                                    style="width: 79%; margin-right: 10px;" v-model="deptCd" />
                                <Button icon="pi pi-refresh" severity="contrast" variant="text"
                                    @click="deptCd = {}"></Button>
                            </td>

                            <th scope="row">{{ t('10630') }}</th><!--Department manager-->
                            <td>
                                <span class="check_item">
                                    <input style="margin-right: 10px;" type="checkbox" id="inputCheck"
                                        v-model="detail.deptHeadYn" true-value="Y" false-value="N">
                                    <label for="inputCheck"></label>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">{{ t('10362') }}</th><!--Humor 1-->
                            <td colspan="3">

                                <TreeSelect v-model="ccofCd" :options="treeData" :placeholder="t('10224')"
                                    selectionMode="multiple" style="width: 33%; margin-right: 10px;"
                                    :maxSelectedLabels="0" class="mb_2"/>
                                <template v-for="(item, i) in selectLabels" :key="i">
                                    <div class="mb_1" style="display: flex; align-items: center;">
                                        {{ '- ' + item.label }}
                                        <Button icon="pi pi-times" severity="contrast" variant="text" @click="fnRemoveCcof(item.key)"></Button>
                                    </div>
                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="btn_group_fixed">
                    <a href="javascript:void(0)" class="v_btn btn_outline_primary btn_md"
                        @click="$router.push({ path: '/main/system/user', query: { key: 'user' } })">{{ t('10084')
                        }}</a><!--inventory-->
                    <button type="button" class="v_btn btn_primary btn_md" @click="fnRequireUpdate">{{ t('10000')
                        }}</button>
                    <button type="button" class="v_btn btn_outline_secondary btn_md" @click="fnRequireDel">{{ t('10173')
                        }}</button>
                </div>
            </div>


        </div>
        <!-- // Main area -->
    </div>
</template>

<style scoped>
.v_table .form_control {
    width: 100%;
}
</style>
