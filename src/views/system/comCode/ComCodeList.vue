<script setup>
import { ref } from "vue";
import GrpCodeList from "@/views/system/comCode/GrpCodeList.vue";
import CodeDetailList from "@/views/system/comCode/CodeDetailList.vue";
import TitleComp from "@/components/TitleComp.vue";

const grpCd = ref('');
const childYn = ref(true);

const fnGrpCd = (e) => {
    grpCd.value = e;
}

const fnChildYn = (e) => {
    childYn.value = e;
}

</script>

<template>
    <div class="content_inner">
        <TitleComp />
        <!-- Main area -->
        <div class="content_section">
            <div class="content_row department_wrap">
                <div class="col_6 v_box">
                    <GrpCodeList @grpCd="fnGrpCd" :childYn="childYn"/>
                </div>
                <div class="col_6 v_box">
                    <CodeDetailList :grpCd="grpCd" @childCd="fnChildYn"/>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
</style>
