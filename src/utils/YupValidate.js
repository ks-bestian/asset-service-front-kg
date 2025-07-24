import * as yup from 'yup';
import msg from '@/utils/message'
import { useForm } from 'vee-validate'

//입력 필드에 대한 유효성 검사 스키마를 생성하는 함수
export function createYupValidate(list) {
  const shape = {};
  list.forEach(fields => {
    fields.forEach(({ name, label, type, required }) => {

      //todo 유효성 검사 type별 세분화 하기
      if (required) {
        shape[name] = yup.string().required(msg.validation.missing(label));
      } else {
        shape[name] = yup.string().nullable();
      }
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