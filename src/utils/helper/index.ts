import { ClassTransformOptions, plainToClass, Transform } from 'class-transformer';

export const circularToJSON = (circular: unknown) => JSON.parse(JSON.stringify(circular));

export function generateViewModel<T, V>(cls: { new(...args: any[]): T }, obj: V[], options?: ClassTransformOptions): T[];
export function generateViewModel<T, V>(cls: { new(...args: any[]): T }, obj: V, options?: ClassTransformOptions): T;
export function generateViewModel(...args: any[]) {
  const result = plainToClass(args[0], circularToJSON(args[1]),
    {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
      enableImplicitConversion: true,
      ...args[2],
    });
  return result as unknown;
}

export function Default(defaultValue: unknown): PropertyDecorator {
  return Transform((obj: any) => obj?.value ?? defaultValue);
}
