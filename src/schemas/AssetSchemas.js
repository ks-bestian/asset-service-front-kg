import i18n from '@/i18n'
import { useFormStore, useStore } from "@/store";
const store = useStore();



export const formSchemas = {
  equipment: {
    fields: [
      [ //1. 배열 1행 or 2행으로 넘겨야함 2. name db컬럼명과 일치 3.입력 type 및 필수 여부(db not null) 설정 
        { name: "eqpmntNm", label: i18n.global.t('10751'), type: 'text', required: true }, //장비명
        { name: "eqpmntCd", label: i18n.global.t('10725'), type: 'text', required: true },  //장비코드
      ],
      [
        { name: "bzentyId", label: i18n.global.t('10752'), type: 'select', items: store.getBzentys(), default: '', required: true }, //공급업체
        { name: "eqpmntSe", label: i18n.global.t('10727'), type: 'select', items: store.getComCodes('1037'), default: '', required: true }, //장비구분
      ],
      [
        { name: "expln", label: i18n.global.t('10728'), type: 'text', required: true }, //설명
      ],
      [
        { name: "files", label: i18n.global.t('10755'), type: 'file' }, //장비 메뉴얼 파일
        // name과 타입은 추후 개발 되는대로 올바르게 적용해주세요~
      ],
      [
        { name: "dtlImg", label: i18n.global.t('10754'), type: 'file', attachType: 'image'}, //상세이미지
      ],
      [
        { name: "thumbnail", label: i18n.global.t('10753'), type: 'file', attachType: 'image' }, //썸네일이미지
      ],
      [
        { name: "eqpmntId", label: 'eqpmntId', type: 'text', hidden: true }, //장비아이디
      ]
      // [  //담당부서는 사용 안될거같다.
      //   { name: "tkcgDeptId", label: 'Dept. ID', type: 'file', hidden: true }, //담당부서아이디
      // ],
    ]
  },

  installVo: {
    fields: [
      [
        { name: 'instlPlcCd', label: i18n.global.t('10737'), type: 'select', items: store.getComCodes('1038'), default: '', required: true }, //설치위치
        { name: 'instlPlcDtl1', label: i18n.global.t('10762'), type: 'text', required: true }, //상세 위치-ky
      ],
      [
        { name: 'instlPlcDtl2', label: i18n.global.t('10763'), type: 'text' }, //상세 위치-ru
        { name: 'instlPlcDtl3', label: i18n.global.t('10761'), type: 'text' }, //상세 위치-ko
      ],
      [
        { name: 'instlYmd', label: i18n.global.t('10738'), type: 'date', required: true }, //설치일
        { name: 'dscdYmd', label: i18n.global.t('10740'), type: 'date' }, //폐기일
      ],
      [
        { name: 'instlPicNm', label: i18n.global.t('10777'), type: 'text', required: true }, //설치 위치 이미지명
        { name: 'instlFile', label: i18n.global.t('10741'), type: 'file', attachType: 'image' }, //설치 위치 이미지
      ],
      [
        { name: 'rmrk', label: i18n.global.t('10742'), type: 'textarea' }, //비고
      ]
    ]
  },

  mnulVo: {
    fields: [
      [
        { name: 'mnlLng', label: i18n.global.t('10238'), type: 'select', items: store.getComCodes('1039'), default: 'mnlLng01', width: '15%', required: true }, //언어
        { name: 'mnlNm', label: i18n.global.t('10735'), type: 'text', required: true }, //메뉴얼명
        { name: 'videoFile', label: i18n.global.t('10733'), type: 'file',  upload: 'tus', attachType: 'video'}, //영상 메뉴얼

      ],
    ]
  },
  faqVo: {
    fields: [
      [
        { name: 'faqSe', label: i18n.global.t('10778'), type: 'select', items:store.getComCodes('1040'), default: '', required: true }, //문의구분
      ],
      [
        { name: 'qstn', label: i18n.global.t('10779'), type: 'textarea', required: true }, //질문
      ],
      [
        { name: 'ans', label: i18n.global.t('10496'), type: 'textarea', required: true }, //답변
      ]
    ]
  },
  bzenty: {
    fields: [
      [
        { name: 'bzentyNm1', label: i18n.global.t('10756'), type: 'text', required: true } //업체명(한국어)
      ],
      [
        { name: 'bzentyNm2', label: i18n.global.t('10757'), type: 'text', required: true } //업체명(키르기스어)
      ],
      [
        { name: 'bzentyNm3', label: i18n.global.t('10758'), type: 'text', required: true } //업체명(러시아어)
      ],
      [
        { name: 'telno', label: i18n.global.t('10358'), type: 'text' }, //전화번호
        { name: 'eml', label: i18n.global.t('10359'), type: 'text' } //이메일
      ],
      [
        { name: 'picNm', label: i18n.global.t('10759'), type: 'text' } //담당자
      ],
      [
        { name: 'useYn', label: i18n.global.t('10367'), type: 'radio' } //사용여부
      ]
    ]
  },
  user: {
    fields: [
      [
        { name: 'userId', label: i18n.global.t('10325'), type: 'text', required: true, readonly: true }, //아이디
        { name: 'jobCd', label: i18n.global.t('10361'), type: 'select' } //직급
      ],
      [
        { name: 'pswd', label: i18n.global.t('10613'), type: 'password', required: true } //비밀번호
      ],
      [
        { name: 'flnm1', label: i18n.global.t('10327'), type: 'text', required: false } //이름(키르키즈어)
      ],
      [
        { name: 'flnm2', label: i18n.global.t('10326'), type: 'text', required: false } //이름(러시아어)
      ],
      [
        { name: 'flnm3', label: i18n.global.t('10152'), type: 'text' } //이름
      ],
      [
        { name: 'frstNm', label: i18n.global.t('10781'), type: 'text', required: true } //최초명
      ],
      [
        { name: 'lastNm', label: i18n.global.t('10782'), type: 'text', required: true }, //최종명
        { name: 'mdNm', label: i18n.global.t('10780'), type: 'text', required: true }//중간명(부칭)
      ],
      [
        { name: 'eml', label: i18n.global.t('10359'), type: 'text' },//이메일
        { name: 'telno', label: i18n.global.t('10358'), type: 'text' }//전화번호
      ]
    ]
  },
}

