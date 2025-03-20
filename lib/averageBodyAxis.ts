export function averageBodyAxis(axes: {p1: Point; p2: Point}[]): {
  p1: Point;
  p2: Point;
} {
  if (axes.length === 0) {
    return {p1: {x: 0, y: 0}, p2: {x: 0, y: 0}};
  }

  // 重み付き平均をとるなら、calcAverageKeypoints の発想をそのまま流用！
  let totalWeight = 0;
  const result = {p1: {x: 0, y: 0}, p2: {x: 0, y: 0}};
  const len = axes.length;

  for (let i = 0; i < len; i++) {
    // 例として、左右対称の三角配列的な重み
    const weight = (len - 1) / 2 - Math.abs((len - 1) / 2 - i) + 1;
    totalWeight += weight;
    result.p1.x += axes[i].p1.x * weight;
    result.p1.y += axes[i].p1.y * weight;
    result.p2.x += axes[i].p2.x * weight;
    result.p2.y += axes[i].p2.y * weight;
  }

  result.p1.x /= totalWeight;
  result.p1.y /= totalWeight;
  result.p2.x /= totalWeight;
  result.p2.y /= totalWeight;

  return result;
}
