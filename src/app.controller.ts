import {
  Body, Controller,
  Post, UploadedFile, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@UseGuards(AuthGuard(['cms-auth']))
@Controller({
  path: 'cms/part-msrp',
})
export class AppController {
  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async impot(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    console.log(file);
  }
}
