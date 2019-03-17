import {
  Transform,
  createIdentity,
  createRotation,
  createScale,
  createTranslation
} from '../src/transforms'

describe('Transform', () => {
  describe('#apply', () => {
    test('apply identity', () => {
      // prettier-ignore
      const matrix = [
        2, 3, 5,
        3, 5, 6,
        8, 8, 9,
      ]
      const transform = new Transform(matrix)
      const identity = createIdentity()
      transform.apply(identity)
      // prettier-ignore
      expect(transform.array).toEqual(matrix);
    })

    test('apply translation', () => {
      // prettier-ignore
      const transform = createIdentity()
      const x = 10
      const y = 30
      transform.apply(createTranslation(x, y))
      // prettier-ignore
      expect(transform.array).toEqual([
        1, 0, x,
        0, 1, y,
        0, 0, 1,
      ]);
    })
    test('apply scale', () => {
      // prettier-ignore
      const transform = createIdentity()
      const x = 10
      const y = 30
      transform.apply(createScale(x, y))
      // prettier-ignore
      expect(transform.array).toEqual([
        x, 0, 0,
        0, y, 0,
        0, 0, 1,
      ]);
    })
    test('apply rotation', () => {
      // prettier-ignore
      const transform = createIdentity()
      const a = Math.PI / 2
      transform.apply(createRotation(a))
      // prettier-ignore
      expect(transform.array).toEqual([
        Math.cos(a), -Math.sin(a), 0,
        Math.sin(a), Math.cos(a), 0,
        0, 0, 1,
      ]);
    })
    test('apply translate and scale', () => {
      // prettier-ignore
      const transform = createIdentity()
      const sx = 2
      const sy = 3
      transform.apply(createTranslation(-5, -15))
      expect(transform.array).toEqual([1, 0, -5, 0, 1, -15, 0, 0, 1])
      transform.apply(createScale(sx, sy))
      // prettier-ignore
      expect(transform.array).toEqual([
        sx, 0, -5,
        0, sy, -15,
        0, 0, 1,
      ]);
      transform.apply(createTranslation(20, 30))
      // prettier-ignore
      expect(transform.array).toEqual([
        sx, 0, 35,
        0, sy, 75,
        0, 0, 1,
      ]);
    })
  })
})

describe('createIdentity', () => {
  test('returns identity matrix as Transform', () => {
    // prettier-ignore
    expect(createIdentity().array).toEqual([
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    ]);
  })
}),
  describe('createRotation', () => {
    test('returns rotation matrix as Transform', () => {
      const angle = Math.PI / 2
      // prettier-ignore
      expect(createRotation(angle).array).toEqual([
        6.123233995736766e-17,-1, 0,
        1, 6.123233995736766e-17, 0,
        0, 0, 1
      ]);
    })
  }),
  describe('createScale', () => {
    test('returns scale matrix as Transform', () => {
      // prettier-ignore
      expect(createScale(2,5).array).toEqual([
        2, 0, 0,
        0, 5, 0,
        0, 0, 1
      ]);
    })
  }),
  describe('createTranslation', () => {
    test('returns translation matrix as Transform', () => {
      // prettier-ignore
      expect(createTranslation(2, 4).array).toEqual([
        1, 0, 2,
        0, 1, 4,
        0, 0, 1
      ]);
    })
  })
