#version 300 es
precision highp float;
# define M_PI 3.1415926535897932384626433832795 

in vec2 vTextureCoord;
out vec4 fragColor;

float circle(vec2 p, float r, float sm) {
  vec2 pos = vec2(0.5) -p;
  // return dot(pos,pos)*M_PI;
  // return step(dot(pos,pos)*M_PI,0.783*r*r);
  float s = 0.783*r*r;
  return smoothstep(s-sm*r,s+sm*r, dot(pos,pos)*M_PI);
  // return smoothstep(0.776-r , 1.0-r+r*0.2, 1.0-dot(pos,pos)*M_PI);
}

void main() {
  // float x = (vTextureCoord.x) * 1.0 * M_PI;
  // float y = (vTextureCoord.y) * 1.0 * M_PI;
  // float v = circle(fract(vTextureCoord * 20.0), 1.45, 1.0/20.0);
  float v = circle(fract(vTextureCoord * 30.0), 1.1, 1./30.0);//1.0/20.0);
  // float v = 0.2;
  fragColor = vec4(v,v,v,1);
}
