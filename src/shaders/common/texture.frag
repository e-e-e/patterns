#version 300 es
precision highp float;
precision highp sampler2D;

uniform sampler2D uInputTexture;

in vec2 vTextureCoord;
out vec4 fragColor;

void main() {
  fragColor = texture(uInputTexture, vTextureCoord);
}
