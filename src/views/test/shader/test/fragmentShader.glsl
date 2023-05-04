#include <common>
uniform vec3 iResolution;
uniform float iTime;
// by David Hoskins.
// Original water turbulence effect by joltz0r
// Redefine below to see the tiling...
// #define SHOW_TILING
#define TAU 6.28318530718
#define MAX_ITER 5
void mainImage(out vec4 fragColor,in vec2 fragCoord)
{
    float time=iTime*.5+23.;
    // uv should be the 0-1 uv of texture...
    vec2 uv=fragCoord.xy/iResolution.xy;
    
    #ifdef SHOW_TILING
    vec2 p=mod(uv*TAU*2.,TAU)-250.;
    #else
    vec2 p=mod(uv*TAU,TAU)-250.;
    #endif
    vec2 i=vec2(p);
    float c=1.;
    float inten=.005;
    for(int n=0;n<MAX_ITER;n++)
    {
        float t=time*(1.-(3.5/float(n+1)));
        i=p+vec2(cos(t-i.x)+sin(t+i.y),sin(t-i.y)+cos(t+i.x));
        c+=1./length(vec2(p.x/(sin(i.x+t)/inten),p.y/(cos(i.y+t)/inten)));
    }
    c/=float(MAX_ITER);
    c=1.17-pow(c,1.4);
    vec3 colour=vec3(pow(abs(c),8.));
    colour=clamp(colour+vec3(0.,.35,.5),0.,1.);
    #ifdef SHOW_TILING
    // Flash tile borders...
    vec2 pixel=2./iResolution.xy;
    uv*=2.;
    float f=floor(mod(iTime*.5,2.));// Flash value.
    vec2 first=step(pixel,uv)*f;// Rule out first screen pixels and flash.
    uv=step(fract(uv),pixel);// Add one line of pixels per tile.
    colour=mix(colour,vec3(1.,1.,0.),(uv.x+uv.y)*first.x*first.y);// Yellow line
    #endif
    
    fragColor=vec4(colour,1.);
}
varying vec2 vUv;
void main(){
    mainImage(gl_FragColor,vUv*iResolution.xy);
}
