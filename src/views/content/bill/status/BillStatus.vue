<script setup>
import { ref, onMounted, computed, watch } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Chart from 'primevue/chart';
import BillStatusReport from "@/components/modal/bill/status/BillStatusReport.vue";
import { BillStatusService } from "@/BillStatusService";
import TitleComp from "@/components/TitleComp.vue";
import { useI18n } from 'vue-i18n'
import { isEmpty, replace } from 'lodash';

const { t } = useI18n()
const tableDatas = ref([
  { kind: t('10569'), receive: "3", process: "2", unProcess : "1"},
  { kind: t('10344'), receive: "12", process: "8", unProcess: "4"},
]);

const dialog = ref(false);

const chartData = ref();
// const chartOptions = ref();

const chartType = ref('pie');
const chartKind = ref('ppslKnd');
const ppslDtFrom = ref();
const ppslDtTo = ref();

const getChartData = async () => {
    const from = isEmpty(ppslDtFrom.value) ? '' : replace(ppslDtFrom.value, /-/g, '');
    const to = isEmpty(ppslDtTo.value) ? '' : replace(ppslDtTo.value, /-/g, '');
    chartData.value = await BillStatusService.getChartData(chartKind.value, from, to);
    // chartOptions.value = BillStatusService.getChartOptions();

}

const openReport = () => {
    dialog.value = true;
}

const fnReset = () => {
    chartKind.value = 'ppslKnd';
} 

watch([() => chartKind.value, () => ppslDtFrom.value, () => ppslDtTo.value], () => {
    getChartData();
});

onMounted(() => {
    getChartData();
});

</script>

<template>
    <div class="content_inner">
        <TitleComp />
        <!-- Main area -->
        <div class="content_section">
            <div class="board_search">
                <div class="search_inner">
                    <div class="form_row">
                        <div class="input_item">
                            <label class="form_label">{{ t('10279') }}</label>
                            <select class="form_control" v-model="chartKind">
                                <option value="ppslKnd">{{ t('10280') }}</option>
                                <option value="cmt">{{ t('10281') }}</option><!--Committee-->
                                <option value="poly">{{ t('10282') }}</option><!--Political party-->
                            </select>
                        </div>
                        <div class="input_item">
                            <label class="form_label">{{ t('10102') }}</label>
                            <div class="input_group">
                                <input type="date" class="form_control form_datepicker" v-model="ppslDtFrom">
                                <span class="text">~</span>
                                <input type="date" class="form_control form_datepicker" v-model="ppslDtTo">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="search_btn">
                    <button type="button" class="v_btn btn_primary btn_md" @click="getChartData()"><i class="v_ico ico_search_white"></i><span>{{ t('10053') }}</span></button>
                    <!-- <button type="button" class="v_btn btn_primary btn_md" onclick="openModal('#layer_bill_status_report', this);"><i class="v_ico ico_excel_white"></i><span>Отчет</span></button> -->
                    <button type="button" class="v_btn btn_primary btn_md" @click="openReport"><i class="v_ico ico_excel_white"></i><span>{{ t('10283') }}</span></button>
                    <button type="button" @click="fnReset" class="v_btn btn_outline_primary btn_md"><i class="v_ico ico_reset_primary"></i><span></span></button>
                </div>
            </div>
            <div style="margin-top: 1rem; text-align: right;">
                <select class="form_control" v-model="chartType">
                    <option value="bar">bar</option>
                    <option value="pie">pie</option>
                </select>
            </div>
            <div class="stat_area">
                <Chart type="bar" :data="chartData" :options="BillStatusService.getBarChartOptions()" style="width: 90%; height: 500px" v-if="chartType === 'bar'" />
                <Chart type="pie" :data="chartData" :options="BillStatusService.getPieChartOptions()" style="width: 100%; height: 400px" v-if="chartType === 'pie'" />
            </div>
        </div>
        <!-- // Main area -->
    </div>

    <BillStatusReport v-show="dialog" @close="dialog = false"/>
</template>

<style>
.stat_area {
    display: flex;
    justify-content: center; /* Alignment */
    align-items: center; /* Sort in vertical */
    /* Height: 514px; Setting the desired height */
}

.stat_image_link {
    display: flex;
    justify-content: center; /* Alignment */
    align-items: center; /* Sort in vertical */
}

.stat_image_link img {
    max-width: 100%; /* Set not to exceed the width of the parents */
    max-height: 100%; /* Set not to exceed the height of parents */
    object-fit: contain; /* Size adjustment while maintaining the image ratio */
}
</style>