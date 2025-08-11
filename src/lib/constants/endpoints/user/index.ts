import { EndpointT } from '@/types/endpoints';

type UsersEndpointKeys = 'GET_USERS';

export const USERS_ENDPOINT: EndpointT<UsersEndpointKeys> = {
  GET_USERS: '/user',
};
