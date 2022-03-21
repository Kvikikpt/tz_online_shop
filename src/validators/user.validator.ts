import * as yup from 'yup';

export const userValidator = yup.object({
  name: yup.string().required(),
  password: yup.string().required(),
});
