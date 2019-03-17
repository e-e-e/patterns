#version 300 es
precision highp float;
precision highp sampler2D;

uniform sampler2D uInputTexture;
uniform mat3[5] uTransforms;
uniform float uDeltas[5];
uniform int uNumber;
in vec2 vTextureCoord;
out vec4 fragColor;

float hermitishCurve(float t, float d, float m0, float m1) {
  float t2 = t * t;
  float t3 = t2 * t;
  float d2 = d * d;
  return (
    t * m0 + 
    t2 * (((3.0 / d) - (2.0 * m0) - m1) / d) + 
    t3 * ((m0 + m1 - (2.0 / d)) / d2)
  );
}

vec2 interpolate(float t) {
  vec3 hCoord = vec3(vTextureCoord.xy, 1);
  vec2 pos = vec2(0,0);
  vec3 start = hCoord * uTransforms[0];
  if (uNumber == 1) return start.xy;
  float pm = 0.0;
  int limit = uNumber-1;
  for (int i = 0; i < limit; i++) {
    if (t >= uDeltas[i] && t < uDeltas[i+1]) {
      float m = (uDeltas[i+1] - uDeltas[i]);
      float fm = (i < limit-1) 
        ? (uDeltas[i+2] - uDeltas[i+1]) 
        : 0.0;
      float o = t - uDeltas[i];
      float v = hermitishCurve(o, m, pm, fm);
      pm = m;
      vec3 A = hCoord * uTransforms[i];
      vec3 B = hCoord * uTransforms[i+1];
      start = A * (1.0 - v) + (B * v);
      return start.xy;
    }
  }
  if (t > uDeltas[limit]) {
    start = hCoord * uTransforms[limit];
  }
  return start.xy;
}

void main() {
  float d = vTextureCoord.y;
  vec2 v = interpolate(1.0-d);
  fragColor = texture(uInputTexture, v);
}
