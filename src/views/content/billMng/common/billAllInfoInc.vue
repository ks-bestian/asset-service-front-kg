<script setup>
import { ref, watch , defineExpose} from "vue";
import { useRouter, useRoute } from 'vue-router'
import { useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import { isEmpty , replace} from 'lodash';
import dayjs from "dayjs";

import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';

import Fieldset from 'primevue/fieldset';
import Panel from 'primevue/panel';
import 'primeicons/primeicons.css'
import { PrimeIcons } from '@primevue/core/api';
import Button from 'primevue/button';
import BillFileList from "./billFileList.vue";
import BillStepDiagram from "./BillStepDiagram.vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter();
const route = useRoute();
const store = useStore();
const props = defineProps({
    billId: String,
	open: Array,
});

const userInfo = store.loginInfo;
const lang = localStorage.getItem("languageType");
const billBasicInfo = ref({});
const lawReviewInfo = ref({});
const etcInfoList = ref([]);
const billBasicFileList = ref([]);
const cmtMtList = ref([]);
const mainMtList = ref([]);
const cmtList = ref([]);
// const billCmtReviewVoList = ref([]);

const open = ref(props.open);
const langReview = ref();
const lgExntn = ref();
const legalAct = ref();
const gvrnTrsf = ref();
const prmg = ref();
const presidentReject = ref();
const progressValue = ref(0);


/** check */
const fnSearch = async () => {

    let params = {};
    params.lang = lang;
	params.lngType = lang == 'lng_type_3' ? 'lng_type_1' : lang; // Wanted file language type (change to KG)


    const apiUrl = '/bill/review/all/detail/'+props.billId;
    store.API_LIST(apiUrl, params).then((data) => {
        
        billBasicInfo.value = data.data.data.billBasicInfo;
		progressValue.value = billBasicInfo.value.progressValue;

		lawReviewInfo.value = data.data.data.billlegalReviewVo;
		
		// const basicFileKindCd = ['110', '120', '130', '140', '150', '160'];
		// billBasicFileList.value = data.data.data.billFileList.filter(file => basicFileKindCd.includes(file.fileKindCd));

		billBasicFileList.value = data.data.data.billFileList;

		cmtMtList.value = data.data.data.cmtMtList;
		mainMtList.value = data.data.data.mainMtList;
		// billCmtReviewVoList.value = data.data.data.billCmtReviewVoList;

		cmtList.value = data.data.data.cmtList;

		langReview.value = data.data.data.billLangReviewVoList;
		lgExntn.value =  data.data.data.etcInfoList.filter(info => info.clsCd == '140');
		legalAct.value = data.data.data.etcInfoList.filter(info => info.clsCd == '200');
		gvrnTrsf.value = data.data.data.etcInfoList.filter(info => info.clsCd == '325')[0];
		prmg.value = data.data.data.etcInfoList.filter(info => info.clsCd == '320')[0];
		presidentReject.value = data.data.data.etcInfoList.filter(info => info.clsCd == '330')[0];

    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

/** File download */
const fnDownloadFile = (fileId, fileNm) => {
    store.API_FILE_DOWN(fileId, fileNm);
}

const expandAll = () => {
	open.value = ['0', '1', '2'];
}

const collapseAll = () => {
	open.value = [];
}

watch(() => props.billId, fnSearch, { immediate: true });

defineExpose({ fnSearch });

</script>
<template>


<BillStepDiagram :stepNo="progressValue" style="display: flex; justify-content: center;"/>
<div style="text-align: left;">
	<Button icon="pi pi-plus" variant="outlined" @click="expandAll" />
	<Button icon="pi pi-minus" variant="outlined" @click="collapseAll" />
</div>

<div class="v_table">
    <Accordion :value="open" multiple>
        <AccordionPanel value="0">
            <AccordionHeader>{{ "I." + t('10117') }}</AccordionHeader><!--Basic information and law review-->
            <AccordionContent>
				<div class="card">
					<Tabs value="0">
						<TabList>
							<Tab value="0">{{ t('10118') }}</Tab><!--Basic information-->
							<Tab value="1">{{ t('10058') }}</Tab><!--Legal review-->
							<Tab value="2">{{ t('10119') }}</Tab><!--Language part-->
							<Tab value="3">{{ t('10123') }}</Tab><!--Review department-->
						</TabList>
						<TabPanels>
							<TabPanel value="0">
								<table>
									<colgroup>
										<col style="width: 16.3%;">
										<col>
										<col style="width: 16.3%;">
										<col style="width: 33.7%;">
									</colgroup>
									<tbody>
										<tr>
											<th scope="row">{{ t('10293') }}</th><!--Agency-->
											<td colspan="3">{{ billBasicInfo.billName }}</td>
										</tr>       
										<tr>
											<th scope="row">{{ t('10292') }}</th><!--Agenda number-->
											<td>{{ billBasicInfo.billNo }}</td>
											<th scope="row">{{ t('10148') }}</th><!--Reception date-->
											<td>{{ billBasicInfo.rcpDt ? dayjs(billBasicInfo.rcpDt).format('DD/MM/YYYY') : '' }}</td>
										</tr>
										<tr>
											<th scope="row">{{ t('10109') }}</th><!--Agenda-->
											<td>{{ billBasicInfo.ppslKndNm }}</td>
											<th scope="row">{{ t('10051') }}</th><!--Suggestion-->
											<td>{{ dayjs(billBasicInfo.ppslDt).format('DD/MM/YYYY') }}</td>
										</tr>
										<tr>
											<th scope="row">{{ t('10106') }}</th><!--proponent-->
											<td colspan="3">{{ billBasicInfo.ppsrNm }}</td>
										</tr>
										<tr>
											<th scope="row">{{ t('10121') }}</th><!--Voter-->
											<td colspan="3">{{ billBasicInfo.proposerItems }}</td>
										</tr>
										<tr>
											<th scope="row">file</th>
											<td colspan="3">
												<BillFileList :fileList="billBasicFileList" />
											</td>
										</tr>
										<tr>
											<th scope="row">{{ t('10111') }}</th>
											<td colspan="3">{{ billBasicInfo.etc }}</td>
										</tr>
									</tbody>
								</table>

							</TabPanel>
							<TabPanel value="1">
								<table>
									<colgroup>
										<col style="width: 10%;">
										<col style="width: 10%;">
										<col style="width: 10%;">
										<col style="width: 20%;">
										<col style="width: 10%;">
										<col>
									</colgroup>
									<tbody>
										<tr>
											<th scope="row">{{ t('10125') }}</th><!--result-->
											<td>{{ lawReviewInfo.lglRvwRsltNm }}</td>
											<th scope="row">{{ t('10126') }}</th><!--Review date-->
											<td>{{ isEmpty(lawReviewInfo.rsltDt) ? '': dayjs(lawReviewInfo.rsltDt).format('DD/MM/YYYY') }}</td>
											<th scope="row">{{ t('10127') }}</th><!--Reviewer-->
											<td>{{ lawReviewInfo.regNm }}</td>
										</tr>
										<tr>
											<th scope="row">file</th>
											<td colspan="5">
												<BillFileList :fileList="lawReviewInfo.fileList" />
											</td>
										</tr>
										<tr>
											<th scope="row">{{ t('10128') }}</th><!--reason-->
											<td colspan="5">{{ lawReviewInfo.rmrk }}
											</td>
										</tr>
									</tbody>
								</table>
							</TabPanel>
							<TabPanel value="2">
								<table>
									<colgroup>
										<col style="width: 30%;">
										<col style="width: 10%;">
										<col>
									</colgroup>
									<tbody>
										<tr>
											<th scope="col" class="text_center">{{ t('10129') }}</th><!--Opinion-->
											<th scope="col" class="text_center">{{ t('10100') }}</th><!--Registration date-->
											<th scope="col" class="text_center">{{ t('10111') }}</th><!--note-->
										</tr>
										<tr v-for="(item, index) in langReview" :key="index">
											<td>
												<BillFileList :fileList="item.fileList" />
											</td>
											<td class="text_center">{{ isEmpty(item.regDt) ?  "":dayjs(item.regDt).format('DD/MM/YYYY') }}</td>
											<td>{{ item.rmrk }}</td>
										</tr>
									</tbody>
								</table>
							</TabPanel>
							<TabPanel value="3">
								<table>
									<colgroup>
										<col style="width: 30%;">
										<col style="width: 10%;">
										<col>
									</colgroup>
									<tbody>
										<tr>
											<th scope="col" class="text_center">{{ t('10129') }}</th><!--Opinion-->
											<th scope="col" class="text_center">{{ t('10100') }}</th><!--Registration date-->
											<th scope="col" class="text_center">{{ t('10111') }}</th><!--note-->
										</tr>
										<tr v-for="(item, index) in lgExntn" :key="index">
											<td>
												<BillFileList :fileList="item.fileList" />
											</td>
											<td class="text_center">{{ isEmpty(item.regDt) ?  "":dayjs(item.regDt).format('DD/MM/YYYY') }}</td>
											<td>{{ item.rmrk }}</td>
										</tr>
									</tbody>
								</table>
							</TabPanel>
						</TabPanels>
					</Tabs>
    			</div>
            </AccordionContent>
        </AccordionPanel>
        <AccordionPanel value="1">
            <AccordionHeader>{{ "II." + t('10130') }}</AccordionHeader><!--Meeting information and legal acts-->
            <AccordionContent>
				<div class="card">
					<Tabs value="0">
						<TabList>
							<Tab value="0">{{ t('10045') }}</Tab><!--committee-->
							<Tab value="1">{{ t('10046') }}</Tab><!--Plenary-->
							<!-- <Tab Value = "2"> Government </tab> -->
							<Tab value="3">{{ t('10131') }}</Tab><!--Legal action-->
						</TabList>
						<TabPanels>
							<TabPanel value="0">
								<Fieldset>
									<template #legend>
										<div class="flex items-center pl-2">
											<span class="font-bold p-2">{{ t('10132') }}</span><!--Meeting information-->
										</div>
									</template>
									<p class="m-0">
									<table>
									<colgroup>
										<col style="width: 10%;">
										<col style="width: 10%;">
										<col>
										<col style="width: 10%;">
										<col style="width: 20%;">
									</colgroup>
									<tbody>
										<tr>
											<th scope="col" class="text_center">{{ t('10133') }}</th><!--Meeting date-->
											<th scope="col" class="text_center">{{ t('10134') }}</th><!--Committee-->
											<th scope="col" class="text_center">{{ t('10135') }}</th><!--Committee-->
											<th scope="col" class="text_center">{{ t('10136') }}</th><!--result-->
											<th scope="col" class="text_center">{{ t('10139') }}</th><!--proceedings-->
										</tr>
										<tr v-for="(item, index) in cmtMtList" :key="index">
											<td class="text_center">{{ isEmpty(item.openDtm) ?  "":dayjs(item.openDtm).format('DD/MM/YYYY') }}</td>
											<td class="text_center">{{ item.cmtSeNm }}</td>
											<td>{{ item.deptNm }}</td>
											<td class="text_center">{{ item.rsltNm }}</td>
											<td>
												<BillFileList :fileList="item.reportList" />
											</td>
										</tr>
									</tbody>
									</table>
									</p>
								</Fieldset>
								<Fieldset>
									<template #legend>
										<div class="flex items-center pl-2">
											<span class="font-bold p-2">{{ t('10204') }}</span><!--Review report-->
										</div>
									</template>
									<p class="m-0">
									<table>
									<colgroup>
										<col style="width: 10%;">
										<col style="width: 30%;">
										<col style="width: 10%;">
										<col>
									</colgroup>
									<tbody>
										<tr>
											<th scope="col" class="text_center">{{ t('10134') }}</th><!--Committee-->
											<th scope="col">{{ t('10045') }}</th><!--committee-->
											<th scope="col" class="text_center">{{ t('10141') }}</th><!--Return date-->
											<th scope="col">{{ t('10093') }}</th><!--document-->
										</tr>
										<tr v-for="(item, index) in cmtList" :key="index">
											<td class="text_center">{{ item.cmtSeNm }}</td>
											<td>{{ item.deptNm }}</td>
											<td>{{ item.submitDt }}</td>
											<td>
												<BillFileList :fileList="item.fileList" />
											</td>
										</tr>
									</tbody>
									</table>

									</p>
								</Fieldset>
								

								
							</TabPanel>
							<TabPanel value="1">
								<Fieldset>
									<template #legend>
										<div class="flex items-center pl-2">
											<span class="font-bold p-2">{{ t('10132') }}</span><!--Meeting information-->
										</div>
									</template>
									<p class="m-0">
									<table>
									<colgroup>
										<col style="width: 30%;">
										<col style="">
										<!-- <col> -->
									</colgroup>
									<tbody>
										<tr>
											<th scope="col" class="text_center">{{ t('10133') }}</th><!--Meeting date-->
											<!-- <th scope="col" class="text_center">{{ t('10134') }}</th>
											<th scope="col" class="text_center">{{ t('10135') }}</th> -->
											<th scope="col" class="text_center">{{ t('10136') }}</th><!--result-->
											<!--<th scope="col" class="text_center">{{ t('10139') }}</th>-->
										</tr>
										<tr v-for="(item, index) in mainMtList" :key="index">
											<td class="text_center">{{ isEmpty(item.openDtm) ?  "":dayjs(item.openDtm).format('DD/MM/YYYY') }}</td>
											<!-- <td class="text_center">{{ item.cmtSeNm }}</td>
											<td>{{ item.deptNm }}</td> -->
											<td class="text_center">{{ item.rsltNm }}</td>
											<!-- <td>
												<BillFileList :fileList="item.reportList" />
											</td> -->
										</tr>
									</tbody>
									</table>
									</p>
								</Fieldset>
							</TabPanel>
							<!-- <TabPanel value="2">
								{{ t('10569') }}
							</TabPanel> -->
							<TabPanel value="3">
								<table>
									<colgroup>
										<col style="width: 20%;">
										<col style="width: 10%;">
										<col>
										<col>
									</colgroup>
									<tbody>
										<tr>
											<th scope="col" class="text_center">{{ t('10136') }}</th><!--result-->
											<th scope="col" class="text_center">{{ t('10144') }}</th><!--Treatment date-->
											<th scope="col" class="text_center">file</th>
											<th scope="col" class="text_center">{{ t('10111') }}</th><!--note-->
										</tr>
										<tr v-for="(item, index) in legalAct" :key="index">
											<td class="text_center">{{ item.lglActRsltNm }}</td>
											<td class="text_center">{{ isEmpty(item.rsltDt) ?  "":dayjs(item.rsltDt).format('DD/MM/YYYY') }}</td>
											<td>
												<BillFileList :fileList="item.fileList" />
											</td>
											<td>{{ item.rmrk }}</td>
										</tr>
									</tbody>
								</table>
							</TabPanel>
						</TabPanels>
					</Tabs>
    			</div>
            </AccordionContent>
        </AccordionPanel>
        <AccordionPanel value="2">
            <AccordionHeader>{{ "III." + t('10145') }}</AccordionHeader><!--Government transfer and fear-->
            <AccordionContent>
				<Fieldset v-if="!isEmpty(prmg)">
					<template #legend>
						<div class="flex items-center pl-2">
							<span class="font-bold p-2">{{ t('10048') }}</span><!--horror-->
						</div>
					</template>
					<p class="m-0"></p>
					<table>
						<colgroup>
							<col style="width: 16.3%;">
							<col>
							<col style="width: 16.3%;">
							<col>
						</colgroup>
						<tbody>
							<tr>
								<th scope="row">{{ t('10144') }}</th><!--Treatment date-->
								<td>{{ isEmpty(prmg?.rsltDt) ?  "":dayjs(prmg?.rsltDt).format('DD/MM/YYYY') }}</td>
								<th scope="row">{{ t('10562') }}</th><!--Horror number-->
								<td>{{ billBasicInfo.prmgNo }}</td>
							</tr>
							<tr>
								<th scope="row">{{ t('10093') }}</th><!--document-->
								<td colspan="3">
									<BillFileList :fileList="prmg?.fileList" />
								</td>
							</tr>
						</tbody>
					</table>
				</Fieldset>

				<Fieldset v-if="!isEmpty(presidentReject)">
					<template #legend>
						<div class="flex items-center pl-2">
							<span class="font-bold p-2">{{ t('10064') }}</span><!--Presidential rejection-->
						</div>
					</template>
					<p class="m-0"></p>
					<table>
						<colgroup>
							<col style="width: 16.3%;">
							<col>
							<col style="width: 16.3%;">
							<col>
						</colgroup>
						<tbody>
							<tr>
								<th scope="row">{{ t('10144') }}</th><!--Treatment date-->
								<td>{{ presidentReject.prsdRjctDt ? dayjs(presidentReject.prsdRjctDt).format('DD/MM/YYYY') : '' }}</td>
								<th scope="row">{{ t('10632') }}</th><!--Rejection number-->
								<td>{{ presidentReject.prsdRjctNo }}</td>
							</tr>
							<tr>
								<th scope="row">{{ t('10093') }}</th><!--document-->
								<td colspan="3">
									<BillFileList :fileList="presidentReject?.fileList" />
								</td>
							</tr>
						</tbody>
					</table>
				</Fieldset>
            </AccordionContent>
        </AccordionPanel>
    </Accordion>
</div>

</template>