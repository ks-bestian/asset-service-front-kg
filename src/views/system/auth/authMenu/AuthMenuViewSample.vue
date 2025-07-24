<script setup>
import { ref, onMounted } from "vue";
import { NodeService } from "@/NodeService";
import TreeTable from 'primevue/treetable';
import Column from 'primevue/column';
import Listbox from 'primevue/listbox';

const confirmDialog = ref(null);
const nodes = ref();
const selectedKey = ref({});
const items = ref(['Жалпы бөлүмдүн ыйгарым укуктары', 'Юридикалык бөлүмдүн ыйгарым укуктары', 'Төраганын кабинетинин ыйгарым укуктары', 'Тил боюнча адистешкен бөлүмдүн ыйгарым укуктары', 'Экспертиза бөлүмүнүн ыйгарым укуктары', 
'Юридикалык иш-аракеттер бөлүмүнүн ыйгарым укуктары', 'Тил боюнча котормо жана экспертиза бөлүмүнүн ыйгарым укуктары', 'Көрүү үчүн гана уруксат', 'Системалык администратордун укуктары'])
const selectAuth = ref('Улуттук Ассамблеянын ыйгарым укуктары')


const fnSearch = (item) => {
    selectAuth.value = item
}

const fnSave = async () => {
}

const fnReadAll = () => { //Full read

    nodes.value.forEach(item => {
        item.children.forEach((data) => {
            data.data.read = true;
            data.data.cud = false;
        })
        item.data.read = true;
        item.data.cud = false;
    });
}

let selectAll = true;

const fnMenuAll = () => { //Select the full menu


    if (selectAll) {
        nodes.value.forEach(item => {
            selectedKey.value[item.key] = { checked: true };  // Parent check

            item.children.forEach(child => {
                selectedKey.value[child.key] = { checked: true };  // Child check

            });
        });
    } else {
        nodes.value.forEach(item => {
            selectedKey.value[item.key] = { checked: false };
            item.children.forEach(child => {
                selectedKey.value[child.key] = { checked: false };
            });
        });
    }

    selectAll = !selectAll;
}


const fnSelectMenu = (key) => {
    const selectedItems = nodes.value.filter(item => selectedKey.value[item.key]);
}

const fnEditAll = () => { //Full editorial right

    nodes.value.forEach(item => {
        item.children.forEach((data) => {
            data.data.read = false;
            data.data.cud = true;
        })
        item.data.read = false;
        item.data.cud = true;
    });
}

const fnSelectRead = (node) => { //Inquirable

    node.data.read = !node.data.read
    if (node.data.read) {
        node.data.cud = false;
        selectedKey.value[node.key] = { checked: true }
    } else {
        selectedKey.value[node.key] = { checked: false }
    }
}

const fnSelectCud = (node) => { //Editorial

    node.data.cud = !node.data.cud
    if (node.data.cud) {
        node.data.read = false;
        selectedKey.value[node.key] = { checked: true }
    } else {
        selectedKey.value[node.key] = { checked: false }
    }
}

onMounted(() => {
    NodeService.getAuthMenuTreeNodesSample().then((data) => (nodes.value = data));
});

</script>

<template>
    <div class="content_inner">
        <div class="content_util">
            <div class="title_wrap">
                <h2 class="content_tit">Укуктарга жараша меню башкаруу</h2>
                <button type="button" class="v_btn btn_favorite"><i class="v_ico ico_bookmark"></i></button>
            </div>
            <nav class="v_breadcrumb">
                <ul class="path">
                    <li><i class="v_ico ico_home"></i></li>
                    <li>Администратор</li>
                    <li>Укуктарга жараша меню башкаруу</li>
                </ul>
            </nav>
        </div>

        <!-- Main area -->
        <div class="content_section">
            <div class="content_row authority_wrap">
                <div class="col_4">
                    <div class="col_item_fit">
                        <!-- <div class="card flesx justify-center">
                        <Listbox v-model="selectedCity" :options="cities" optionLabel="name" style="border: none;">
                            <template #option="slotProps">
                                <div class="v_btn"
                                    style="border: 1px solid #E7EBEE; width: 100%; height: 4.2rem; border-radius: 0px;">
                                    {{ slotProps.option.name }}
                                </div>
                            </template>
</Listbox>
</div> -->
                        <ul class="check_list">
                            <li v-for="(item, index) in items">
                                <a href="javascript:void(0)" class="v_btn" :class="{ on: selectAuth === item }"
                                    @click="fnSearch(item)">{{ item
                                    }}</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="col_8">
                    <div class="col_item v_box">
                        <div class="v_table table_list type2">
                            <div class="left">
                                <h4 class="v_tit">{{ selectAuth }}</h4>
                            </div>
                            <div class="tit_header mb_4">
                                <div class="right">
                                    <div class="btn_group">
                                        <button type="button" class="v_btn btn_primary btn_sm"
                                            @click="fnSave">сактоо</button>
                                        <button type="button" class="v_btn btn_outline_primary btn_sm"
                                            @click="fnMenuAll">Бардык менюну тандоо
                                        </button>
                                        <button type="button" class="v_btn btn_outline_primary btn_sm"
                                            @click="fnReadAll">Толук көрүү
                                            укуктары</button>
                                        <button type="button" class="v_btn btn_outline_primary btn_sm"
                                            @click="fnEditAll">Толук түзөтүү
                                            укуктары</button>
                                    </div>
                                </div>
                            </div>

                            <TreeTable v-model:selectionKeys="selectedKey" :value="nodes" selectionMode="checkbox"
                                 :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
                                tableStyle="min-width: 50rem" @update:selectionKeys="fnSelectMenu">
                                <Column field="label" header="Менюнун аталышы" expander></Column>
                                <Column field="read" header="Көрүү" style="width: 15%;" class="align_center">
                                    <template #body="slotProps">
                                        <input type="checkbox" :checked="slotProps.node.data.read"
                                            @change="fnSelectRead(slotProps.node)" />
                                    </template>
                                </Column>
                                <Column header="түзөтүү" class="align_center">
                                    <template #body="slotProps">
                                        <input type="checkbox" :checked="slotProps.node.data.cud"
                                            @change="fnSelectCud(slotProps.node)" />
                                    </template>
                                </Column>
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
