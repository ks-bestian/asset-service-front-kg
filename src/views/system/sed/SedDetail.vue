<script setup>
import { ref, onMounted, computed } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ConfirmModal from '@/components/modal/confirmModal.vue';
import { useI18n } from "vue-i18n";

const {t} = useI18n();
const agreeYn = ref(null);
const confirmDialog = ref(null);

const handleConfirm = (msg) => {
    return confirmDialog.value.showConfirmDialog({
        message: msg,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptMessage: 'Operation Successful',
        rejectMessage: 'Operation Cancelled',
        onAccept: () => console.log('Operation proceed'),
        onReject: () => console.log('Operation rejected')
    });
};

const currentTable = ref('TB_dockum');
const selectTable = (val) => {
    currentTable.value = val;
};

const fnSearch = () => {

}

const fnSave = () => {
    handleConfirm(t('10443'));
}

onMounted(() => {
    fnSearch();
});
</script>

<template>
    <div class="content_inner">
        <div class="content_util">
            <div class="title_wrap">
                <h2 class="content_tit">SED маалыматтары</h2>
                <button type="button" class="v_btn btn_favorite"><i class="v_ico ico_bookmark"></i></button>
            </div>
            <nav class="v_breadcrumb">
                <ul class="path">
                    <li><i class="v_ico ico_home"></i></li>
                    <li>{{ t('10031') }}</li>
                    <li>SED</li>
                </ul>
            </nav>
        </div>
        <div class="content_section">
            <div class="overlap_wrap">
                <nav class="tab_menu type2">
                    <ul class="tab_list">
                        <li class="on"><a href="javascript:void(0)" @click="selectTable('TB_dockum')">TB_dokum</a></li>
                        <li><a href="javascript:void(0)" @click="selectTable('TB_attachblob')">TB_attachblob</a></li>
                        <li><a href="javascript:void(0)" @click="selectTable('TB_isp')">TB_isp</a></li>
                    </ul>
                </nav>
            </div>
            <div class="board_info" style="margin-top: 2rem;">
                <div class="right">
                    <div class="btn_wrap">
                        <a href="javascript:void(0)" class="v_btn btn_primary btn_md" @click="fnSave(currentTable)">Маалыматты өткөрүп берүү</a>
                    </div>
                </div>
            </div>
            <div class="v_table">
                <table>
                    <colgroup>
                        <col style="width: 16.3%;">
                        <col>
                        <col style="width: 16.3%;">
                        <col style="width: 33.7%;">
                    </colgroup>
                    <tbody v-if="currentTable == 'TB_dockum'">
                        <tr>
                            <th scope="row">id</th>
                            <td>10</td>
                            <th scope="row">doc_nom</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th scope="row">doc_dat</th>
                            <td></td>
                            <th scope="row">vh_nom</th>
                            <td>18687</td>
                        </tr>
                        <tr>
                            <th scope="row">vh_dat</th>
                            <td>2012-07-16 00:00:00.000</td>
                            <th scope="row">vh_nom_upr</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th scope="row">vh_dat_upr</th>
                            <td></td>
                            <th scope="row">ish_nom</th>
                            <td>13-535/15</td>
                        </tr>
                        <tr>
                            <th scope="row">ish_dat</th>
                            <td>2012-07-16 00:00:00.000</td>
                            <th scope="row">ish_organ</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th scope="row">ish_sp_organ</th>
                            <td>3</td>
                            <th scope="row">ish_sp_podraz</th>
                            <td>6</td>
                        </tr>
                        <tr>
                            <th scope="row">sp_podraz</th>
                            <td>6</td>
                            <th scope="row">soderjanie</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th scope="row">sp_viddoc</th>
                            <td></td>
                            <th scope="row">sp_tipdoc</th>
                            <td>1</td>
                        </tr>
                        <tr>
                            <th scope="row">dat_isp</th>
                            <td></td>
                            <th scope="row">dat_fakt</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th scope="row">sp_region</th>
                            <td></td>
                            <th scope="row">adres</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th scope="row">tel</th>
                            <td></td>
                            <th scope="row">sp_vidvopr</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th scope="row">sp_seclevel</th>
                            <td></td>
                            <th scope="row">spSotr</th>
                            <td>323</td>
                        </tr>
                        <tr>
                            <th scope="row">adresat</th>
                            <td>ЖК КР</td>
                            <th scope="row">svyazNom</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th scope="row">kollist</th>
                            <td>1</td>
                            <th scope="row">zpNameKyr</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th scope="row">zpNameRus</th>
                            <td></td>
                            <th scope="row">zpInitiatorID</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th scope="row">zpInitiatorInfoKyr</th>
                            <td></td>
                            <th scope="row">zpInitiatorInfoRus</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th scope="row">zplsPublished</th>
                            <td></td>
                            <th scope="row">zpRepresentativeKyr</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th scope="row">zpRepresentativeRus</th>
                            <td></td>
                            <th scope="row">resol</th>
                            <td>резолюция руководителя</td>
                        </tr>
                        <tr>
                            <th scope="row">ust</th>
                            <td></td>
                            <th scope="row">usrrec</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th scope="row">datrec</th>
                            <td>2024-04-29 12:57:49.560</td>
                            <th scope="row">spZakr</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th scope="row">id_drafts</th>
                            <td></td>
                            <th scope="row">zpLastPassingID</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th scope="row">iscontrol</th>
                            <td>0</td>
                            <th scope="row">pozitive</th>
                            <td></td>
                        </tr>
                    </tbody>
                    <tbody v-if="currentTable == 'TB_attachblob'">
                        <tr>
                            <th scope="row">id</th>
                            <td>10</td>
                            <th scope="row">sp_docum</th>
                            <td>10</td>
                        </tr>
                        <tr>
                            <th scope="row">sp_attachdoc</th>
                            <td></td>
                            <th scope="row">file_kg</th>
                            <td>
                                <ul class="file_list">
                                    <li>
                                        <span>Мыйзам долбоору расмий тилде</span>
                                        <div class="file_wrap">
                                            <a href="javascript:void(0)" class="v_btn"><img src="@/assets/images/common/ico_file_word.png" alt=""></a>
                                        </div>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">file_ru</th>
                            <td>
                                <ul class="file_list">
                                    <li>
                                        <span>Законопроект на официальном языке</span>
                                        <div class="file_wrap">
                                            <a href="javascript:void(0)" class="v_btn"><img src="@/assets/images/common/ico_file_word.png" alt=""></a>
                                        </div>
                                    </li>
                                </ul>
                            </td>
                            <th scope="row">versia</th>
                            <td>1</td>
                        </tr>
                        <tr>
                            <th scope="row">FileNameKG</th>
                            <td>Мыйзам долбоору расмий тилде</td>
                            <th scope="row">ExtentionKG</th>
                            <td>docx</td>
                        </tr>
                        <tr>
                            <th scope="row">FileNameRU</th>
                            <td>Законопроект на официальном языке</td>
                            <th scope="row">ExtentionRU</th>
                            <td>docx</td>
                        </tr>
                        <tr>
                            <th scope="row">pr</th>
                            <td></td>
                            <th scope="row">hash_kg</th>
                            <td>uZ1/XdWbhPY2WmmPwbQaIQ==</td>
                        </tr>
                        <tr>
                            <th scope="row">hash_ru</th>
                            <td colspan="3">W+aFZ6ykc3Ad4vgyacJEwg==</td>
                        </tr>
                    </tbody>
                    <tbody v-if="currentTable == 'TB_isp'">
                        <tr>
                            <th scope="row">id</th>
                            <td>1</td>
                            <th scope="row">ord</th>
                            <td>0</td>
                        </tr>
                        <tr>
                            <th scope="row">spDocum</th>
                            <td>3</td>
                            <th scope="row">spParent</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th scope="row">spAuthorPodraz</th>
                            <td>12</td>
                            <th scope="row">spAuthor</th>
                            <td>33</td>
                        </tr>
                        <tr>
                            <th scope="row">spPodraz</th>
                            <td>1</td>
                            <th scope="row">spSotr</th>
                            <td>24</td>
                        </tr>
                        <tr>
                            <th scope="row">spRoute</th>
                            <td>1</td>
                            <th scope="row">datBeg</th>
                            <td>2012-07-11 15:01:25.970</td>
                        </tr>
                        <tr>
                            <th scope="row">datExpire</th>
                            <td></td>
                            <th scope="row">datExam</th>
                            <td>2012-07-11 15:02:39.593</td>
                        </tr>
                        <tr>
                            <th scope="row">datOtvet</th>
                            <td>2012-07-11 15:02:55.750</td>
                            <th scope="row">datEnd</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th scope="row">zamech</th>
                            <td>резолюция руководителя</td>
                            <th scope="row">otvet</th>
                            <td>Подписываю!</td>
                        </tr>
                        <tr>
                            <th scope="row">otvetstv</th>
                            <td></td>
                            <th scope="row">spKlassdoc</th>
                            <td>3</td>
                        </tr>
                        <tr>
                            <th scope="row">status</th>
                            <td>2</td>
                            <th scope="row">zpStageID</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th scope="row">zpConclusionResultID</th>
                            <td colspan="3"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <ConfirmModal ref="confirmDialog" />
</template>

<style>

</style>