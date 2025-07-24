<script setup>
import TitleComp from "@/components/TitleComp.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const {t} = useI18n();
const router = useRouter();
const confirmDialog = ref(null);



const fnSave = () => {
        router.push('/main/system/form')
}
</script>

<template>
    <div class="content_inner">
        <TitleComp />
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
                            <th scope="row">{{ t('10414') }}</th>
                            <td colspan="3">
                                <input type="text" class="form_control" :value="t('10002')"
                                    style="width: 100%;">
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">{{ t('10367') }}</th>
                            <td>
                                <div class="check_area">
                                    <span class="check_item">
                                        <input type="radio" name="inputRadio1" id="inputRadio1_1" checked>
                                        <label for="inputRadio1_1">Y</label>
                                    </span>
                                    <span class="check_item">
                                        <input type="radio" name="inputRadio1" id="inputRadio1_2">
                                        <label for="inputRadio1_2">N</label>
                                    </span>
                                </div>
                            </td>

                            <th scope="row">{{ t('10415') }}</th>
                            <td>
                                <select class="form_control">
                                    <option>{{ t('10224') }}</option>
                                </select>
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">{{ t('10122') }}</th>
                            <td colspan="3">
                                <div class="file_attatch">
                                    <div class="form_row">
                                        <div class="input_item">
                                            <div class="input_group">
                                                <!-- Label for and input ID matching required -->
                                                <input type="file" class="form_file" id="inputFile1_1">
                                                <input type="text" class="form_control file_name">
                                                <span class="input_addon">
                                                    <label class="v_btn btn_outline_secondary btn_sm btn_file"
                                                        for="inputFile1_1">{{ t('10122') }}</label>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">{{ t('10416') }}</th>
                            <td colspan="3">
                                <select class="form_control">
                                    <option>{{ t('10224') }}</option>
                                </select>
                                <button type="button" class="v_btn btn_outline_neutral btn_md">{{ t('10195') }}</button>
                                <div class="v_table table_list type2" style="padding-top: 15px;">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th scope="col">No</th>
                                                <th scope="col">{{ t('10417') }}</th>
                                            </tr>
                                        </thead>
                                        <colgroup>
                                            <col style="width: 5%;">
                                            <col>
                                        </colgroup>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>
                                                    <select class="form_control">
                                                        <option>$название законопроекта$</option>
                                                        <option>$Дата подачи$</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="btn_group_fixed">
            <button type="button" class="v_btn btn_outline_neutral btn_md" @click="fnSave">{{ t('10173') }}</button>
            <button type="button" class="v_btn btn_outline_neutral btn_md" @click="fnSave">{{ t('10000') }}</button>
            <a href="javascript:void(0)" class="v_btn btn_primary btn_md"
                @click="$router.push('/main/system/form')">{{ t('10084') }}</a>
        </div>
        <!-- // Main area -->
    </div>
</template>

<style></style>
