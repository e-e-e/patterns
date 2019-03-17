export class Buffer {
  constructor(gl, target, type) {
    this.gl = gl
    this.buffer = null
    this.target = target
    this.type = type
    this.data = []
    this.bufferLength = 0
    this.bufferSpacing = 0
  }

  compile(type) {
    const gl = this.gl
    let data = []
    for (let i = 0, chunk = 10000; i < this.data.length; i += chunk) {
      data = Array.prototype.concat.apply(data, this.data.slice(i, i + chunk))
    }
    var spacing = this.data.length ? data.length / this.data.length : 0
    if (spacing != Math.round(spacing)) {
      throw new Error(
        'buffer elements not of consistent size, average size is ' + spacing
      )
    }
    this.buffer = this.buffer || gl.createBuffer()
    this.bufferLength = data.length
    this.bufferSpacing = spacing
    gl.bindBuffer(this.target, this.buffer)
    gl.bufferData(this.target, new this.type(data), type || gl.STATIC_DRAW)
  }
}

export class Mesh {}
