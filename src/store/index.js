import { defineStore } from 'pinia'
import axios from "@/axios";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

import * as XLSX from "xlsx-js-style";

export const useStore = defineStore('main', {
    state: () => ({
        jwtToken: null,
        loginInfo: null,
        isLoading: false,
        confirm: useConfirm(),
        toast: useToast(),
        comCodes: null,
        ageObj: {
            naTermCd: '',
            naTermNm: ''
        },
        ageList: [],
        deptList: [],
        ccofList: [],
        bzentyList: [],
        profileImgUrl: null,
        fileViewUrl: null,
        menuList: [],
        quickMenuList: [],
    }),
    getters: {
        // finishedTodos(state) {
        //     // autocompletion! ✨
        //     return state.todos.filter((todo) => todo.isFinished)
        // },
        // unfinishedTodos(state) {
        //     return state.todos.filter((todo) => !todo.isFinished)
        // },
        // /**
        //  * @returns {{ text: string, id: number, isFinished: boolean }[]}
        //  */
        // filteredTodos(state) {
        //     if (this.filter === 'finished') {
        //         // call other getters with autocompletion ✨
        //         return this.finishedTodos
        //     } else if (this.filter === 'unfinished') {
        //         return this.unfinishedTodos
        //     }
        //     return this.todos
        // },
        getAgeObj: state => state.ageObj,
        getAgeList: state => state.ageList,
        getDeptList: state => state.deptList,

    },
    actions: {
        reset() {
            this.jwtToken = null;
            this.loginInfo = null;
            this.isLoading = false;
            this.comCodes = null;
            this.ageObj = {
                naTermCd: '',
                naTermNm: ''
            };
            this.ageList = [];
            this.ccofList = [];
            this.bzentyList = [];
            this.profileImgUrl = null;
            this.fileViewUrl = null;
            this.menuList = [];
            this.quickMenuList = [];
        },
        showProgressSpinner() {
            this.isLoading = true;
        },
        hideProgressSpinner() {
            this.isLoading = false;
        },
        // showConfirmDialog({ message, header='Confirmation', icon='pi pi-exclamation-triangle' }) {
        //     return new Promise((resolve) => {
        //         this.confirm.require({
        //             message,
        //             header,
        //             icon,
        //             accept: () => {
        //                 resolve(true);
        //             },
        //             reject: () => {
        //                 resolve(false);
        //             },
        //         });
        //     });
        // },
        getBzentys() {
            const list = this.bzentyList;
            const lang = localStorage.getItem('languageType');

            for(var i = 0; i < list.length; ++i) {
                list[i].codeId = list[i].bzentyId;
                if(lang == 'lng_type_1') {
                    list[i].codeNm = list[i].bzentyNm1;
                }
                else if(lang == 'lng_type_2'){
                    list[i].codeNm = list[i].bzentyNm2;
                } 
                else {
                    list[i].codeNm = list[i].bzentyNm3;
                }
            }
            return list;
        },
        getComCodes(grpCode) {
            const list = this.comCodes.filter(comCode => comCode.grpCode == grpCode);
            const lang = localStorage.getItem('languageType');

            for(var i = 0; i < list.length; ++i) {
                if(lang == 'lng_type_1') {
                    list[i].codeNm = list[i].codeNm1;
                }
                else if(lang == 'lng_type_2'){
                    list[i].codeNm = list[i].codeNm2;
                } 
                else {
                    list[i].codeNm = list[i].codeNm3;
                }
            }
            return list;
        },
        getCodeNm(grpCode, codeId) {
            const list = this.comCodes?.filter(comCode => comCode.grpCode == grpCode);
            if(!list) return "";
            const data = list.find(comCode => comCode.codeId === codeId);
            const lang = localStorage.getItem('languageType');
            let result = null;
            if(lang == 'lng_type_1') {
                result = data?.codeNm1;
            }
            else if(lang == 'lng_type_2'){
                result= data?.codeNm2;
            }
            else {
                result= data?.codeNm3;
            }
            return result;
        },
        formatLocalDateTime(date, format) {
            if (!date) return "";

            const type = {
                "date": "YYYY-MM-DD",
                "dateTime": "YYYY-MM-DD HH:mm",
                "time24": "HH:mm",
                "time": "HH:mm:ss",
                "timeWithSec": "HH:mm:ss.SSS",
                "dateTimeWithSec": "YYYY-MM-DD HH:mm:ss",
                "dateTimeWithSec2": "YYYY-MM-DD HH:mm:ss.SSS",
            };

            if (!format) {
                format = "dateTimeWithSec";
            }

            let formatString = type[format];
            if (!formatString) {
                console.warn(`Invalid format type: ${format}. Using default 'dateTimeWithSec'.`);
                format = "dateTimeWithSec"; // 유효하지 않은 포맷이면 기본값으로
                formatString = type[format];
            }

            const match = date.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,6}))?$/);

            if (!match) {
                console.warn(`Invalid localDateTimeString format: ${date}. Expected YYYY-MM-DDTHH:mm:ss[.SSS] or YYYY-MM-DD HH:mm:ss[.SSS]`);
                return date; // 잘못된 형식이면 원본 반환
            }

            const year = parseInt(match[1], 10);
            const month = parseInt(match[2], 10);
            const day = parseInt(match[3], 10);
            const hour = parseInt(match[4], 10);
            const minute = parseInt(match[5], 10);
            const second = parseInt(match[6], 10);
            const subSecondString = match[7];
            let millisecondsForDateObject = 0;
            if (subSecondString) {
                // 초의 소수점 이하 부분을 밀리초로 변환 (소수점 이하 버림)
                // 예: "771859" -> 0.771859초 -> 771.859밀리초 -> 771밀리초
                // 예: "7" -> 0.7초 -> 700밀리초 -> 700밀리초
                const fractionalSeconds = parseFloat("0." + subSecondString);
                millisecondsForDateObject = Math.floor(fractionalSeconds * 1000);
            }



            const dateObj = new Date(year, month - 1, day, hour, minute, second, millisecondsForDateObject);

            if (isNaN(dateObj.getTime()) ||
                dateObj.getFullYear() !== year ||
                dateObj.getMonth() !== (month - 1) ||
                dateObj.getDate() !== day

            ) {
                console.warn(`Invalid date components in "${date}" or date was adjusted by Date constructor (e.g., Feb 30). Returning original string.`);
                return date;
            }


            let result = formatString;


            if (result.includes('SSS')) {
                result = result.replace(/SSS/g, String(dateObj.getMilliseconds()).padStart(3, '0'));
            }
            if (result.includes('YYYY')) {
                result = result.replace(/YYYY/g, String(dateObj.getFullYear()));
            }
            if (result.includes('MM')) {
                result = result.replace(/MM/g, String(dateObj.getMonth() + 1).padStart(2, '0')); // 월은 +1
            }
            if (result.includes('DD')) {
                result = result.replace(/DD/g, String(dateObj.getDate()).padStart(2, '0'));
            }
            if (result.includes('HH')) {
                result = result.replace(/HH/g, String(dateObj.getHours()).padStart(2, '0'));
            }
            if (result.includes('mm')) {
                result = result.replace(/mm/g, String(dateObj.getMinutes()).padStart(2, '0'));
            }
            if (result.includes('ss')) {
                result = result.replace(/ss/g, String(dateObj.getSeconds()).padStart(2, '0'));
            }

            return result;
        },
        /** 사이즈 타입 변환 */
        formatFileSize(fileSize) {
            if (fileSize === undefined || fileSize === null || fileSize == 0) return ''; // 파일 크기가 0인 경우 빈 문자열 반환

            const kb = 1024;
            const mb = kb * 1024;
            const gb = mb * 1024;

            // GB 단위로 변환
            if (fileSize >= gb) {
                return (fileSize / gb).toFixed(1) + ' GB';
            }
            // MB 단위로 변환
            else if (fileSize >= mb) {
                return (fileSize / mb).toFixed(1) + ' MB';
            }
            // KB 단위로 변환
            else if (fileSize >= kb) {
                return Math.floor(fileSize / kb) + ' KB';
            }
            // 1 KB 미만일 경우 바이트로 표시
            else {
                return fileSize + ' Bytes';
            }
        },
        async getProfileImg() {
            try {
                const response = await axios.get('myPage/myInfo/img', {
                    responseType: 'blob'
                });
                if (response.data != null && response.data.size > 0) {
                    this.profileImgUrl = URL.createObjectURL(response.data);
                }
                else {
                    this.profileImgUrl = null;
                }
            } catch (e) {
                console.error(e)
            }
        },
        async getFileView(fileId, type) {
            const api = type === 'file' ? 'mnul/asset/file/view' : 'asset/img/view'
            try {
                const response = await axios.get(api, {
                    responseType: 'blob',
                      params: {
                      pdfFileNm: fileId,  
                      },
                });
                if (response.data != null && response.data.size > 0) {
                    this.fileViewUrl = URL.createObjectURL(response.data);
                }
                else {
                    this.fileViewUrl = null;
                }
            } catch (e) {
                console.error(e)
            }
        },

        getQuickMenuList() {
            let params = { lang: localStorage.getItem('languageType') }
            this.API_LIST('/admin/quickMenu', params).then((data) => {
                return this.quickMenuList = data.data.data;
            }).catch(({ message }) => {
                console.log(message);
            })
        },
        addQuickMenu(menuId) {
            const params = {menuId};
            this.API_SAVE('/admin/quickMenu', params).then(data => {
                this.getQuickMenuList();
            });
        },
        deleteQuickMenu(menuId) {
            const params = {menuId};
            this.API_DELETE('/admin/quickMenu', params).then(data => {
                this.getQuickMenuList();
            });
        },
        /** 엑셀 다운로드 */
        fnExcelDownload(data, selectedHeaders, wsCols, title) {
            // 포함할 헤더 지정
            // const selectedHeaders = ["sclDscRcpNmb", "billName", "ppsrNm", "regDate", "regDt2", "signDate"];
            // const wsCols = ["Каттоо номери(등록번호)", "Аталыш(제목)", "Сунуш кылуучу(제안자)", "Катталган күн(등록일)", "Абал(상태)", "Макулдук(동의)"]; // 헤더명 배열

            // 헤더에 해당하는 데이터만 필터링
            const filteredData = data.map(item => {
                let filteredItem = {};
                selectedHeaders.forEach(header => {
                    filteredItem[header] = item[header];
                });
                return filteredItem;
            });

            // 워크시트 생성 (데이터를 아래로 한 칸 밀기)
            const worksheet = XLSX.utils.json_to_sheet(filteredData, {
                header: selectedHeaders,
                origin: "A2",
                skipHeader: false
            });

            // 기존 데이터와 헤더를 한 칸 아래로 이동
            XLSX.utils.sheet_add_aoa(worksheet, [wsCols], { origin: "A2" }); // 헤더는 A2로 이동

            // 병합된 셀 타이틀 추가
            worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: wsCols.length - 1 } }]; // A1에서 마지막 열까지 병합
            worksheet["A1"] = {
                v: title, // 병합된 셀에 텍스트
                s: {
                    font: { bold: true, color: { rgb: "FFFFFF" } },
                    fill: { fgColor: { rgb: "0070C0" } }, // 배경색
                    alignment: { horizontal: "center", vertical: "center" }, // 가운데 정렬
                },
            };

            // 행 높이 설정
            worksheet["!rows"] = [
                { hpx: 40 }, // 타이틀 행 높이
                { hpx: 25 }, // 헤더 행 높이
                ...Array(filteredData.length).fill({ hpx: 20 }), // 모든 데이터 행 높이
            ];

            // 열 너비를 가장 긴 데이터에 맞춤
            const colWidths = [];
            filteredData.forEach((row) => {
                Object.values(row).forEach((cell, colIndex) => {
                    const cellLength = cell ? cell.toString().length : 0;
                    colWidths[colIndex] = Math.max(colWidths[colIndex] || 0, cellLength);
                });
            });
            worksheet["!cols"] = colWidths.map((width) => ({ wch: Math.max(width, 10) })); // 최소 너비 10

            // 헤더 스타일 적용 (A2부터 시작)
            const headers = Object.keys(worksheet).filter((key) => key.match(/^[A-Z]+2$/));
            headers.forEach((cell) => {
                worksheet[cell].s = {
                    font: { bold: true, color: { rgb: "FFFFFF" } },
                    fill: { fgColor: { rgb: "A9A9A9" } },
                    alignment: { horizontal: "center", vertical: "center" },
                };
            });

            // 셀 경계선 추가
            Object.keys(worksheet)
                .filter((key) => key.match(/^[A-Z]+\d+$/)) // 데이터가 들어있는 모든 셀 필터링
                .forEach((cell) => {
                    worksheet[cell].s = {
                        ...worksheet[cell].s, // 기존 스타일 유지
                        border: {
                            top: { style: "thin", color: { rgb: "000000" } },
                            bottom: { style: "thin", color: { rgb: "000000" } },
                            left: { style: "thin", color: { rgb: "000000" } },
                            right: { style: "thin", color: { rgb: "000000" } },
                        },
                    };
                });

            // 워크북 생성 및 다운로드
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, title + ".xlsx");
        },
        API_LIST(API_PATH, API_PARAMS) {

            this.showProgressSpinner();

            let tmpParams = {};
            tmpParams['params'] = API_PARAMS;

            return axios.get(API_PATH, tmpParams)
                .then(data => {
                    this.hideProgressSpinner();
                    const success = parseInt(data.status / 100) == 2 || parseInt(data.status / 100) == 3 ? true : false;

                    if (success) {
                        return data;
                    } else {
                        console.error(data);
                        throw data;
                    }

                }).catch(error => {
                    this.hideProgressSpinner();
                    console.error(error);
                    throw error;
                });
        },
        API_SAVE(API_PATH, API_PARAMS) {

            this.showProgressSpinner();

            return axios.post(API_PATH, API_PARAMS
                , { headers: { 'Content-Type': 'application/json' } })
                .then(data => {
                    this.hideProgressSpinner();
                    const success = parseInt(data.status / 100) == 2 || parseInt(data.status / 100) == 3 ? true : false;

                    if (success) {
                        this.toast.add({ severity: 'success', summary: 'Success', detail: '정상적으로 저장되었습니다.', life: 3000 });
                        return data;
                    } else {
                        console.error(data);
                        this.toast.add({ severity: 'error', summary: 'Error', detail: data.status, life: 3000 });
                        throw data;
                    }

                }).catch(error => {
                    this.hideProgressSpinner();
                    // this.toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
                    throw error;
                });
        },
        API_UPDATE(API_PATH, API_PARAMS) {

            this.showProgressSpinner();

            return axios.put(API_PATH, API_PARAMS
                , { headers: { 'Content-Type': 'application/json' } })
                .then(data => {
                    this.hideProgressSpinner();
                    const success = parseInt(data.status / 100) == 2 || parseInt(data.status / 100) == 3 ? true : false;
                    if (success) {
                        this.toast.add({ severity: 'success', summary: 'Success', detail: '정상적으로 수정되었습니다.', life: 3000 });
                        return data;
                    } else {
                        this.toast.add({ severity: 'error', summary: 'Error', detail: data.status, life: 3000 });
                        throw data;
                    }

                }).catch(error => {
                    this.hideProgressSpinner();
                    // this.toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
                    throw error;
                });
        },
        API_DELETE(API_PATH, deleteItems) {

            let tmpParams = {};
            tmpParams['data'] = deleteItems;

            this.showProgressSpinner();

            return axios.delete(API_PATH, tmpParams)
                .then(data => {
                    this.hideProgressSpinner();
                    const success = parseInt(data.status / 100) == 2 || parseInt(data.status / 100) == 3 ? true : false;
                    if (success) {
                        this.toast.add({ severity: 'success', summary: 'Success', detail: '정상적으로 삭제되었습니다.', life: 3000 });
                        return data;
                    } else {
                        this.toast.add({ severity: 'error', summary: 'Error', detail: data.status, life: 3000 });
                        throw data;
                    }

                }).catch(error => {
                    this.hideProgressSpinner();
                    // this.toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
                    throw error;
                });
        },
        API_SAVE_FILE(API_PATH, FORM_DATA) {

            this.showProgressSpinner();

            return axios.post(API_PATH, FORM_DATA
                , { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(data => {
                    this.hideProgressSpinner();
                    const success = parseInt(data.status / 100) == 2 || parseInt(data.status / 100) == 3 ? true : false;
                    
                    if (success) {
                        this.toast.add({ severity: 'success', summary: 'Success', detail: '정상적으로 저장되었습니다.', life: 3000 });
                        return data;
                    } else {
                        this.toast.add({ severity: 'error', summary: 'Error', detail: data.status, life: 3000 });
                        throw data;
                    }

                }).catch(error => {
                    this.hideProgressSpinner();
                    // this.toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
                    throw error;
                });
        },
        API_FILE_DOWN(fileId, fileNm) {

            this.showProgressSpinner();

            const API_PATH = `mnul/asset/file/down`;
            return axios.get(API_PATH, { responseType: 'blob', params: {fileId} })
                .then(response => {

                    this.hideProgressSpinner();

                    const blob = new Blob([response.data], { type: response.headers['content-type'] });
                    const objectURL = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = objectURL;
                    link.setAttribute("download", fileNm);
                    document.body.appendChild(link);
                    link.click();
                }).catch(error => {
                    this.hideProgressSpinner();

                    console.log(error);
                    // this.toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
                });
        },
        API_PDF_VIEWER(fileId) {
            // const fileUrl = "http://43.203.192.251:8081/com/file/down?fileId="+fileId;
            // const pdfLink = "http://kgtest.bestiansoft.it:8882/ezpdfwebviewer/unidocswv/ezpdf1/bsPdfViewer.jsp?fileUrl="+fileUrl;
            const fileUrl = import.meta.env.VITE_FILE_DOWN_URL+"="+fileId;
            const pdfLink = import.meta.env.VITE_PDF_VIEWER_URL+"="+fileUrl;

            window.open(pdfLink, "_blank");
        },
        // LoginView로 로직이동
        // async API_AGE_LIST() {

        //     try {
        //         //this.ageList = [];
        //         const response = await axios.get('/admin/baseCode', {});
        //         const success = Math.floor(response.status / 100) === 2;
            
        //         if (success) {
        //           const data = response.data.data || []; // 기본값 설정

        //           const ageList =  Array.isArray(data) ? [...data] : []; // 배열 확인 및 초기화
        //           const ageObj = {};
            
        //           ageList.forEach((item) => {
        //             if (item.currYn === 'Y') {
        //               ageObj.codeId = item.codeId;
        //               ageObj.codeNm = item.codeNm;
        //             }
        //           });
            
        //           this.ageList = ageList; // 전체 리스트를 덮어씀
        //           this.ageObj = ageObj;
            
        //         } else {
        //           console.error('API 응답 오류:', response);
        //           this.ageList = [];
        //           this.ageObj = { codeId: '', codeNm: '' };
        //         }
        //     } catch (error) {
        //         console.error('API 요청 실패:', error);
        //         this.ageList = [];
        //         this.ageObj = { codeId: '', codeNm: '' };
        //     }
        // },
        async API_DEPT_LIST() {

            return axios.get('admin/dept',{})
              .then(data => {
      
                const success = parseInt(data.status / 100) == 2 ||  parseInt(data.status / 100) == 3 ? true:false;
                const lang = localStorage.getItem("languageType") == "lng_type_2" ? 'lng_type_2':'lng_type_1';
      
                let sCodeNm = '';
                if(lang == 'lng_type_1') {
                  sCodeNm = "Бүтүн";
                  data.data.data.forEach(item=>{
                    item.deptNm = item.deptNm1;
                  });
                } else if(lang == 'lng_type_2'){
                  sCodeNm = "Весь";
                  data.data.data.forEach(item=>{
                    item.deptNm = item.deptNm2;
                  });
                } else {
                  sCodeNm = "전체";
                  data.data.data.forEach(item=>{
                    item.deptNm = item.deptNm3;
                  });
                }
      
                if(success){
                  const codes = [{bgDt:'',ctgrId:'',deptId: '', deptNm: sCodeNm,edDt:'',mngrId:'',ord:0,parentDepartment:'',shrtNm:'',uprDeptCd:'',useYn:'Y'}, ...data.data.data];
                  this.deptList = codes;
                } else {
                  this.deptList = [];
                  console.error(data);
                }
      
            }).catch(error => {
                this.deptList = [];
              //commit('displaySnackbar', { message: error.message,visible:true,timeout:3000});
              console.error(error);
            });
        },
    },
    persist: {
        storage: sessionStorage,
        pick: ['jwtToken', 'loginInfo', 'comCodes', 'ageObj', 'ageList', 'ccofList', 'bzentyList', 'profileImgUrl', 'fileViewUrl', 'menuList', 'quickMenuList']
    },
})
export const usePageStore = defineStore('page', {
    state: () => ({
        curPage: 0,
        rows: 10,
        startIndex: 0,
        searchParams: {}
    }),
    getters: { 
        getCurPage: state => state.curPage,
        getRows: state => state.rows,
        getStartIndex: state => state.startIndex,
        getSearchParams: state => state.searchParams
    },
    actions: { 
        fnSavePage (curPage, rows) {
            this.curPage = curPage
            this.rows = rows
            this.startIndex = curPage * rows
        }, 
        fnSaveParams(searchParams) {
            this.searchParams = searchParams
        },
        fnClearSession() {
           this.curPage = 0;
           this.rows = 10;
           this.startIndex = 0
           this.searchParams = {}
        }
    },
    persist: { 
        storage: sessionStorage,
        pick: ['curPage', 'rows', 'startIndex', 'searchParams']
    },
})
export const useAlarmStore = defineStore('alarm', {
    state: ()=>({
        alarm : {},
        totalAlarmCount : 0
    }),
    getters: {
        getAlarm(menuId){
            return this.alarm.value[menuId];
        },

    },
    actions: {
        setApprovalCount(){
            useStore().API_LIST('/eas/approval/count')
                .then(res=> {
                    this.alarm[85] = res.data.data
                });
        },
        setReceiveCount(){
            useStore().API_LIST("/eas/document/receive/count")
                .then(res=> {
                    this.alarm[76] = res.data.data
                });
        },
        setRejectCount(){
            useStore().API_LIST("/eas/document/reject/count")
                .then(res=> {
                    this.alarm[87] = res.data.data
                });
        },
        setWorkResCount(){
            useStore().API_LIST("/eas/document/work/count")
                .then(res=> {
                    this.alarm[86] = res.data.data
                });
        },
        getAllCount(){
            this.setApprovalCount();
            this.setReceiveCount();
            this.setRejectCount();
            this.setWorkResCount();
        }
    },
})


// Form 유효성 검사
export const useFormStore = defineStore('form', {
  state: () => ({
    validators: {},
    values: {},
    fieldStore: {},
    fieldArr: [],
    apiPath: null, //db에 저장할 주소
    apiMethod: null,
  }),

  actions: {

    //초기화
    resetForm() {
      this.validators = {}
      this.values = {}
      this.fieldStore = {}
      this.apiMethod = null;
      this.apiPath = null
      this.fieldArr = []
    },

    // 컴포넌트별 유효성 검사 등록
    fnRegister(formkey, validate, fieldStore) {
      this.validators[formkey] = validate;
      this.fieldArr.push(fieldStore)
    },

    //유효성 검사
    async fnSubmit() {
      let allvalid = true;

      for (const [formKey, validate] of Object.entries(this.validators)) {
        const result = await validate()
        this.values[formKey] = result.values?.[formKey] || {}
        if (!result.valid) allvalid = false
      }

      return allvalid
    },

    fnSave() { 
      let params = {};

        Object.entries(this.fieldStore).forEach(([key, obj]) => {
          params[key] = obj.value
        })

      return useStore()[this.apiMethod](this.apiPath, params).then((data) => {
        return true;
      }).catch(({ err }) => {
        console.error(err)
        return false;
      })
    },
  }
})


