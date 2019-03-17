#version 300 es
precision highp float;

in vec2 vTextureCoord;
out vec4 fragColor;

void main() {
  float v = step(1.0, mod(
    floor((vTextureCoord.x) / 0.01)
    + floor((vTextureCoord.y) / 0.01),
    2.0
  ));
  fragColor = vec4(v,v,v,1);
}
