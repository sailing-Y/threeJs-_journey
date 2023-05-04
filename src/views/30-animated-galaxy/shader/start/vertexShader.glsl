//defaultFile
uniform float uSize;
uniform float uTime;

attribute float aScale;              //粒子大小随机缩放
attribute vec3 aRandomness;         //粒子大小随机位置 在添加旋转之后

varying vec3 vColor;
void main() {
    //modelPosition
    vec4 modelPosition = modelMatrix * vec4(position ,1. );

    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;     //distanceToCenter的话是远的跑的快 1/~ 进的跑得快 
    angle += angleOffset;
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;

    modelPosition.xyz += aRandomness;
    // modelPosition.x += aRandomness.x;
    // modelPosition.y += aRandomness.y;
    // modelPosition.z += aRandomness.z;

    //viewPosition
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    gl_PointSize = uSize * aScale;

    // 不论离摄像机近还是远 大小都相同的问题调整 离的近的要改变大小 
    // 这段代码是从shaderLib中的points_vert.glsl.js中找的 gl_PointSize *= (scale / - mvPosition.z);
    gl_PointSize *= (1.0 / - viewPosition.z);       
    vColor = color;
}