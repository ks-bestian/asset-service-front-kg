<script setup>
import { defineProps, defineEmits, ref, onMounted, computed } from 'vue';
import Dialog from 'primevue/dialog'
import { useStore } from '@/store';
import { useI18n } from 'vue-i18n'
import VideoView from './VideoView.vue';

const { t } = useI18n();
const props = defineProps({
    dialog: Boolean,
    videoMnlId: String,
    eqpmntInfo: Object
})

const emit = defineEmits(['close'])
const visible = ref(props.dialog)


const videoSrc = ref(null);

const fnGetVideoMnl = () => {
    let params = {mnlId: props.videoMnlId}
    store.API_LIST('mnul/video/detail', params).then((data) => {
        obj.value = data.data.data
    }).catch(({message}) => {
        console.log(message)
    })
}


const loadVideoWithAuth = async (mnlId) => {
  const token = store.jwtToken;
  const url = `/mnul/video/${mnlId}`

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });


  if (!res.ok) {
    console.error("❌ 영상 로딩 실패:", res.status);
    return;
  }

  const blob = await res.blob();
  videoSrc.value = URL.createObjectURL(blob);
};

onMounted(() => {

    fnGetVideoMnl();
    loadVideoWithAuth(props.videoMnlId);

})
</script>

<template>
    <Dialog v-model:visible="visible" modal :style="{ width: '62vw', minHeight: '25vh' }" @hide="emit('close')">
        <template #header>
            <div class="popup_header" style="width: 100%; border-top-left-radius: 12px;">

                <h2 class="popup_tit">{{ obj.mnlNm }}</h2>

            </div>
        </template>

        <div class="flex item-center gap-4 mb-4">
            <div class="popup_body">


            <VideoView :eqpmntInfo="props.eqpmntInfo" :mnlId="props.videoMnlId"/>

<!--
                <video controls width="100%" :src="videoSrc" style="border-radius: 1rem;"></video>
-->
                <div class="popup_footer">
                    <div class="btn_group">
                        <button type="button" class="v_btn btn_outline_primary btn_md"
                            @click="emit('close')">{{ t('10153') }}</button>
                    </div>
                </div>
            </div>
        </div>
    </Dialog>
</template>


<style>
.p-dialog-header {
    background-color: #0094D3;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
}
</style>