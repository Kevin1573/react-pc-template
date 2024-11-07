import { Suspense } from "react";
import { Spin } from "antd";

// 路由懒加载组件
export const lazyLoader = (Component: React.LazyExoticComponent<() => JSX.Element>) => {
  return (
    <Suspense
      fallback={
        <Spin
          size="large"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      }
    >
      <Component />
    </Suspense>
  );
};
