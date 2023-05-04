// defaultFile
varying vec3 vColor;



void main(){

    // 利用gl_PointCoord 
    // //1.画圆形
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength = step(0.5 , strength);
    // strength = 1.0 - strength;

    // //2.画外围线性模糊的圆
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength *= 2.0;
    // strength = 1.0 - strength;

    // // 3.画外围非线性模糊的圆 -- 幂次方调整粒子大小不会显得很刺眼 亮点局限在一部分
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 5.0);

    vec3 mixColor = mix(vec3(0.0), vColor, strength);
    gl_FragColor = vec4(mixColor, 1.);
}