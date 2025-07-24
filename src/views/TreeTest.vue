<script setup>
import { ref, onMounted } from "vue";
import Tree from 'primevue/tree';

import TreeTable from 'primevue/treetable';
import Column from 'primevue/column';
import { NodeService } from "@/NodeService";

const nodes = ref();
const selectedKey = ref(null);

const onNodeSelect = (node) => {
    console.log(node)
};

onMounted(() => {
    NodeService.getTreeNodes().then((data) => (nodes.value = data));
});
</script>

<template>
    <div class="content_inner">
        <Tree :value="nodes" v-model:selectionKeys="selectedKey" selectionMode="single" @node-select="onNodeSelect"></Tree>
    </div>
</template>

<style></style>
