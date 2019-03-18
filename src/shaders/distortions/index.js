import standardVertexShader from '../common/standard.vert'
import scannerFragmentShader from './scanner.frag'

export function createScannerRenderFunction(context, mesh) {
  const shader = context.createShader(
    standardVertexShader,
    scannerFragmentShader
  )
  return function(texture, matrices, deltas) {
    texture.bind(0)
    const uniforms = matrices.reduce(
      (p, c, i) => {
        p[`uTransforms[${i}]`] = c
        return p
      },
      { uInputTexture: 0, uDeltas: deltas, uNumber: matrices.length }
    )
    shader.draw(mesh, uniforms)
  }
}
