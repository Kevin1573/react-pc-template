const console_warn = console.warn;
console.warn = function (...args) {
  const message = args.join(" ");
  if (typeof message === "string" && message.includes("React Router Future Flag Warning")) {
    return;
  }
  console_warn.apply(console, args);
  // console_warn.apply(console, arguments);  //这个写法也可以
};
