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
      console.log(i18n.global.t('4'));
      console.log(fieldName);
      //return replaceParams(i18n.global.t('4'), { fieldName: fieldName });
      return i18n.global.t('4',{ fieldName: fieldName });
    },
    duplicate(fieldName = 'default') {
      if(fieldName == 'default'){
        return i18n.global.t('5')
      }else{
        //return `이미 존재하는 ${fieldName}입니다.`
        return i18n.global.t('6', { fieldName: fieldName });
      }
    },
    format: {
      file(fieldName = 'default') {
        if(fieldName == 'default'){
          return i18n.global.t('7')
        }else{
          //return `지원하지 않는 파일 형식입니다. ${fieldName} 형식을 확인해주세요.`
          return i18n.global.t('8', { fieldName: fieldName });
        }
      },
      text(fieldName = 'default') {
        if(fieldName == 'default'){
          return i18n.global.t('9')
        }else{
          //return `${fieldName} 형식을 확인해주세요.`
          return i18n.global.t('10', { fieldName: fieldName });
        }
      },
    },
  },
  confirm: {
    create(fieldName = 'default'){
      if(fieldName == 'default'){
        return i18n.global.t('11')
      }else{
        //return `${fieldName}을 등록하시겠습니까?`
        return i18n.global.t('12', { fieldName: fieldName });
      }
    }, 
    update(fieldName = 'default'){
      if(fieldName == 'default'){
        return i18n.global.t('13')
      }else{
        //return `${fieldName}을 수정하시겠습니까?`
        return i18n.global.t('14', { fieldName: fieldName });
      }
    },
    delete(fieldName = 'default'){
      if(fieldName == 'default'){
        return i18n.global.t('15')
      }else{
        //return `${fieldName}을 삭제하시겠습니까?`
        return i18n.global.t('16', { fieldName: fieldName });
      }
    }
  },
  completed: {
    create(fieldName = 'default'){
      if(fieldName == 'default'){
        return i18n.global.t('17')
      }else{
        //return `${fieldName}이 등록되었습니다.`
        return i18n.global.t('18', { fieldName: fieldName });
      }
    }, 
    update(fieldName = 'default'){
      if(fieldName == 'default'){
        return i18n.global.t('19')
      }else{
        //return `${fieldName}이 수정되었습니다.`
        return i18n.global.t('20', { fieldName: fieldName });
      }
    },
    delete(fieldName = 'default'){
      if(fieldName == 'default'){
        return i18n.global.t('21')
      }else{
        //return `${fieldName}이 삭제되었습니다.`
        return i18n.global.t('22', { fieldName: fieldName });
      }
    }
  },
  failed: {
    create(fieldName = 'default'){
      if(fieldName == 'default'){
        return i18n.global.t('23')
      }else{
        //return `${fieldName} 등록에 실패했습니다. 다시 시도해주세요.`
        return i18n.global.t('24', { fieldName: fieldName });
      }
    }, 
    update(fieldName = 'default'){
      if(fieldName == 'default'){
        return i18n.global.t('25')
      }else{
        //return `${fieldName} 수정에 실패했습니다. 다시 시도해주세요.`
        return i18n.global.t('26', { fieldName: fieldName });
      }
    },
    delete(fieldName = 'default'){
      if(fieldName == 'default'){
        return i18n.global.t('27')
      }else{
        //return `${fieldName} 삭제에 실패했습니다. 다시 시도해주세요.`
        return i18n.global.t('28', { fieldName: fieldName });
      }
    }
  },
  info: {
    send() {
      return i18n.global.t('29')
    },
  },
  error: {
    system() {
      return i18n.global.t('30')
    },
  },
}

export default msg 


