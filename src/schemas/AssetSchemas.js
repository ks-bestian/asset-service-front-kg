import i18n from '@/i18n'
import { useFormStore, useStore } from "@/store";
const store = useStore();



export const formSchemas = {
  equipment: {
    fields: [
      [ //1. 배열 1행 or 2행으로 넘겨야함 2. name db컬럼명과 일치 3.입력 type 및 필수 여부(db not null) 설정 
        { name: "eqpmntNm", label: i18n.global.t('10751'), type: 'text', required: true }, //장비명
        { name: "eqpmntCd", label: i18n.global.t('10725'), type: 'text' },  //장비코드
      ],
      [
        { name: "bzentyId", label: i18n.global.t('10752'), type: 'select', items:store.getBzentys(), required: true, default: ''}, //공급업체
        { name: "eqpmntSe", label: i18n.global.t('10727'), type: 'select', items:store.getComCodes('1037'), default: '' }, //장비구분
      ],
      [
        { name: "expln", label: i18n.global.t('10728'), type: 'text' }, //설명
      ],
      [
        { name: "thumbnail", label: i18n.global.t('10753'), type: 'thumbnail' }, //썸네일 이미지
      ],
      [
        // name과 타입은 추후 개발 되는대로 올바르게 적용해주세요~
        { name: "dtlImg", label: i18n.global.t('10754'), type: 'thumbnail' }, //상세이미지
      ],
      [
        { name: "file", label: i18n.global.t('10755'), type: 'file' }, //PDF 메뉴얼
      ],
      [  //담당부서는 사용 안될거같다.
        { name: "tkcgDeptId", label: 'Dept. ID', type: 'file', hidden: true }, //담당부서아이디
      ],
    ]
  },

  installVo: {
    fields: [
      [
        { name: 'instlPlcCd', label: i18n.global.t('10737'), type: 'select', items:store.getComCodes('1038'), default: '' }, //설치위치
        { name: 'instlPlcDtl1', label: i18n.global.t('10762'), type: 'text' }, //상세 위치-ky
      ],
      [
        { name: 'instlPlcDtl2', label: i18n.global.t('10763'), type: 'text'  }, //상세 위치-ru
        { name: 'instlPlcDtl3', label: i18n.global.t('10761'), type: 'text' }, //상세 위치-ko
      ],
      [
        { name: 'instlYmd', label: i18n.global.t('10738'), type: 'date' }, //설치일
        { name: 'dscdYmd', label: i18n.global.t('10740'), type: 'date' }, //폐기일
      ],
      [
        { name: 'instlPicNm', label: i18n.global.t('10741'), type: 'file' }, //설치 위치 이미지
      ],
      [
        { name: 'rmrk', label: i18n.global.t('10742'), type: 'textarea' }, //비고
      ]
    ]
  },

  mnulVo: {
    fields: [
      [
        { name: 'mnlLng1', label: i18n.global.t('10238'), type: 'select', items:store.getComCodes('1039'), default: 'mnlLng01', width:'15%', required: true}, //언어
        { name: 'mnlNm1', label: i18n.global.t('10735'), type: 'text', required: true}, //메뉴얼명
        { name: 'filePath1', label: i18n.global.t('10733'), type: 'file', required: true}, //영상 메뉴얼
      ],
      [
        { name: 'mnlLng2', label: i18n.global.t('10238'), type: 'select', items:store.getComCodes('1039'), default: '', width:'15%' }, //언어
        { name: 'mnlNm2', label: i18n.global.t('10735'), type: 'text' }, //메뉴얼명
        { name: 'filePath2', label: i18n.global.t('10733'), type: 'file' }, //영상 메뉴얼
      ],
    ]
  },
  faqVo: {
    fields: [
      [
        { name: 'faqSe', label: '문의구분', type: 'select', items:store.getComCodes('1040'), default: '', required: true }, //문의구분
      ],
      [
        { name: 'qstn', label: '질문', type: 'textarea', required: true }, //질문
      ],
      [
        { name: 'ans', label: '답변', type: 'textarea', required: true }, //답변
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
        { name: 'userId', label: '아이디', type: 'text', required: true, readonly: true },
        { name: 'jobCd', label: '직급', type: 'select' }
      ],
      [
        { name: 'pswd', label: '비밀번호', type: 'password', required: true }
      ],
      [
        { name: 'flnm1', label: '이름(우즈베크어)', type: 'text', required: false }
      ],
      [
        { name: 'flnm2', label: '이름(러시아어)', type: 'text', required: false }
      ],
      [
        { name: 'flnm3', label: '이름(한국어)', type: 'text' }
      ],
      [
        { name: 'frstNm', label: '최초명', type: 'text', required: true }
      ],
      [
        { name: 'lastNm', label: '최종명', type: 'text', required: true },
        { name: 'mdNm', label: '중간명(부칭)', type: 'text', required: true }
      ],
      [
        { name: 'eml', label: '이메일', type: 'text' },
        { name: 'telno', label: '전화번호', type: 'text' }
      ]
    ]
  },

}

