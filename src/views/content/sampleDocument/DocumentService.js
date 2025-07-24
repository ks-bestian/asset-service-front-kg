export const DocumentService = {
    getDeptDocumentsData() {
        return [
            {
                id: 0,
                title: 'сүрөт',
                folderYn: 'Y',
                fileSize: undefined,
                regNm: undefined,
                regDt: undefined,
            },
            {
                id: 1,
                title: '123',
                folderYn: 'Y',
                fileSize: undefined,
                regNm: undefined,
                regDt: undefined,
            },
            {
                id: 2,
                title: 'Законопроект на государственном языке',
                folderYn: 'N',
                fileSize: '19 KB',
                regNm: 'admin',
                regDt: '2024.08.14 02:08',
                starYn: 'Y',
            },
            {
                id: 3,
                title: 'АРВ на государственном языке',
                folderYn: 'N',
                fileSize: '7.6 MB',
                regNm: 'admin',
                regDt: '2024.08.14 02:09',
            },
            {
                id: 4,
                title: 'Пленарный_зал_Администратор_Проектный документ экрана_v0.9',
                folderYn: 'N',
                fileSize: '4.7 MB',
                regNm: 'admin',
                regDt: '2024.08.28 04:57',
            },
            {
                id: 5,
                title: 'Сэд_Проектный документ экрана_v0.91',
                folderYn: 'N',
                fileSize: '4.4 MB',
                regNm: 'admin',
                regDt: '2024.08.28 04:58',
                starYn: 'Y',
            },
            {
                id: 6,
                title: 'Пленарный_зал_член Конгресса_Проектный документ экрана_v0.9',
                folderYn: 'N',
                fileSize: '1.7 MB',
                regNm: 'admin',
                regDt: '2024.08.28 04:58',
            },
            {
                id: 7,
                title: 'Сруктура',
                folderYn: 'N',
                fileSize: '57 KB',
                regNm: 'admin',
                regDt: '2024.08.28 05:00',
            },
            {
                id: 8,
                title: 'изменения тз сайта_Translation_Requirements for Website_kr',
                folderYn: 'N',
                fileSize: '894 KB',
                regNm: 'admin',
                regDt: '2024.08.28 05:00',
            },
            {
                id: 9,
                title: 'Отчет Торага_2022_ФИНАЛ',
                folderYn: 'N',
                fileSize: '34 MB',
                regNm: 'admin',
                regDt: '2024.08.28 05:02',
            },
            {
                id: 10,
                title: 'Памятка ЖК_кр_ру',
                folderYn: 'N',
                fileSize: '7.1 MB',
                regNm: 'admin',
                regDt: '2024.08.28 05:03',
            },
            {
                id: 11,
                title: 'Презентация1_Translation',
                folderYn: 'N',
                fileSize: '11 MB',
                regNm: 'admin',
                regDt: '2024.08.28 05:03',
            },
            {
                id: 12,
                title: '키르키스 국회시스템구성도(TO-BE)--',
                folderYn: 'N',
                fileSize: '25 MB',
                regNm: 'admin',
                regDt: '2024.08.29 04:42',
            },
            {
                id: 13,
                title: '키르키스 e-의안시스템 화면구성-',
                folderYn: 'N',
                fileSize: '3.5 MB',
                regNm: 'admin',
                regDt: '2024.08.29 04:42',
            },
            {
                id: 14,
                title: '마이크관리 (1)',
                folderYn: 'N',
                fileSize: '966 KB',
                regNm: 'admin',
                regDt: '2024.08.29 04:42',
            },
            {
                id: 15,
                title: '국회 서버실 도면_한글_(파르호드)_20220309',
                folderYn: 'N',
                fileSize: '169 KB',
                regNm: 'admin',
                regDt: '2024.08.29 04:42',
            },
            {
                id: 16,
                title: 'usgs-T72rrSoh-Yo-unsplash',
                folderYn: 'N',
                fileSize: '3.6 MB',
                regNm: 'admin',
                regDt: '2024.12.06 10:02',
            },
        ];
    },

    getMyDocumentsData() {
        const ret = [];
        ret.push({
            id: 0,
            title: '비정기 보고',
            folderYn: 'Y',
            fileSize: undefined,
            regNm: '홍길동',
            regDt: '28-06-2024',
        });
        for(var i = 1; i < 20; ++i) {
            ret.push({
                id: i,
                title: 'О проекте конституционного Закона «О внесении изменений в конституционный Закон',
                folderYn: 'N',
                fileSize: '16MB',
                regNm: '홍길동',
                regDt: '28-06-2024',
                starYn: i == 3 ? 'Y' : 'N',
            });
        }
        return ret;  
    },

    getStarredDocumentsData() {
        return [
            {
                id: 2,
                title: 'Законопроект на государственном языке',
                folderYn: 'N',
                fileSize: '19 KB',
                regNm: 'admin',
                regDt: '2024.08.14 02:08',
                starYn: 'Y',
            },
            {
                id: 5,
                title: 'Сэд_Проектный документ экрана_v0.91',
                folderYn: 'N',
                fileSize: '4.4 MB',
                regNm: 'admin',
                regDt: '2024.08.28 04:58',
                starYn: 'Y',
            },
            {
                id: 3,
                title: 'О проекте конституционного Закона «О внесении изменений в конституционный Закон',
                folderYn: 'N',
                fileSize: '16MB',
                regNm: '홍길동',
                regDt: '28-06-2024',
                starYn: 'Y',
            },
        ]
    },

    getTrashedDocumentsData() {
        return [
            {
                id: 12,
                title: 'drive-download-20240828T081316Z-001',
                folderYn: 'Y',
                fileSize: undefined,
                regNm: 'admin',
                regDt: '2024.08.14 02:08',
            },
            {
                id: 15,
                title: 'Генеральный секретарь',
                folderYn: 'Y',
                fileSize: undefined,
                regNm: 'admin',
                regDt: '2024.08.28 04:58',
            },
            {
                id: 13,
                title: 'Минэкономразвития',
                folderYn: 'Y',
                fileSize: undefined,
                regNm: 'admin',
                regDt: '2024.08.28 04:58',
            },
            {
                id: 3,
                title: '$둘다qq',
                folderYn: 'N',
                fileSize: '20 KB',
                regNm: 'admin',
                regDt: '2024.08.29 02:49',
            },
            {
                id: 3,
                title: 'Ⅶ. 별첨_완료',
                folderYn: 'N',
                fileSize: '144 KB',
                regNm: 'admin',
                regDt: '2024.08.29 02:55',
            },
        ]
    },

    getDeptDocuments() {
        return Promise.resolve(this.getDeptDocumentsData());
    },

    getMyDocuments() {
        return Promise.resolve(this.getMyDocumentsData());
    },

    getStarredDocuments() {
        return Promise.resolve(this.getStarredDocumentsData());
    },

    getTrashedDocuments() {
        return Promise.resolve(this.getTrashedDocumentsData());
    },
};
