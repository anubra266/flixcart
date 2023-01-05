export function groupBy<I extends Record<string, any>>(xs: I[], f: (item: I) => any) {
  return xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {})
}
