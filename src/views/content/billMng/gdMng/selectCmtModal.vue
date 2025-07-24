<script setup>
import { ref, defineExpose, defineEmits } from "vue";
import { useStore } from "@/store";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import RadioButton from 'primevue/radiobutton';
import { isEmpty , replace} from 'lodash';
import { useI18n } from "vue-i18n";

const {t} = useI18n();
const lang = localStorage.getItem("languageType");
const store = useStore();

const emits = defineEmits(['fnCallback']); // Event definition to parents

const visible = ref(false);
const deptList = ref(null);
const filteredData = ref(null)
const cmtItem = ref('');
const relCmtItems = ref([]);

/** Committee duplicate check */
const fnCheckCmt = (item) => {

	console.log(item);
}


/** Committee */
const fnGetDeptList = () => {

    let params = {};
    params.lang = lang;
    const apiUrl = `/admin/dept`;
    store.API_LIST(apiUrl, params).then((data) => {
      deptList.value = data.data.data;
      filteredData.value = [...deptList.value.filter(item => item.uprDeptCd === 'CMT')];
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}


const fnSave = () => {

};

const fnOpen = () => {
    cmtItem.value = {};
    relCmtItems.value = [];
    visible.value = true;
	fnGetDeptList();
};

const fnCancel = () => {
    visible.value = false;
};

defineExpose({ fnOpen });


</script>

<template>
	<Dialog v-model:visible="visible" modal :style="{ width: '65vw', height: '65vh'}" @hide="emit('close')">
		<template #header>
			<div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
				<h2 class="popup_tit">{{ t('10666') }}</h2>
			</div>
		</template>
		<div class="popup_inner">
			<div class="popup_body">
				<div class="popup_cont">
					<div class="v_table table_list type2">
						<DataTable 
							:value="filteredData"
							scrollable
							scrollHeight="270px"
							style="min-height: 270px">
							<Column field="radio"  :header="t('10409')" class="text_center" style="width: 8%;">
								<template #body="{ data, index }">
									<RadioButton v-model="cmtItem" :inputId="data.deptCd" name="rdoMaintCmt" :value="data.deptCd" />
										<label :for="data.deptCd"></label>
								</template>
							</Column>
							<Column field="checkbox" :header="t('10142')" class="text_center" style="width: 8%;">
								<!-- <template #body="{ data, index }">
									<span class="check_item">
										<input type="checkbox"  v-model="relCmtItems" @click="fnCheckCmt(data)">
										<label ></label>
									</span>
								</template> -->
							</Column>
							<Column field="deptNm" :header="t('10135')" class="text_left" style="width: 60%;"></Column>
							<template #empty>
								<div class="no_data">
									<i class="v_ico ico_error"></i>
									<span class="text_msg">{{ t('10075') }}</span>
								</div>
							</template>
						</DataTable>
					</div>
				</div>
				<div class="popup_footer">
					<div class="btn_group">
						<button type="button" class="v_btn btn_primary btn_md" @click="fnSave">{{ t('10089') }}</button>
						<button type="button" class="v_btn btn_outline_neutral btn_md" @click="fnCancel">{{ t('10001') }}</button>
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
    min-height: 40rem !important;
    overflow-y: auto;
}
</style>
