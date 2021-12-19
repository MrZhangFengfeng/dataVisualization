import { applyAttributes, createSVGElement, mount } from "./utils";

export function shape(type, context, attributes) {
  const { group } = context;
  const el = createSVGElement(type);
  applyAttributes(el, attributes);

  mount(group, el);

  return el;
}

export function line(context, attributes) {
  return shape("line", context, attributes);
}

// rect 不支持 width 和 height 是负数
export function rect(context, attributes) {
  const { width, height, x, y } = attributes;

  return shape("rect", context, {
    ...attributes,
    width: Math.abs(width),
    height: Math.abs(height),
    x: width > 0 ? x : x + width,
    y: height > 0 ? y : y + height,
  });
}

export function circle(context, attributes) {
  return shape("circle", context, attributes);
}

export function text(context, attributes) {
  const { text, ...rest } = attributes;
  const textElement = shape("text", context, rest);
  textElement.textContent = text;
  return textElement;
}

// path 的属性 d （路径）是一个字符串，拼接起来比较麻烦，这里我们通过数组去生成
// [
//  ['M', 10, 10],    // M命令是移动画笔位置
//  ['L', 100, 100], // L需要两个参数，分别是一个点的x轴和y轴坐标，
//  ['L', 100, 10],  // L命令将会在当前位置和新位置（L前面画笔所在的点）之间画一条线段。
//  ['Z'],  // Z 闭合路径
// ];
// 上面的二维数组会被转换成如下的字符串
// 'M 10 10 L 100 100 L 100 10 Z'
export function path(context, attributes) {
  const { d } = attributes;
  return shape("path", context, { ...attributes, d: d.flat().join(" ") });
}

// 绘制圆环
// 用三个圆去模拟一个圆环，它们的填充色都是透明的，其中最大和最小两个圆的边框去模拟圆环的边框，中间大小的圆的边框去模拟圆环本身
export function ring(context, attributes) {
  // r1 是内圆的半径，r2 是外圆的半径
  const { cx, cy, r1, r2, ...styles } = attributes;
  const { stroke, strokeWidth, fill } = styles;
  const defaultStrokeWidth = 1;
  const innerStroke = circle(context, {
    fill: "transparent",
    stroke: stroke || fill,
    strokeWidth,
    cx,
    cy,
    r: r1,
  });
  const ring = circle(context, {
    ...styles,
    strokeWidth: r2 - r1 - (strokeWidth || defaultStrokeWidth),
    stroke: fill,
    fill: "transparent",
    cx,
    cy,
    r: (r1 + r2) / 2,
  });
  const outerStroke = circle(context, {
    fill: "transparent",
    stroke: stroke || fill,
    strokeWidth,
    cx,
    cy,
    r: r2,
  });
  return [innerStroke, ring, outerStroke];
}
