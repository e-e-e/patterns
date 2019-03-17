export class Transform {
  constructor(values) {
    if (values) {
      this.array = Array.from(values)
    } else {
      // prettier-ignore
      this.array = [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0
      ]
    }
  }
  apply(t) {
    const n = new Array(9)
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        let v = 0
        for (let k = 0; k < 3; k++) {
          v += t.array[c + k * 3] * this.array[r * 3 + k]
        }
        n[r * 3 + c] = v
      }
    }
    this.array = n
  }
  copy() {
    return new Transform(this.array)
  }
}

export function createIdentity() {
  // prettier-ignore
  return new Transform([
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
  ])
}

export function createTranslation(x, y) {
  // prettier-ignore
  return new Transform([
    1, 0, x,
    0, 1, y,
    0, 0, 1
  ])
}

export function createScale(x, y) {
  // prettier-ignore
  return new Transform([
    x, 0, 0,
    0, y, 0,
    0, 0, 1
  ])
}

export function createRotation(radian) {
  const cos = Math.cos(radian)
  const sin = Math.sin(radian)
  // prettier-ignore
  return new Transform([
    cos, -sin, 0,
    sin,  cos, 0,
    0,    0,   1
  ])
}
