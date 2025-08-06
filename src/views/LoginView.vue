<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from 'vue-router'
import axios from "@/axios";
import VueCookies from 'vue-cookies';
import { useStore } from "@/store";
import { isEmpty } from 'lodash';
import ProgressSpinner from 'primevue/progressspinner';
import BlockUI from 'primevue/blockui';

const router = useRouter();
const userId = ref("XK4544");
const pswd = ref("best1234");
const rememberId = ref(false);
const store = useStore();
const lang = isEmpty(localStorage.getItem("languageType")) ? 'lng_type_1':localStorage.getItem("languageType");

const fnLogin = () => {

    const formData = new FormData();
    formData.append("userId", userId.value);
    formData.append("pswd", pswd.value);
    formData.append("lang", lang);

    store.showProgressSpinner();
    axios.post('/login', formData, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        store.hideProgressSpinner();
        console.log(response.data);

        store.loginInfo = response.data.loginInfo;
        // VueCookies.set('jwtToken', response.data.token, { path: '/', secure: true, httpOnly: true });


        store.jwtToken = response.data.token;
        store.comCodes = response.data.comCodes;

        //Base codes

        const data = response.data.baseCodes || []; // Default setting


        const ageList = Array.isArray(data) ? [...data] : []; // Array confirmation and initialization

        const ageObj = {};

        ageList.forEach((item) => {
            if (item.currYn === 'Y') {
                ageObj.naTermCd = item.codeId;
                ageObj.naTermNm = item.codeNm;
            }
        });

        store.ageList = ageList; // Cover the entire list

        store.ageObj = ageObj;
        store.ccofList = response.data.ccofList;

        if (response.data.token != null) {
            fnLoginInitPath();
        }

        fnBzentyList()
    }).catch(error => {
        store.hideProgressSpinner();
        if (error.response?.data?.msg == 'LOGIN_FAIL') {
            alert("ID же сырсөз туура эмес.");

        } else if (error.response?.data?.msg == 'AUTH_FAIL') {
            alert("ID же сырсөз туура эмес.");
        }
    });
}

const fnBzentyList = () => {
    let param = {
    }
    store.API_LIST('/asset/bzenty', param).then((data) => {
        store.bzentyList = data.data.data;

    }).catch(({ message }) => {
        console.log(message)
    })
}

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
        router.push('/main/asset/mng');
    }

}

const handleCheckboxChange = () => {
    if (rememberId.value) {
        VueCookies.set("idChk", userId.value, '365d');
    } else {
        VueCookies.remove("idChk");
    }
}

watch(userId, (newUsername) => {
    if (rememberId.value) {
        VueCookies.set("idChk", newUsername, '365d');
    }
})

onMounted(() => {
    // When the page is loaded, the user name is loaded and filled in the cookie.

    const savedUsername = VueCookies.get("idChk");
    if (savedUsername) {
        userId.value = savedUsername;
        rememberId.value = true;
    }

    if (userId.value.trim() === '') {
        document.getElementById('userId').focus();
    }

    if(isEmpty(localStorage.getItem("languageType"))) {
      localStorage.setItem("languageType",'lng_type_3');
    }
});

const onchange = (e) => {
    const id = e.target.value;
    const password = 'best1234';
    if(!id) {
        return;
    }
    userId.value = id;
    pswd.value = password;
    fnLogin();
}

</script>

<template>
    <body class="login_wrap">
        <div class="login_inner">
            <h1 id="v_logo">
                <img src="@/assets/images/common/logo.png" alt="">
                <span class="text">Мыйзам документтерин <br> башкаруу системасы</span>
            </h1>
            <div class="login_form">
                <div class="input_item">
                    <label for="userId" class="form_label">Id</label>
                    <input type="text" id="userId" v-model="userId" class="form_control">
                </div>
                <div class="input_item">
                    <label for="pswd" class="form_label">Password</label>
                    <input type="password" id="pswd" v-model="pswd" class="form_control">
                </div>

                <div class="check_item">
                    <input type="checkbox" id="inputCheck" v-model="rememberId" @change="handleCheckboxChange">
                    <label for="inputCheck">Идентификаторду сактоо</label>
                </div>
                
                <button type="button" class="v_btn btn_primary btn_lg btn_block btn_login" @click="fnLogin()">Sign In</button>
                
            </div>

            <div class="input_item">
                <label for="" class="form_label"></label>
                <select class="form_control" @change="onchange">
                    <option value="" hidden>TEST ID</option>
                    <option value="XK4544">XK4544 (Жогорку Кеңештин депутаты)</option>
                    <option value="QM9264">QM9264 (Жогорку Кеңештин депутаты)</option>
                    <option value="gduser1">gduser1 (GD)</option>
                    <option value="LGRVuser1">LGRVuser1 (Мыйзамдарды кароо бөлүмү)</option>
                    <option value="LGGSPLZ">LGGSPLZ (Тил боюнча адис)</option>
                    <option value="lgexntnuser">lgexntnuser (Мыйзамдарды адистештирилген экспертизалоо бөлүмү)</option>
                    <option value="cmtuser1">cmtuser1 (Комитет по международным делам, обороне, безопасности и миграции)</option>
                    <option value="cmtuser2">cmtuser2 (Комитет по топливно-энергетическому комплексу, недропользованию и промышленной политике)</option>
                    <option value="rahima">rahima (Жыйындар залын башкаруу бөлүмү)</option>
                    <option value="legalactuser">legalactuser (Укуктук аракет / Укуктук иш-аракет)</option>
                    <option value="admin">admin (Система башкаруу бөлүмү)</option>
                </select>
            </div>
        </div>
        <BlockUI v-if="store.isLoading" :blocked="true" :fullScreen="false"></BlockUI>
        <div class="overlay" v-if="store.isLoading">
            <ProgressSpinner />
        </div>
    </body>
</template>

<style>

.overlay {
    position:fixed !important;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
    z-index: 100000;
	display: flex;
	align-items: center;
}

</style>
