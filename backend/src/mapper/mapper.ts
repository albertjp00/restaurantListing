
export const mapImagesToDto = (images: any[]): ImageDto[] => {
  return images.map((image) => ({
    _id: image._id.toString(),
    title: image.title,
    image: image.image,
    order: image.order
  }));
};

export interface ImageDto {
  _id: string;
  title: string;
  image: string;
  order: number;
}