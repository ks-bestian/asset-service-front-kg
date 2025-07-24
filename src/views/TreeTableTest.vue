<script setup>
import { ref, onMounted } from "vue";
import Tree from 'primevue/tree';

import TreeTable from 'primevue/treetable';
import Column from 'primevue/column';
import { NodeService } from "@/NodeService";

const nodes = ref();
const selectedKey = ref(null);

onMounted(() => {
    NodeService.getTreeTableNodes().then((data) => (nodes.value = data));
});
</script>

<template>
    <div class="content_inner">
        <div class="v_table table_list">
            <TreeTable v-model:selectionKeys="selectedKey" :value="nodes" selectionMode="checkbox" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
                <Column field="name" header="Name" expander style="width: 34%"></Column>
                <Column field="size" header="Size" style="width: 33%"></Column>
                <Column field="type" header="Type" style="width: 33%"></Column>
            </TreeTable>
        </div>
    </div>
</template>

<style></style>
