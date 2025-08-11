import { EndpointT } from '@/types/endpoints';

type PhotosEndpointKeys =
  | 'POST_ADD_PHOTOS'
  | 'DELETE_PHOTOS'
  | 'GET_USERS_PHOTOS'
  | 'GET_FEATURED_PHOTO'
  | 'POST_ADD_FEATURED_PHOTO'
  | 'GET_EVENT_PHOTO'
  | 'POST_ADD_EVENT_PHOTO';

export const PHOTOS_ENDPOINT: EndpointT<PhotosEndpointKeys> = {
  POST_ADD_PHOTOS: '/photo',
  DELETE_PHOTOS: '/photo/:photoId',
  GET_USERS_PHOTOS: '/photo/user/:id',
  GET_FEATURED_PHOTO: '/photo/featured',
  POST_ADD_FEATURED_PHOTO: '/photo/featured',
  GET_EVENT_PHOTO: '/photo/event/:id',
  POST_ADD_EVENT_PHOTO: '/photo/event/:id',
};
