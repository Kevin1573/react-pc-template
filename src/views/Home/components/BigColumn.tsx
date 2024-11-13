import { Column } from "@ant-design/charts";
import { useThemeStore } from "@/store/theme";

export default function BigColumn() {
  const { isDark } = useThemeStore();

  const config = {
    data: [
      { name: "London", 月份: "Jan.", 月均降雨量: 18.9 },
      { name: "London", 月份: "Feb.", 月均降雨量: 28.8 },
      { name: "London", 月份: "Mar.", 月均降雨量: 39.3 },
      { name: "London", 月份: "Apr.", 月均降雨量: 81.4 },
      { name: "London", 月份: "May", 月均降雨量: 47 },
      { name: "London", 月份: "Jun.", 月均降雨量: 20.3 },
      { name: "London", 月份: "Jul.", 月均降雨量: 24 },
      { name: "London", 月份: "Aug.", 月均降雨量: 35.6 },
      { name: "London", 月份: "Sep.", 月均降雨量: 55.2 },
      { name: "London", 月份: "Oct.", 月均降雨量: 45.7 },
      { name: "London", 月份: "Nov.", 月均降雨量: 33.5 },
      { name: "London", 月份: "Dec.", 月均降雨量: 21.8 },
      { name: "Berlin", 月份: "Jan.", 月均降雨量: 12.4 },
      { name: "Berlin", 月份: "Feb.", 月均降雨量: 23.2 },
      { name: "Berlin", 月份: "Mar.", 月均降雨量: 34.5 },
      { name: "Berlin", 月份: "Apr.", 月均降雨量: 99.7 },
      { name: "Berlin", 月份: "May", 月均降雨量: 52.6 },
      { name: "Berlin", 月份: "Jun.", 月均降雨量: 35.5 },
      { name: "Berlin", 月份: "Jul.", 月均降雨量: 37.4 },
      { name: "Berlin", 月份: "Aug.", 月均降雨量: 42.4 },
      { name: "Berlin", 月份: "Sep.", 月均降雨量: 49.3 },
      { name: "Berlin", 月份: "Oct.", 月均降雨量: 38.7 },
      { name: "Berlin", 月份: "Nov.", 月均降雨量: 26.5 },
      { name: "Berlin", 月份: "Dec.", 月均降雨量: 17.9 },
    ],
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
