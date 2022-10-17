import * as Yup from 'yup'

export const createValidationSchema = (params: Record<string, any>) => {
  return Yup.object().shape(params || {})
}

export default Yup
