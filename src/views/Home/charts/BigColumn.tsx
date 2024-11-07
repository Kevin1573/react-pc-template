import { Column } from "@ant-design/charts";
import { useThemeStore } from "@/store/theme";
import { data } from "../data";

export default function BigColumn() {
  const { isDark } = useThemeStore();

  const config = {
    data,
    xField: "月份",
    yField: "月均降雨量",
    stack: true,
    colorField: "name",
    axis: {
      x: {
        labelFontSize: 14,
        labelAlign: "horizontal",
        labelFill: isDark === "dark" ? "#fff" : "#141414",
        tickStroke: isDark === "dark" ? "#fff" : "#141414",
      },
      y: {
        labelFontSize: 16,
        labelFill: isDark === "dark" ? "#fff" : "#141414",
        tickStroke: isDark === "dark" ? "#fff" : "#141414",
      },
    },
  };
  return <Column {...config} />;
}
