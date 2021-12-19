import { applyTransform, createSVGElement, mount } from "./utils";

export function transform(type, context, ...params) {
  // type 是希望的变换种类：scale，translate，rotate 等
  const { group } = context;
  applyTransform(group, `${type}(${params.join(", ")})`);
}

export function translate(context, tx, ty) {
  transform("translate", context, tx, ty);
}

export function rotate(context, theta) {
  transform("rotate", context, theta);
}

export function scale(context, sx, sy) {
  transform("scale", context, sx, sy);
}

// 在使用坐标系变换的时候，除了应用对应变换之外，还应该实现对变换状态的管理。
// 这个地方的核心就是控制当前变换影响的元素范围。
// 基于 SVG 通过 g 元素来指定变换的特点，我们只用更新当前挂载节点，
// 使得当前变换只会影响当前挂载节点下面的元素即可。
export function save(context) {
  const { group } = context;
  const newGroup = createSVGElement("g");
  mount(group, newGroup);
  context.group = newGroup;
}
