import {
  ArgumentMetadata,
  flatten,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';

import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { VALIDATION_CODE } from '../error';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const mappedErrors = await Promise.all(
        errors.map(async (error) => {
          if (error?.children?.length === 0 && error?.constraints) {
            return this.transformError(error);
          }

          if (error?.children?.[0]) {
            return this.getChildrenConstraint(error.children[0]);
          }
          return null;
        }),
      );
      throw new UnprocessableEntityException(
        flatten(mappedErrors),
        VALIDATION_CODE,
      );
    }
    return value;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private getChildrenConstraint(children: any) {
    if (children.constraints) return this.transformError(children);

    const grandChildren = children.children[0];
    return this.getChildrenConstraint(grandChildren);
  }

  private transformError(error) {
    const messages = Object.values(error.constraints);
    return messages.map((message) => ({
      field: error.property,
      message,
    }));
  }
}
