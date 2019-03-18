#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;

uniform sampler2D uLevelTexture;
uniform sampler2D[5] uInputTextures;
uniform int uNumber;
in vec2 vTextureCoord;
out vec4 fragColor;

void main() {
  vec4 t = texture(uLevelTexture, vTextureCoord);
  float level = ((t.r + t.g + t.b) / 3.0);
  float d = 1.0 / float(uNumber -1); 
  float diff = level * float(uNumber - 1);
  float v = fract(diff);
  float r = 0.1;
  v = smoothstep(.5-r,.5+r, v);
  vec3 B, A;
  if (level < d * 1.0 ) {
    A = texture(uInputTextures[0], vTextureCoord).rgb;
    B = texture(uInputTextures[1], vTextureCoord).rgb;
  } else if (level < d * 2.0) {
    A = texture(uInputTextures[1], vTextureCoord).rgb;
    B = texture(uInputTextures[2], vTextureCoord).rgb;
  } else if (level < d * 3.0) {
    A = texture(uInputTextures[2], vTextureCoord).rgb;
    B = texture(uInputTextures[3], vTextureCoord).rgb;
  } else if (level < d * 4.0) {
    A = texture(uInputTextures[3], vTextureCoord).rgb;
    B = texture(uInputTextures[4], vTextureCoord).rgb;
  } else {
    A = texture(uInputTextures[4], vTextureCoord).rgb;
    B = A;
  }  
  fragColor = vec4(mix(A,B,v), 1.0);
}
