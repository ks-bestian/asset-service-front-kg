<script setup>
import { ref, onMounted, computed  } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import dayjs from "dayjs";
import TitleComp from "@/components/TitleComp.vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const store = useStore();
const router = useRouter();
const userInfo = store.loginInfo;
const ageObj = computed(() => store.getAgeObj);
const ageList = computed(() => store.getAgeList);
const lang = localStorage.getItem("languageType");
const tableDatas = ref([]);
const searchAgeCd = ref(ageObj.value.naTermCd);

const today = dayjs(); // Current date

const searchFromDate = ref(today.subtract(30, 'day').format('YYYY-MM-DD'));// 30 days ago

const searchToDate = ref(today.add(30, 'day').format('YYYY-MM-DD'));// 30 days later


const statCds = store.getComCodes(1007); //Meeting

const searchStatCd = ref('');

const fnGetMtngList = () => {

    let params = {};
    params.lang = lang;
	params.searchAgeCd = searchAgeCd.value;
	params.searchFromDate = searchFromDate.value.replace(/-/g, '');
	params.searchToDate = searchToDate.value.replace(/-/g, '');
	// params.deptCd = userInfo.deptCd;

	params.mtngTypeCd = '2'; //Plenary

	params.statCd = searchStatCd.value; //Meeting

    const apiUrl = `/bill/mtng/from`;
    store.API_LIST(apiUrl, params).then((data) => {
        tableDatas.value = data.data.data;
    }).catch(({ message }) => {
        console.log("message : ", message);
    });
}

const fnGoDetail= (e)=>{
    router.push({name: 'mtng.mainMtng2.detail', query : {  mtngId: e.data.mtngId }});
}


const fnGoSave= (e)=>{
   router.push({name: 'mtng.mainMtng.create'});
}

onMounted(() => {

	fnGetMtngList();

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
											<label class="form_label">{{ t('10180') }}</label>
											<div class="input_group">
												<input type="date" class="form_control"  v-model="searchFromDate">
												<input type="date" class="form_control"  v-model="searchToDate">
											</div>
										</div>										
										<div class="input_item">
											<label class="form_label">{{ t('10116') }}</label>
											<select class="form_control" v-model="searchAgeCd">
												<option v-for="age in ageList" :value="age.codeId">{{ age.codeNm }}</option>
											</select>
										</div>
										<div class="input_item">
											<label class="form_label">{{ t('10182') }}</label>
											<select class="form_control" v-model="searchStatCd">
												<option value="">{{ t('10066') }}</option>
												<option v-for="statCd in statCds" :value="statCd.codeId">{{ statCd.codeNm }}</option>
											</select>
										</div>
									</div>
								</div>
								<div class="search_btn">
									<button type="button" class="v_btn btn_primary btn_md"  @click="fnGetMtngList"><i class="v_ico ico_search_white"></i><span>{{ t('10053') }}</span></button>
								</div>
							</div>
							<div class="board_info mt_6">
								<div class="left">
									<div class="total_num">Total <span class="text_primary">{{ tableDatas.length }}</span></div>
								</div>
								<!-- <div class="right">
									<div class="btn_wrap">
										<a href="javascript:void(0)" class="v_btn btn_secondary btn_sm" @click="fnGoSave">{{ t('10193') }}</a>
									</div>
								</div> -->
							</div>
							<div class="v_table table_list">
                                <DataTable :value="tableDatas" @row-dblclick="fnGoDetail" paginator :rows="10" :pageLinkSize="10" :rowsPerPageOptions="[5, 10, 20, 50]"
								paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink">
								    <Column field="ageCd" :header="t('10116')" style="width: 5%;" bodyStyle="text-align: center;"></Column>
									<Column field="sessionNo" :header="t('10211')" style="width: 5%;" bodyStyle="text-align: center;"></Column>
									<Column field="sessionOrd" :header="t('10212')" style="width: 5%;" bodyStyle="text-align: center;"></Column>
								    <Column field="dueDtm" :header="t('10185')" sortable style="width: 15%;"  bodyStyle="text-align: center;">
										<template #body="slotProps">
											{{ dayjs(slotProps.data.dueDtm, "YYYYMMDDHHmm").format("DD/MM/YYYY HH:mm") }}
										</template>
                                    </Column>
									<Column field="openDtm" :header="t('10133')" sortable style="width: 15%;"  bodyStyle="text-align: center;">
										<template #body="slotProps">
											<span v-if="slotProps.data.openDtm">
												{{ dayjs(slotProps.data.openDtm, "YYYYMMDDHHmm").format("DD/MM/YYYY") }}
											</span>
										</template>
                                    </Column>
									<!-- <Column field="mtngTypeCd" :header="t('10181')" style="width: 10%;" bodyStyle="text-align: center;">
										<template #body="slotProps">
                                            {{  slotProps.data.mtngTypeNm }}
                                        </template>
									</Column> -->
                                    <Column field="deptNm" :header="t('10045')" ></Column>
									<Column field="statNm" :header="t('10182')" style="width: 5%;" bodyStyle="text-align: center;"></Column>
                                </DataTable>
							</div>
							
						</div>
						<!-- // Main area -->
					</div>
</template>

<style></style>
