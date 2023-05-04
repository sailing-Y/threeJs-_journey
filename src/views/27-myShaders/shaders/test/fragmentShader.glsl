precision mediump float;

varying float vRandom;
varying vec2 vUv;
varying float vElevation;

uniform vec3 uColor;
uniform sampler2D uTexture;
uniform float uColorDepth;
void main(){
    vec4 textureColor = texture2D(uTexture,vUv);    //rgba

    // gl_FragColor = vec4(vRandom, vRandom*0.5, 1.0 ,1.);
    // gl_FragColor = vec4(uColor, 1.0);
    textureColor.xyz *= vElevation*2.0 + uColorDepth;
    gl_FragColor = textureColor;
    
}

// // defaultFile
// void main(){
//     gl_FragColor = vec4(0.0, .1, 1., 1.);
// }