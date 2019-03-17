import { GL } from './gl/gl'
import {
  createRotation,
  createScale,
  createTranslation,
  createIdentity
} from './transforms'

import standardVertexShader from './shaders/standard.vert'
import textureFragmentShader from './shaders/texture.frag'
import testFragmentShader from './shaders/patterns/test.frag'
import dotsFragmentShader from './shaders/patterns/dots.frag'
import scannerFragmentShader from './shaders/distortions/scanner.frag'

function isUndefined(a) {
  return typeof a === 'undefined'
}

function createCanvas(width, height) {
  const canvas = document.createElement('canvas')
  canvas.style.margin = '0 auto'
  canvas.style.display = 'block'
  canvas.width = width
  canvas.height = height
  return canvas
}

function makeTestRenderFunction(context, mesh) {
  const shader = context.createShader(standardVertexShader, testFragmentShader)
  return function() {
    shader.draw(mesh, {
      // uColor: color || [0, 0, 0, 1]
    })
  }
}

function makeDotsRenderFunction(context, mesh) {
  const shader = context.createShader(standardVertexShader, dotsFragmentShader)
  return function() {
    shader.draw(mesh, {
      // uColor: color || [0, 0, 0, 1]
    })
  }
}

function makeScannerRenderFunction(context, mesh) {
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

function makeSimpleVertexMesh(context) {
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

function makeTextureRenderFunction(context, mesh) {
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

function makeTextures(context, names, options) {
  const textures = {}
  names.forEach(name => {
    textures[name] = context.createTexture(options.width, options.height, {
      type: context.gl.FLOAT
    })
  })
  textures.swap = function swap(a, b) {
    if (isUndefined(a)) {
      throw new Error(`No texture ${a} exists`)
    }
    if (isUndefined(b)) {
      throw new Error(`No texture ${b} exists`)
    }
    const tmp = this[a]
    this[a] = this[b]
    this[b] = tmp
  }
  return textures
}

function init() {
  console.log('init')
  const WIDTH = 1024
  const HEIGHT = WIDTH
  const app = document.getElementById('app')
  const canvas = createCanvas(WIDTH, HEIGHT)
  app.appendChild(canvas)
  const context = new GL(canvas)
  context.viewport(canvas.width, canvas.height)
  const simpleVertexMesh = makeSimpleVertexMesh(context)
  const drawTexture = makeTextureRenderFunction(context, simpleVertexMesh)
  const drawTest = makeTestRenderFunction(context, simpleVertexMesh)
  const drawDots = makeDotsRenderFunction(context, simpleVertexMesh)
  const drawScanner = makeScannerRenderFunction(context, simpleVertexMesh)

  const textures = makeTextures(
    context,
    [
      'velocity0',
      'velocity1',
      'color0',
      'color1',
      'divergence',
      'pressure0',
      'pressure1'
    ],
    { width: WIDTH, height: HEIGHT }
  )

  const reset = () => {
    textures.color0.drawTo(() => drawTest())
    textures.color1.drawTo(() => {
      // prettier-ignore
      const b = createTranslation(0.5,0.5)
      b.apply(createScale(1 / 4, 1 / 4))
      b.apply(createRotation((Math.PI * Date.now()) / 8000))
      b.apply(createTranslation(-0.5, -0.5))
      // prettier-ignore
      const a = createTranslation(0,0)
      // a.apply(createScale(0.2, 0.2))
      // a.apply(createTranslation(-0.5, -0.5))
      const c = a.copy()
      // c.apply(createTranslation(-1.0, 0))
      const d = b.copy()
      drawScanner(textures.color0, [a.array, b.array, c.array], [0.0, 0.5, 1])
    })
    textures.swap('color1', 'color0')
  }

  const draw = () => {
    context.clear(0, 0, 0)
    reset()
    drawTexture(textures.color0)
  }
  reset()
  draw()
  context.onDraw(draw)
  context.start()
}

init()
