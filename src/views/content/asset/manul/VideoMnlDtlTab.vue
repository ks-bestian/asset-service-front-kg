<script setup>
import { ref, onMounted, defineProps, computed } from 'vue'
import Divider from 'primevue/divider';
import AssetFile from '@/views/content/asset/common/AssetFile.vue';
import { useStore } from '@/store';
import { useI18n } from 'vue-i18n'
import VideoView from './VideoView.vue';
const { t } = useI18n();
const store = useStore()
const product = ref([])
const props = defineProps({
    videoList: Array,
    eqpmntInfo: Object
})
const lang = ref(localStorage.getItem("languageType"));
const list = ref([])
const selVideo = ref([])
const firstMnlId = ref('')

/*
const fnGetVideoList = () => {
    let parmas = { eqpmntId: props.eqpmntInfo.eqpmntId, modalYn: false }

    store.API_LIST('mnul/video/list', parmas).then((data) => {
        list.value = data.data.data
        firstMnlId.value = data.data.data[0].mnlId
        selVideo.value = data.data.data[0]
        await loadVideoWithAuth(selVideo.value.mnlId);
        list.value = list.value.map(item => {
            return {
                ...item,
                isClick: false
            }
        })
    }).catch(({ message }) => {
        console.log(message)
    })
}
*/
const fnGetVideoList = async () => {
    let parmas = { eqpmntId: props.eqpmntInfo.eqpmntId }

    try {
        const data = await store.API_LIST('mnul/video/list', parmas);
        list.value = data.data.data;
        selVideo.value = data.data.data[0];
        await loadVideoWithAuth(selVideo.value.mnlId);

        list.value = list.value.map(item => ({
            ...item,
            isClick: false
        }));
    } catch ({ message }) {
        console.log(message);
    }
}
const fnGetVideo = async (id) => {
    // const obj = list.value.find((item) => item.mnlId === id);
    // selVideo.value = obj?  [obj] : []
    selVideo.value = list.value.find(item => item.mnlId === id)
    selVideo.value.isClick = true;
    await loadVideoWithAuth(id); // ✅ 여기도 추가
}

const videoSrc = ref(null);

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
    } else {
        alert('영상 로딩 성공')
    }

    const blob = await res.blob();
    videoSrc.value = URL.createObjectURL(blob);
};

const videoPlayer = ref(null); // <video> 태그에 접근하기 위한 ref
const videoDuration = ref(0);

const handleLoadedMetadata = () => {
    if (videoPlayer.value) {
        videoDuration.value = videoPlayer.value.duration;
    }
};

const formattedDuration = computed(() => {
    if (videoDuration.value && videoDuration.value > 0) {
        const hours = Math.floor(videoDuration.value / 3600); // 시 계산
        const minutes = Math.floor((videoDuration.value % 3600) / 60); // 분 계산
        const seconds = Math.floor(videoDuration.value % 60); // 초 계산

        const paddedHours = String(hours).padStart(2, '0');
        const paddedMinutes = String(minutes).padStart(2, '0');
        const paddedSeconds = String(seconds).padStart(2, '0');

        return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
    }
    return 'Loading...';
});

function joinPath(...segments) {
    return segments
        .map(s => s.replace(/^\/+|\/+$/g, '')) // 앞뒤 슬래시 제거
        .filter(Boolean)
        .join('/');
}
/** File download */
const fnDownloadFile = (file) => {

    let fileNm = file.orgnlFileNm + '.' + file.fileExtn;
    const filePath = joinPath(file.filePath, `${file.fileNm}.${file.fileExtn}`);

    store.API_FILE_DOWN(filePath, fileNm);
}

onMounted(() => {
    fnGetVideoList();
})
</script>

<template>
    <div class="content_row">
        <div class="col_9 v_box">

            <!-- <div class="tit_header mb_4">
                <div class="left">
                    <h4 class="v_tit m_2">{{ eqpmntInfo.eqpmntNm }}</h4>
                    <span class="e_info m_2 text_lg">{{ eqpmntInfo.eqpmntCd + ' | ' + ((lang === 'lng_type_1') ?
                        eqpmntInfo.eqpmntSeNm1 : (lang === 'lng_type_2') ? eqpmntInfo.eqpmntSeNm2 :
                            eqpmntInfo.eqpmntSeNm3) }}</span>
                </div>
            </div>
            <div>
                <video controls width="100%" height="700px" :src="videoSrc" style="border-radius: 1rem;"
                    @loadedmetadata="handleLoadedMetadata" ref="videoPlayer"></video>
                <div class="mt_4 ml_1 text_xl" style="display: flex; align-items: center;">

                    <div>{{ selVideo.mnlNm }}</div>
                    <span class="m_1 text_lg" v-if="videoDuration">{{ `[${formattedDuration}]` }}</span>

                </div>
            </div> -->
            <VideoView :eqpmntInfo="props.eqpmntInfo" :mnlId="firstMnlId" />
        </div>

        <div class="col_3 v_box">
            <template v-for="(item, i) in list" :key="i">
                <div class="m1_5" style="display: flex; align-items: center;">
                    <div style="cursor: pointer;" @click="fnGetVideo(item.mnlId)">
                        <i class="pi pi-play-circle mr_1 " style="font-size: 1.8rem;"></i>
                        <button type="button" class="m_1 text_xl" :class="{ text_bold: item.isClick }"
                            style="text-align: left;">{{ item.mnlNm }}</button>
                        <span class="m_1 text_lg" v-if="videoDuration">{{ `[${formattedDuration}]` }}</span>
                    </div>
                    <i class="pi pi-download" style="margin-left: auto; cursor: pointer;"
                        @click="fnDownloadFile(item)"></i>
                </div>
                <Divider />
            </template>
        </div>
    </div>
</template>


<style scoped></style>