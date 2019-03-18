import standardVertexShader from '../common/standard.vert'
import simpleCheckerFragmentShader from './simple_checker.frag'
import dotsFragmentShader from './dots.frag'

export function createCheckerRenderFunction(context, mesh) {
  const shader = context.createShader(
    standardVertexShader,
    simpleCheckerFragmentShader
  )
  return function() {
    shader.draw(mesh, {})
  }
}

export function createDotsRenderFunction(context, mesh) {
  const shader = context.createShader(standardVertexShader, dotsFragmentShader)
  return function() {
    shader.draw(mesh, {})
  }
}
