export interface UploadResponse {
  fileName: string;
  url: string;
  key: string;
  eTag: string;
}

export interface UploadRequest {
  file: Express.Multer.File;
  relativePath?: string;

  baseName?: string;
}
