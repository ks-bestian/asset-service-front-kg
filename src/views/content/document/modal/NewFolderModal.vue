<script setup>
import { ref, computed, reactive } from "vue";
import { DocumentService } from "../service/DocumentService";
import Dialog from 'primevue/dialog';
import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { FormField } from '@primevue/forms';
import { useConfirm } from "primevue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
	deptFolderYn: String,
    upperFolderId: Number,
    upperFolderNm: String,
	dialog: Boolean,
});

const emit = defineEmits(['close', 'reload']);

const confirm = useConfirm();
const visible = ref(props.dialog)
const folderNm = ref();

const fnClose = (reload) => {
	// Close modal('#layer new folder');

	emit('close');
	if(reload) {
		emit('reload');
	}
}

const fnSave = (e) => {
	if(!fnValidate()) {
		return;
	}

	// confirm.require({
	// 	target: e.currentTarget,
	// 	message: 'Сактайсызбы?',
	// 	accept: () => {
	// 		// fnSave();
	// 		if(props.deptFolderYn == 'Y') {
	// 			DocumentService.newDeptFolder(props.upperFolderId || -1, folderNm.value)
	// 			.then(data => {
	// 				fnClose(true);
	// 			})
	// 		}
	// 		else {
	// 			DocumentService.newMyFolder(props.upperFolderId || -1, folderNm.value)
	// 			.then(data => {
	// 				fnClose(true);
	// 			})
	// 		}
	// 	},
	// });


	if(props.deptFolderYn == 'Y') {
		DocumentService.newDeptFolder(props.upperFolderId || -1, folderNm.value)
		.then(data => {
			fnClose(true);
		})
	}
	else {
		DocumentService.newMyFolder(props.upperFolderId || -1, folderNm.value)
		.then(data => {
			fnClose(true);
		})
	}
}

const fnValidate = () => {
	const {errors} = resolver();
	return Object.keys(errors).length === 0;
}

const resolver = () => {
    const errors = {};
    if (!folderNm.value) {
        errors.folderNm = [{ message: 'folderNm is required.' }];
    }
    return {
        errors
    };
};

const onFormSubmit = ({ valid }) => {
    if (valid) {
    }
};

</script>
<template>
  <!-- Layer pop -up (new folder) -->
  	<Dialog v-model:visible="visible" modal :style="{ width: '45vw', height: '38vh' }" @hide="emit('close')">

		<template #header>
            <div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
                <h2 class="popup_tit">{{ t('10302') }}</h2>
            </div>
        </template>

		<Form v-slot="$form" :resolver="resolver" @submit="onFormSubmit">
			<div class="popup_inner">
				<div class="popup_body">
					<div class="popup_cont">
						<div class="form_col type4 mb_2">
							<div class="input_item">
								<label class="form_label">{{ t('10315') }}<span class="text_red">*</span></label>
								<input type="text" class="form_control" value="Подача заявления" v-model="props.upperFolderNm" readonly>
							</div>
							<div class="input_item">
								<label class="form_label">{{ t('10312') }}<span class="text_red">*</span></label>
								<FormField v-slot="$field" name="folderNm" initialValue="" style="flex-grow: 1;">
									<InputText type="text" v-model="folderNm" class="form_control" size="large" style="width: 100%" />
									<Message v-if="$field?.invalid" severity="error" size="large" variant="simple">{{ $field.error?.message }}</Message>
								</FormField>
							</div>
						</div>
					</div>
					<div class="popup_footer">
						<div class="btn_group">
							<button type="submit" class="v_btn btn_primary btn_md" @click="fnSave">{{ t('10174') }}</button>
						</div>
					</div>
				</div>
			</div>
		</Form>
	</Dialog>
</template>

<style>
</style>
