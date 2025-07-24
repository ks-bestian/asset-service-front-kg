<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { DocumentService } from "../service/DocumentService";
import Dialog from 'primevue/dialog';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
    folderId: Number,
	folderNm: String,
	dialog: Boolean,
});

const emit = defineEmits(['close', 'reload']);

const visible = ref(props.dialog)
const folderNm = ref(props.folderNm);

const fnClose = (reload) => {
	// closeModal('#layer_folder_update');
	emit('close');
	if(reload) {
		emit('reload');
	}
}

const fnSave = (e) => {
	DocumentService.updateFolder(props.folderId, folderNm.value)
	.then(data => {
		fnClose(true);
	})
}

</script>
<template>
  <!-- Layer pop -up (folder modification) -->
  	<Dialog v-model:visible="visible" modal :style="{ width: '45vw', height: '28vh' }" @hide="emit('close')">

		<template #header>
            <div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">
                <h2 class="popup_tit">{{ t('10600	') }}</h2>
            </div>
        </template>

		<div class="popup_inner">
			<div class="popup_body">
				<div class="popup_cont">
					<div class="form_col type4 mb_2">
						<!-- <div class="input_item">
							<label class="form_label">Аталык папканын аты <span class="text_red">*</span></label>
							<input type="text" class="form_control" value="Подача заявления" v-model="props.upperFolderNm" readonly>
						</div> -->
						<div class="input_item">
							<label class="form_label">{{ t('10312') }}<span class="text_red">*</span></label>
							<input type="text" class="form_control" v-model="folderNm" >
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
