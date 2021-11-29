import { Controller } from '@nestjs/common/interfaces';
import { applyDecorators } from '@nestjs/common';
import { RequestMethod } from '@nestjs/common/enums/request-method.enum';
import * as methodsApi from '@nestjs/common/decorators/http/request-mapping.decorator';
import { MethodsAuthApi } from '../interface/decorator/auth.decorator.interface';

type HTTPFabricDecorator = (path?: string | string[]) => MethodDecorator;

const ApiAuthWritter =
  (): MethodDecorator =>
  <T>(
    target: Controller,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ) => {
    console.log({
      target,
      propertyKey,
      descriptor,
    });

    return descriptor;
  };

const HttpAuthMethod =
  (method: HTTPFabricDecorator) =>
  (path?: string): MethodDecorator => {
    return applyDecorators(ApiAuthWritter(), method(path || ''));
  };

const keys: Array<string> = Object.keys(RequestMethod)
  .filter((i) => isNaN(Number(i)))
  .map((s: string) => s[0].toUpperCase() + s.slice(1).toLowerCase());

const methodsAuthApi: MethodsAuthApi = keys.reduce(
  (acc, methodName: string) => (
    (acc[methodName + 'Auth'] = HttpAuthMethod(methodsApi[methodName])), acc
  ),
  Object.create(null)
);

export default { ...methodsAuthApi };
