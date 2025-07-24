<script setup>
import { ref, computed } from "vue";
import { DocumentService } from "../service/DocumentService";
import Dialog from 'primevue/dialog';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
    fileId: String,
    fileTitle: String,
	favoriteYn: String,
	folderNm: String,
	dialog: Boolean,
});

const emit = defineEmits(['close', 'reload']);

const visible = ref(props.dialog)
const favoriteYn = ref(props.favoriteYn);
const fileTitle = ref(props.fileTitle);

const fnClose = (reload) => {
	emit('close');
	if(reload) {
		emit('reload');
	}
}

const fnSave = () => {

	// if (!fnValidate()) {
	//     return;
	// }


	DocumentService.updateFile(props.fileId, fileTitle.value, favoriteYn.value)
		.then(data => {
			fnClose(true);
		})
}

</script>
<template>
	<!-- Layer pop -up (file modification) -->
	<Dialog v-model:visible="visible" modal :style="{ width: '45vw', height: '38vh' }" @hide="emit('close')">

		<template #header>
            <div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
                <h2 class="popup_tit">{{ t('10598') }}</h2>
            </div>
        </template>

		<div class="popup_inner">
			<div class="popup_body">
				<div class="popup_cont">
					<div class="form_col type4 mb_2">
						<div class="input_item">
							<label class="form_label">{{ t('10312') }}</label>
							<input type="text" class="form_control" value="" v-model="props.folderNm" readonly>
						</div>
						<div class="input_item">
							<label class="form_label">{{ t('10532') }} <span class="text_red">*</span></label>
							<input type="text" class="form_control" v-model="fileTitle">
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
