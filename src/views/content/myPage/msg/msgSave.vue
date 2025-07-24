<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter } from 'vue-router'
import { useStore } from "@/store";
import Chip from 'primevue/chip';
import msgRcvModal from "@/views/content/myPage/msg/msgRcvModal.vue";
import { useConfirm } from "primevue/useconfirm";
import TitleComp from "@/components/TitleComp.vue";
import Button from 'primevue/button';
import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import { FormField } from '@primevue/forms';
import Textarea from 'primevue/textarea';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const confirm = useConfirm();
const store = useStore();
const router = useRouter();
const data = ref({})
const files = ref([])
const dialog = ref(false);
const selectUsers = ref([])

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
        message: t('10349'), //'Would you like to transfer?',

        accept: () => {
            fnSend();
        },
    });
}

const fnSend = () => {
    const formData = new FormData();

    formData.append("msgSj", data.value.msgSj ?? "")
    formData.append("msgCn", data.value.msgCn ?? "")

    selectUsers.value.forEach((item) => {
        formData.append("rcvIds", item.userId)
    })

    if (files.value !== null) {
        for (var i = 0; i < files.value?.length; ++i) {
            formData.append("files", files.value[i]);
        }
    }

    store.API_SAVE_FILE('/myPage/msg', formData).then((data) => {
        router.push({ name: 'myPage.msg' })
    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnRcvs = (rcvs) => {
    selectUsers.value = [...rcvs]
    dialog.value = false;
}

const fnRemove = (userId) => {
    selectUsers.value = selectUsers.value.filter((item) => item.userId !== userId)
}

const fnValidate = () => {
    const { errors } = resolver();
    return Object.keys(errors).length === 0;
}

const resolver = () => {
    const errors = {};
    if (!data.value.msgSj) {
        errors.msgSj = [{ message: t('10460') }];
    }
    if (!data.value.msgCn) {
        errors.msgCn = [{ message: t('10460') }];
    }
    if(selectUsers.value.length <= 0) {
        errors.rcvIds = [{ message : t('10460')}]
    }


    return {
        errors
    };
};

onMounted(() => {
})
</script>

<template>
    <div class="content_inner">
        <TitleComp />
        <Form v-slot="$form" :resolver="resolver">

            <!-- Main area -->
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
                                <th scope="row">{{ t('10250') }}<span class="text_red">*</span></th><!--Recipient-->
                                <td colspan="3">
                                    <a href="javascript:void(0)" class="v_btn btn_secondary btn_sm"
                                        @click="dialog = true;"><i class="v_ico ico_search_white_sm"></i>{{ t('10342') }}</a><!--Recipient-->
                                    <div style="margin: 10px 0;" v-if="selectUsers.length > 0">
                                        <div
                                            style="margin-left: 10px; font-size: 15px; font-weight: bold; color: #0094D3;">
                                            <i style="font-weight: bold; font-size: 16px;"></i>{{
                                                t('10250') + "(" +
                                                selectUsers.length + ")" }}
                                        </div>
                                    </div>

                                    <div style="line-height: 1.5;">
                                        <FormField v-slot="$field" name="rcvIds" initialvalue="">
                                            <Message v-if="selectUsers.length === 0" severity="error" size="large"
                                                variant="simple">{{ $field.error?.message }}</Message>
                                        </FormField>
                                        <Chip v-for="(item) in selectUsers" :key="item.userId" :label="item.userNm"
                                            style=" margin: 5px;" removable @remove="fnRemove(item.userId)" />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">{{ t('10049') }}<span class="text_red">*</span></th><!--title-->
                                <td colspan="3">
                                    <FormField v-slot="$field" name="msgSj" initialValue="" style="flex-grow: 1;">
                                        <InputText type="text" v-model="data.msgSj" class="form_control" size="large"
                                            style="width: 100%" />
                                        <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">
                                            {{ $field.error?.message }}</Message>
                                    </FormField>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">{{ t('10256') }}<span class="text_red">*</span></th><!--detail-->
                                <td colspan="3" style="line-height: 1.5;">
                                    <FormField v-slot="$field" name="msgCn" initialValue="" style="flex-grow: 1;">
                                        <Textarea v-model="data.msgCn" class="form_control" size="large"
                                            style="width: 100%; line-height: 1.5;"></Textarea>
                                        <Message v-if="$field?.invalid" severity="error" size="large" variant="simple">
                                            {{ $field.error?.message }}</Message>
                                    </FormField>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">{{ t('10257') }}</th><!--attachment-->
                                <td colspan="3">
                                    <div class="file_attatch">
                                        <div class="input_item">
                                            <div class="input_group">
                                                <!-- Label for and input ID matching required -->
                                                <input type="file" class="form_file" id="inputFile1_1" multiple
                                                    @change="e => files = e.target.files">
                                                <input type="text" class="form_control file_name">
                                                <span class="input_addon">
                                                    <label class="v_btn btn_outline_secondary btn_sm btn_file"
                                                        for="inputFile1_1">{{ t('10160') }}</label><!--File selection-->
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="btn_group_fixed">
                <a href="javascript:void(0)" class="v_btn btn_outline_primary btn_md"
                    @click="$router.push('/myPage/msg')">{{ t('10084') }}</a><!--inventory-->
                <button type="submit" class="v_btn btn_primary btn_md" @click="fnRequire">{{ t('10348') }}</button><!--forwarding-->
            </div>
            <!-- // Main area -->
        </Form>
    </div>
    <msgRcvModal v-if="dialog" @close="dialog = false" @rcvs="fnRcvs" :dialog="dialog" :selectUsers="selectUsers" />
</template>

<style scoped>
.v_table .form_control {
    width: 100%;
}
</style>