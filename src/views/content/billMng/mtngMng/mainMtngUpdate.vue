onMounted<script setup>
import { ref, computed, onMounted } from "vue";
import cmtMtngAttendModal from "@/views/content/billMng/common/cmtMtngAttendModal.vue";
import mtngAgendaModal from "@/views/content/billMng/common/mtngAgendaModal.vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import dayjs from "dayjs";
import { isEmpty , replace} from 'lodash';
import { useConfirm } from "primevue/useconfirm";
import Chip from 'primevue/chip';
import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/store";
import TitleComp from "@/components/TitleComp.vue";
import { useI18n } from 'vue-i18n'
import BillInfoIncModal from "@/views/content/billMng/common/billInfoIncModal.vue";
import { last } from "lodash";


const { t } = useI18n()

const confirm = useConfirm();
const router = useRouter();
const route = useRoute();
const store = useStore();

const mtngId = route.query.mtngId;
const lang = localStorage.getItem("languageType");
const agendaRef = ref(null);
const agendaList = ref([]); // Agenda

const mtngData = ref({});
const time = ref([]);
const min = ref(['00','10','20','30','30','50']);
const dialog = ref(false);
const selectBillId = ref('');

const existsbillToSubmit = computed(() => {
	console.log('existsbillToSubmit', agendaList.value);
	for(var i = 0; i < agendaList.value?.length; ++i) {
		const agenda = agendaList.value[i];
		if(agenda.submitted !== true) { 
			return true;
		}
	}
	return false;
})

Array.from({ length: 23 }, (_, i) => {
  const num = (i + 1).toString().padStart(2, '0');
  time.value.push(num);
});

/** List */
const fnGoList = () => {
	router.push({name: 'mtng.mainMtng'});
};


const fnAgendaSendList = (sendList) => {
	// agendaList.value = [...new Map([...agendaList.value, ...sendList].map(item => [item.billId, item])).values()];


	for(var i = 0; i < sendList?.length; ++i) {
		const send = sendList[i];
		const lastOrd =Math.max(...agendaList.value.map(agenda => agenda.agendaOrd));
		send.agendaOrd = lastOrd + i + 1;

		const found = agendaList.value.find(agenda => agenda.billId == send.billId);

		if(!found) {
			agendaList.value.push(send);
			send.added = true;
		}
	}

	fnSaveAgenda();
};

const fnAddAgenda = (event) => {
	agendaRef.value.fnOpen();
};

const fnDeleteAgenda = (item) => {

	if(item.added) {
		const idx = agendaList.value.indexOf(item);
		agendaList.value.splice(idx, 1);
		return;
	}

	const mtngId = item.mtngId;
	const billId = item.billId;
	const rsltCd = item.rsltCd;

	confirm.require({
        target: event.currentTarget,
        message: t('10555'),
        accept: () => {

			const jsonData = {
				mtngId: mtngId,
				billId: billId,
				rsltCd: rsltCd
			};

			const apiUrl = `/bill/mtng/hallMtng/billDelete`;
			store.API_SAVE(apiUrl, jsonData).then((data) => {
				// Fn get mtng data();

				const idx = agendaList.value.indexOf(item);
				agendaList.value.splice(idx, 1);
			}).catch(({ message }) => {
				console.log("message : ", message);
			})
        },
    });	

};

const fnSave = (event) => {

    confirm.require({
        target: event.currentTarget,
        message: t('10155'),
        accept: () => {

            let params = {};
			params.mtngTypeCd = '2'; //Plenary

            params.mtngId = mtngId;
			params.openDtm = replace(mtngData.value.openDate, /-/g, '')+mtngData.value.openHour+mtngData.value.openMin;
            params.rmk = mtngData.value.rmk;
            params.agendaList = agendaList.value.filter(agenda => agenda.added);
			params.sessionNo = mtngData.value.sessionNo;
			params.sessionOrd = mtngData.value.sessionOrd;
            const apiUrl = `/bill/mtng/hallMtng`;

            store.API_UPDATE(apiUrl, params).then((data) => {
                fnGetMtngData();
            }).catch(({ message }) => {
                console.log("message : ", message);
            });
        },
    });
};

const fnSaveAgenda = (event) => {

	let params = {};
	params.mtngId = mtngId;
	params.agendaList = agendaList.value.filter(agenda => agenda.added);
	const apiUrl = `/bill/mtng/hallMtng/agenda`;

	store.API_UPDATE(apiUrl, params).then((data) => {
		fnGetMtngData();
	}).catch(({ message }) => {
		console.log("message : ", message);
	});
};

const fnSubmitMtngAgenda = () => {
	confirm.require({
		target: event.currentTarget,
		message: t('10216'), //Do you want to ask for an agenda?

		accept: () => {

			let params = {};
			// params.lang = lang;

			params.mtngId = mtngId;
			const apiUrl = '/bill/mtng/from/submit';
			store.API_UPDATE(apiUrl, params).then((data) => {
				fnGetMtngData();
			}).catch(({ message }) => {
				console.log("message : ", message);
			})
		},
	});
}

const fnGetMtngData = () => {
	
    let params = {};
    params.lang = lang;
    const apiUrl = '/bill/mtng/from/detail/'+mtngId;
    store.API_LIST(apiUrl, params).then((data) => {

	  mtngData.value = data.data.data;
      agendaList.value = data.data.data.agendaList;

      mtngData.value.openDate = dayjs(mtngData.value.openDtm).format('YYYY-MM-DD');
      mtngData.value.openHour = dayjs(mtngData.value.openDtm).format('HH');
      mtngData.value.openMin = dayjs(mtngData.value.openDtm).format('mm');

    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

const onRowReorder = (event) => {
	agendaList.value = event.value;

	const jsonData = {
		agendaList: agendaList.value,
	};

	const apiUrl = `/bill/mtng/hallMtng/ord`;
	store.API_UPDATE(apiUrl, jsonData).then((data) => {
		fnGetMtngData();
	}).catch(({ message }) => {
		console.log("message : ", message);
	})
};

onMounted(() => {
    fnGetMtngData();
});

</script>

<template>
	<div class="content_inner">
		<TitleComp />
		<!-- Main area -->
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
							<th scope="row">{{ t('10186') }}</th>
							<td>
								<div class="input_group">
									<input type="date" class="form_control"  v-model="mtngData.openDate">
									<select class="form_control" v-model="mtngData.openHour" style="width: 20%;">
										<option v-for="tval in time" :value="tval">
											{{ tval }}
										</option>
									</select>
									<select class="form_control" v-model="mtngData.openMin" style="width: 20%;">
										<option v-for="mVal in min" :value="mVal">
											{{ mVal }}
										</option>
									</select>
								</div>

							</td>
							<th scope="row">{{ t('10211') }}</th>
							<td>        
								<input type="number" class="form_control" v-model="mtngData.sessionNo" :placeholder="t('10211')">
							</td>
							<th scope="row">{{ t('10212') }}</th>
							<td>        
								<input type="number" class="form_control" v-model="mtngData.sessionOrd" :placeholder="t('10212')">
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
				<DataTable :value="agendaList" paginator :rows="10"  :pageLinkSize="10" paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink" @rowReorder="onRowReorder">
					<Column rowReorder headerStyle="width: 3rem" :reorderableColumn="false" style="border-right: none;"/>
					<Column field="billNo"   :header="t('10292')" class="text_center" style="width: 10%;">
					<template #body="{data}">
						<button type="button" class="v_btn btn_outline_primary btn_xs" @click="dialog = true; selectBillId = data.billId">{{ data.billNo }} </button>
					</template>
					</Column>
					<Column field="billName" :header="t('10293')"  ></Column>
					<Column field="ppslDt" :header="t('10051')" class="text_center" style="width: 10%;">
						<template #body="slotProps">
							{{ dayjs(slotProps.data.ppslDt).format('DD/MM/YYYY') }}
						</template>
					</Column>
					<Column field="ppsrNm" :header="t('10196')" class="text_center" style="width: 20%;"></Column>
					<Column field="statCd" :header="t('10551')" class="text_center" style="width: 20%;">
						<template #body="slotProps">
							{{ slotProps.data.submitted ? t('10553') : t('10552') }}
						</template>
					</Column>
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
			<a href="javascript:void(0)" class="v_btn btn_primary btn_md" @click="fnSave">{{ t('10174') }}</a>
			<a href="javascript:void(0)" class="v_btn btn_primary btn_md" @click="fnSubmitMtngAgenda" v-if="existsbillToSubmit">{{ t('10215') }}</a>
		</div>
	</div>		
	<mtngAgendaModal ref="agendaRef" mode="main" @sendList="fnAgendaSendList"></mtngAgendaModal>
	<BillInfoIncModal v-if="dialog" @close="dialog = false" :bill-id="selectBillId" :dialog="dialog"/> 

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
