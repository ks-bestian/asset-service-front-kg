import * as yup from 'yup';
import msg from '@/utils/message'
import { useForm } from 'vee-validate'

//입력 필드에 대한 유효성 검사 스키마를 생성하는 함수
export function createYupValidate(list) {
  const shape = {};
  list.forEach(fields => {
    fields.forEach(({ name, label, type, required }) => {

      //todo 유효성 검사 type별 세분화 하기
      /*
      if (required) {
        shape[name] = yup.string().required(msg.validation.missing(label));
      } else {
        shape[name] = yup.string().nullable();
      }
        */

      let validator;

      switch (type) {
        case 'string':
        case 'text':
        case 'date':
        case 'datetime':
          validator = yup.string();
          break;
        case 'number':
          validator = yup.number();
          break;
        case 'file':
        case 'image':
        case 'object':
          validator = yup.mixed(); // 어떤 타입이든 허용 (object 가능)
          break;
        case 'array':
          validator = yup.array();
          break;
        default:
          validator = yup.mixed(); // 안전하게 처리
      }

      if (required) {
        validator = validator.required(msg.validation.missing(label));
      } else {
        validator = validator.nullable();
      }

      shape[name] = validator;

    });
  })

  return yup.object().shape(shape);
}

export function useYupForm(schema, initial = {}) {
  const form = useForm({
    validationSchema: schema,
    initialValues: initial,
  })
  return form 
}