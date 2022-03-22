import * as yup from 'yup';
import { POSTGRES_INT_MAX_VALUE, POSTGRES_INT_MIN_VALUE } from '../constants';

export const shopItemValidator = yup.object({
  name: yup.string().max(255).required(),
  price: yup.number().max(POSTGRES_INT_MAX_VALUE).min(POSTGRES_INT_MIN_VALUE).required(),
  weight: yup.number().max(POSTGRES_INT_MAX_VALUE).min(POSTGRES_INT_MIN_VALUE).required(),
  startDate: yup.date().required(),
  endDate: yup.date().required(),
});
