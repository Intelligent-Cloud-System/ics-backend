type HTTPFabricDecorator = (path?: string | string[]) => MethodDecorator;

export interface MethodsAuthApi {
  GetAuth: HTTPFabricDecorator;
  PostAuth: HTTPFabricDecorator;
  PutAuth: HTTPFabricDecorator;
  DeleteAuth: HTTPFabricDecorator;
  PatchAuth: HTTPFabricDecorator;
  AllAuth: HTTPFabricDecorator;
  OptionsAuth: HTTPFabricDecorator;
  HeadAuth: HTTPFabricDecorator;
}
