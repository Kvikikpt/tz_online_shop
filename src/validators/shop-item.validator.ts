import * as yup from 'yup';
import { BIGINT_MAX_VALUE, BIGINT_MIN_VALUE } from '../constants';

export const shopItemValidator = yup.object({
  name: yup.string().max(255).required(),
  price: yup.number().max(BIGINT_MAX_VALUE).min(BIGINT_MIN_VALUE).required(),
  weight: yup.number().max(BIGINT_MAX_VALUE).min(BIGINT_MIN_VALUE).required(),
  startDate: yup.date().required(),
  endDate: yup.date().required(),
});
