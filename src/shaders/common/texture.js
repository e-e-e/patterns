import standardVertexShader from './standard.vert'
import textureFragmentShader from './texture.frag'

export function createTextureRenderFunction(context, mesh) {
  const shader = context.createShader(
    standardVertexShader,
    textureFragmentShader
  )
  return function(inputTexture) {
    inputTexture.bind(0)
    shader.draw(mesh, {
      uInputTexture: 0
    })
  }
}
