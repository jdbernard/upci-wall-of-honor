import { AxiosInstance } from 'axios';
import SparkMD5 from 'spark-md5';
import { logService } from '@jdbernard/logging';
import apiHttp from '@/data/api-client';
import { Photo } from '@/data/minister.model';

interface FileType {
  mimeType: string;
  extensions: string[];
}

const SUPPORTED_FILE_TYPES: FileType[] = [
  { mimeType: 'image/gif', extensions: ['.gif'] },
  {
    mimeType: 'image/jpeg',
    extensions: ['.jpg', '.jpeg', '.jfif', '.pjpeg', '.pjp']
  },
  { mimeType: 'image/png', extensions: ['.png'] },
  { mimeType: 'image/webp', extensions: ['.webp'] }
];

export const SUPPORTED_EXTENSIONS: string = SUPPORTED_FILE_TYPES.map(
  ft => ft.extensions
)
  .reduce((extList, acc) => extList.concat(acc))
  .join(',');

const logger = logService.getLogger('/data/minister-photo-upload.service');

export class MinisterPhotoUploadService {
  constructor(private http: AxiosInstance) {}

  public async uploadPhoto(
    f: File,
    onProgress?: (e: ProgressEvent) => void
  ): Promise<Photo> {
    logger.trace({
      function: 'uploadPhoto',
      message: 'preparing upload',
      filename: f.name
    });
    const reader = new FileReader();

    const promise = new Promise<Photo>((resolve, reject) => {
      const fileType = MinisterPhotoUploadService.detectImageType(f.name);
      if (!fileType) {
        throw 'Unsupported or unknown filetype for image named ' + f.name;
      }

      reader.onload = () => {
        const fileContents: ArrayBuffer = reader.result as ArrayBuffer;
        logger.trace({
          function: 'uploadPhoto#promise',
          message: 'file read',
          fileSize: fileContents.byteLength
        });

        const hash = SparkMD5.ArrayBuffer.hash(fileContents);
        const filename = hash + fileType.extensions[0];

        this.http
          .post('/ministers/photo/' + filename, fileContents, {
            headers: { 'Content-Type': fileType.mimeType },
            onUploadProgress: onProgress || undefined
          })
          .then(() => {
            logger.trace({ function: 'uploadPhoto', message: 'success' });
            resolve({ uri: '/img/minister-photos/' + filename });
          })
          .catch(err => reject(err));
      };

      reader.readAsArrayBuffer(f);
    });

    return promise;
  }

  private static detectImageType(filename: string): FileType | undefined {
    return SUPPORTED_FILE_TYPES.find(ft =>
      ft.extensions.some(ext => filename.endsWith(ext))
    );
  }
}

export default new MinisterPhotoUploadService(apiHttp);
