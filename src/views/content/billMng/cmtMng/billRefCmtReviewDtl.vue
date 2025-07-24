<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router'
import { useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import { isEmpty , replace} from 'lodash';
import { useI18n } from "vue-i18n";
import dayjs from "dayjs";

import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import TitleComp from "@/components/TitleComp.vue";

const {t} = useI18n();
const router = useRouter();
const route = useRoute();
const store = useStore();
const confirm = useConfirm();

const userInfo = store.loginInfo;
const lang = localStorage.getItem("languageType");
const billBasicVo = ref({});
const billLegalReviewVo = ref({});


/** Buttons */
const btnSave = ref(false);//save

const btnReport = ref(false);//Report


const fnAuthSetup = () => {

	let taskStatus = billBasicVo.value.taskStatus;
	if(taskStatus != 'C') {//Unless it's completed

		btnSave.value = true;
		btnReport.value = true;
	}

};

const fnGoList = () => {
	router.push({ name: 'billMng.cmtMng.billMngList' });
};

/** Confirmation window */
const fnConfirm = (event) => {
    confirm.require({
        target: event.currentTarget,
        message: t('10437'),
        accept: () => {
			fnNextProcess();	
        },
        reject: () => {
        }
    });
}


/** Process progress */
const fnNextProcess = () => {

	const jsonData = {
		billId: route.query.id,
		taskId: route.query.taskId,
		taskStatus: 'C'
	};

	const apiUrl = `/process/taskMng/taskUpdate`;
	store.API_SAVE(apiUrl, jsonData).then((data) => {
		fnGoList();
	}).catch(({ message }) => {
		console.log("message : ", message);
	});

}

/** save */
const fnSave = () => {

	const jsonData = {
		billId: route.query.id,
        rmrkKg: billLegalReviewVo.value.rmrkKg,
        rmrkRu: billLegalReviewVo.value.rmrkRu,
		rsltDt: isEmpty(billLegalReviewVo.value.rsltDt) ? '' : replace(billLegalReviewVo.value.rsltDt, /-/g, ''),
        lglRvwRsltCode: billLegalReviewVo.value.lglRvwRsltCode,
		seq: billLegalReviewVo.value.seq,
		clsCd: '110'
    }

	const apiUrl = `/bill/review/billLegalReview`;
	store.API_SAVE(apiUrl, jsonData).then((data) => {
		fnSearch();
	}).catch(({ message }) => {
		console.log("message : ", message);
	})
}


/** check */
const fnSearch = () => {

    let params = {};
	params.lang = lang;
	params.billId = route.query.id;
	params.taskId = route.query.taskId;
	params.assignedTo = userInfo.deptCd;
    params.clsCd = '140';
	const apiUrl = `/bill/review/billMng/detail`;

	store.API_LIST(apiUrl, params).then((data) => {

        console.log(data.data.data);

        if(!isEmpty(data.data.data.billLegalReviewVo)) {
			billMngVo.value = data.data.data.billMngVo;
		} 

		if(isEmpty(data.data.data.billlegalReviewVo)) {
			//billLegalReviewVo.value = {};

		} else {
			billLegalReviewVo.value = data.data.data.billlegalReviewVo;
			billLegalReviewVo.value.rsltDt = dayjs(billLegalReviewVo.value.rsltDt).format('YYYY-MM-DD');
            console.log(billLegalReviewVo.value.rsltDt);
		}

		fnAuthSetup();

	}).catch(({ message }) => {
		console.log("message : ", message);
	})
}

onMounted(() => {
	fnSearch();
})

</script>

<template>
<div class="content_inner">
 
	<TitleComp />
<!-- Main area -->
<div class="content_section">
	<h3 class="v_tit1">{{ t('10679') }}</h3>
	<div class="v_table">
		<table>
			<colgroup>
				<col style="width: 70%;">
				<col style="width: 15%;">
				<col style="width: 15%;">
			</colgroup>
			<tbody>
				<tr>
					<th scope="col" class="text_center">{{ t('10680') }}</th>
					<th scope="col" class="text_center">{{ t('10091') }}</th>
					<th scope="col" class="text_center">{{ t('10099') }}</th>
				</tr>
				<tr>
					<td>
						<ul class="file_list text_center">
							<li>
								<span>{{ t('10680') }}</span>
								<div class="file_wrap">
									<a href="javascript:void(0)" class="v_btn">download</a>
								</div>
							</li>
						</ul>
					</td>
					<td class="text_center">10/02/2025</td>
					<td class="text_center">{{ t('10099') }}</td>
				</tr>
			</tbody>
		</table>
	</div>

	</div>
	<div class="btn_group_fixed">
		<button type="button" class="v_btn btn_outline_primary btn_md" @click="fnGoList">{{ t('10084') }}</button>
	</div>

	<h3 class="v_tit1">{{ t('10166') }}</h3>
	<div class="v_table">

		<div class="card">
        <Tabs value="0">
            <TabList>
                <Tab value="0">{{ t('10118') }}</Tab>
                <Tab value="1">{{ t('10140') }}</Tab>
                <Tab value="2">{{ t('10142') }}</Tab>
				<Tab value="3">{{ t('10046') }}</Tab>
				<Tab value="4">{{ t('10047') }}</Tab>
				<Tab value="5">{{ t('10058') }}</Tab>
				<Tab value="6">{{ t('10399') }}</Tab>
				<Tab value="7">{{t('10119')}}</Tab>
				<Tab value="8">{{ t('10120') }}</Tab>
				<Tab value="9">{{ t('10131') }}</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                    <p class="m-0">
						{{ t('10118') }}
                    </p>
                </TabPanel>
				<TabPanel value="1">
                    <p class="m-0">
						{{ t('10140') }}
                    </p>
                </TabPanel>
				<TabPanel value="2">
                    <p class="m-0">
						{{ t('10142') }}
                    </p>
                </TabPanel>
				<TabPanel value="3">
                    <p class="m-0">
						{{ t('10046') }}
                    </p>
                </TabPanel>
				<TabPanel value="4">
                    <p class="m-0">
						{{ t('10047') }}
                    </p>
                </TabPanel>
				<TabPanel value="5">
                    <p class="m-0">
						{{ t('10058') }}
                    </p>
                </TabPanel>
				<TabPanel value="6">
                    <p class="m-0">
						{{ t('10399') }}
                    </p>
                </TabPanel>
				<TabPanel value="7">
                    <p class="m-0">
						{{t('10119')}}
                    </p>
                </TabPanel>
				<TabPanel value="8">
                    <p class="m-0">
						{{ t('10120') }}
                    </p>
                </TabPanel>
				<TabPanel value="9">
                    <p class="m-0">
						{{ t('10131') }}
                    </p>
                </TabPanel>

            </TabPanels>
        </Tabs>
        </div>

	</div>

</div>




<!-- // Main area -->
</template>

<style></style>
