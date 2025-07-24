<script setup>
import { ref, defineExpose, onMounted  } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import { useStore } from "@/store";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore();
const props = defineProps({
	mtngId: String,
	viewMode: String
}); 

const lang = localStorage.getItem("languageType");
const participants = ref([]);
const visible = ref(false);
const fnOpen = () => {
    visible.value = true;
	participants.value = [];
	fnGetparticipantsList();
};

const fnClose = () => {
  visible.value = false;
};

const fnGetparticipantsList = () => {
    
	let params = {};
	params.lang = lang;
	params.mtngId = props.mtngId;
	const apiUrl = `/bill/mtng/all/participants`;
	store.API_LIST(apiUrl, params).then((data) => {
		participants.value = data.data.data;
		for(let i = 0; i < participants.value?.length; ++i) {
			participants.value[i].index = i + 1;
		}

		console.log(participants.value);
	}).catch(({ message }) => {
		console.log("message : ", message);
	})
}

defineExpose({ fnOpen });

</script>

<template>
	<Dialog v-model:visible="visible" modal :style="{ width: '50vw', height: '50vh'}" @hide="fnClose">
		<template #header>
			<div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
				<h2 class="popup_tit" v-if="props.viewMode == '1' ">{{ t('10213') }}</h2>
				<h2 class="popup_tit" v-if="props.viewMode == '2' ">{{ t('10188') }}</h2>
			</div>
		</template>
		<div class="popup_inner">
			<div class="popup_body">
				<div class="popup_cont">
					<div class="v_table table_list fixed_header type2">
						<DataTable :value="participants" paginator :rows="10"  :pageLinkSize="10" paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink">
							<Column field="index" :header="t('10090')" class="text_center" style="width: 5%;">
								<!-- <template #body="{index}">
									{{ index+1 }}
								</template> -->
							</Column>
							<Column field="memberNm" :header="t('10152')" class="text_center" style=""></Column>
							<Column field="deptNm" :header="t('10189')" class="text_center" style=""></Column>
							<Column field="atdtPosition" :header="t('10635')" class="text_center" style=""></Column>
							<Column v-if="props.viewMode == '2' " field="atdtDivNm" :header="t('10190')" class="text_center" style="width: 10%;"></Column>
						</DataTable>
					</div>
				</div>
				<div class="popup_footer">
					<div class="btn_group">
						<button type="button" class="v_btn btn_outline_neutral btn_md" @click="fnClose">{{ t('10153') }}</button>
					</div>
				</div>
			</div>
			
		</div>
	</Dialog>
</template>

<style></style>
