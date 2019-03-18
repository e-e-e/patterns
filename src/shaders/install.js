import { createTextureRenderFunction } from './common/texture'
import { createLevelsRenderFunction } from './compositions'
import { createScannerRenderFunction } from './distortions'
import {
  createCheckerRenderFunction,
  createDotsRenderFunction
} from './generators'

function createMesh(context) {
  const gl = context.gl
  const vertexBuffer = context.createBuffer(gl.ARRAY_BUFFER, Float32Array)
  vertexBuffer.data = [[-1, 1], [1, 1], [-1, -1], [1, -1]]
  vertexBuffer.compile()
  const textureCoordBuffer = context.createBuffer(gl.ARRAY_BUFFER, Float32Array)
  textureCoordBuffer.data = [[0, 1], [1, 1], [0, 0], [1, 0]]
  textureCoordBuffer.compile()
  return {
    aTextureCoord: textureCoordBuffer,
    aVertexPosition: vertexBuffer
  }
}

export function installShaders(context) {
  const mesh = createMesh(context)
  return {
    drawTexture: createTextureRenderFunction(context, mesh),
    generate: {
      drawChecker: createCheckerRenderFunction(context, mesh),
      drawDots: createDotsRenderFunction(context, mesh)
    },
    distort: {
      drawScanner: createScannerRenderFunction(context, mesh)
    },
    compose: {
      drawLevels: createLevelsRenderFunction(context, mesh)
    }
  }
}
