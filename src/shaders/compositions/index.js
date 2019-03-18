import standardVertexShader from '../common/standard.vert'
import levelsFragmentShader from './levels.frag'

export function createLevelsRenderFunction(context, mesh) {
  const shader = context.createShader(
    standardVertexShader,
    levelsFragmentShader
  )
  return function(texture, inputs) {
    texture.bind(0)

    const uniforms = {
      uLevelTexture: 0,
      uNumber: inputs.length,
      uInputTextures: inputs.map((v, i) => {
        v.bind(i + 1)
        return i + 1
      })
    }
    shader.draw(mesh, uniforms)
  }
}
