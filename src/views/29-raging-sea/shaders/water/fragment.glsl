uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;

uniform float uColorOffset;         //颜色偏移量
uniform float uColorMultiplier;     //颜色混合比

varying float vElevation; 
void main(){

    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 color = mix(uDepthColor , uSurfaceColor , mixStrength);

    
    gl_FragColor = vec4(color, 1.);
}