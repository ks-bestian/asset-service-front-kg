<script setup>
import { ref, onMounted, computed } from "vue";
import TreeTable from 'primevue/treetable';
import Column from 'primevue/column';
import { useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import TitleComp from "@/components/TitleComp.vue";
import { useI18n } from "vue-i18n";

const {t} = useI18n();
const confirm = useConfirm();

const store = useStore();
const nodes = ref([]);
const selectedKey = ref([]);
const authList = ref([])
const detail = ref({})
const detailYn = ref(false);

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
        message: t('10155'),
        accept: () => {
            fnSave();
        },
    });
}

const fnAuth = () => { //Authority

    let params = { lang: localStorage.getItem('languageType') }
    store.API_LIST('/admin/auth', params).then((data) => {
        authList.value = data.data.data.slice(0, 8) //ToDo modification

    }).catch(({ message }) => {
        console.log(message);
    })
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


const fnDetail = (item) => {
    selectedKey.value = {};
    detail.value = item;
    detailYn.value = true;

    store.API_LIST(`/admin/authMenu/${item.authId}`).then((data) => { //Kwon Hanbyul menu list

        if (data.data.data.length > 0) {
            const menuAuthMap = new Map();

            data.data.data.forEach(content => {
                menuAuthMap.set(content.menuId, content.menuAuth);
            });

            //Menuauth update while traveling to the nodes.value array

            const recurse = (item) => {
                if (menuAuthMap.has(item.key)) {
                    item.data.menuAuth = menuAuthMap.get(item.key);
                }

                if (item.data.menuAuth != 0) {
                    selectedKey.value[item.key] = { checked: true };
                    item.menuChecked = true;
                }
            }

            nodes.value.forEach(item => {
                recurse(item)

                if (item.children) {
                    item.children.forEach(child => {
                        recurse(child);
                    });
                }
            });

        } else {
            nodes.value.forEach(item => {
                item.data.menuAuth = 0;

                if (item.children) {
                    item.children.forEach(child => {
                        child.data.menuAuth = 0;
                    })
                }
            })
        }
    }).catch(({ message }) => {
        console.log(message);
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

    const recurse = (item) => {
        if (key === 'all') {
            selectedKey.value[item.key] = { checked: checkIs };
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

    nodes.value.forEach(item => {
        recurse(item)
        if (item.children) {
            item.children.forEach(child => {
                recurse(child)
            })
        }
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
        authMenuVos: temp,
        authId: detail.value.authId
    }

    store.API_SAVE('/admin/authMenu', jsonData).then((data) => {
    }).catch(({ message }) => {
        console.log(message);
    })
}


const fnFlattenJson = (json) => {

    let result = [];
    const recurse = (node) => {

        result.push({
            menuId: node.key,
            menuChecked: node.menuChecked,
            menuAuth: node.data.menuAuth,
            authId: detail.value.authId
        });

        if (node.children) {
            node.children.forEach(child => {
                recurse(child);
            });
        }
    }

    recurse(json);
    return result;
}

onMounted(() => {
    fnAuth();
    fnMenu();
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
                            <li v-for="(item) in authList">
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
                            <div class="tit_header mb_4">
                                <div class="right" v-if="detailYn">
                                    <div class="btn_group">
                                        <button type="button" class="v_btn btn_primary btn_sm"
                                            @click="fnRequireSave">{{ t('10000') }}</button>
                                        <button type="button" class="v_btn btn_outline_primary btn_sm"
                                            @click="fnSelectMenu('all')">{{ t('10426') }}</button>
                                        <button type="button" class="v_btn btn_outline_primary btn_sm"
                                            @click="fnSelAuth(4)">{{ t('10674') }}</button>
                                        <button type="button" class="v_btn btn_outline_primary btn_sm"
                                            @click="fnSelAuth(6)">{{ t('10675') }}</button>
                                    </div>
                                </div>
                            </div>

                            <TreeTable v-model:selectionKeys="selectedKey" :value="nodes" selectionMode="checkbox"
                                :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem"
                                @update:selectionKeys="fnSelectMenu">
                                <Column field="label" :header="t('10424')" expander></Column>

                                <Column field="read" :header="t('10676')" style="width: 40%;" class="align_center">
                                    <template #body="slotProps">
                                        <div class="check_area">
                                            <span class="check_item">
                                                <input type="radio" :name="`radioView_${slotProps.node.key}`"
                                                    :id="`view_${slotProps.node.key}`"
                                                    v-model='slotProps.node.data.menuAuth' :value="4">
                                                <label :for="`view_${slotProps.node.key}`">{{ t('10053') }}</label>
                                            </span>
                                            <span class="check_item">
                                                <input type="radio" :name="`radioEdit_${slotProps.node.key}`"
                                                    :id="`edit_${slotProps.node.key}`"
                                                    v-model="slotProps.node.data.menuAuth" :value="6">
                                                <label :for="`edit_${slotProps.node.key}`">{{ t('10677') }}</label>
                                            </span>
                                        </div>
                                    </template>
                                </Column>

                                <template #empty>
                                    <div class="no_data">
                                        <i class="v_ico ico_error"></i>
                                        <span class="text_msg">{{ t('10075') }}</span>
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
</style>
