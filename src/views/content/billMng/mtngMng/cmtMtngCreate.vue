<script setup>
import { ref, computed, onMounted } from "vue";
import cmtMtngAttendModal from "@/views/content/billMng/common/cmtMtngAttendModal.vue";
import mtngAgendaModal from "@/views/content/billMng/common/mtngAgendaModal.vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import dayjs from "dayjs";
import { isEmpty , replace} from 'lodash';
import { useConfirm } from "primevue/useconfirm";
import Chip from 'primevue/chip';
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
const userInfo = store.loginInfo;

const participantRef = ref(null);
const agendaRef = ref(null);
const agendaList = ref([]); // Agenda

const participantList = ref([]); // Participation list

const mtngData = ref({});
const time = ref([]);
const min = ref(['00','10','20','30','40','50']);

Array.from({ length: 24 }, (_, i) => {
  const num = (i).toString().padStart(2, '0');
  time.value.push(num);
});

/** List */
const fnGoList = () => {
	router.push({name: 'mtng.cmtMtng'});
};

const fnAddAttendants = (event) => {
	participantRef.value.fnOpen();
};

const fnSendList = (sendList) => {
	participantList.value = [...new Map([...participantList.value, ...sendList].map(item => [item.memberId, item])).values()];
};

const fnAgendaSendList = (sendList) => {
	agendaList.value = [...new Map([...agendaList.value, ...sendList].map(item => [item.billId, item])).values()];
};

const fnRemoveAttend = (memberId) => {
	participantList.value = participantList.value.filter(user => user.memberId !== memberId);
};

const fnAddAgenda = (event) => {
	agendaRef.value.fnOpen();
};

const fnDeleteAgenda = (item) => {
	agendaList.value = agendaList.value.filter(selected => selected.billId !== item.billId);
};

const fnSave = (event) => {

	if (!fnValidate()) {
		return;
	}

    confirm.require({
        target: event.currentTarget,
        message: t('10155'),
        accept: () => {

			const jsonData = {
				mtngTypeCd: '1',
				deptCd: userInfo.deptCd,
				mtngPlc: mtngData.value.mtngPlc,
				ageCd: ageObj.value.naTermCd,
				rmk: mtngData.value.rmk,
				statCd: '1',
				dueDtm: replace(mtngData.value.dueDate, /-/g, '')+mtngData.value.dueHour+mtngData.value.dueMin,
				attendantList: participantList.value,
				agendaList: agendaList.value
			};

			const apiUrl = `/bill/mtng/from`;
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
	
	if (!mtngData.value.dueDate || !mtngData.value.dueHour || !mtngData.value.dueMin) {
        errors.dueDate = [{ message: 'dueDate is required.' }];
    }

    return {
        errors
    };
};

onMounted(() => {

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
							<col style="width: 16.3%;">
							<col>
							<col style="width: 16.3%;">
							<col style="width: 33.7%;">
						</colgroup>
						<tbody>
							<tr>
								<th scope="row">{{ t('10045') }}</th>
								<td colspan="3" >
									{{ userInfo.deptNm }}
								</td>
							</tr>
							<tr>
								<th scope="row">{{ t('10186') }}<span class="text_red">*</span></th>
								<td>
									<div class="input_group">
										<FormField v-slot="$field" name="dueDate" initialValue="" style="flex-grow: 1;">
											<input type="date" class="form_control" value="" v-model="mtngData.dueDate" style="width: 40%;">
											<select class="form_control" v-model="mtngData.dueHour" style="width: 25%;">
												<option v-for="tval in time" :value="tval">
													{{ tval }}
												</option>
											</select>
											<select class="form_control" v-model="mtngData.dueMin" style="width: 25%;">
												<option v-for="mVal in min" :value="mVal">
													{{ mVal }}
												</option>
											</select>
											<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
										</FormField>
									</div>

								</td>
								<th scope="row">{{ t('10187') }}</th>
								<td>        
									<input type="text" class="form_control" v-model="mtngData.mtngPlc" :placeholder="t('10187')" >
									
								</td>

							</tr>
							<tr>
								<th scope="row">{{ t('10213') }}</th>
								<td colspan="3">
									<div class="mb_2">
										<a href="javascript:void(0)" class="v_btn btn_secondary btn_xs" @click="fnAddAttendants"><i class="v_ico ico_search_white_xs"></i><span>{{ t('10177') }}</span></a>
									</div>
									<div class="card flex flex-wrap gap-2">
										<Chip  v-for="item in participantList" :key="item.memberId" :label="item.memberNm" removable @remove="fnRemoveAttend(item.memberId)"/>
									</div>
								</td>
							</tr>

							<tr>
								<th scope="row">{{ t('10111') }}</th>
								<td colspan="3">
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
					<DataTable :value="agendaList" paginator :rows="10"  :pageLinkSize="10" paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink">
						<Column field="billNo"   :header="t('10292')" class="text_center" style="width: 10%;"></Column>
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
	<cmtMtngAttendModal ref="participantRef" @sendList="fnSendList"></cmtMtngAttendModal>
	<mtngAgendaModal ref="agendaRef" mode="cmt" @sendList="fnAgendaSendList"></mtngAgendaModal>
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
