// 声明 全局变量
declare interface Window {
  TMap: any;
}

// 声明 数组
declare type EmptyArrayType<T = any> = T[];

// 声明 对象
declare type EmptyObjectType<T = any> = {
  [key: string]: T;
};

// 声明 请求结果
declare type HttpResultType<T = any> = {
  code: number;
  data: T;
  message: string | EmptyObjectType;
};
