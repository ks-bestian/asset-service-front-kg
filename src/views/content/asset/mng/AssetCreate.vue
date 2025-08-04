<script setup>
import { ref, onMounted } from 'vue'
import EqpmntCreateTab from '@/views/content/asset/equipment/EqpmntCreateTab.vue'
import VideoMnlCreateTab from '@/views/content/asset/manul/VideoMnlCreateTab.vue'
import InstlCreateTab from '@/views/content/asset/install/InstlCreateTab.vue'
import FaqCreateTab from '@/views/content/asset/faq/FaqCreateTab.vue'
import { useRouter, useRoute } from 'vue-router'
import TitleComp from "@/components/TitleComp.vue";
import { useStore, useFormStore } from '@/store';
import { useI18n } from 'vue-i18n'
import { formSchemas } from '@/schemas/AssetSchemas'
import { uploadTusFiles } from '@/utils/tus'
import { useRequireConfirm } from '@/utils/require'
import i18n from '@/i18n'


const requireConfirm = useRequireConfirm();
const store = useStore();
const formStore = useFormStore();
const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const tab = ref('productInf')
formStore.apiPath = "/equip"
const instlField = ref(formSchemas.installVo.fields.flatMap(row => row.map(col => col.name)));
const mnulField = ref(formSchemas.mnulVo.fields.flatMap(row => row.map(col => col.name)))
const faqField = ref(formSchemas.faqVo.fields.flatMap(row => row.map(col => col.name)))
const type = ref(route.params.type)
const equipDetailVo = ref({})
const mnulList = ref([])
const installList = ref([])
const faqList = ref([])
const eqpmntId = ref(route.params.eqpmntId);

const inputRefs = ref([])

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// 영상 파일은 TUS로 업로드 후 URL만 저장

// 나머지 파일 및 데이터는 FormData로 저장

// TUS 업로드 -> URL을 mnulVoList에 매핑 -> FormData 생성 -> API 전송 순서
const buildVoLists = () => {
  const mnulVo = []
  const installVo = []
  const faqVo = []
  const params = {}
  const tusVideoFiles = []
  const formData = new FormData();

  formStore.fieldArr.forEach((item) => {
    const obj = {};
    let isInstall = false, isManual = false, isFaq = false;

    Object.entries(item).forEach(([key, value]) => {
      const val = value?.value;

      if (mnulField.value.includes(key)) {
        if (key === 'videoFile' && val) {
          const files = Array.isArray(val) ? val : (val instanceof FileList ? Array.from(val) : [val]);

          files.forEach(file => {
            if (file instanceof File || file instanceof Blob) {
              tusVideoFiles.push({ file, targetObj: obj });
              obj.orgnlFileNm = file.name.replace(/\.[^/.]+$/, '');
              obj.fileSz = file.size;

              const extension = file.name.split('.').pop()?.toLowerCase() || '';
              obj.fileExtn = extension;
            } else {
              console.warn('⚠️ 무시된 videoFile 객체 (File 아님):', file);
            }
          });
        } else {
          obj[key] = val;
        }

        isManual = true;

      } else if (instlField.value.includes(key)) {
        if (key === 'instlFile' && val?.length > 0) {
          val.forEach(file => {
            const fileId = generateUUID();
            formData.append(fileId, file);
            obj['fileId'] = fileId;
            obj[key] = file.name;
          });
        } else {
          obj[key] = val;
        }
        isInstall = true;

      } else if (faqField.value.includes(key)) {
        obj[key] = val;
        isFaq = true;
      } else {
        params[key] = val;
      }
    });

    if (isManual) {
      mnulVo.push(obj); // ✅ 먼저 넣어야 참조 유지됨

    }
    if (isInstall) installVo.push(obj);
    if (isFaq) faqVo.push(obj);
  });

  return { mnulVo, installVo, faqVo, params, tusVideoFiles, formData };
}


const uploadTusFilesToTargets = async (tusVideoFiles) => {
  const uploadResults = await Promise.all(
    tusVideoFiles.map(({ file }) => uploadTusFiles([file]))
  );

  // ✅ 결과를 직접 새 객체로 리턴
  return tusVideoFiles.map(({ targetObj }, i) => {
    const url = uploadResults[i][0];
    return {
      ...targetObj,
      videoFileUrl: [url], // or 여러 개면 uploadResults[i]
    };
  });
};

const buildFormData = (sendData, formData) => {
  for (const key in sendData) {
    const value = sendData[key];
    if (key === 'files' || key === 'dtlImg' || key === 'thumbnail') {
      if (value) {
        for (let i = 0; i < value.length; i++) {
          formData.append(key, value[i]);
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  }
  return formData;
}

const submitForm = async (formData) => {
  const isValid = await formStore.fnSubmit();
  if (!isValid) return;


  if (type.value === 'create') {
    store.API_SAVE_FILE('/equip', formData).then(() => {
      router.push({ name: 'asset.mng' });
      formStore.fieldArr = [];
    }).catch(({ message }) => {
      console.error(message);
    });
  } else {
    router.push({ name: 'asset.mng.dtl', params: { eqpmntId: eqpmntId.value } });
  }
}

const fnClickSave = (event) => {
  requireConfirm(
    event.currentTarget,  
    () => fnSave(),
    i18n.global.t('10786'),
    type.value
  );
};

const fnSave = async () => {
  const { mnulVo, installVo, faqVo, params, tusVideoFiles, formData } = buildVoLists();
  const updatedMnulVo = await uploadTusFilesToTargets(tusVideoFiles);

  const sendData = {
    ...params,
    mnulVoList: updatedMnulVo,
    installVoList: installVo,
    faqVoList: faqVo
  };

  const fullFormData = buildFormData(sendData, formData);
  // ✅ 최종 전송되는 FormData 확인
  console.log('📦 Final FormData keys:', [...fullFormData.keys()]);
  console.log('📦 mnulVoList JSON:', fullFormData.get('mnulVoList'));
  await submitForm(fullFormData);
};



const fnDetail = () => {
  formStore.fieldArr = []
  let params = {
    eqpmntId: eqpmntId.value
  }
  store.API_LIST('equip/detail', params).then((data) => {
    equipDetailVo.value = data.data.data.equipDetailVo
    mnulList.value = data.data.data.mnulList
    installList.value = data.data.data.installList
    faqList.value = data.data.data.faqList
    
  }).catch(({ message }) => {
    console.log(message)
  })
}

const fnClickDel = (event) => {
  requireConfirm(
    event.currentTarget,  
    () => fnDelete(),
    i18n.global.t('10786'),
    'delete'
  );
}

const fnDelete = () => {
  const deleteItems = []
  deleteItems.push(eqpmntId.value)

  store.API_DELETE('equip', deleteItems).then((data) => {
    router.push(({ name: 'asset.mng' }))
  }).catch(({ message }) => {
    console.log(message)
  })
}


onMounted(() => {
  if (type.value === 'update') {
    fnDetail();
  }
})

</script>

<template>
  <div class="content_inner">
    <TitleComp />
    <!-- 본문 영역 -->
    <div class="content_section">
      <nav class="tab_menu type2 mb_6">
        <ul class="tab_list">
          <li :class="{ on: tab == 'productInf' }" @click="tab = 'productInf'"><a href="javascript:void(0)">{{
            t('10732') }}</a></li>
          <li :class="{ on: tab == 'manual' }" @click="tab = 'manual'"><a href="javascript:void(0)">{{
            t('10733') }}</a></li>
          <li :class="{ on: tab == 'installInf' }" @click="tab = 'installInf'"><a href="javascript:void(0)">{{
            t('10734') }}</a></li>
          <li :class="{ on: tab == 'faq' }" @click="tab = 'faq'"><a href="javascript:void(0)">{{ 'FAQ' }}</a>
          </li>
        </ul>
      </nav>
      <EqpmntCreateTab :show="tab === 'productInf'" :detailDatas="equipDetailVo" :type="type" />
      <VideoMnlCreateTab :show="tab === 'manual'" :detailDatas="mnulList" :type="type" />
      <InstlCreateTab :show="tab === 'installInf'" :detailDatas="installList" :type="type" />
      <FaqCreateTab :show="tab === 'faq'" :detailDatas="faqList" :type="type" />
    </div>
    <div class="btn_group_fixed">
      <button type="submit" class="v_btn btn_primary btn_md" @click="fnClickSave">{{ t('10743') }}</button><!-- 저장 -->
      <button type="button" class="v_btn btn_outline_secondary btn_md" v-if="type === 'update'" @click="fnClickDel">{{
        t('10745') }}</button><!-- 삭제 -->
      <button type="button" class="v_btn btn_outline_primary btn_md"
        @click="router.push({ name: 'asset.mng' }); formStore.fieldArr = [];">{{ t('10750') }}</button>
      <!-- 목록 -->
    </div>
  </div>

</template>

<style scoped></style>