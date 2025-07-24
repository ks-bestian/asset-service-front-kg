<script setup>
import { ref, defineProps, defineEmits, computed } from "vue";
import SampleImg from '@/assets/images/content/status_sample.png';

const emit = defineEmits(["close"]);

const fnClose = () => {
  emit("close"); 
};

</script>
<template>
  <!-- Layer Pop -up (End Statistics Report) -->
	<div class="layer_popup layer_sm popup_regist show" id="layer_bill_status_report">
		<div class="popup_inner">
			<div class="popup_header">
				<h2 class="popup_tit text_center">Мыйзам долбоорунун статистикасы боюнча отчет</h2>
			</div>
			<div class="popup_body">
				<div class="popup_cont">
					<a href="javascript:void(0)" class="stat_image_link"><img :src="SampleImg" alt="" /></a>
				</div>
			</div>
			<button type="button" class="btn btn_close_popup" @click="fnClose"><i class="v_ico ico_close_white"></i></button>
		</div>
	</div>
</template>

<style>
</style>
