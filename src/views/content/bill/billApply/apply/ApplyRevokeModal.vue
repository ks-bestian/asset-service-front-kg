<script setup>
import { ref, defineProps, defineEmits, computed } from "vue";
import { useRouter, useRoute } from 'vue-router'
import { useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import Dialog from 'primevue/dialog';
import BillFileInput from "@/views/content/billMng/common/billFileInput.vue";
import { useI18n } from 'vue-i18n'
import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { FormField } from '@primevue/forms';
import Textarea from 'primevue/textarea';

const { t } = useI18n()

const props = defineProps({
	billId: String,
	dialog: Boolean,
});

const confirm = useConfirm();
const store = useStore();
const router = useRouter();
const route = useRoute();
const inputFile = ref(null);
const visible = ref(props.dialog);
const files = ref();
const wtCnKg = ref();
const wtCnRu = ref();
const myFiles = ref();

const revokeObj = ref({});
const emit = defineEmits(["close"]);

const fnClose = () => {
  	emit("close"); 
};

const fnSave = (event) => {

	if(!fnValidate()) {
		return;
	}

	confirm.require({
        target: event.currentTarget,
        message: t('10430'),
        accept: () => {

			const formData = new FormData();

			formData.append("wtCnKg", wtCnKg.value);
			formData.append("wtCnRu", wtCnRu.value);
			for (var i = 0; i < files.value?.length; ++i) {
				formData.append("files", files.value[i]);
			}
			for(var i = 0; i < myFiles.value?.length; ++i) {
				formData.append("myFileIds", myFiles.value[i].fileId);
			}

			const apiUrl = '/bill/revoke/request/' + props.billId;
			store.API_SAVE_FILE(apiUrl, formData).then((data) => {
				fnClose();
			}).catch(({message}) => {
				console.log("message : ", message);
			})

        },
        reject: () => {
        }
    });

}

const onFileChange = (selection, type) => {
	if (type == 'file') {
		files.value = selection;
		myFiles.value = null;
	}
	else {
		files.value = null;
		myFiles.value = selection;
	}
}

const fnValidate = () => {
	const {errors} = resolver();
	return Object.keys(errors).length === 0;
}

const resolver = () => {
    const errors = {};
    if (!wtCnKg.value) {
        errors.wtCnKg = [{ message: 'required.' }];
    }
	if (!wtCnRu.value) {
        errors.wtCnRu = [{ message: 'required.' }];
    }

    return {
        errors
    };
};

</script>
<template>
    <!-- Layer pop -up (request for withdrawal) -->
	<Dialog v-model:visible="visible" modal :style="{ width: '45vw', height: '60vh' }" @hide="emit('close')">
		<template #header>
            <div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
                <h2 class="popup_tit">{{ t('10159') }}</h2>
            </div>
        </template>
		<div class="popup_inner">
			<div class="popup_body">
				<Form v-slot="$form" :resolver="resolver">
					<div class="popup_cont">
						<div class="form_col type4 mb_2">
							<div class="input_item">
								<div class="file_attatch">
									<div class="form_col type4">
										<div class="input_item">
											<span class="form_label">{{ t('10160') }}</span>
											<BillFileInput multiple button-name="file" @change="(selection, type) => onFileChange(selection, type)" />
											<!-- <div class="input_group">
												<input type="file" class="form_file" id="inputFile1_1" multiple @change="e => files = e.target.files">
												<input type="text" class="form_control file_name">
												<span class="input_addon">
													<label class="v_btn btn_outline_primary btn_sm btn_file" for="inputFile1_1">{{ t('10160') }}</label>
												</span>
											</div> -->
										</div>
									</div>
								</div>
							</div>
							<div class="input_item">
								<label class="form_label">{{ t('10161') }}<span class="text_red">*</span></label>
								<FormField v-slot="$field" name="wtCnKg" initialValue="" style="flex-grow: 1;">
									<Textarea v-model="wtCnKg" class="form_control" size="large" style="width: 100%; line-height: 1.5; height: 12rem;"></Textarea>
									<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
								</FormField>
							</div>
							<div class="input_item">
								<label class="form_label">{{ t('10162') }}<span class="text_red">*</span></label>
								<FormField v-slot="$field" name="wtCnRu" initialValue="" style="flex-grow: 1;">
									<Textarea v-model="wtCnRu" class="form_control" size="large" style="width: 100%; line-height: 1.5; height: 12rem;"></Textarea>
									<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
								</FormField>
							</div>
						</div>
					</div>
					<div class="popup_footer">
						<div class="btn_group">
							<button type="submit" class="v_btn btn_primary btn_md" @click="fnSave">{{ t('10089') }}</button>
							<button type="button" class="v_btn btn_outline_primary btn_md" @click="fnClose">{{ t('10163') }}</button>
						</div>
					</div>
				</Form>
			</div>
			<button type="button" class="btn btn_close_popup" @click="fnClose"><i class="v_ico ico_close_white"></i></button>
		</div> 
	</Dialog>
</template>

<style>
</style>
