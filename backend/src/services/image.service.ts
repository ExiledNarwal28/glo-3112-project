import { BadRequestError } from '../types/errors';
import { logger } from '../middlewares/logger';
import { ImageClient } from '../clients/image.client';
import { S3ImageClient } from '../clients/s3/s3.image.client';
import Jimp from 'jimp';

const DATA_TYPE_REGEX = /^data:image\/(?:png|jpeg)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/;
const MAX_FILE_SIZE_IN_BYTES = 2000000;
const THUMBNAIL_DIMENSIONS = { height: 400, width: 225 };
export class ImageService {
  private s3Client: ImageClient = new S3ImageClient();

  public async uploadAvatar(data: string): Promise<string> {
    logger.info('Uploading avatar');

    const buffer = ImageService.validateImage(data);
    return this.s3Client.uploadAvatar(buffer);
  }

  public async uploadPost(data: string): Promise<string> {
    logger.info('Uploading post');

    const buffer = ImageService.validateImage(data);
    return this.s3Client.uploadPost(buffer);
  }

  public async uploadThumbnail(
    data: string | undefined,
  ): Promise<string | null> {
    logger.info('Uploading thumbnail');
    if (data === undefined) return null;
    const buffer = ImageService.validateImage(data);

    let resizedBuffer = buffer;

    Jimp.read(buffer, (err, image) => {
      if (err) throw err;
      else {
        image
          .resize(THUMBNAIL_DIMENSIONS.height, THUMBNAIL_DIMENSIONS.width)
          .quality(100)
          .getBuffer(Jimp.MIME_JPEG, (err, src) => {
            resizedBuffer = src;
          });
      }
    });
    logger.info('LE CONTENU' + resizedBuffer);
    return this.s3Client.uploadPost(resizedBuffer);
  }

  private static validateImage(data: string): Buffer {
    ImageService.validateDataType(data);

    const parsedData = data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(parsedData, 'base64');
    ImageService.validateBufferSize(buffer);

    return buffer;
  }

  private static validateDataType(data: string) {
    if (!DATA_TYPE_REGEX.test(data)) {
      throw new BadRequestError('Invalid image type (not JPEG or PNG)');
    }
  }

  private static validateBufferSize(buffer: Buffer) {
    if (buffer.byteLength > MAX_FILE_SIZE_IN_BYTES) {
      throw new BadRequestError('Image too large (over 2mb)');
    }
  }
}
