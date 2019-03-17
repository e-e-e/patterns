import { Shader } from './shader'
import { Buffer } from './buffer'
import { Texture, Texture3D } from './texture'

function createGlContext(canvas) {
  let gl
  try {
    gl = canvas.getContext('webgl2')
    // eslint-disable-next-line no-empty
  } catch (e) {}
  try {
    gl = gl || canvas.getContext('experimental-webgl')
    // eslint-disable-next-line no-empty
  } catch (e) {}
  if (!gl) throw new Error('WebGL not supported')
  return gl
}

export class GL {
  constructor(canvas) {
    this.canvas = canvas
    this.gl = createGlContext(canvas)
    this._onUpdate = null
    this._onDraw = null
    this.running = false
    this._time = 0
    this._intervalId = null
  }

  createTexture(width, height, options) {
    return new Texture(this.gl, width, height, options)
  }

  createTexture3D(width, height, depth, options) {
    return new Texture3D(this.gl, width, height, depth, options)
  }

  createShader(vertexShader, fragmentShader) {
    return new Shader(this.gl, vertexShader, fragmentShader)
  }

  createBuffer(target, type) {
    return new Buffer(this.gl, target, type)
  }

  onUpdate(cb) {
    this._onUpdate = cb
  }

  onDraw(cb) {
    this._onDraw = cb
  }

  viewport(width, height) {
    this.gl.viewport(0, 0, width, height)
  }

  clear(r, g, b, a) {
    const gl = this.gl
    gl.clearColor(r || 0.0, g || 0.0, b || 0.0, a || 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  }

  start() {
    if (this.running) return
    this._time = new Date().getTime()
    this.running = true
    this._update()
  }

  stop() {
    if (!this.running) return
    this.running = false
    if (this._intervalId) {
      window.cancelAnimationFrame(this._intervalId)
      this._intervalId = null
    }
  }

  _update = () => {
    if (!this.running) return
    const now = new Date().getTime()
    if (this._onUpdate) this._onUpdate((now - this._time) / 1000)
    if (this._onDraw) this._onDraw()
    this._intervalId = window.requestAnimationFrame(this._update)
    this._time = now
  }
}
