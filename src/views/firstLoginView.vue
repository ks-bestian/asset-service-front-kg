<script setup>
import { ref } from "vue";
import { useStore } from "@/store";
import ProgressSpinner from 'primevue/progressspinner';
import BlockUI from 'primevue/blockui';
import { FormField } from "@primevue/forms";
import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import { useI18n } from 'vue-i18n'
import Message from 'primevue/message';


const { t } = useI18n()
const store = useStore();
const userId = ref('')
const pswd = ref('')
const passwordChk = ref('')

const fnRequire = () => {
    if (!fnValidate()) {
        return;
    }
    fnUpdatePswd();
}

const fnUpdatePswd = () => {

    let params = {
        userId: userId.value,
        userPassword: pswd.value
    }
    store.API_UPDATE('login/update', params).then((data) => {
        alert(t('10627'))
        userId.value = '';
        pswd.value = '';
        passwordChk.value = '';
    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnValidate = () => {
    const { errors } = resolver();
    return Object.keys(errors).length === 0;
}

const resolver = () => {
    const errors = {};
    const password = pswd.value;
    const pswdChk = passwordChk.value;

    // verify password

    if (!password) {
        errors.pswd = [{ message: t('10460') }];
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
            errors.pswd = pwErrors;
        }
    }

    return { errors };
};

</script>

<template>

    <body class="login_wrap">
        <Form v-slot="$form" :resolver="resolver">
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
                        <FormField v-slot="$field" name="pswd" initialValue="" style="width: 100%;">
                            <InputText type="password" v-model="pswd" class="form_control" style="width: 100%;">
                            </InputText>
                            <div v-if="$field?.invalid">
                                <Message v-for="(err, i) in $field.errors" :key="i" severity="error" size="large"
                                    variant="simple">
                                    {{ err.message }}
                                </Message>
                            </div>
                        </FormField>
                    </div>

                    <div class="input_item">
                        <label for="pswdChk" class="form_label">Password Ырастоо</label>

                        <FormField v-slot="$field" name="pswdChk" initialValue="" style="width: 100%;">
                            <InputText type="password" v-model="passwordChk" class="form_control" style="width: 100%;">
                            </InputText>
                            <Message v-if="$field?.invalid" severity="error" variant="simple" size="large">{{
                                $field.error?.message }}</Message>
                        </FormField>
                    </div>

                    <button type="submit" class="v_btn btn_primary btn_lg btn_block btn_login"
                        @click="fnRequire">{{ t('10089') }}</button>
                </div>

            </div>
            <BlockUI v-if="store.isLoading" :blocked="true" :fullScreen="false"></BlockUI>
            <div class="overlay" v-if="store.isLoading">
                <ProgressSpinner />
            </div>
        </Form>
    </body>
</template>

<style>
.overlay {
    position: fixed !important;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
    z-index: 100000;
    display: flex;
    align-items: center;
}
</style>
