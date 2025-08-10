import { EndpointT } from '@/types/endpoints';

type EventEndpointKeys =
  | 'GET_EVENTS'
  | 'POST_ADD_EVENT'
  | 'GET_LATEST_EVENT'
  | 'GET_EVENT_USERS'
  | 'POST_REMOVE_EVENT_USER'
  | 'POST_ADD_EVENT_USER'
  | 'POST_ADD_EVENT_USER_EMAIL';

export const EVENTS_ENDPOINT: EndpointT<EventEndpointKeys> = {
  GET_EVENTS: '/event',
  POST_ADD_EVENT: '/event',
  GET_EVENT_USERS: '/event/:id/user',
  POST_REMOVE_EVENT_USER: '/event/:id/remove-user',
  GET_LATEST_EVENT: '/event/latest',
  POST_ADD_EVENT_USER_EMAIL: '/event/:id/assign-user/email',
  POST_ADD_EVENT_USER: '/event/:id/assign-user',
};
