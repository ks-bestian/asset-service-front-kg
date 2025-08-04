<script setup>
import { defineEmits, defineProps, ref, computed } from 'vue'
import Panel from 'primevue/panel';
import Button from 'primevue/button';
import { formSchemas } from '@/schemas/AssetSchemas';
import Testform from '../mng/testform.vue';
import { useI18n } from 'vue-i18n'
import { size } from 'lodash';
const { t } = useI18n();

const lang = ref(localStorage.getItem("languageType"));
const props = defineProps({
  imgVo: Object,
  imgSe: String,
  size: {
    type: String,
    default: 'medium' // 기본값
  }
})

const thumbnailStyle = computed(() => {
  switch (props.size) {
    case 'small':
      return { width: '15rem' }
    case 'large':
      return { width: '50rem' }
    case 'medium':
    default:
      return { width: '100%', height: '35rem' }
  }
})

</script>

<template>
  <template v-if="props.imgSe === 'thumbnail'">
    <img v-if="props.imgVo && props.imgVo.eqpmntId" :src="`/equip/thumbnail/${props.imgVo.eqpmntId}`"
      @error="e => e.target.src = `/images/content/img_noimage.png`" :alt="props.imgVo.eqpmntNm" :style="thumbnailStyle"
      loading="lazy" />
  </template>

  <template v-if="props.imgSe === 'detail'">
    <img v-if="props.imgVo && props.imgVo.imgId" class="v_box" :src="`/equip/img/${props.imgVo.imgId}`"
      @error="e => e.target.src = `/images/content/img_noimage.png`" :alt="props.imgVo.orgnlFileNm"
      :style="thumbnailStyle" loading="lazy" />
  </template>

  <template v-if="props.imgSe === 'installImg'">

    <img v-if="props.imgVo && props.imgVo.instlId" :src="`/equip/installImg/${props.imgVo.instlId}`"
      @error="e => e.target.src = `/images/content/img_noimage.png`" :alt="`[${lang === 'lng_type_1' ? props.imgVo.instlPlcNm1 :
        lang === 'lng_type_2' ? props.imgVo.instlPlcNm2 :
          props.imgVo.instlPlcNm3}
                ] ${lang === 'lng_type_1' ? props.imgVo.instlPlcDtl1 :
          lang === 'lng_type_2' ? props.imgVo.instlPlcDtl2 :
            props.imgVo.instlPlcDtl3}`" :style="thumbnailStyle" loading="lazy" />
  </template>



</template>

<style></style>