import { ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '~/src/hooks/auth/useAuthContext';
import http from '~/src/utils/http';
import { PHOTOS_ENDPOINT } from '~/src/lib/constants/endpoints/photo';
import { NoPhoto } from '../../common/NoPhoto';
import { ImageI } from '~/src/types/Image';
import { LoadingImages } from '../../common/Skeleton/LoadingImages';
import { ImageGrid } from '../../common/ImageGrid';
import { RefreshControl } from 'react-native-gesture-handler';

export const PhotoScreen = () => {
  const { user } = useAuthContext();

  const { data, refetch, isLoading, isFetching } = useQuery({
    queryKey: ['my-photos', user?.id],
    queryFn: () => http.get<ImageI[]>(PHOTOS_ENDPOINT.GET_USERS_PHOTOS.replace(':id', user?.id!)),
    select: (data) => data.data,
    enabled: !!user?.id,
  });

  if (isFetching || isLoading) {
    return <LoadingImages />;
  }

  if (data?.length === 0) {
    return <NoPhoto refetch={refetch} isLoading={isLoading} />;
  }

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}>
      <ImageGrid data={data} />
    </ScrollView>
  );
};
