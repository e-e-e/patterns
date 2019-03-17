vec2 tile(vec2 p, float w, float h) {
    return fract(p * vec2(w,h));
}

vec2 tileMirror(vec2 p, float w, float h) {
    vec2 np = fract(p * vec2(w/2.,h/2.))*2.; // 0.0 - 2.0
    vec2 s = step(vec2(1.), np);
    return (np * (1. -s)) + ((2. - np) * s);
}

vec2 tileRotate(vec2 p, float w, float h) {
    vec2 np = fract(p * vec2(w,h)/2.)*2.; // 0.0 - 2.0
    vec2 s = step(vec2(1.), np);
    vec2 rp = (np - s);
    float r = abs(s.x - s.y);
    rp = (rp.yx * (1.-r)) + (rp.xy * r);
	return (rp * (1. - s)) + ((1.0 - rp) * s);
}

vec2 tileStretch(vec2 p, float w, float h) {
    vec2 st = vec2(.75,.25);
    vec2 d = p * vec2(w,h);
    vec2 np = fract(d);
    vec2 s = step(st, np);
    return (np/st * (1. - s)) + ((np-st)/(1.0-st) * s);
}

vec2 tileOffset(vec2 p, float w, float h) {
    vec2 d = p * vec2(w,h);
    vec2 o = mod(floor(d), 2.0);
    return fract(d + o.yx*vec2(.5,.0));
}
