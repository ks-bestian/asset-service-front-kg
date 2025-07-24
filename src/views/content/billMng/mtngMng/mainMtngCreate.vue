<script setup>
import { ref, computed, onMounted } from "vue";
import mtngAgendaModal from "@/views/content/billMng/common/mtngAgendaModal.vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import dayjs from "dayjs";
import { isEmpty , replace} from 'lodash';
import { useConfirm } from "primevue/useconfirm";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import TitleComp from "@/components/TitleComp.vue";
import { useI18n } from 'vue-i18n'
import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { FormField } from '@primevue/forms';

const { t } = useI18n()

const confirm = useConfirm();
const router = useRouter();
const store = useStore();
const ageObj = computed(() => store.getAgeObj);
const agendaRef = ref(null);
const agendaList = ref([]); // Agenda

const mtngData = ref({});
const time = ref([]);
const min = ref(['00','10','20','30','40','50']);
const today = dayjs(); // Current date


Array.from({ length: 24 }, (_, i) => {
  const num = (i).toString().padStart(2, '0');
  time.value.push(num);
});

/** List */
const fnGoList = () => {
	router.push({name: 'mtng.mainMtng'});
};


const fnAgendaSendList = (sendList) => {
	agendaList.value = [...new Map([...agendaList.value, ...sendList].map(item => [item.billId, item])).values()];
};

const fnAddAgenda = (event) => {
	agendaRef.value.fnOpen();
};

const fnDeleteAgenda = (item) => {
	agendaList.value = agendaList.value.filter(selected => selected.billId !== item.billId);
};

const fnSave = (event) => {

	if(!fnValidate()) {
		return false;
	}

    confirm.require({
        target: event.currentTarget,
        message: t('10155'),
        accept: () => {

			// let openDtm = '';
			// if(!isEmpty(mtngData.value.openDate) && !isEmpty(mtngData.value.openHour) && !isEmpty(mtngData.value.openMin)) {
			// 	openDtm =  replace(mtngData.value.openDate, /-/g, '')+mtngData.value.openHour+mtngData.value.openMin;
			// }


			const jsonData = {
				mtngTypeCd: '2',
				ageCd: ageObj.value.naTermCd,
				rmk: mtngData.value.rmk,
				statCd: '1',
				openDtm: replace(mtngData.value.openDate, /-/g, '')+mtngData.value.openHour+mtngData.value.openMin,
				agendaList: agendaList.value,
				sessionNo: mtngData.value.sessionNo,
				sessionOrd: mtngData.value.sessionOrd,
			};

			const apiUrl = `/bill/mtng/hallMtng`;
			store.API_SAVE(apiUrl, jsonData).then((data) => {
				fnGoList();
			}).catch(({ message }) => {
				console.log("message : ", message);
			})

        },
    });
}

const fnValidate = () => {
	const {errors} = resolver();
	return Object.keys(errors).length === 0;
}

const resolver = () => {
    const errors = {};

	if(!mtngData.value.openDate || !mtngData.value.openHour || !mtngData.value.openMin) {
		errors.openDate = [{ message: 'required.' }];
	}
	if(!mtngData.value.sessionNo) {
		errors.sessionNo = [{ message: 'required.' }];
	}
	if(!mtngData.value.sessionOrd) {
		errors.sessionOrd = [{ message: 'required.' }];
	}

    return {
        errors
    };
};

const onRowReorder = (event) => {
	agendaList.value = event.value;
};

onMounted(() => {

	mtngData.value.openDate = ref(today.format('YYYY-MM-DD'));
	mtngData.value.openHour = '12';
	mtngData.value.openMin = "00";

});

</script>

<template>
	<div class="content_inner">
		<TitleComp />
		<!-- Main area -->
		<Form v-slot="$form" :resolver="resolver">
			<div class="content_section">
				<div class="v_table" >
					<table>
						<colgroup>
							<col style="width: 15%;">
							<col>
							<col style="width: 20%;">
							<col style="width: 10%;">
							<col style="width: 20%;">
							<col style="width: 10%;">
						</colgroup>
						<tbody>
							<tr>
								<th scope="row">{{ t('10186') }}<span class="text_red">*</span></th>
								<td>
									<div class="input_group">
										<FormField v-slot="$field" name="openDate" initialValue="" style="flex-grow: 1;">
											<input type="date" class="form_control" value="" v-model="mtngData.openDate" style="width: 40%;">
											<select class="form_control" v-model="mtngData.openHour" style="width: 25%;">
												<option v-for="tval in time" :value="tval">
													{{ tval }}
												</option>
											</select>
											<select class="form_control" v-model="mtngData.openMin" style="width: 25%;">
												<option v-for="mVal in min" :value="mVal">
													{{ mVal }}
												</option>
											</select>
											<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
										</FormField>
									</div>

								</td>
								<th scope="row">{{ t('10211') }}<span class="text_red">*</span></th>
								<td>        
									<FormField v-slot="$field" name="sessionNo" initialValue="" style="flex-grow: 1;">
										<input type="number" class="form_control" v-model="mtngData.sessionNo" :placeholder="t('10211')">
										<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
									</FormField>
								</td>
								<th scope="row">{{ t('10212') }}<span class="text_red">*</span></th>
								<td>        
									<FormField v-slot="$field" name="sessionOrd" initialValue="" style="flex-grow: 1;">
										<input type="number" class="form_control" v-model="mtngData.sessionOrd" :placeholder="t('10212')">
										<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
									</FormField>
								</td>
							</tr>
							<tr>
								<th scope="row">{{ t('10111') }}</th>
								<td colspan="5">
									<textarea row="2" class="form_control full" v-model="mtngData.rmk"></textarea>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div class="text_right mb_2 mt_2">
					<a href="javascript:void(0)" class="v_btn btn_primary btn_sm" @click="fnAddAgenda">{{ t('10197') }}</a>
				</div>

				<div class="v_table"> 
					<DataTable :value="agendaList" paginator :rows="10"  :pageLinkSize="10" paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"  @rowReorder="onRowReorder">
						<Column rowReorder headerStyle="width: 3rem" :reorderableColumn="false" style="border-right: none;"/>
						<Column field="billNo"   :header="t('10292')" class="text_center" style="width: 5%;"></Column>
						<Column field="billName" :header="t('10293')"  ></Column>
						<Column field="ppslDt" :header="t('10051')" class="text_center" style="width: 10%;">
							<template #body="slotProps">
								{{ dayjs(slotProps.data.ppslDt).format('DD/MM/YYYY') }}
							</template>
						</Column>
						<Column field="ppsrNm" :header="t('10196')" class="text_center" style="width: 20%;"></Column>
						<Column :header="t('10173')" class="text_center" style="width: 10%;">
							<template #body="slotProps">
								<button type="button" class="v_btn btn_outline_secondary btn_xs" @click="fnDeleteAgenda(slotProps.data)">{{ t('10173') }}</button>
							</template>
						</Column>
					</DataTable>
				</div>
			
			</div>
			<!-- // Main area -->
			<div class="btn_group_fixed">
				<button type="button" class="v_btn btn_outline_primary btn_md" @click="fnGoList">{{ t('10084') }}</button>
				<button type="submit" class="v_btn btn_primary btn_md" @click="fnSave">{{ t('10174') }}</button>
			</div>
		</Form>
	</div>		
	<mtngAgendaModal ref="agendaRef" mode="main" @sendList="fnAgendaSendList"></mtngAgendaModal>
</template>
<style>
.no_data {
    display: flex; /* Flex box use */
    justify-content: center; /* Horizontal */
    align-items: center;
    flex-direction: column;
    height: 16rem; 
}
</style>
