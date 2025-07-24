<script setup>
import { ref, computed } from "vue";
import { DocumentService } from "../service/DocumentService";
import Dialog from 'primevue/dialog';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
	deptFileYn: String,
    folderId: Number,
    folderNm: String,
	dialog: Boolean,
});

const emit = defineEmits(['close', 'reload']);

const visible = ref(props.dialog)
const groupYn = ref('N');
const folderUpload = ref(false);
const files = ref(null);
const favoriteYn = ref('N');

const fnClose = (reload) => {
	// closeModal('#layer_file_upload');
	emit('close');
	if(reload) {
		emit('reload');
	}
}

// Storage (including files)

const fnSave = () => {

	console.log('fnSave', props.folderId);
	// return;

	// if (!fnValidate()) {
	//     return;
	// }


	if(props.deptFileYn == 'Y') {
		DocumentService.saveDeptFile(props.folderId || -1, favoriteYn.value, files.value)
			.then(data => {
				fnClose(true);
			})
	}
	else {
		DocumentService.saveMyFile(props.folderId || -1, favoriteYn.value, files.value)
			.then(data => {
				fnClose(true);
			})
	}
}

</script>
<template>
	<!-- Layer pop -up (file registration) -->
	<Dialog v-model:visible="visible" modal :style="{ width: '45vw', height: '48vh' }" @hide="emit('close')">

		<template #header>
            <div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
                <h2 class="popup_tit">{{ t('10309') }}</h2>
            </div>
        </template>

		<div class="popup_inner">
			<div class="popup_body">
				<div class="popup_cont">
					<div class="form_col type4 mb_2">
						<div class="input_item">
							<label class="form_label">{{ t('10312') }}<span class="text_red">*</span></label>
							<input type="text" class="form_control" value="" v-model="props.folderNm" readonly>
						</div>
						<div class="input_item" v-if="groupYn == 'Y'">
							<label class="form_label">{{ t('10049') }}<span class="text_red">*</span></label>
							<input type="text" class="form_control">
						</div>
						<div class="input_item">
							<div class="file_attatch">
								<div class="form_col type4">
									<div class="input_item" v-if="folderUpload === false">
										<span class="form_label">{{ t('10160') }}<span class="text_red">*</span></span>
										<div class="input_group">
											<!-- Label for and input ID matching required -->
											<input type="file" class="form_file" id="inputFile1_1" multiple @change="e => files = e.target.files">
											<input type="text" class="form_control file_name">
											<span class="input_addon">
												<label class="v_btn btn_outline_primary btn_sm btn_file" for="inputFile1_1">{{ t('10160') }}</label>
											</span>
										</div>
									</div>
									<div class="input_item" v-if="folderUpload === true">
										<span class="form_label">{{ t('10599') }}<span class="text_red">*</span></span>
										<div class="input_group">
											<!-- Label for and input ID matching required -->
											<input type="file" class="form_file" id="inputFile1_1" directory webkitdirectory mozdirectory @change="e => files = e.target.files">
											<input type="text" class="form_control file_name">
											<span class="input_addon">
												<label class="v_btn btn_outline_primary btn_sm btn_file" for="inputFile1_1">{{ t('10599') }}</label>
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="input_item">
							<label class="form_label">{{ t('10313') }}</label>
							<div class="check_area">
								<span class="check_item">
									<input type="checkbox" id="inputCheck2_1" v-model="favoriteYn" true-value="Y"  false-value="N">
									<label for="inputCheck2_1"></label>
								</span>
							</div>
						</div>
						<!-- <div class="input_item" v-if="groupYn == 'Y'">
							<div class="file_attatch">
								<div class="form_col type4">
									<div class="input_item">
										<span class="form_label">{{ t('10669') }}</span>
										<div class="input_group">
											<input type="file" class="form_file" id="inputFile1_2">
											<input type="text" class="form_control file_name">
											<span class="input_addon">
												<label class="v_btn btn_outline_primary btn_sm btn_file" for="inputFile1_2">{{ t('10160') }}</label>
											</span>
										</div>
									</div>
								</div>
							</div>
						</div> -->
					</div>
					<hr class="division_line">
					<div class="form_col type4 mt_2">
						<div class="input_item">
							<!-- <label class="form_label">топтомун көтөрүү</label>
							<div class="check_area">
								<span class="check_item check_item_switch">
									<input type="checkbox" id="inputSwitch" false-value="N" true-value="Y" v-model="groupYn">
									<label for="inputSwitch"></label>
								</span>
							</div> -->

							<label class="form_label">{{ t('10314') }}</label>
							<div class="check_area">
								<span class="check_item check_item_switch">
									<input type="checkbox" id="inputSwitch2" v-model="folderUpload">
									<label for="inputSwitch2"></label>
								</span>
							</div>
						</div>
					</div>
				</div>
				<div class="popup_footer">
					<div class="btn_group">
						<button type="button" class="v_btn btn_primary btn_md" @click="fnSave">{{ t('10174') }}</button>
					</div>
				</div>
			</div>
		</div>
	</Dialog>
</template>

<style>
</style>
