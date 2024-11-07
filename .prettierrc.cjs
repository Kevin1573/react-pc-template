module.exports = {
  // 每行最大列，超过换行
  printWidth: 110,
  // 使用制表符而不是空格缩进
  useTabs: false,
  // 指定每个缩进级别的空格数
  tabWidth: 2,
  // 在语句末尾打印分号
  semi: true,
  // 使用单引号
  singleQuote: false,
  // 在JSX中使用单引号
  jsxSingleQuote: false,
  // 更改引用对象属性的时间 可选值"<as-needed|consistent|preserve>"
  quoteProps: "as-needed",
  // 多行时尽可能打印尾随逗号 可选值"<none|es5|all>"
  trailingComma: "es5",
  // 箭头函数里面，如果是一个参数的时候，去掉括号
  arrowParens: "avoid",
  // 对象、数组括号与文字间添加空格
  bracketSpacing: true,
  // 使用默认的折行标准 always\never\preserve
  proseWrap: "always",
  // 换行符使用 lf 结尾是 可选值"<auto|lf|crlf|cr>"
  endOfLine: "lf",
};
