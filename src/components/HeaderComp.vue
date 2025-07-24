<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from 'vue-router'
import axios from '@/axios';
import VueCookies from 'vue-cookies';
import { useStore } from "@/store";
import Menubar from 'primevue/menubar';
import { jwtDecode } from "jwt-decode";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter();
const searchItem = ref('')
const store = useStore();
const lang = localStorage.getItem("languageType");
const userInfo = store.loginInfo;

const ccofItems = computed(() => {
  const orgDeptCd = userInfo.orgDeptCd || userInfo.deptCd;
  const orgDeptNm = userInfo.orgDeptNm || userInfo.deptNmKg;
  const orgUprDeptCd = userInfo.orgUprDeptCd || userInfo.uprDeptCd;
  const ret = [{
    label: 'root',
    items: [{deptCd: orgDeptCd, deptNm: orgDeptNm, uprDeptCd: orgUprDeptCd}, ...store.ccofList],
  }];
  return ret;
})

const fnLogout = async () => {
  try {
    // VueCookies.remove('jwtToken');
    // store.loginInfo = null;
    //store.reset();

    
    const formData = new FormData();
    axios.post('/logout', formData, {
      // headers: {
      //   'Authorization': `Bearer ${store.getters.token}`,
      //   'Content-Type': 'application/x-www-form-urlencoded'
      // }

    }).then(response => {
      store.reset();
      // store.dispatch('updateUser', {userId: null, token: null, loginInfo: null});

      router.push('/');
    }).catch(error => {
      store.reset();
      //console.error('Error :', error);

      router.push('/');
    });
  } catch (e) {
    //console.error(e instanceof Error ? e.message : e);

  }
};

const fnSearch = () => {
  if(searchItem.value.length <= 1) {
    alert(t('10644'))
    return;
  }
  router.push({
        path: '/main/billMng/billSearch/billSearchEngineList',
        query: { key: searchItem.value }
    })
}


const fnMyPage = () => {
  router.push('/myPage/myInfo');
}


const fnChangeLanguage = (languageType) => {
  localStorage.setItem("languageType", languageType);
  router.go(0); // Forced refresh

}

const fnChangeDept = (deptCd, deptNm, uprDeptCd) => {
  if(deptCd === undefined) {
    return;
  }
  if(deptCd == userInfo.deptCd) {
    return;
  }
  const params = {deptCd};
  store.API_SAVE('/changedept', params).then(data => {
    const token = data.data?.token;
    if(token) {
      store.jwtToken = token;

      if(store.loginInfo.orgDeptCd === undefined) {
        store.loginInfo.orgDeptCd = store.loginInfo.deptCd;
        store.loginInfo.orgDeptNm = store.loginInfo.deptNmKg;
        store.loginInfo.orgUprDeptCd = store.loginInfo.uprDeptCd;
      }

      store.loginInfo.deptCd = deptCd;
      store.loginInfo.deptNmKg = deptNm;
      store.loginInfo.deptNmKo = deptNm;
      store.loginInfo.deptNmRu = deptNm;
      store.loginInfo.uprDeptCd = uprDeptCd;
    }

    router.go(0); // Forced refresh

  })
}

const fnExtendLogin = () => {
  store.API_SAVE('/token').then(data => {
    const token = data.data?.token;
    if(token) {
      store.jwtToken = token;
    }

    router.go(0); // Forced refresh

  })
}

const currentTimestamp = ref(Math.floor(Date.now() / 1000)); // Current time (super unit time stamp)

const tokenExpiration = ref();

const tokenRemaining = computed(() => {
  if(!store.jwtToken) {
    return '';
  }
  const decodedToken = jwtDecode(store.jwtToken);
  // Together to expire token (expiration time is in the 'EXP' field)

  tokenExpiration.value = decodedToken.exp;
  const diff = tokenExpiration.value - currentTimestamp.value;
  if(diff < 0) {
    return '';
  }
  const m = Math.floor(diff / 60);
  const s = diff % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return `${mm}:${ss}`;
})


/* Early screen by department */
const fnLoginInitPath = () => {

  const userDeptCd = store.loginInfo.deptCd;

  // Early screen by department

  if( userDeptCd.includes("GD")) {
      router.push('/main/billMng/gdMng/billMngRc');//Agenda

  } else if( userDeptCd.includes("LGRV")) {
      router.push('/main/billMng/lgReviewMng/billMng');//Legal review

  } else if( userDeptCd.includes("CMT")) {
      router.push('/main/mtng/cmtMtng');//committee

  } else if( userDeptCd.includes("LGGSPLZ")) {
      router.push('/main/billMng/langReviewMng/billMng');//Speech

  } else if( userDeptCd.includes("LGEXNTN")) {
      router.push('/main/billMng/lgExntnMng/billMng');//Legal review

  } else if( userDeptCd.includes("LGACT")) {
      router.push('/main/billMng/legalActMng/billMng');//Verification of the plenary session of legal action

  } else if( userDeptCd.includes("PLHALL")) {
      router.push('/main/mtng/mainMtng1');//Lahima's plenary session

  } else {
      router.push('/main');
  }

}


watch(() => currentTimestamp.value, () => {
  if(currentTimestamp.value && tokenExpiration.value && currentTimestamp.value > tokenExpiration.value) {
    tokenExpiration.value = null;
    alert(t('10451'));
    fnLogout(); 
  }
})

onMounted(() => {
    store.getProfileImg();
    setInterval(() => {
      currentTimestamp.value = Math.floor(Date.now() / 1000); // Current time (super unit time stamp)

    }, 1000);
})
</script>

<template>
  <header id="v_header">
    <div class="v_inner">
      <h1 id="v_logo">
        <a href="javascript:void(0)" @click="fnLoginInitPath()">
          <img src="@/assets/images/common/logo.png" alt="">
          <span class="text">Мыйзам документтерин <br> башкаруу системасы</span>
        </a>
      </h1>
      <div class="search_form">
        
        <input type="text" class="form_control" placeholder="Search" v-model="searchItem" @keydown.enter="fnSearch">

        <button @click="fnSearch" type="button" class="btn_search"><i class="v_ico ico_search"></i></button>
      </div>
      <div class="util_group">
        <div class="util_item util_user" style="margin-right: 0.2rem; cursor: pointer;">
          <div class="picture_wrap">
          <div class="picture_box" style="width: 4rem; height: 4rem;">
          <span class="user_pic" style="display: flex; align-items: center; justify-content: center;">
            <img :src="store.profileImgUrl" :alt="t('10646')" :title="t('10646')" @click="$router.push('/myPage/myInfo')" v-if="store.profileImgUrl">
            <!-- <img style="background-color: lightgray; padding: 5rem;" @click="$router.push('/myPage/myInfo')" v-else> -->
            <i class="pi pi-user" style="font-size: 1.5rem;" @click="$router.push('/myPage/myInfo')" v-else></i>
          </span>
          </div>
          </div>
        </div>
        <Menubar :model="ccofItems" style="border: none; padding: 0;">
          <template #item="{ item, props, hasSubmenu, root }">
            <a v-bind="props.action" @click="fnChangeDept(item.deptCd, item.deptNm, item.uprDeptCd)">
              <div class="util_item util_user" v-if="root">
                <span class="user_name" :title="t('10646')">{{ userInfo.userNmKg }}({{ userInfo.userId }})[{{ userInfo.deptNm }}]</span>
                <i class="pi pi-angle-down"></i>
              </div>
              <span v-else style="width: 100%;">
                {{item.deptNm}}
              </span>
            </a>
          </template>
        </Menubar>
        <div class="util_item util_lang">
          <button type="button" class="v_btn" :class="{ active: lang === 'lng_type_1' }" @click="fnChangeLanguage('lng_type_1')">KblP</button>
          <button type="button" class="v_btn" :class="{ active: lang === 'lng_type_2' }" @click="fnChangeLanguage('lng_type_2')">PYC</button>
          <button type="button" class="v_btn" :class="{ active: lang === 'lng_type_3' }" @click="fnChangeLanguage('lng_type_3')">Ko</button>
        </div>
        <div class="util_item util_ctrl">
          <button type="button" class="v_btn active"><i class="v_ico ico_alarm" @click="$router.push('/myPage/msg')"></i></button>
          <button type="button" class="v_btn" @click="fnLogout()"><i class="v_ico ico_logout"></i></button>
        </div>
      </div>
    </div>
  </header>
</template>

<style>
</style>
