<script setup>
import { ref, onMounted } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import TitleComp from "@/components/TitleComp.vue";
import BillAllInfoInc from "@/views/content/billMng/common/billAllInfoInc.vue";
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
	billId: String
	, searchWord: String
});

const router = useRouter();

const fnGoList = () => {

	router.push({
		path: '/main/billMng/billSearch/billSearchEngineList',
		query: { key: props.searchWord }
	});
};

</script>
<template>
	<div class="content_inner">
		<TitleComp />
		<!-- Main area -->
		<div class="content_section">
							<BillAllInfoInc :billId="props.billId" :open="['0', '1', '2']"/>
			<div class="btn_group_fixed ">
								<button type="button" class="v_btn btn_outline_primary btn_md" @click="fnGoList">{{ t('10084') }}</button>
			</div>
		</div>
		<!-- // Main area -->
	</div>

</template>
<style></style>
