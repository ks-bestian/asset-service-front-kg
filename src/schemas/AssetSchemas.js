import i18n from '@/i18n'

export const formSchemas = {
  equipment: {
    fields: [
      [ //1. 배열 1행 or 2행으로 넘겨야함 2. name db컬럼명과 일치 3.입력 type 및 필수 여부(db not null) 설정 
        { name: "eqpmntNm", label: '장비명', type: 'text', required: true },
        { name: "eqpmntCd", label: '장비코드', type: 'select' },
      ],
      [
        { name: "bzentyId", label: '업체아이디', type: 'number' },
        { name: "eqpmntSe", label: '업체구분', type: 'text' },
      ],
      [
        { name: "expln", label: '설명', type: 'text' },
      ],
      [
        { name: "thumbnail", label: '썸네일', type: 'thumbnail' },
      ],
      [
        { name: "file", label: '파일', type: 'file' },
      ],
       [
        { name: "tkcgDeptId", label: '담당부서아이디', type: 'file', hidden: true },
      ],
    ]
  },

  installVo: {
    fields: [
      [
        { name: 'instlPlcCd', label: '설치장소', type: 'select' },
        { name: 'instlPlcDtl1', label: '상세장소', type: 'text' },
      ],
      [
        { name: 'instlYmd', label: '설치일', type: 'date' },
        { name: 'dscdYmd', label: '폐기일', type: 'date' },
      ],
      [
        { name: 'instlPicNm', label: '설치이미지명', type: 'file' },
      ],
      [
        { name: 'rmrk', label: '비고', type: 'textarea' },
      ]
    ]
  },

  mnulVo: {
    fields: [
      [
        { name: 'mnlNm1', label: '메뉴얼명(우즈벡)', type: 'text'},
        { name: 'filePath1', label: '메뉴얼 파일(우즈벡)', type: 'file' },
      ],
      [
        { name: 'mnlNm2', label: '메뉴얼명(러시아)', type: 'text' },
        { name: 'filePath2', label: '메뉴얼 파일(러시아)', type: 'file' },
      ],
      [
        { name: 'mnlNm3', label: '메뉴얼명(영어)', type: 'text' },
        { name: 'filePath3', label: '메뉴얼 파일(영어)', type: 'file' },
      ],
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
  bzenty: {
    fields: [
      [
        { name: 'bzentyNm1', label: '업체명1', type: 'text', required: true }
      ],
      [
        { name: 'bzentyNm2', label: '업체명2', type: 'text', required: true }
      ],
      [
        { name: 'bzentyNm3', label: '업체명3', type: 'text', required: true }
      ],
      [
        { name: 'telno', label: '전화번호', type: 'text' },
        { name: 'eml', label: '이메일', type: 'text' }
      ],
      [
        { name: 'picNm', label: '담당자', type: 'text' }
      ],
      [
        { name: 'useYn', label: '사용여부', type: 'radio' }
      ]
    ]
  },
}

