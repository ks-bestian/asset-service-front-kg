<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from '@/store';
import { useRoute } from 'vue-router';
import dayjs from "dayjs";
import TitleComp from '@/components/TitleComp.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore();
const route = useRoute();
const detail = ref({});


const fnGetData = () => {
    let params = {lang : localStorage.getItem('languageType')};
    const apiUrl = `/admin/board/detail/${route.query.id}`;

    store.API_LIST(apiUrl, params).then((data) => {
        detail.value = data.data.data;
    }).catch(({ message }) => {
        console.log("message : ", message);
    })
}


onMounted(() => {
    fnGetData();
})
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
                            <th scope="row">{{ t('10049') }}</th><!--title-->
                            <td>
                                {{ detail.brdSj }}
                            </td>
                            <th scope="row">{{ t('10350') }}</th><!--Views-->
                            <td>
                                {{ detail.notiInqCnt }}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">{{ t('10256') }}</th><!--detail-->
                            <td colspan="3" style="line-height: 1.5;">
                                {{ detail.brdCn }}
                            </td>
                        </tr>
                        <tr>
                            <th>{{ t('10625') }}</th>
                            <td colspan="3">{{ detail.deptNm }}</td>
                        </tr>
                        <tr>
                            <th scope="row">{{ t('10099') }}</th><!--registrant-->
                            <td>{{ detail.regNm }}</td>
                            <th scope="row">{{ t('10100') }}</th><!--Registration date-->
                            <td>{{ dayjs(detail.regDt).isValid() ? dayjs(detail.regDt).format('DD/MM/YYYY') : '' }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="btn_group_fixed">
            <a href="javascript:void(0)" class="v_btn btn_outline_primary btn_md" @click="$router.push('/notice/faq')">{{ t('10084') }}</a><!--inventory-->
        </div>
        <!-- // Main area -->
    </div>

</template>

<style></style>