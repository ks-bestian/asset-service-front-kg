<script setup>
import { ref, onMounted, defineProps, computed, watch } from 'vue'
import { useStore } from '@/store';
import { useI18n } from 'vue-i18n'

const store = useStore()
const props = defineProps({
    mnlId: String,
    eqpmntInfo: Object,
    selVideo: Object
})
const lang = ref(localStorage.getItem("languageType"));
const obj = ref([])
const clickMnlId = ref(props.mnlId)


const currentVideo = computed(() => {
    return `http://localhost:8081/mnul/video/${clickMnlId.value}`
})

const videoPlayer = ref(null); // <video> 태그에 접근하기 위한 ref
const videoDuration = ref(0);

const handleLoadedMetadata = () => {
    if (videoPlayer.value) {
        videoDuration.value = videoPlayer.value.duration;
    }
};

const formattedDuration = computed(() => {
    if (videoDuration.value && videoDuration.value > 0) {
        const hours = Math.floor(videoDuration.value / 3600);  
        const minutes = Math.floor((videoDuration.value % 3600) / 60);  
        const seconds = Math.floor(videoDuration.value % 60); 

        const paddedHours = String(hours).padStart(2, '0');
        const paddedMinutes = String(minutes).padStart(2, '0');
        const paddedSeconds = String(seconds).padStart(2, '0');

        return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
    }
    return 'Loading...';
});

watch(() => props.mnlId, (newval) => {
    if (newval && newval.length) {
        fnGetVideoMnl();
    }
})

watch(() => props.selVideo, (newval) => {
    if (newval && newval.length) {
        clickMnlId.value = props.selVideo.mnlId
    }
})

const fnGetVideoMnl = () => {
    let params = { mnlId: props.mnlId }
    store.API_LIST('mnul/video/detail', params).then((data) => {
        obj.value = data.data.data
    }).catch(({ message }) => {
        console.log(message)
    })
}


onMounted(() => {
    fnGetVideoMnl();
})
</script>


<template> 
    <div class="tit_header mb_4"> 
        <div class="left">
            <h4 class="v_tit m_2">{{ props.eqpmntInfo.eqpmntNm }}</h4>
            <span class="e_info m_2 text_lg">{{ props.eqpmntInfo.eqpmntCd + ' | ' + ((lang === 'lng_type_1') ?
                props.eqpmntInfo.eqpmntSeNm1 : (lang === 'lng_type_2') ? props.eqpmntInfo.eqpmntSeNm2 :
                    props.eqpmntInfo.eqpmntSeNm3) }}</span>
        </div>
    </div>

    <div>
        <video controls width="100%" height="700px" :src="currentVideo" style="border-radius: 1rem;"
            @loadedmetadata="handleLoadedMetadata" ref="videoPlayer"></video>

        <div class="mt_4 ml_1 text_xl" style="display: flex; align-items: center;">
            <div>{{ obj?.fileNm }}</div>
            <span class="m_1 text_lg" v-if="videoDuration">{{ `(${formattedDuration})` }}</span>
        </div>
    </div>
</template>


<style scoped>
.v_box {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.e_info {
    color: #3b3b3b;
}
</style>