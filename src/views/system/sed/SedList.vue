<script setup>
import { ref } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useI18n } from "vue-i18n";

const tableDatas = ref([]);
const {t} = useI18n();

for(var i = 0; i < 6; ++i) {
    tableDatas.value.push({
        no: `6-7580/24-${i}`,
        title: 'О проекте Закона «О внесении изменений в некоторые законодательные акты Кыргызской Республики в сфере налогообложения и социального страхования»',
        regNm: 'Министрлер Кабинетинин төрагасы',
        regDt: '28-06-2024',
        regDt2: 'Зарегистрирован 12-07-2024',
        regDt3: '12-07-2024'
    });
}

</script>

<template>
    <div class="content_inner">
        <div class="content_util">
            <div class="title_wrap">
                <h2 class="content_tit">SED маалыматтары</h2>
            </div>
            <nav class="v_breadcrumb">
                <ul class="path">
                    <li><i class="v_ico ico_home"></i></li>
                    <li>{{ t('10031') }}</li>
                    <li>SED</li>
                </ul>
            </nav>
        </div>
        <!-- Main area -->
        <div class="content_section">
            <div class="board_search type2">
                <div class="search_inner">
                    <div class="form_row">
                        <div class="input_item">
                            <label class="form_label">{{ t('10102') }}</label>
                            <!-- input type="date" -->
                            <input type="date" class="form_control" value="2024-12-10">
                        </div>
                        <div class="input_item">
                            <label class="form_label">{{ t('10056') }}</label>
                            <select class="form_control">
                                <option>{{ t('10224') }}</option>
                                <option>{{ t('10044') }}</option>
                                <option>{{ t('10158') }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="form_row">
                        <div class="input_item">
                            <label class="form_label">{{ t('10147') }}</label>
                            <input type="text" class="form_control" :placeholder="t('10146')">
                        </div>
                        <div class="input_item">
                            <label class="form_label">{{ t('10049') }}</label>
                            <input type="text" class="form_control" :placeholder="t('10146')">
                        </div>
                    </div>
                </div>
                <div class="search_btn">
                    <button type="button" class="v_btn btn_primary btn_md"><i class="v_ico ico_search_white"></i><span>{{ t('10053') }}</span></button>
                </div>
            </div>
            <div class="board_info" style="margin-top: 2rem;">
                <div class="left">
                    <div class="total_num">Total <span class="text_primary">{{ tableDatas.length }}</span></div>
                </div>
                <div class="right">
                    <div class="btn_wrap">
                    </div>
                </div>
            </div>

            <div class="v_table table_list">
                <DataTable @row-dblclick="$router.push({name: 'system.sed.dtl'})" :value="tableDatas" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem;"
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink">
                    <Column field="no" :header="t('10147')" style="width: 7.8%;" class="text_center"></Column>
                    <Column field="title" :header="t('10049')"></Column>
                    <Column field="regNm" :header="t('10106')" style="width: 15.5%;"></Column>
                    <Column field="regDt" :header="t('10100')" style="width: 8.4%;" class="text_center"></Column>
                    <Column field="regDt2" :header="t('10056')" style="width: 13.9%;" class="text_center"></Column>
                    <Column field="regDt3" :header="t('10541')" style="width: 8.9%;" class="text_center"></Column>
                </DataTable>
            </div>


        </div>
        <!-- // Main area -->
    </div>
</template>

<style></style>
