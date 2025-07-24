<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "@/store";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import { useI18n } from "vue-i18n";

const {t} = useI18n();
const store = useStore();
const props = defineProps({
	billId: String,
	dialog: Boolean
});
const emit = defineEmits(["close"]);
const visible = ref(props.dialog);
const lang = localStorage.getItem('languageType');
const proposerList = ref([]);

const fnSearch = () => {
	let params = {};
	params.lang = lang;
	params.billId = props.billId;
	const apiUrl = `/bill/review/billMng/proposer`;
	store.API_LIST(apiUrl, params).then((data) => {
		proposerList.value = data.data.data;
	}).catch(({ message }) => {
		console.log("message : ", message);
	});
};

onMounted(() => {
	fnSearch();
})
</script>

<template>
	<Dialog v-model:visible="visible" modal :style="{ width: '65vw', height: '80vh'}" @hide="emit('close')">
		<template #header>
			<div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
				<h2 class="popup_tit">{{ t('10151') }}</h2>
			</div>
		</template>
		<div class="popup_inner">
			<div class="popup_body">
				<div class="popup_cont">
					<div class="v_table table_list type2">
						<DataTable 
							:value="proposerList"
							paginator 
							:rows="10" 
							:rowsPerPageOptions="[5, 10, 20, 50]" 
							paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
						>
							<Column field="num" :header="t('10090')" style="width: 30%;" class="text_center" />
							<Column field="cmitNm" :header="t('10073')" style="width: 60%;" class="text_center" />
							<Column field="proposerNm" :header="t('10152')" style="width: 60%;" class="text_center" />
							<template #empty>
								<div class="no_data" style="border-bottom: none; height: 11rem;">
									<i class="v_ico ico_error"></i>
									<span class="text_msg">{{ t('10075') }}</span>
								</div>
							</template>
						</DataTable>
					</div>
				</div>
				<div class="popup_footer">
					<div class="btn_group">
						<button type="button" class="v_btn btn_outline_neutral btn_md" @click="emit('close')">{{ t('10153') }}</button>
					</div>
				</div>
			</div>
		</div>
	</Dialog>
</template>

<style scoped>
.no_data {
    display: flex; /* Flex box use */
    justify-content: center; /* Horizontal */
    align-items: center;
    flex-direction: column;
    height: 16rem; 
}

:deep(.p-datatable-table-container) {
    min-height: 30rem !important;
    overflow-y: auto;
}

:deep(.p-paginator) {
    border-top: solid 1px #e2e8f0;
    border-radius: 0 !important;
    padding: 1rem 0 1rem 0 !important;
}

</style>
