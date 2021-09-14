import { ClassTransformOptions, plainToClass } from 'class-transformer';

export const circularToJSON = (circular: unknown) => JSON.parse(JSON.stringify(circular));

export function generateViewModel<T, V>(cls: { new(...args: any[]): T }, obj: V[], options?: ClassTransformOptions): T[];
export function generateViewModel<T, V>(cls: { new(...args: any[]): T }, obj: V, options?: ClassTransformOptions): T;
export function generateViewModel(...args: any[]) {
  const result = plainToClass(args[0], circularToJSON(args[1]),
    {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
      enableImplicitConversion: true,
      exposeDefaultValues: true,
      ...args[2],
    });
  return result as unknown;
}
