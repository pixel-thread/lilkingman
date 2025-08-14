import { RefreshControl, ScrollView } from 'react-native';
import { useEventContext } from '~/src/hooks/event/useEventContext';
import { Ternary } from '../../common/Ternary';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import http from '~/src/utils/http';
import { PHOTOS_ENDPOINT } from '~/src/lib/constants/endpoints/photo';
import { ImageI } from '~/src/types/Image';
import { LoadingImages } from '../../common/Skeleton/LoadingImages';
import { NoPhoto } from '../../common/NoPhoto';
import { ImageGrid } from '../../common/ImageGrid';

export const EventScreen = () => {
  const { event, isEventLoading, refresh } = useEventContext();

  const {
    data,
    refetch: refetchImages,
    isFetching: isImagesFetching,
  } = useQuery({
    queryKey: ['event', event?.id],
    queryFn: () =>
      http.get<ImageI[]>(PHOTOS_ENDPOINT.GET_EVENT_PHOTO.replace(':id', event?.id ?? '')),
    select: (data) => data.data,
    enabled: !!event?.id,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60, // 1 minute
  });

  if (isImagesFetching) {
    return <LoadingImages />;
  }

  if (!event) {
    return (
      <NoPhoto
        title="Sorry!"
        description="There is no event currently under your account. Please join an event."
        isLoading={isEventLoading}
        refetch={refresh}
        icon="calendar-outline"
      />
    );
  }

  return (
    <>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isImagesFetching} onRefresh={refetchImages} />}
        className="flex-1 bg-background">
        <Ternary
          condition={data?.length === 0}
          trueComponent={<NoPhoto refetch={refetchImages} isLoading={isImagesFetching} />}
          falseComponent={<ImageGrid data={data} />}
        />
      </ScrollView>
    </>
  );
};
