import { RenderImageItem } from './RenderImageItems';
import { ImageI } from '~/src/types/Image';
import { useImageViewModalStore } from '~/src/lib/store/useImageViewerModal';
import { FlashList } from '@shopify/flash-list';
import { ImageViewerModal } from './ImageViewerModal';
import { Ternary } from './Ternary';

type ImageGridProps = {
  data?: ImageI[] | undefined | null;
};
export const ImageGrid = ({ data = [] }: ImageGridProps) => {
  const { onImageChange, open, image } = useImageViewModalStore();

  return (
    <>
      <FlashList
        data={data}
        renderItem={({ item, index }) => (
          <RenderImageItem item={item} index={index} imagePress={onImageChange} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={3}
        className="flex-1 pt-0"
        contentContainerClassName="space-between"
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
      <Ternary
        condition={!!image && open}
        trueComponent={<ImageViewerModal />}
        falseComponent={null}
      />
    </>
  );
};
