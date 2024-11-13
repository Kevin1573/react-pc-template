// 问题：React 中使用 fowardRef 包裹组件后，会丢失组件的泛型
// 方案：使用修复的 fixedForwardRef 函数类型覆盖原来的 forwardRef

import React from "react";

type FixedForwardRef = <T, P = {}>(
  render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
) => (props: P & React.RefAttributes<T>) => React.ReactElement | null;

export const fixedForwardRef = React.forwardRef as FixedForwardRef;
