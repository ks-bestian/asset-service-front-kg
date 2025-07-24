<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "@/store";
import { useConfirm } from "primevue/useconfirm";
import TitleComp from "@/components/TitleComp.vue";
import { useI18n } from 'vue-i18n'
import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { FormField } from '@primevue/forms';

const { t } = useI18n()
const confirm = useConfirm();
const store = useStore();
const lang = ref(localStorage.getItem('languageType'))
const detail = ref({})
const files = ref(null);
const imgPath = ref(null);

const fnRequire = (event) => {
    if (!fnValidate()) {
        return;
    }

    confirm.require({
        rejectProps: {
            severity: 'secondary',
            outlined: true,
            size: 'large'
        },
        acceptProps: {
            size: 'large'
        },
        target: event.currentTarget,
        message: t('10155'), //'Would you like to save?',

        accept: () => {
            fnSave2();
        },
    });
}


// Storage (including files)

const fnSave2 = () => {

    const formData = new FormData();

    formData.append("msgRcvYn", detail.value.msgRcvYn ?? "");
    formData.append("mblNo", detail.value.mblNo ?? "");
    formData.append("email", detail.value.email ?? "");
    formData.append("type", detail.value.type ?? "");
    formData.append("userId", detail.value.userId ?? "");
    formData.append("userPassword", detail.value.userPassword ?? "")

    for (var i = 0; i < files.value?.length; ++i) {
        formData.append("files", files.value[i]);
    }

    const apiUrl = `/myPage/myInfo`;

    store.API_SAVE_FILE(apiUrl, formData).then((data) => {
        // Window.location.reload();

    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}

const fnGetInfo = () => {
    let param = { lang: lang.value }
    store.API_LIST('myPage/myInfo', param).then((data) => {
        detail.value = data.data.data
    }).catch(({ message }) => {
        console.log(message)
    })
}


const fnChangeImg = (event) => { //Image change

    files.value = event.target.files; //getting files


    for (let i = 0; i < files.value.length; i++) {
        if (files.value[i].size > 1048576) {
            return;
        }
        const objectURL = URL.createObjectURL(files.value[i]);
        imgPath.value = objectURL;
    }
}

const fnClear = () => {
    files.value = null;
    imgPath.value = null;
}

const fnValidate = () => {
    const { errors } = resolver();
    return Object.keys(errors).length === 0;
}

const resolver = () => {
    const errors = {};
    const password = detail.value.userPassword;
    const pswdChk = detail.value.pswdChk;

    // verify password

    if (!password && pswdChk) {
        errors.userPassword = [{ message: t('10460') }];
    }

    if (password && !pswdChk) {
        errors.pswdChk = [{ message: t('10460') }];
    }

    if (password && pswdChk && password !== pswdChk) {
        errors.pswdChk = [{ message: t('10612') }];
    }

    // Password validation 

    const pwErrors = [];

    if (password) {
        if (password.length < 8) {
            pwErrors.push({ message: t('10621') });
        }
        if (!/[a-zA-Z]/.test(password)) {
            pwErrors.push({ message: t('10622') });
        }
        if (!/\d/.test(password)) {
            pwErrors.push({ message: t('10623') });
        }
         if (!/[!@#$%^&*]/.test(password)) {
            pwErrors.push({ message: t('10624') });
        }

        if (pwErrors.length > 0) {
            errors.userPassword = pwErrors;
        }
    }

    return { errors };
};


onMounted(() => {
    imgPath.value = store.profileImgUrl;
    fnGetInfo();
})
</script>

<template>
    <div class="content_inner">
        <TitleComp />
        <!-- Main area -->
        <Form v-slot="$form" :resolver="resolver">

            <div class="content_section">
                <div class="v_table">
                    <table>
                        <colgroup>
                            <col style="width: 13%;">
                            <col>
                            <col style="width: 13%;">
                            <col style="width: 37%;">
                        </colgroup>
                        <tbody>
                            <tr>
                                <th scope="row">ID</th>
                                <td colspan="3">{{ detail.userId }}</td>
                            </tr>
                            <!-- <tr>
                            <th scope="row">{{ t('10095') }} <span class="text_red">*</span></th>
                            <td colspan="3">
                                <div class="sign_wrap">
                                    <div class="sign_box">
                                        <img src="@/assets/images/content/img_sign.png" alt="">
                                    </div>
                                    <div class="btn_group">
                                        <button type="button" class="v_btn btn_outline_secondary btn_xs">{{ t('10157') }}</button>
                                    </div>
                                </div>
                            </td>
                        </tr> -->
                            <tr>
                                <th scope="row">{{ t('10327') }}</th><!--Name (Kyrgyz)-->
                                <td>{{ detail.userNmKg }}</td>
                                <th scope="row">{{ t('10326') }}</th><!--Name (Russian)-->
                                <td>{{ detail.userNmKg }}</td>
                            </tr>
                            <tr>
                                <th scope="row">{{ t('10328') }}</th><!--Division name or party name-->
                                <td colspan="3" v-if="detail.deptNm != null">{{ detail.deptNm }}</td>
                                <td colspan="3" v-else>{{ detail.polyNm }}</td>
                            </tr>
                            <tr>
                                <th scope="row">{{ t('10329') }}</th><!--Profile image-->
                                <td colspan="3">
                                    <div class="picture_wrap">
                                        <div class="picture_box">
                                            <span class="user_pic">
                                                <img :src="imgPath" alt="img" title="img" v-if="imgPath"
                                                    style="width: 10rem; height: 10rem;">
                                                <i class="pi pi-user" v-else style="font-size: 3rem;"></i>
                                            </span>
                                        </div>
                                        <div class="btn_group">
                                            <div class="file_attatch">
                                                <div class="form_col type4">
                                                    <div class="input_item">
                                                        <div class="input_group">
                                                            <!-- Label for and input ID matching required -->
                                                            <input type="file" class="form_file" id="imgPath"
                                                                name="imgPath" @change="fnChangeImg">
                                                            <span class="input_addon">
                                                                <label class="v_btn btn_outline_secondary btn_sm"
                                                                    for="imgPath"><i class="v_ico ico_camera"></i>{{ t('10157') }}</label><!--correction-->
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <button type="button" class="v_btn btn_outline_neutral btn_sm"
                                                @click="fnClear">Clear</button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">email</th>
                                <td colspan="3"><a class="v_link"><input type="text" class="form_control"
                                            v-model="detail.email" maxlength="90"></a>
                                </td>
                            </tr>
                            <tr v-if="detail.type === 'member'">
                                <th scope="row">{{ t('10360') }}</th><!--Cell phone-->
                                <td colspan="3"><input type="text" class="form_control" v-model="detail.mblNo"></td>
                            </tr>
                            <tr>
                            </tr>
                            <tr>
                                <th scope="row">{{ t('10332') }}</th><!--Notification reception-->
                                <td colspan="3">
                                    <div class="check_area">
                                        <span class="check_item">
                                            <input type="radio" name="inputRadio1" id="inputRadio1_1"
                                                v-model="detail.msgRcvYn" value="Y">
                                            <label for="inputRadio1_1">{{ t('10266') }}</label><!--reception-->
                                        </span>
                                        <span class="check_item">
                                            <input type="radio" name="inputRadio1" id="inputRadio1_2"
                                                v-model="detail.msgRcvYn" value="N">
                                            <label for="inputRadio1_2">{{ t('10333') }}</label><!--Unconvollment-->
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">{{ t('10616') }}<span class="text_red">*</span></th><!--Password change-->
                                <td>
                                    <FormField v-slot="$field" name="userPassword" initialValue=""
                                        style="flex-grow: 1;">
                                        <InputText type="password" v-model="detail.userPassword" class="form_control"
                                            maxlength="70" size="large"></InputText>

                                        <div v-if="$field?.invalid">
                                            <Message v-for="(err, i) in $field.errors" :key="i" severity="error" size="large" variant="simple">
                                                {{ err.message }}
                                            </Message>
                                        </div>
                                        <!-- <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">
                                            {{ $field.error?.message }}</Message> -->
                                    </FormField>
                                </td>
                                <th>{{ t('10614') }}<span class="text_red">*</span></th><!--verify password-->
                                <td>
                                    <FormField v-slot="$field" name="pswdChk" initialValue="" style="flex-grow: 1;">
                                        <InputText type="password" v-model="detail.pswdChk" class="form_control"
                                            size="large" maxlength="70"></InputText>
                                        <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">
                                            {{ $field.error?.message }}</Message>
                                    </FormField>


                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="btn_group_fixed">
                <button type="submit" class="v_btn btn_primary btn_md" @click="fnRequire">{{ t('10000') }}</button>
            </div>
        </Form>
        <!-- // Main area -->
    </div>
</template>

<style></style>