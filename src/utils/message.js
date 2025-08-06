import i18n from '@/i18n' // i18n 인스턴스 import


/*
누락	Missing
중복	Duplicate
완료	Completed
실패	Failed
확인	Confirm
형식오류	Format
안내	info
에러	Error

msg
  - validation
    - missing()      : 필수값
    - duplicate()    : 중복체크
    - format
      - file()       : 파일 형식
      - text()       : 입력값 형식
  - confirm
    - create()       : 등록?
    - update()       : 수정?
    - delete()       : 삭제?
  - completed
    - create()       : 등록O
    - update()       : 수정O
    - delete()       : 삭제O
  - failed
    - create()       : 등록X
    - update()       : 수정X
    - delete()       : 삭제X
  - info
    - send()         : 이메일, 와치앱, SMS로 전송할 수 있습니다.
  - error
    - system()       : 시스템 오류

*/

export function replaceParams(template, params = {}) {
  return template.replace(/{([^}]+)}/g, (_, key) => {
    return params[key] !== undefined ? params[key] : `{${key}}`
  })
}

export const msg = {
  validation: {
    missing(fieldName = 'default') {
      //return replaceParams(i18n.global.t('000000(메세지)'), { fieldName: i18n.global.t('000000(라벨)') });
      //return `${fieldName}은(는) 필수 입력입니다.`
      //console.log(i18n.global.t('10697'));
      //console.log(fieldName);
      //return replaceParams(i18n.global.t('4'), { fieldName: fieldName });
      return i18n.global.t('10697',{ fieldName: fieldName });
    },
    duplicate(fieldName = 'default') {
      if(fieldName == 'default'){
        return i18n.global.t('10698')
      }else{
        //return `이미 존재하는 ${fieldName}입니다.`
        return i18n.global.t('10699', { fieldName: fieldName });
      }
    },
    format: {
      file(fieldName = 'default') {
        if(fieldName == 'default'){
          return i18n.global.t('10700')
        }else{
          //return `지원하지 않는 파일 형식입니다. ${fieldName} 형식을 확인해주세요.`
          return i18n.global.t('10701', { fieldName: fieldName });
        }
      },
      text(fieldName = 'default') {
        if(fieldName == 'default'){
          return i18n.global.t('10702')
        }else{
          //return `${fieldName} 형식을 확인해주세요.`
          return i18n.global.t('10703', { fieldName: fieldName });
        }
      },
    },
  },
  confirm: {
    create(fieldName = 'default'){
      if(fieldName == 'default'){
        return i18n.global.t('10704')
      }else{
        //return `${fieldName}을 등록하시겠습니까?`
        return i18n.global.t('10705', { fieldName: fieldName });
      }
    }, 
    update(fieldName = 'default'){
      if(fieldName == 'default'){
        return i18n.global.t('10706')
      }else{
        //return `${fieldName}을 수정하시겠습니까?`
        return i18n.global.t('10707', { fieldName: fieldName });
      }
    },
    delete(fieldName = 'default'){
      if(fieldName == 'default'){
        return i18n.global.t('10708')
      }else{
        //return `${fieldName}을 삭제하시겠습니까?`
        return i18n.global.t('10709', { fieldName: fieldName });
      }
    }
  },
  completed: {
    create(fieldName = 'default'){
      if(fieldName == 'default'){
        return i18n.global.t('10710')
      }else{
        //return `${fieldName}이 등록되었습니다.`
        return i18n.global.t('10711', { fieldName: fieldName });
      }
    }, 
    update(fieldName = 'default'){
      if(fieldName == 'default'){
        return i18n.global.t('10712')
      }else{
        //return `${fieldName}이 수정되었습니다.`
        return i18n.global.t('10713', { fieldName: fieldName });
      }
    },
    delete(fieldName = 'default'){
      if(fieldName == 'default'){
        return i18n.global.t('10714')
      }else{
        //return `${fieldName}이 삭제되었습니다.`
        return i18n.global.t('10715', { fieldName: fieldName });
      }
    }
  },
  failed: {
    create(fieldName = 'default'){
      if(fieldName == 'default'){
        return i18n.global.t('10716')
      }else{
        //return `${fieldName} 등록에 실패했습니다. 다시 시도해주세요.`
        return i18n.global.t('10717', { fieldName: fieldName });
      }
    }, 
    update(fieldName = 'default'){
      if(fieldName == 'default'){
        return i18n.global.t('10718')
      }else{
        //return `${fieldName} 수정에 실패했습니다. 다시 시도해주세요.`
        return i18n.global.t('10719', { fieldName: fieldName });
      }
    },
    delete(fieldName = 'default'){
      if(fieldName == 'default'){
        return i18n.global.t('10720')
      }else{
        //return `${fieldName} 삭제에 실패했습니다. 다시 시도해주세요.`
        return i18n.global.t('10721', { fieldName: fieldName });
      }
    }
  },
  info: {
    send() {
      return i18n.global.t('10722')
    },
  },
  error: {
    system() {
      return i18n.global.t('10723')
    },
  },
}

export default msg 


