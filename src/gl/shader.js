function compileShader(gl, type, src) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error('compile error: ' + gl.getShaderInfoLog(shader))
  }
  return shader
}

function createShaderProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram()
  gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, vertexShader))
  gl.attachShader(
    program,
    compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader)
  )
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error('link error: ' + gl.getProgramInfoLog(program))
  }
  return program
}

function extractArrayNumber(str) {
  return parseInt(str.slice(1, -1), 10)
}

function attachUniform(uniforms, name, type) {
  if (uniforms[name]) {
    throw new Error(`uniform declared more than once`)
  }
  uniforms[name] = { type }
}

function extractUniforms(str) {
  const re = /uniform (\w+(\[\d+])?) ([a-zA-Z0-9_]*)(\[\d+])?;/gm
  let match
  const uniforms = {}
  while ((match = re.exec(str)) !== null) {
    console.log(match)
    const [_, type, arrayType, varName, arrayTypeInName] = match
    if (arrayType || arrayTypeInName) {
      const num = extractArrayNumber(arrayType || arrayTypeInName)
      const typeWithoutArray = type.replace(arrayType || '', '')
      const nameWithoutArray = varName.replace(arrayTypeInName || '', '')
      if (type.startsWith('mat')) {
        for (let i = 0; i < num; i++) {
          const name = `${nameWithoutArray}[${i}]`
          attachUniform(uniforms, name, typeWithoutArray)
        }
      } else {
        attachUniform(uniforms, nameWithoutArray, typeWithoutArray + 'Array')
      }
    } else {
      attachUniform(uniforms, varName, type)
    }
  }
  console.log(uniforms)
  return uniforms
}

export class Shader {
  constructor(gl, vertexShader, fragmentShader) {
    this.gl = gl
    this.program = createShaderProgram(gl, vertexShader, fragmentShader)
    this._uniforms = extractUniforms(vertexShader + fragmentShader)
    this._attributes = {}
    this._uniformFuncByType = {
      float: (location, data) => gl.uniform1f(location, data),
      floatArray: (location, data) => gl.uniform1fv(location, data),
      int: (location, data) => gl.uniform1i(location, data),
      uint: (location, data) => gl.uniform1ui(location, data),
      sampler2D: (location, data) => gl.uniform1i(location, data),
      sampler3D: (location, data) => gl.uniform1i(location, data),
      vec2: (location, data) => gl.uniform2fv(location, data),
      vec3: (location, data) => gl.uniform3fv(location, data),
      vec4: (location, data) => gl.uniform4fv(location, data),
      mat2: (location, data) => gl.uniformMatrix2fv(location, false, data),
      mat3: (location, data) => gl.uniformMatrix3fv(location, false, data),
      mat4: (location, data) => gl.uniformMatrix4fv(location, false, data)
    }
  }

  uniforms(uniforms) {
    const gl = this.gl
    gl.useProgram(this.program)
    for (let name in uniforms) {
      const uniform = this._uniforms[name]
      if (!uniform) continue
      const location =
        uniform.location || gl.getUniformLocation(this.program, name)
      if (!location) continue
      uniform.location = location
      const setUniformOfType = this._uniformFuncByType[uniform.type]
      setUniformOfType(location, uniforms[name])
    }
  }

  draw(buffers, uniforms, mode) {
    const indexBuffer = buffers.indexBuffer
    const vertexBuffers = indexBuffer ? buffers.vertexBuffers : buffers
    const gl = this.gl
    this.uniforms(uniforms || {})
    // Create and enable attribute pointers as necessary.
    let length = 0
    let attribute = null
    for (attribute in vertexBuffers) {
      var buffer = vertexBuffers[attribute]
      var location =
        this._attributes[attribute] ||
        gl.getAttribLocation(this.program, attribute)
      if (location == -1 || !buffer.buffer) continue
      this._attributes[attribute] = location
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer)
      gl.enableVertexAttribArray(location)
      gl.vertexAttribPointer(
        location,
        buffer.bufferSpacing,
        gl.FLOAT,
        false,
        0,
        0
      )
      length = buffer.bufferLength / buffer.bufferSpacing
    }

    // Disable unused attribute pointers.
    for (attribute in this._attributes) {
      if (!(attribute in vertexBuffers)) {
        gl.disableVertexAttribArray(this._attributes[attribute])
      }
    }
    if (length) {
      if (!indexBuffer) {
        gl.drawArrays(mode || gl.TRIANGLE_STRIP, 0, length)
      } else {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer)
        gl.drawElements(
          mode || gl.TRIANGLES,
          indexBuffer.bufferLength,
          gl.UNSIGNED_SHORT,
          0
        )
      }
    }
  }
}
