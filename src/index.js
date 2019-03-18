import { GL } from './gl/gl'
import { createRotation, createScale, createTranslation } from './transforms'
import { installShaders } from './shaders/install'

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
  const WIDTH = 1024
  const HEIGHT = WIDTH
  const app = document.getElementById('app')
  const canvas = createCanvas(WIDTH, HEIGHT)
  app.appendChild(canvas)
  const context = new GL(canvas)
  context.viewport(canvas.width, canvas.height)
  const {
    drawTexture,
    distort: { drawScanner },
    generate: { drawChecker, drawDots },
    compose: { drawLevels }
  } = installShaders(context)

  const textures = makeTextures(
    context,
    ['color0', 'color1', 'checker', 'dots', 'c2'],
    {
      width: WIDTH,
      height: HEIGHT
    }
  )
  textures.checker.drawTo(() => drawChecker())
  textures.c2.drawTo(() => {
    const b = createTranslation(0.5, 0.5)
    b.apply(createScale(1 / 3, 1 / 3))
    b.apply(createRotation((Math.PI * Date.now()) / 4000))
    b.apply(createTranslation(-0.5, -0.5))
    const a = createTranslation(0, 0)
    a.apply(createScale(2, 2))
    const c = a.copy()
    drawScanner(textures.checker, [a.array, b.array, c.array], [0.0, 0.5, 1])
  })
  textures.dots.drawTo(() => drawDots())

  const reset = () => {
    textures.color1.drawTo(() => {
      const b = createTranslation(0.5, 0.5)
      b.apply(createScale(1 / 4, 1 / 1))
      b.apply(createRotation((Math.PI * Date.now()) / 4000))
      b.apply(createTranslation(-0.5, -0.5))
      const a = createTranslation(0, 0)
      const c = a.copy()
      drawScanner(textures.dots, [a.array, b.array, c.array], [0.0, 0.5, 1])
    })
    textures.color0.drawTo(() => {
      drawLevels(textures.color1, [
        textures.dots,
        textures.checker,
        textures.c2
      ])
    })
  }

  const draw = () => {
    context.clear(0, 0, 0)
    reset()
    drawTexture(textures.color0)
  }
  // draw()
  context.onDraw(draw)
  context.start()
}

init()
