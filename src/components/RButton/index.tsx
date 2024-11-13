import React from "react";
import { Button, ConfigProvider, type ButtonProps } from "antd";

type BtnType = "default" | "primary" | "success" | "warning" | "error" | "info";
interface RButtonProps extends ButtonProps {
  btn_type?: BtnType;
  btn_variant?: "link" | "text" | "solid" | "dashed" | "outlined" | "filled";
}

const colorSchema: Record<BtnType, string> = {
  default: "#1D1D1D",
  primary: "#1677FF",
  success: "#52c41a",
  warning: "#faad14",
  error: "#FF4D4F",
  info: "#13C2C2",
};

const RButton = React.memo(({ btn_type = "primary", btn_variant = "solid", ...rest }: RButtonProps) => {
  switch (btn_type) {
    case "default":
      // defalut 的颜色用 algorithm 算不准，所以使用原版样式
      return <Button color="default" variant={btn_variant} {...rest} />;
    default:
      return (
        <ConfigProvider
          theme={{
            components: {
              Button: {
                algorithm: true,
                colorPrimary: colorSchema[btn_type],
              },
            },
          }}
        >
          <Button color="primary" variant={btn_variant} {...rest} />
        </ConfigProvider>
      );
  }
});

export default RButton;
