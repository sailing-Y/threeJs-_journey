precision mediump float;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

// uniform float uFrequence;
uniform vec2 uFrequenceVec2;
uniform float uTime;
attribute vec3 position;
attribute float aRandom;

attribute vec2 uv;
varying vec2 vUv;
varying float vRandom;
varying float vElevation;
void main()
{
    vec4 modelPosition = modelMatrix * vec4(position,1.0);

    // 随机值 并varying float vRandom; 并发送给fragmentShader应用在颜色上
    // modelPosition.z = aRandom*0.1; 

    //整合下方的运算                           
    float elevation = sin(modelPosition.x * uFrequenceVec2.x - uTime)*0.1;
    elevation += sin(modelPosition.y * uFrequenceVec2.y - uTime)*0.1;
    modelPosition.z += elevation;

    // modelPosition.z += sin(modelPosition.x * uFrequence)*0.1;
    // modelPosition.z += sin(modelPosition.x * uFrequenceVec2.x - uTime)*0.1;     //x轴 y轴都有sin的效果
    // modelPosition.z += sin(modelPosition.y * uFrequenceVec2.y - uTime)*0.1;

    vec4 viewMatrix = viewMatrix * modelPosition;
    gl_Position=projectionMatrix*viewMatrix;

    vRandom = aRandom;
    vUv = uv;
    vElevation = elevation;
}

// //defaultFile
// void main() {
//     //modelPosition
//     vec4 modelPosition = modelMatrix * vec4(position ,1. );
   
//     //viewPosition
//     vec4 viewPosition = viewMatrix * modelPosition;

//     vec4 projectedPosition = projectionMatrix * viewPosition;

//     gl_Position = projectedPosition;
// }