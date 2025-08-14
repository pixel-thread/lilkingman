import { RefreshControl, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import http from '~/src/utils/http';
import { ImageI } from '~/src/types/Image';
import { PHOTOS_ENDPOINT } from '~/src/lib/constants/endpoints/photo';
import { LoadingImages } from '../../common/Skeleton/LoadingImages';
import { NoPhoto } from '../../common/NoPhoto';
import { ImageGrid } from '../../common/ImageGrid';

export const GalleryScreen = () => {
  const {
    data,
    refetch: refetchImages,
    isFetching: isImagesLoading,
  } = useQuery({
    queryKey: ['featured images'],
    queryFn: () => http.get<ImageI[]>(PHOTOS_ENDPOINT.GET_FEATURED_PHOTO),
    select: (data) => data.data,
  });

  if (isImagesLoading) {
    return <LoadingImages />;
  }

  if (data?.length === 0) {
    return <NoPhoto refetch={refetchImages} isLoading={isImagesLoading} />;
  }
  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={isImagesLoading} onRefresh={refetchImages} />}>
      <ImageGrid data={data} />
    </ScrollView>
  );
};
