<script setup>
import { ref } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import TitleComp from "@/components/TitleComp.vue";
import dayjs from "dayjs";
import {useStore} from "@/store";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore();
const tableDatas = ref([]);

for(var i = 0; i < 13; ++i) {
    tableDatas.value.push({
        no: `${i + 1}`,
        date: `2024-02-${i + 1 < 10 ? `0${i + 1}` : i + 1}`,
        billNo: `6-11${i + 1 < 10 ? `0${i + 1}` : i + 1}/24`,
        billName: '«Жалпы билим берүүчү уюмда мобилдүү түзүлүштү пайдаланууну жөнгө салуу жөнүндө» Мыйзамдын долбоору',
        agree: '34',
        disagree: '13',
        giveup: '5',
        result: t('10138')//'Approval'

    });
}

const fnReset = () => {
    //ToDo initialization 

}

const fnExcelDownload = () => {
    // Header designation to include

    const selectedHeaders = ["no", "date", "billNo", "billName", "agree", "disagree", "giveup", "result"];
    const wsCols = [t('10090'), t('10291'), t('10292'), t('10293'), t('10294'), t('10295'), t('10296'), t('10125')]; // Heather name array


    const title = t('10020') + t('10084')//'List of the votes of the plenary session';


    store.fnExcelDownload(tableDatas.value, selectedHeaders, wsCols, title);
};
</script>

<template>
    <div class="content_inner">
        <TitleComp />
        <!-- Main area -->
        <div class="content_section">
            <div class="board_search type2"><!-- If you go over 2 lines of search items.Type2 -->
                <div class="search_inner">
                    <div class="form_row">
                        <div class="input_item">
                            <label class="form_label">{{t('10116')}}</label><!--Algebraic-->
                            <select class="form_control">
                                <option>{{ t('10224') }}</option> <!--Please select.-->
                                <option>14</option>
                                <option>13</option>
                                <option>12</option>
                            </select>
                        </div>
                        <div class="input_item">
                            <label class="form_label">{{ t('10211') }}</label><!--session-->
                            <select class="form_control">
                                <option>{{ t('10224') }}</option> <!--Please select.-->
                                <option>105</option>
                                <option>104</option>
                                <option>103</option>
                                <option>102</option>
                                <option>101</option>
                                <option>100</option>
                                <option>99</option>
                            </select>
                        </div>
                        <div class="input_item">
                            <label class="form_label">{{ t('10212') }}</label><!--Order-->
                            <select class="form_control">
                                <option>{{ t('10224') }}</option> <!--Please select.-->
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </select>
                        </div>
                    </div>
                    <div class="form_row">
                        <div class="input_item">
                            <label class="form_label">{{ t('10289') }}</label><!--Meeting day-->
                            <div class="input_group">
                                <input type="date" class="form_control form_datepicker">
                                <span class="text">~</span>
                                <input type="date" class="form_control form_datepicker">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="search_btn">
                    <button type="button" class="v_btn btn_primary btn_md"><i class="v_ico ico_search_white"></i><span>{{ t('10053') }}</span></button>
                    <button type="button" @click="fnReset" class="v_btn btn_outline_primary btn_md"><i class="v_ico ico_reset_primary"></i><span></span></button>
                </div>
            </div>

            <div class="board_info" style="margin-top: 2rem;">
                <div class="left">
                    <div class="total_num">Total <span class="text_primary">{{ tableDatas.length }}</span></div>
                </div>
                <div class="right">
                    <div class="btn_wrap">
                        <button type="button" class="v_btn btn_outline_secondary btn_sm" @click="fnExcelDownload"><i
                            class="v_ico ico_download_secondary"></i><span>{{ t('10055') }}</span></button>
                    </div>
                </div>
            </div>

            <div class="v_table table_list">
                <DataTable @row-dblclick="$router.push({name: 'bill.voteResult.dtl'})" :value="tableDatas" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem;"
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink">
                    <Column field="no" :header="t('10290')" style="width: 5%;" class="text_center" sortable></Column>
                    <Column field="date" :header="t('10291')" style="width: 7%;" class="text_center" sortable></Column>
                    <Column field="billNo" :header="t('10292')" style="width: 6%;" sortable></Column>
                    <Column field="billName" :header="t('10293')" style="width: 40%;" class="text_left" sortable></Column>
                    <Column field="agree" :header="t('10294')" style="width: 5%;" class="text_center"></Column>
                    <Column field="disagree" :header="t('10295')" style="width: 5%;" class="text_center"></Column>
                    <Column field="giveup" :header="t('10296')" style="width: 6%;" class="text_center"></Column>
                    <Column field="result" :header="t('10125')" style="width: 10%;" class="text_center"></Column>
                </DataTable>
            </div>


        </div>
        <!-- // Main area -->
    </div>
</template>

<style></style>
