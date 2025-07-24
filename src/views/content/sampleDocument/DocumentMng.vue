<script setup>
import { NodeService } from "@/NodeService";
// import NewFolderModal from "@/components/modal/document/NewFolderModal.vue";

import Tree from 'primevue/tree';
import { onMounted, ref } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { DocumentService } from "./DocumentService";
// import FileUploadModal from "@/components/modal/document/FileUploadModal.vue";
import { useI18n } from "vue-i18n";

const {t} = useI18n();
const nodes = ref();
const nodes2 = ref();
const selectedKey = ref(null);
const curDoc = ref('dept');
const selectedRowDept = ref([]);
const selectedRowMy = ref([]);
const selectedRowStar = ref([]);
const selectedRowTrash = ref([]);

const onNodeSelect = (node) => {
    console.log(node)
};

const deptDocuments = ref([]);
const myDocuments = ref([]);
const starredDocuments = ref([]);
const trashedDocuments = ref([]);

const viewType = ref('list');

// DocumentService.getDeptDocuments().then(data => {
//     deptDocuments.value = data;
// })


// DocumentService.getMyDocuments().then(data => {
//     myDocuments.value = data;
// })


// DocumentService.getStarredDocuments().then(data => {
//     starredDocuments.value = data;
// })


// DocumentService.getTrashedDocuments().then(data => {
//     trashedDocuments.value = data;
// })


onMounted(async () => {
    NodeService.getSampleTreeNodes().then((data) => (nodes.value = data));
});
</script>

<template>
    <div class="content_inner">
        <div class="content_util">
            <div class="title_wrap">
                <h2 class="content_tit">документ башкаруу</h2>
                <button type="button" class="v_btn btn_favorite"><i class="v_ico ico_bookmark"></i></button>
            </div>
            <nav class="v_breadcrumb">
                <ul class="path">
                    <li><i class="v_ico ico_home"></i></li>
                    <li>документ башкаруу</li>
                    <li>документ башкаруу</li>
                </ul>
            </nav>
        </div>
        <!-- Main area -->
        <div class="content_section">
            <div class="content_row file_manage_wrap">
                <div class="col_item_fit v_box bg_primary">
                    <div class="dropdown_menu">
                        <button type="button" class="v_btn btn_secondary btn_xs dropdown_btn"><i class="v_ico ico_plus_white"></i><span>NEW</span></button>
                        <div class="dropdown_cont">
                            <ul class="dropdown_list">
                                <li><button type="button" class="v_btn" onclick="openModal('#layer_new_folder', this);"><i class="v_ico ico_folder_add"></i><span>жаңы папка</span></button></li>
                                <li><button type="button" class="v_btn" onclick="openModal('#layer_folder_upload', this);"><i class="v_ico ico_folder_upload"></i><span>Папканы каттоо</span></button></li>
                                <li><button type="button" class="v_btn" onclick="openModal('#layer_file_upload', this);"><i class="v_ico ico_file_upload"></i><span>Файлды каттоо</span></button></li>
                            </ul>
                        </div>
                    </div>
                    <div class="search_form">
                        <input type="text" class="form_control" placeholder="Search">
                        <button type="button" class="btn_search"><i class="v_ico ico_search"></i></button>
                    </div>
                    <div class="document_wrap">
                        <div class="document_item">
                            <button type="button" class="v_btn" :class="{on: curDoc === 'dept'}" @click="curDoc = 'dept'"><i class="v_ico ico_document1"></i><span>бөлүмдүн документтери</span></button>
                            <div class="document_cont">
                                <Tree :value="nodes" v-model:selectionKeys="selectedKey" selectionMode="single" @node-select="onNodeSelect"></Tree>
                            </div>

                            
                        </div>
                        <div class="document_item">
                            <button type="button" class="v_btn" :class="{on: curDoc === 'my'}" @click="curDoc = 'my'"><i class="v_ico ico_document2"></i><span>менин документтерим</span></button>
                            <div class="document_cont">
                                <Tree :value="nodes" v-model:selectionKeys="selectedKey" selectionMode="single" @node-select="onNodeSelect"></Tree>
                            </div>
                        </div>
                        <!--
                        <div class="document_item">
                            <button type="button" class="v_btn" :class="{on: curDoc === 'share'}" @click="curDoc = 'share'"><i class="v_ico ico_document3"></i><span>{{ t('10304') }}</span></button>
                        </div>
                        -->
                        <div class="document_item">
                            <button type="button" class="v_btn" :class="{on: curDoc === 'star'}" @click="curDoc = 'star'"><i class="v_ico ico_document4"></i><span>маанилүү документтер</span></button>
                        </div>
                        <div class="document_item">
                            <button type="button" class="v_btn" :class="{on: curDoc === 'trash'}" @click="curDoc = 'trash'"><i class="v_ico ico_document5"></i><span>таштанды себет</span></button>
                        </div>
                    </div>
                </div>
                <div class="col_item">
                    <div class="board_sort mb_6">
                        <div class="left">
                            <div class="input_group">
                                <select class="form_control" style="width: 185px;">
                                    <option>Документтин аталышы</option>
                                    <option>каттоочу</option>
                                </select>
                                <input type="text" class="form_control">
                                <span class="input_addon">
                                    <button type="button" class="v_btn btn_primary btn_sm"><i class="v_ico ico_search_white_xs"></i><span>издөө</span></button>
                                </span>
                            </div>
                        </div>
                        <div class="right">
                            <div class="sort_wrap type1">
                                <button type="button" class="v_btn btn_sort_file"><i class="v_ico ico_star"></i></button>
                                <button type="button" class="v_btn btn_sort_file"><span>ALL</span></button>
                                <button type="button" class="v_btn btn_sort_file"><i class="v_ico ico_file_pdf_sm"></i><span>PDF</span></button>
                                <button type="button" class="v_btn btn_sort_file"><i class="v_ico ico_file_ppt_sm"></i><span>PPT</span></button>
                                <button type="button" class="v_btn btn_sort_file"><i class="v_ico ico_file_doc_sm"></i><span>DOC</span></button>
                                <button type="button" class="v_btn btn_sort_file"><i class="v_ico ico_file_xlsx_sm"></i><span>XLS</span></button>
                                <button type="button" class="v_btn btn_sort_file"><i class="v_ico ico_file_zip_sm"></i><span>ZIP</span></button>
                                <button type="button" class="v_btn btn_sort_file"><i class="v_ico ico_file_hwp_sm"></i><span>HWP</span></button>
                                <button type="button" class="v_btn btn_sort_file"><i class="v_ico ico_file_img_sm"></i><span>IMG</span></button>
                                <button type="button" class="v_btn btn_sort_file"><i class="v_ico ico_file_etc_sm"></i><span>ETC</span></button>
                            </div>
                            <div class="sort_wrap type2">
                                <button type="button" class="v_btn btn_sort_list" :class="{active: viewType == 'list'}" @click="viewType = 'list'"><i class="v_ico ico_sort_list"></i></button>
                                <button type="button" class="v_btn btn_sort_gallery" :class="{active: viewType == 'thumbnail'}" @click="viewType = 'thumbnail'"><i class="v_ico ico_sort_gallery"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="board_info type2 mb_4">
                        <div class="left">
                            <div class="total_num">Total <span class="text_primary">{{ deptDocuments.length }}</span></div>
                        </div>
                        <div class="right">
                            <div class="btn_wrap">
                                <button type="button" class="v_btn btn_outline_neutral btn_sm" onclick="openModal('#layer_delete', this);">Документти жок кылуу</button>
                                <!--
                                <button type="button" class="v_btn btn_outline_primary btn_sm" onclick="openModal('#layer_move', this);">Файлды көчүрүү</button>
                                -->
                                <button type="button" class="v_btn btn_primary btn_sm" onclick="openModal('#layer_modify', this);">Документти түзөтүү</button>
                            </div>
                        </div>
                    </div>
                    <div v-if="viewType == 'list'">
                        <div class="v_table table_list" v-if="curDoc === 'dept'">
                            <DataTable :value="deptDocuments" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem;"
                                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                                v-model:selection="selectedRowDept" dataKey="id">
                                <Column selectionMode="multiple" style="width: 4.8%" class="text_center"></Column>
                                <Column field="title" header="Файлдын аталышы" class="text_left">
                                    <template #body="{ data }">
                                        <div class="file_stat">
                                            <div class="btn_wrap">
                                                <button type="button" class="v_btn btn_mark" :class="{on: data.starYn == 'Y'}"><i :class="`v_ico ${data.folderYn == 'Y' ? 'ico_folder' : 'ico_star'}`"></i></button>
                                            </div>
                                            <span>{{data.title}}</span>
                                        </div>
                                    </template>
                                </Column>
                                <Column field="fileSize" header="өлчөмү" style="width: 9%;" class="text_center"></Column>
                                <Column field="regNm" header="каттоочу" style="width: 9%;" class="text_center"></Column>
                                <Column field="regDt" header="дата" style="width: 11.6%;" class="text_center"></Column>
                                <Column field="file" header="файл" style="width: 7.6%;" class="text_center">
                                    <template #body="{ data }">
                                        <button type="button" class="v_btn btn_sort_file" v-if="data.folderYn == 'N'"><i class="v_ico ico_file_pdf_sm"></i><span>PDF</span></button>
                                    </template>
                                </Column>
                            </DataTable>
                        </div>

                        <div class="v_table table_list" v-else-if="curDoc == 'my'">
                            <DataTable :value="myDocuments" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem;"
                                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                                v-model:selection="selectedRowMy" dataKey="id"
                            >
                                <Column selectionMode="multiple" style="width: 4.8%" class="text_center"></Column>
                                <Column field="title" header="Файлдын аталышы" class="text_left">
                                    <template #body="{ data }">
                                        <div class="file_stat">
                                            <div class="btn_wrap">
                                                <button type="button" class="v_btn btn_mark" :class="{on: data.starYn == 'Y'}"><i :class="`v_ico ${data.folderYn == 'Y' ? 'ico_folder' : 'ico_star'}`"></i></button>
                                            </div>
                                            <span>{{data.title}}</span>
                                        </div>
                                    </template>
                                </Column>
                                <Column field="fileSize" header="өлчөмү" style="width: 9%;" class="text_center"></Column>
                                <Column field="regNm" header="каттоочу" style="width: 9%;" class="text_center"></Column>
                                <Column field="regDt" header="дата" style="width: 11.6%;" class="text_center"></Column>
                                <Column field="file" header="файл" style="width: 7.6%;" class="text_center">
                                    <template #body="{ data }">
                                        <button type="button" class="v_btn btn_sort_file" v-if="data.folderYn == 'N'"><i class="v_ico ico_file_pdf_sm"></i><span>PDF</span></button>
                                    </template>
                                </Column>
                            </DataTable>
                        </div>

                        <div class="v_table table_list" v-else-if="curDoc == 'star'">
                            <DataTable :value="starredDocuments" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem;"
                                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                                v-model:selection="selectedRowStar" dataKey="id">
                                <Column selectionMode="multiple" style="width: 4.8%" class="text_center"></Column>
                                <Column field="title" header="Файлдын аталышы" class="text_left">
                                    <template #body="{ data }">
                                        <div class="file_stat">
                                            <div class="btn_wrap">
                                                <button type="button" class="v_btn btn_mark" :class="{on: data.starYn == 'Y'}"><i :class="`v_ico ${data.folderYn == 'Y' ? 'ico_folder' : 'ico_star'}`"></i></button>
                                            </div>
                                            <span>{{data.title}}</span>
                                        </div>
                                    </template>
                                </Column>
                                <Column field="fileSize" header="өлчөмү" style="width: 9%;" class="text_center"></Column>
                                <Column field="regNm" header="каттоочу" style="width: 9%;" class="text_center"></Column>
                                <Column field="regDt" header="дата" style="width: 11.6%;" class="text_center"></Column>
                                <Column field="file" header="файл" style="width: 7.6%;" class="text_center">
                                    <template #body="{ data }">
                                        <button type="button" class="v_btn btn_sort_file" v-if="data.folderYn == 'N'"><i class="v_ico ico_file_pdf_sm"></i><span>PDF</span></button>
                                    </template>
                                </Column>
                            </DataTable>
                        </div>

                        <div class="v_table table_list" v-else-if="curDoc == 'trash'">
                            <DataTable :value="trashedDocuments" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem;"
                                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                                v-model:selection="selectedRowTrash" dataKey="id"
                            >
                                <Column selectionMode="multiple" style="width: 4.8%" class="text_center"></Column>
                                <Column field="title" header="Файлдын аталышы" class="text_left">
                                    <template #body="{ data }">
                                        <div class="file_stat">
                                            <div class="btn_wrap">
                                                <button type="button" class="v_btn btn_mark" :class="{on: data.starYn == 'Y'}"><i :class="`v_ico ${data.folderYn == 'Y' ? 'ico_folder' : 'ico_star'}`"></i></button>
                                            </div>
                                            <span>{{data.title}}</span>
                                        </div>
                                    </template>
                                </Column>
                                <Column field="fileSize" header="өлчөмү" style="width: 9%;" class="text_center"></Column>
                                <Column field="regNm" header="каттоочу" style="width: 9%;" class="text_center"></Column>
                                <Column field="regDt" header="дата" style="width: 11.6%;" class="text_center"></Column>
                                <Column field="file" header="файл" style="width: 7.6%;" class="text_center">
                                    <template #body="{ data }">
                                        <button type="button" class="v_btn btn_sort_file" v-if="data.folderYn == 'N'"><i class="v_ico ico_file_pdf_sm"></i><span>PDF</span></button>
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                    </div>
                    <div v-if="viewType == 'thumbnail'">
                        <div class="gallery_list">
                            <div class="gallery_item">
                                <div class="thumnail_wrap">
                                    <img src="@/assets/images/content/img_folder.png" alt="">
                                </div>
                                <span class="document_tit">Мезгилсиз отчет</span>
                            </div>
                            <div class="gallery_item">
                                <div class="thumnail_wrap">
                                    <button type="button" onclick="openModal('#layer_thumnail', this);">
                                        <img src="@/assets/images/content/img_sample1.jpg" alt="">
                                    </button>
                                </div>
                                <span class="document_tit">Кыргыз_колдонмо_презентация_жыйынтыгы_кароо (com+ebil+plenary_hall)_англисче </span>
                                <button type="button" class="v_btn btn_down"><i class="v_ico ico_download"></i></button>
                            </div>
                            <div class="gallery_item">
                                <div class="thumnail_wrap">
                                    <button type="button" onclick="openModal('#layer_thumnail', this);">
                                        <img src="@/assets/images/content/img_sample2.jpg" alt="">
                                    </button>
                                </div>
                                <span class="document_tit">Кыргыз_колдонмо_презентация_жыйынтыгы_кароо (com+ebil+plenary_hall)_англисче </span>
                                <button type="button" class="v_btn btn_down"><i class="v_ico ico_download"></i></button>
                            </div>
                            <div class="gallery_item">
                                <div class="thumnail_wrap">
                                    <button type="button" onclick="openModal('#layer_thumnail', this);">
                                        <img src="@/assets/images/content/img_sample3.jpg" alt="">
                                    </button>
                                </div>
                                <span class="document_tit">Кыргыз_колдонмо_презентация_жыйынтыгы_кароо (com+ebil+plenary_hall)_англисче </span>
                                <button type="button" class="v_btn btn_down"><i class="v_ico ico_download"></i></button>
                            </div>
                            <div class="gallery_item">
                                <div class="thumnail_wrap">
                                    <img src="@/assets/images/content/img_noimage.png" alt="">
                                </div>
                                <span class="document_tit">Кыргыз_колдонмо_презентация_жыйынтыгы_кароо (com+ebil+plenary_hall)_англисче </span>
                                <button type="button" class="v_btn btn_down"><i class="v_ico ico_download"></i></button>
                            </div>
                            <div class="gallery_item">
                                <div class="thumnail_wrap">
                                    <button type="button" onclick="openModal('#layer_thumnail', this);">
                                        <img src="@/assets/images/content/img_sample4.jpg" alt="">
                                    </button>
                                </div>
                                <span class="document_tit">Кыргыз_колдонмо_презентация_жыйынтыгы_кароо (com+ebil+plenary_hall)_англисче </span>
                                <button type="button" class="v_btn btn_down"><i class="v_ico ico_download"></i></button>
                            </div>
                            <div class="gallery_item">
                                <div class="thumnail_wrap">
                                    <button type="button" onclick="openModal('#layer_thumnail', this);">
                                        <img src="@/assets/images/content/img_sample2.jpg" alt="">
                                    </button>
                                </div>
                                <span class="document_tit">Кыргыз_колдонмо_презентация_жыйынтыгы_кароо (com+ebil+plenary_hall)_англисче </span>
                                <button type="button" class="v_btn btn_down"><i class="v_ico ico_download"></i></button>
                            </div>
                            <div class="gallery_item">
                                <div class="thumnail_wrap">
                                    <img src="@/assets/images/content/img_noimage.png" alt="">
                                </div>
                                <span class="document_tit">Кыргыз_колдонмо_презентация_жыйынтыгы_кароо (com+ebil+plenary_hall)_англисче </span>
                                <button type="button" class="v_btn btn_down"><i class="v_ico ico_download"></i></button>
                            </div>
                            <div class="gallery_item">
                                <div class="thumnail_wrap">
                                    <button type="button" onclick="openModal('#layer_thumnail', this);">
                                        <img src="@/assets/images/content/img_sample2.jpg" alt="">
                                    </button>
                                </div>
                                <span class="document_tit">Кыргыз_колдонмо_презентация_жыйынтыгы_кароо (com+ebil+plenary_hall)_англисче </span>
                                <button type="button" class="v_btn btn_down"><i class="v_ico ico_download"></i></button>
                            </div>
                            <div class="gallery_item">
                                <div class="thumnail_wrap">
                                    <button type="button" onclick="openModal('#layer_thumnail', this);">
                                        <img src="@/assets/images/content/img_sample2.jpg" alt="">
                                    </button>
                                </div>
                                <span class="document_tit">Кыргыз_колдонмо_презентация_жыйынтыгы_кароо (com+ebil+plenary_hall)_англисче </span>
                                <button type="button" class="v_btn btn_down"><i class="v_ico ico_download"></i></button>
                            </div>
                        </div>
                        <div class="v_pagination">
                            <select class="form_control">
                                <option>10</option>
                            </select>
                            <a href="javascript:void(0)" class="direction first"><i class="v_ico ico_paging_first"></i></a>
                            <a href="javascript:void(0)" class="direction prev"><i class="v_ico ico_paging_prev"></i></a>
                            <a href="javascript:void(0)">1</a>
                            <a href="javascript:void(0)">2</a>
                            <a href="javascript:void(0)" class="active"><strong>3</strong></a>
                            <a href="javascript:void(0)">4</a>
                            <a href="javascript:void(0)">5</a>
                            <a href="javascript:void(0)">6</a>
                            <a href="javascript:void(0)">7</a>
                            <a href="javascript:void(0)">8</a>
                            <a href="javascript:void(0)">9</a>
                            <a href="javascript:void(0)">10</a>
                            <a href="javascript:void(0)" class="direction next"><i class="v_ico ico_paging_next"></i></a>
                            <a href="javascript:void(0)" class="direction last"><i class="v_ico ico_paging_last"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- // Main area -->
    </div>

    <!-- <NewFolderModal />
    <FileUploadModal /> -->

    <!-- Layer pop -up (thumbnail) -->
	<div class="layer_popup popup_thumnail hide" id="layer_thumnail">
		<div class="popup_inner">
			<div class="popup_body">
				<div class="popup_cont">
					<img src="@/assets/images/content/img_sample1_lg.jpg" alt="">
				</div>
			</div>
			<button type="button" class="btn btn_close_popup"><i class="v_ico ico_close_white_lg"></i></button>
		</div>
	</div>

</template>

<style></style>
