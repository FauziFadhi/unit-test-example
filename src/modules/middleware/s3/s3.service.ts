import { AwsConfigService } from '@config/aws/config.provider';
import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { DeleteObjectRequest, ManagedUpload, PutObjectRequest } from 'aws-sdk/clients/s3';
import * as moment from 'moment';
import { extname, join } from 'path';

import { UploadRequest } from './interface/upload.interface';

@Injectable()
export class S3Service {
  private bucket: string;

  s3: S3;

  constructor(
    private readonly awsConfigService: AwsConfigService,
  ) {
    this.s3 = this.setup();
    this.bucket = awsConfigService.bucket;
  }

  private setup() {
    return new S3({
      credentials: {
        accessKeyId: this.awsConfigService.accessKeyId,
        secretAccessKey: this.awsConfigService.secretAccessKey,
      },
      region: this.awsConfigService.defaultRegion,
    });
  }

  private async uploadObject(file: Express.Multer.File, fullPath: string) {
    const params: PutObjectRequest = {
      Bucket: this.bucket,
      Key: fullPath,
      ContentType: file.mimetype,
      Body: file.buffer,
      ACL: 'public-read',
    };
    return this.s3.upload(params).promise();
  }

  /**
   * filename with extension
   * @param fileName
   */
  private async removeObject(fullPath: string) {
    const params: DeleteObjectRequest = {
      Bucket: this.bucket,
      Key: fullPath,
    };

    return this.s3.deleteObject(params).promise();
  }

  getFileName(file: Express.Multer.File, baseName?: string): string {
    const fileExt = extname(file.originalname);
    const dateFileName = moment().format('YYYYMMDDHHmmss');
    return baseName
      ? `${baseName.split('.')[0]}${fileExt}`
      : `${dateFileName}${fileExt}`;
  }

  getFullPath(fileName: string, relativePath?: string): string {
    return join(this.awsConfigService.directory, relativePath, fileName);
  }

  /**
   * upload file to S3 based on your bucket with prefixed folder before relative path
   * @param req
   * @returns
   */
  async uploadFile(req: UploadRequest): Promise<ManagedUpload.SendData & { fileName: string }> {
    const fileName = this.getFileName(req.file, req.baseName);
    const fullPath = this.getFullPath(fileName, req.relativePath);

    const uploaded = await this.uploadObject(req.file, fullPath);

    return {
      ...uploaded,
      fileName,
    };
  }

  /**
   * remove file from S3
   * @param fileName
   * @param relativePath
   * @returns
   */
  async removeFile(fileName: string, relativePath?: string) {
    const fullPath = this.getFullPath(fileName, relativePath);

    return this.removeObject(fullPath);
  }

  /**
   * remove and upload new file, you replace the buffer or remove old file and upload new file to different path
   * @param {UploadRequest} newFile set `relativePath` and `baseName` to null or undefined to use both value from oldFile
   * @param oldFile
   * @returns
   */
  async replaceFile(newFile: UploadRequest, oldFile: { relativePath: string, fileName: string }): Promise<ManagedUpload.SendData & { fileName: string }> {
    await this.removeFile(oldFile.fileName, oldFile.relativePath);

    return this.uploadFile({
      file: newFile.file,
      baseName: newFile.baseName || oldFile.fileName.split('.')[0],
      relativePath: newFile.relativePath || oldFile.relativePath,
    });
  }
}
