import { EndpointT } from '@/types/endpoints';

type PaymentEndpointKeys = 'POST_PAYMENT_CREATE_ORDER' | 'POST_PAYMENT_VERIFY';

export const PAYMENT_ENDPOINT: EndpointT<PaymentEndpointKeys> = {
  POST_PAYMENT_CREATE_ORDER: '/payment/create-order',
  POST_PAYMENT_VERIFY: '/payment/verify',
};
