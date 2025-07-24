<script setup>
import { ref, defineExpose, defineEmits  } from "vue";
import Dialog from 'primevue/dialog';
import { useConfirm } from "primevue/useconfirm";
import { useStore } from "@/store";
import dayjs from "dayjs";
import { isEmpty , replace} from 'lodash';
import { useI18n } from "vue-i18n";

const {t} = useI18n();
const store = useStore();
const confirm = useConfirm();
const userInfo = store.loginInfo;

const emits = defineEmits(['fnCallback']); // Event definition to parents

const visible = ref(false);
const billId = ref('');
const mtnDt = ref('');
const rmrkKg = ref('');
const rmrkRu = ref('');


/** save */
const fnSave = () => {

confirm.require({
    target: event.currentTarget,
    message: t('10155'),
    accept: () => {

        const jsonData = {
            billId: billId.value,
            rmrkKg: rmrkKg.value,
            rmrkRu: rmrkRu.value,
            mtnDt: isEmpty(mtnDt.value) ? '' : replace(mtnDt.value, /-/g, ''),
            clsCd: '340',
            deptCd: userInfo.deptCd
        };

        const apiUrl = `/bill/review/billLegalReview`;
        store.API_SAVE(apiUrl, jsonData).then((data) => {
			emits('fnCallback');
            fnCancel();
        }).catch(({ message }) => {
            console.log("message : ", message);
        });	
    },
    reject: () => {
    }
});
}

const fnOpen = (_billId) => {
    billId.value = _billId;
    visible.value = true;
    mtnDt.value = dayjs().format('YYYY-MM-DD');
};

const fnCancel = () => {
    visible.value = false;
};

defineExpose({ fnOpen });

</script>

<template>
    <Dialog v-model:visible="visible" modal  :style="{ width: '50vw', height: '49vh'}">
		<template #header>
			<div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
				<h2 class="popup_tit">{{ t('10663') }}</h2>
			</div>
		</template>
		<div class="popup_inner">
			<div class="popup_body">
				<div class="popup_cont">
					<div class="form_col type4 mb_2">
                        <div class="input_item">
                            <label class="form_label">{{ t('10133') }}</label>
                            <input type="date" class="form_control" style="width: 100px;"  v-model="mtnDt">
                        </div>
            			<div class="input_item">
							<label class="form_label">{{ t('10069') }}</label>
							<textarea row="2" class="form_control full" style="height: 8rem;" v-model="rmrkKg"></textarea>
						</div>
						<div class="input_item">
							<label class="form_label">{{ t('10070') }}</label>
							<textarea row="2" class="form_control full" style="height: 8rem;" v-model="rmrkRu"></textarea>
						</div>
					</div>
				</div>
				<div class="popup_footer">
					<div class="btn_group">
						<button type="button" class="v_btn btn_primary btn_md" @click="fnSave">{{ t('10000') }}</button>
						<button type="button" class="v_btn btn_outline_primary btn_md" @click="fnCancel">{{ t('10001') }}</button>
					</div>
				</div>
			</div>
		</div>
	</Dialog>
</template>

<style scoped>

</style>
