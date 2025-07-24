<script setup>
import { ref, onMounted, computed } from "vue";
import TreeTable from 'primevue/treetable';
import Tree from 'primevue/tree';
import Column from 'primevue/column';
import { useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import TitleComp from "@/components/TitleComp.vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const confirm = useConfirm();
const store = useStore();
const nodes = ref([]);
const selectedKey = ref([]);
const detail = ref({})
const detailYn = ref(false);
const treeNodes = ref();
const selectDept = ref(null)
const selectDeptNm = ref(null)


const fnRequireSave = (event) => {
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
            fnSave();
        },
    });
}

const fnMenu = () => { //Menu

    let params = { lang: localStorage.getItem('languageType'), type: 'authMenu' }
    store.API_LIST('/admin/menu', params).then((data) => {
        const temp = [data.data.data]
        nodes.value.push(...temp[0])
    }).catch(({ message }) => {
        console.log(message);
    })
}

const fnGetData = () => { //Department Tree

    let param = {
        lang: localStorage.getItem('languageType'),
        searchYn: false
    }

    store.API_LIST('admin/dept/tree', param).then((data) => {
        treeNodes.value = data.data.data;
    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnSelAuth = (auth) => { //Inquiry, editorial authority

    nodes.value.forEach(item => {
        item.data.menuAuth = auth;
        if (item.children) {
            item.children.forEach(child => {
                child.data.menuAuth = auth;
            });
        }
    });
}

let checkIs = false;

const fnSelectMenu = (key) => {
    checkIs = !checkIs;

    //Parents without children are false

    const fnRecurse = (item) => {
        if (item.children?.length) {
            item.children.forEach(item => {
                fnRecurse(item);
            })

            const hasCheckedChild = item.children.some(
                child => !!selectedKey.value[child.key]
            );

            if (!hasCheckedChild) {
                item.menuChecked = false;
            }
        }
    }

    //Recursive true

    const recurse = (item) => {

        if (item.children) {
            item.children.forEach(child => {
                recurse(child)
            })
        }

        if (key === 'all') {
            if (checkIs) {
                selectedKey.value[item.key] = { checked: checkIs };
            } else {
                selectedKey.value = []
            }
            item.menuChecked = checkIs;
        } else {
            item.menuChecked = false;
            Object.keys(key).forEach(id => {
                if (id == item.key) {
                    item.menuChecked = true;
                }
            })
        }
    }

    nodes.value.forEach(item => { //Menu

        recurse(item);
        fnRecurse(item);
    })
}

const fnSave = () => {
    let temp = [];

    const recurse = (item) => {
        if (!item.menuChecked) {
            item.data.menuAuth = 0;
        }
    }

    nodes.value.forEach(item => {
        recurse(item);

        if (item.children) {
            item.children.forEach(child => {
                recurse(child);
            })
        }
        temp.push(...fnFlattenJson(item))
    })

    const jsonData = {
        authDeptVos: temp,
        deptCd: detail.value.key
    }

    store.API_SAVE('/admin/authDept', jsonData).then((data) => {
    }).catch(({ message }) => {
        console.log(message);
    })
}


const fnFlattenJson = (json) => {
    let result = [];
    const recurse = (node) => {
        if (node.menuChecked) {
            result.push({
                menuCd: node.key,
                menuChecked: node.menuChecked,
                // menuAuth: node.data.menuAuth,

                deptCd: detail.value.key
            });

            if (node.children) {
                node.children.forEach(child => {
                    if (child.menuChecked) {
                        recurse(child);
                    }
                });
            }
        }
    }

    recurse(json);
    return result;
}

const fnNodeSelect = (node) => { //Click on department

    detail.value = node;
    selectDeptNm.value = node.label
    detailYn.value = true;
    fnAuthDept(node.key);
};

const fnAuthDept = (deptCd) => {
    store.API_LIST(`admin/authDept/${deptCd}`).then((data) => {
        selectedKey.value = [];
        if (data.data.data.length > 0) {
            data.data.data.forEach(item => {
                selectedKey.value[item.menuCd] = { checked: true };
            })
        }

    }).catch(({ message }) => {
        console.log(message)
    })
}



onMounted(() => {
    fnMenu();
    fnGetData();
});

</script>

<template>
    <div class="content_inner">
        <TitleComp />

        <!-- Main area -->
        <div class="content_section">
            <div class="content_row authority_wrap">
                <div class="col_6 v_box">
                    <Tree :value="treeNodes" v-model:selectionKeys="selectDept" selectionMode="single"
                        @node-select="fnNodeSelect" style="height: 100%; overflow: auto;"></Tree>
                </div>

                <div class="col_6" style="height: 70vh; overflow: auto;">
                    <div class="tit_header mb_4">
                        <div class="left">
                            <h4 class="v_tit">{{ selectDeptNm }}</h4>
                        </div>

                        <div class="right">
                            <div class="right" v-if="detailYn">
                                <div class="btn_group">
                                    <button type="button" class="v_btn btn_primary btn_sm" @click="fnRequireSave">{{
                                        t('10174') }}</button><!--save-->
                                    <button type="button" class="v_btn btn_outline_primary btn_sm"
                                        @click="fnSelectMenu('all')">{{ t('10426') }}</button><!--Select a full menu-->
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col_item">
                        <div class="v_table table_list type2">

                            <TreeTable v-model:selectionKeys="selectedKey" :value="nodes" selectionMode="checkbox"
                                :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem"
                                @update:selectionKeys="fnSelectMenu">
                                <Column field="label" :header="t('10424')" expander></Column>
                                <!--Menu-->
                                <template #empty>
                                    <div class="no_data">
                                        <i class="v_ico ico_error"></i>
                                        <span class="text_msg">{{ t('10075') }}</span><!--There is no data.-->
                                    </div>
                                </template>
                            </TreeTable>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <!-- // Main area -->
    </div>
</template>

<style>
.align_center .p-treetable-body-cell-content {
    justify-content: center !important;
}

.align_center .p-treetable-column-header-content {
    justify-content: center !important;
}

.table_list.type2 thead th {
    background-color: #F5FBFE;
    border-bottom: none;
    border-top: 1px solid #DCE0E5;
}
</style>
