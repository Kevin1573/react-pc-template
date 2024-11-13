// 声明 全局变量
declare interface Window {
  TMap: any;
}

// 声明 数组
declare type AnyArrayType = any[];

// 声明 对象
declare type AnyObjectType = {
  [key: string]: any;
  [key: number]: any;
  [key: symbol]: any;
};

// 声明 请求结果
declare type HttpResultType<T = any> = {
  code: number;
  data: T;
  message: string | AnyObjectType;
};
