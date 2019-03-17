// TODO - figure out simple way of sharing without making global
let framebuffer = null
let renderbuffer = null

export class Texture {
  constructor(gl, width, height, options) {
    this.gl = gl
    this.id = gl.createTexture()
    this.width = width
    this.height = height
    const format = options.format || gl.RGBA
    const type = options.type || gl.UNSIGNED_BYTE
    const magFilter = options.filter || options.magFilter || gl.LINEAR
    const minFilter = options.filter || options.minFilter || gl.LINEAR
    if (type === gl.FLOAT) {
      if (!canUseFloatingPointTextures(gl)) {
        throw new Error('OES_texture_float is required but not supported')
      }
      if (
        (minFilter !== gl.NEAREST || magFilter !== gl.NEAREST) &&
        !canUseFloatingPointLinearFiltering(gl)
      ) {
        throw new Error(
          'OES_texture_float_linear is required but not supported'
        )
      }
    }
    gl.bindTexture(gl.TEXTURE_2D, this.id)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter)
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_WRAP_S,
      options.wrap || options.wrapS || gl.REPEAT
    )
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_WRAP_T,
      options.wrap || options.wrapT || gl.REPEAT
    )
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA32F,
      width,
      height,
      0,
      format,
      type,
      options.data || null
    )
  }

  drawTo(callback) {
    const gl = this.gl
    const v = gl.getParameter(gl.VIEWPORT)
    framebuffer = framebuffer || gl.createFramebuffer()
    // renderbuffer = renderbuffer || gl.createRenderbuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    // gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer)
    // if (
    //   this.width != renderbuffer.width ||
    //   this.height != renderbuffer.height
    // ) {
    //   renderbuffer.width = this.width
    //   renderbuffer.height = this.height
    //   gl.renderbufferStorage(
    //     gl.RENDERBUFFER,
    //     gl.DEPTH_COMPONENT16,
    //     this.width,
    //     this.height
    //   )
    // }
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      this.id,
      0
    )
    // gl.framebufferRenderbuffer(
    //   gl.FRAMEBUFFER,
    //   gl.DEPTH_ATTACHMENT,
    //   gl.RENDERBUFFER,
    //   renderbuffer
    // )
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
      throw new Error(
        'Rendering to this texture is not supported (incomplete framebuffer)'
      )
    }
    gl.viewport(0, 0, this.width, this.height)

    callback()

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    // gl.bindRenderbuffer(gl.RENDERBUFFER, null)
    gl.viewport(v[0], v[1], v[2], v[3])
  }

  bind(unit) {
    const gl = this.gl
    gl.activeTexture(gl.TEXTURE0 + (unit || 0))
    gl.bindTexture(gl.TEXTURE_2D, this.id)
  }

  unbind(unit) {
    const gl = this.gl
    gl.activeTexture(gl.TEXTURE0 + (unit || 0))
    gl.bindTexture(gl.TEXTURE_2D, null)
  }
}

function canUseFloatingPointTextures(gl) {
  // console.log(gl.getSupportedExtensions())
  return !!gl.getExtension('EXT_color_buffer_float')
  // return !!gl.getExtension('OES_texture_float')
}
function canUseFloatingPointLinearFiltering(gl) {
  return !!gl.getExtension('OES_texture_float_linear')
}

export class Texture3D {
  constructor(gl, width, height, depth, options) {
    this.gl = gl
    this.id = gl.createTexture()
    this.width = width
    this.height = height
    this.depth = depth

    const format = options.format || gl.RGBA
    const type = options.type || gl.UNSIGNED_BYTE
    const magFilter = options.filter || options.magFilter || gl.LINEAR
    const minFilter = options.filter || options.minFilter || gl.LINEAR
    if (type === gl.FLOAT) {
      if (!canUseFloatingPointTextures(gl)) {
        throw new Error('OES_texture_float is required but not supported')
      }
      if (
        (minFilter !== gl.NEAREST || magFilter !== gl.NEAREST) &&
        !canUseFloatingPointLinearFiltering(gl)
      ) {
        throw new Error(
          'OES_texture_float_linear is required but not supported'
        )
      }
    }
    gl.bindTexture(gl.TEXTURE_3D, this.id)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, magFilter)
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, minFilter)
    gl.texParameteri(
      gl.TEXTURE_3D,
      gl.TEXTURE_WRAP_S,
      options.wrap || options.wrapS || gl.REPEAT
    )
    gl.texParameteri(
      gl.TEXTURE_3D,
      gl.TEXTURE_WRAP_T,
      options.wrap || options.wrapT || gl.REPEAT
    )
    gl.texParameteri(
      gl.TEXTURE_3D,
      gl.TEXTURE_WRAP_R,
      options.wrap || options.wrapR || gl.CLAMP_TO_EDGE
    )

    gl.texImage3D(
      gl.TEXTURE_3D,
      0,
      gl.RGBA32F,
      width,
      height,
      depth,
      0,
      format,
      type,
      options.data || null
    )
  }

  drawTo(depth, callback) {
    const gl = this.gl
    const v = gl.getParameter(gl.VIEWPORT)
    framebuffer = framebuffer || gl.createFramebuffer()
    // renderbuffer = renderbuffer || gl.createRenderbuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    // gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer)
    // if (
    //   this.width != renderbuffer.width ||
    //   this.height != renderbuffer.height
    // ) {
    //   renderbuffer.width = this.width
    //   renderbuffer.height = this.height
    //   gl.renderbufferStorage(
    //     gl.RENDERBUFFER,
    //     gl.DEPTH_COMPONENT16,
    //     this.width,
    //     this.height
    //   )
    // }
    gl.framebufferTextureLayer(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      this.id,
      0,
      depth
    )
    // gl.framebufferRenderbuffer(
    //   gl.FRAMEBUFFER,
    //   gl.DEPTH_ATTACHMENT,
    //   gl.RENDERBUFFER,
    //   renderbuffer
    // )
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
      throw new Error(
        'Rendering to this texture is not supported (incomplete framebuffer)'
      )
    }
    gl.viewport(0, 0, this.width, this.height)

    callback()

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    // gl.bindRenderbuffer(gl.RENDERBUFFER, null)
    gl.viewport(v[0], v[1], v[2], v[3])
  }

  bind(unit) {
    const gl = this.gl
    gl.activeTexture(gl.TEXTURE0 + (unit || 0))
    gl.bindTexture(gl.TEXTURE_3D, this.id)
  }

  unbind(unit) {
    const gl = this.gl
    gl.activeTexture(gl.TEXTURE0 + (unit || 0))
    gl.bindTexture(gl.TEXTURE_3D, null)
  }
}
