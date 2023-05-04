import"./modulepreload-polyfill-3cfb730f.js";import{S as h,P as g,W as x,s,K as c,a2 as d,j as y,V as w,a as f,g as b}from"./three.module-13a89988.js";import{G as T}from"./lil-gui.esm-1e0f7d72.js";var L=`varying vec2 vUv;

void main(){\r
    vUv=uv;\r
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);\r
}`,S=`#include <common>\r
uniform vec3 iResolution;\r
uniform float iTime;

#define TAU 6.28318530718\r
#define MAX_ITER 5\r
void mainImage(out vec4 fragColor,in vec2 fragCoord)\r
{\r
    float time=iTime*.5+23.;\r
    
    vec2 uv=fragCoord.xy/iResolution.xy;\r
    \r
    #ifdef SHOW_TILING\r
    vec2 p=mod(uv*TAU*2.,TAU)-250.;\r
    #else\r
    vec2 p=mod(uv*TAU,TAU)-250.;\r
    #endif\r
    vec2 i=vec2(p);\r
    float c=1.;\r
    float inten=.005;\r
    for(int n=0;n<MAX_ITER;n++)\r
    {\r
        float t=time*(1.-(3.5/float(n+1)));\r
        i=p+vec2(cos(t-i.x)+sin(t+i.y),sin(t-i.y)+cos(t+i.x));\r
        c+=1./length(vec2(p.x/(sin(i.x+t)/inten),p.y/(cos(i.y+t)/inten)));\r
    }\r
    c/=float(MAX_ITER);\r
    c=1.17-pow(c,1.4);\r
    vec3 colour=vec3(pow(abs(c),8.));\r
    colour=clamp(colour+vec3(0.,.35,.5),0.,1.);\r
    #ifdef SHOW_TILING\r
    
    vec2 pixel=2./iResolution.xy;\r
    uv*=2.;\r
    float f=floor(mod(iTime*.5,2.));
    vec2 first=step(pixel,uv)*f;
    uv=step(fract(uv),pixel);
    colour=mix(colour,vec3(1.,1.,0.),(uv.x+uv.y)*first.x*first.y);
    #endif\r
    \r
    fragColor=vec4(colour,1.);\r
}\r
varying vec2 vUv;\r
void main(){\r
    mainImage(gl_FragColor,vUv*iResolution.xy);\r
}`,C=`varying vec2 vUv;

void main(){\r
    vUv=uv;\r
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);\r
}`,z=`#define GLSLSANDBOX

#ifdef __cplusplus\r
#define _in(T) const T &\r
#define _inout(T) T &\r
#define _out(T) T &\r
#define _begin(type) type {\r
#define _end }\r
#define _mutable(T) T\r
#define _constant(T) const T\r
#define mul(a, b) (a) * (b)\r
#endif

#if defined(GL_ES) || defined(GL_SHADING_LANGUAGE_VERSION)\r
#define _in(T) const in T\r
#define _inout(T) inout T\r
#define _out(T) out T\r
#define _begin(type) type (\r
#define _end )\r
#define _mutable(T) T\r
#define _constant(T) const T\r
#define mul(a, b) (a) * (b)\r
#endif

#ifdef HLSL\r
#define _in(T) const in T\r
#define _inout(T) inout T\r
#define _out(T) out T\r
#define _begin(type) {\r
#define _end }\r
#define _mutable(T) static T\r
#define _constant(T) static const T\r
#define vec2 float2\r
#define vec3 float3\r
#define vec4 float4\r
#define mat2 float2x2\r
#define mat3 float3x3\r
#define mat4 float4x4\r
#define mix lerp\r
#define fract frac\r
#define mod fmod\r
#pragma pack_matrix(row_major)\r
#endif

#ifdef HLSLTOY\r
cbuffer uniforms : register(b0) {\r
	float2 u_res;\r
	float u_time;\r
	float2 u_mouse;\r
};\r
void mainImage(_out(float4) fragColor, _in(float2) fragCoord);\r
float4 main(float4 uv : SV_Position) : SV_Target{ float4 col; mainImage(col, uv.xy); return col; }\r
#endif

#if defined(__cplusplus) || defined(SHADERTOY)\r
#define u_res iResolution\r
#define u_time iTime\r
#define u_mouse iMouse\r
#endif

#ifdef GLSLSANDBOX\r
uniform float time;\r
uniform vec3 mouse;\r
uniform vec2 resolution;\r
#define u_res resolution\r
#define u_time time\r
#define u_mouse mouse\r
void mainImage(_out(vec4) fragColor, _in(vec2) fragCoord);\r
void main() { mainImage(gl_FragColor, gl_FragCoord.xy); }\r
#endif

#ifdef UE4\r
_constant(vec2) u_res = vec2(0, 0);\r
_constant(vec2) u_mouse = vec2(0, 0);\r
_mutable(float) u_time = 0;\r
#endif

#define PI 3.14159265359

struct ray_t {\r
	vec3 origin;\r
	vec3 direction;\r
};\r
#define BIAS 1e-4 

struct sphere_t {\r
	vec3 origin;\r
	float radius;\r
	int material;\r
};

struct plane_t {\r
	vec3 direction;\r
	float distance;\r
	int material;\r
};

struct hit_t {\r
	float t;\r
	int material_id;\r
	vec3 normal;\r
	vec3 origin;\r
};\r
#define max_dist 1e8\r
_constant(hit_t) no_hit = _begin(hit_t)\r
	float(max_dist + 1e1), 
	-1, 
	vec3(0., 0., 0.), 
	vec3(0., 0., 0.) 
_end;\r

ray_t get_primary_ray(\r
	_in(vec3) cam_local_point,\r
	_inout(vec3) cam_origin,\r
	_inout(vec3) cam_look_at\r
){\r
	vec3 fwd = normalize(cam_look_at - cam_origin);\r
	vec3 up = vec3(0, 1, 0);\r
	vec3 right = cross(up, fwd);\r
	up = cross(fwd, right);

	ray_t r = _begin(ray_t)\r
		cam_origin,\r
		normalize(fwd + up * cam_local_point.y + right * cam_local_point.x)\r
	_end;\r
	return r;\r
}

_constant(mat3) mat3_ident = mat3(1, 0, 0, 0, 1, 0, 0, 0, 1);\r

mat2 rotate_2d(\r
	_in(float) angle_degrees\r
){\r
	float angle = radians(angle_degrees);\r
	float _sin = sin(angle);\r
	float _cos = cos(angle);\r
	return mat2(_cos, -_sin, _sin, _cos);\r
}

mat3 rotate_around_z(\r
	_in(float) angle_degrees\r
){\r
	float angle = radians(angle_degrees);\r
	float _sin = sin(angle);\r
	float _cos = cos(angle);\r
	return mat3(_cos, -_sin, 0, _sin, _cos, 0, 0, 0, 1);\r
}

mat3 rotate_around_y(\r
	_in(float) angle_degrees\r
){\r
	float angle = radians(angle_degrees);\r
	float _sin = sin(angle);\r
	float _cos = cos(angle);\r
	return mat3(_cos, 0, _sin, 0, 1, 0, -_sin, 0, _cos);\r
}

mat3 rotate_around_x(\r
	_in(float) angle_degrees\r
){\r
	float angle = radians(angle_degrees);\r
	float _sin = sin(angle);\r
	float _cos = cos(angle);\r
	return mat3(1, 0, 0, 0, _cos, -_sin, 0, _sin, _cos);\r
}

vec3 linear_to_srgb(\r
	_in(vec3) color\r
){\r
	const float p = 1. / 2.2;\r
	return vec3(pow(color.r, p), pow(color.g, p), pow(color.b, p));\r
}\r
vec3 srgb_to_linear(\r
	_in(vec3) color\r
){\r
	const float p = 2.2;\r
	return vec3(pow(color.r, p), pow(color.g, p), pow(color.b, p));\r
}

#ifdef __cplusplus\r
vec3 faceforward(\r
	_in(vec3) N,\r
	_in(vec3) I,\r
	_in(vec3) Nref\r
){\r
	return dot(Nref, I) < 0 ? N : -N;\r
}\r
#endif

float checkboard_pattern(\r
	_in(vec2) pos,\r
	_in(float) scale\r
){\r
	vec2 pattern = floor(pos * scale);\r
	return mod(pattern.x + pattern.y, 2.0);\r
}

float band (\r
	_in(float) start,\r
	_in(float) peak,\r
	_in(float) end,\r
	_in(float) t\r
){\r
	return\r
	smoothstep (start, peak, t) *\r
	(1. - smoothstep (peak, end, t));\r
}

void fast_orthonormal_basis(\r
	_in(vec3) n,\r
	_out(vec3) f,\r
	_out(vec3) r\r
){\r
	float a = 1. / (1. + n.z);\r
	float b = -n.x*n.y*a;\r
	f = vec3(1. - n.x*n.x*a, b, -n.x);\r
	r = vec3(b, 1. - n.y*n.y*a, -n.y);\r
}

void intersect_sphere(\r
	_in(ray_t) ray,\r
	_in(sphere_t) sphere,\r
	_inout(hit_t) hit\r
){\r
	vec3 rc = sphere.origin - ray.origin;\r
	float radius2 = sphere.radius * sphere.radius;\r
	float tca = dot(rc, ray.direction);\r
	if (tca < 0.) return;

	float d2 = dot(rc, rc) - tca * tca;\r
	if (d2 > radius2) return;

	float thc = sqrt(radius2 - d2);\r
	float t0 = tca - thc;\r
	float t1 = tca + thc;

	if (t0 < 0.) t0 = t1;\r
	if (t0 > hit.t) return;

	vec3 impact = ray.origin + ray.direction * t0;

	hit.t = t0;\r
	hit.material_id = sphere.material;\r
	hit.origin = impact;\r
	hit.normal = (impact - sphere.origin) / sphere.radius;\r
}\r

struct volume_sampler_t {\r
	vec3 origin; 
	vec3 pos; 
	float height;

	float coeff_absorb;\r
	float T; 

	vec3 C; 
	float alpha;\r
};

volume_sampler_t begin_volume(\r
	_in(vec3) origin,\r
	_in(float) coeff_absorb\r
){\r
	volume_sampler_t v = _begin(volume_sampler_t)\r
		origin, origin, 0.,\r
		coeff_absorb, 1.,\r
		vec3(0., 0., 0.), 0.\r
	_end;\r
	return v;\r
}

float illuminate_volume(\r
	_inout(volume_sampler_t) vol,\r
	_in(vec3) V,\r
	_in(vec3) L\r
);

void integrate_volume(\r
	_inout(volume_sampler_t) vol,\r
	_in(vec3) V,\r
	_in(vec3) L,\r
	_in(float) density,\r
	_in(float) dt\r
){\r
	
	float T_i = exp(-vol.coeff_absorb * density * dt);\r
	
	vol.T *= T_i;\r
	
	vol.C += vol.T * illuminate_volume(vol, V, L) * density * dt;\r
	
	vol.alpha += (1. - T_i) * (1. - vol.alpha);\r
}\r

float hash(\r
	_in(float) n\r
){\r
	return fract(sin(n)*753.5453123);\r
}

float noise_iq(\r
	_in(vec3) x\r
){\r
	vec3 p = floor(x);\r
	vec3 f = fract(x);\r
	f = f*f*(3.0 - 2.0*f);

#if 1\r
    float n = p.x + p.y*157.0 + 113.0*p.z;\r
    return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),\r
                   mix( hash(n+157.0), hash(n+158.0),f.x),f.y),\r
               mix(mix( hash(n+113.0), hash(n+114.0),f.x),\r
                   mix( hash(n+270.0), hash(n+271.0),f.x),f.y),f.z);\r
#else\r
	vec2 uv = (p.xy + vec2(37.0, 17.0)*p.z) + f.xy;\r
	vec2 rg = textureLod( iChannel0, (uv+.5)/256., 0.).yx;\r
	return mix(rg.x, rg.y, f.z);\r
#endif\r
}

#define noise(x) noise_iq(x)\r

#define DECL_FBM_FUNC(_name, _octaves, _basis) float _name(_in(vec3) pos, _in(float) lacunarity, _in(float) init_gain, _in(float) gain) { vec3 p = pos; float H = init_gain; float t = 0.; for (int i = 0; i < _octaves; i++) { t += _basis * H; p *= lacunarity; H *= gain; } return t; }

DECL_FBM_FUNC(fbm, 4, noise(p))

_constant(sphere_t) planet = _begin(sphere_t)\r
	vec3(0, 0, 0), 1., 0\r
_end;

#define max_height .4\r
#define max_ray_dist (max_height * 4.)

vec3 background(\r
	_in(ray_t) eye\r
){\r
#if 0\r
	return vec3(.15, .3, .4);\r
#else\r
	_constant(vec3) sun_color = vec3(1., .9, .55);\r
	float sun_amount = dot(eye.direction, vec3(0, 0, 1));

	vec3 sky = mix(\r
		vec3(.0, .05, .2),\r
		vec3(.15, .3, .4),\r
		1.0 - eye.direction.y);\r
	sky += sun_color * min(pow(sun_amount, 30.0) * 5.0, 1.0);\r
	sky += sun_color * min(pow(sun_amount, 10.0) * .6, 1.0);

	return sky;\r
#endif\r
}

void setup_scene()\r
{\r
}

void setup_camera(\r
	_inout(vec3) eye,\r
	_inout(vec3) look_at\r
){\r
#if 0\r
	eye = vec3(.0, 0, -1.93);\r
	look_at = vec3(-.1, .9, 2);\r
#else\r
	eye = vec3(0, 0, -2.5);\r
	look_at = vec3(0, 0, 2);\r
#endif\r
}

#define CLOUDS

#define anoise (abs(noise(p) * 2. - 1.))\r
DECL_FBM_FUNC(fbm_clouds, 4, anoise)

#define vol_coeff_absorb 30.034\r
_mutable(volume_sampler_t) cloud;

float illuminate_volume(\r
	_inout(volume_sampler_t) cloud,\r
	_in(vec3) V,\r
	_in(vec3) L\r
){\r
	return exp(cloud.height) / .055;\r
}

void clouds_map(\r
	_inout(volume_sampler_t) cloud,\r
	_in(float) t_step\r
){\r
	float dens = fbm_clouds(\r
		cloud.pos * 3.2343 + vec3(.35, 13.35, 2.67),\r
		2.0276, .5, .5);

	#define cld_coverage .29475675 
	#define cld_fuzzy .0335 
	dens *= smoothstep(cld_coverage, cld_coverage + cld_fuzzy, dens);

	dens *= band(.2, .35, .65, cloud.height);

	integrate_volume(cloud,\r
		cloud.pos, cloud.pos, 
		dens, t_step);\r
}

void clouds_march(\r
	_in(ray_t) eye,\r
	_inout(volume_sampler_t) cloud,\r
	_in(float) max_travel,\r
	_in(mat3) rot\r
){\r
	const int steps = 75;\r
	const float t_step = max_ray_dist / float(steps);\r
	float t = 0.;

	for (int i = 0; i < steps; i++) {\r
		if (t > max_travel || cloud.alpha >= 1.) return;\r
			\r
		vec3 o = cloud.origin + t * eye.direction;\r
		cloud.pos = mul(rot, o - planet.origin);

		cloud.height = (length(cloud.pos) - planet.radius) / max_height;\r
		t += t_step;\r
		clouds_map(cloud, t_step);\r
	}\r
}

void clouds_shadow_march(\r
	_in(vec3) dir,\r
	_inout(volume_sampler_t) cloud,\r
	_in(mat3) rot\r
){\r
	const int steps = 5;\r
	const float t_step = max_height / float(steps);\r
	float t = 0.;

	for (int i = 0; i < steps; i++) {\r
		vec3 o = cloud.origin + t * dir;\r
		cloud.pos = mul(rot, o - planet.origin);

		cloud.height = (length(cloud.pos) - planet.radius) / max_height;\r
		t += t_step;\r
		clouds_map(cloud, t_step);\r
	}\r
}

#define TERR_STEPS 120\r
#define TERR_EPS .005\r
#define rnoise (1. - abs(noise(p) * 2. - 1.))

DECL_FBM_FUNC(fbm_terr, 3, noise(p))\r
DECL_FBM_FUNC(fbm_terr_r, 3, rnoise)

DECL_FBM_FUNC(fbm_terr_normals, 7, noise(p))\r
DECL_FBM_FUNC(fbm_terr_r_normals, 7, rnoise)

vec2 sdf_terrain_map(_in(vec3) pos)\r
{\r
	float h0 = fbm_terr(pos * 2.0987, 2.0244, .454, .454);\r
	float n0 = smoothstep(.35, 1., h0);

	float h1 = fbm_terr_r(pos * 1.50987 + vec3(1.9489, 2.435, .5483), 2.0244, .454, .454);\r
	float n1 = smoothstep(.6, 1., h1);\r
	\r
	float n = n0 + n1;\r
	\r
	return vec2(length(pos) - planet.radius - n * max_height, n / max_height);\r
}

vec2 sdf_terrain_map_detail(_in(vec3) pos)\r
{\r
	float h0 = fbm_terr_normals(pos * 2.0987, 2.0244, .454, .454);\r
	float n0 = smoothstep(.35, 1., h0);

	float h1 = fbm_terr_r_normals(pos * 1.50987 + vec3(1.9489, 2.435, .5483), 2.0244, .454, .454);\r
	float n1 = smoothstep(.6, 1., h1);

	float n = n0 + n1;

	return vec2(length(pos) - planet.radius - n * max_height, n / max_height);\r
}

vec3 sdf_terrain_normal(_in(vec3) p)\r
{\r
#define F(t) sdf_terrain_map_detail(t).x\r
	vec3 dt = vec3(0.001, 0, 0);

	return normalize(vec3(\r
		F(p + dt.xzz) - F(p - dt.xzz),\r
		F(p + dt.zxz) - F(p - dt.zxz),\r
		F(p + dt.zzx) - F(p - dt.zzx)\r
	));\r
#undef F\r
}

vec3 setup_lights(\r
	_in(vec3) L,\r
	_in(vec3) normal\r
){\r
	vec3 diffuse = vec3(0, 0, 0);

	
	vec3 c_L = vec3(7, 5, 3);\r
	diffuse += max(0., dot(L, normal)) * c_L;

	
	float hemi = clamp(.25 + .5 * normal.y, .0, 1.);\r
	diffuse += hemi * vec3(.4, .6, .8) * .2;

	
	float amb = clamp(.12 + .8 * max(0., dot(-L, normal)), 0., 1.);\r
	diffuse += amb * vec3(.4, .5, .6);

	return diffuse;\r
}

vec3 illuminate(\r
	_in(vec3) pos,\r
	_in(vec3) eye,\r
	_in(mat3) local_xform,\r
	_in(vec2) df\r
){\r
	
	float h = df.y;\r
	

	vec3 w_normal = normalize(pos);\r
#define LIGHT\r
#ifdef LIGHT\r
	vec3 normal = sdf_terrain_normal(pos);\r
	float N = dot(normal, w_normal);\r
#else\r
	float N = w_normal.y;\r
#endif

	
	#define c_water vec3(.015, .110, .455)\r
	#define c_grass vec3(.086, .132, .018)\r
	#define c_beach vec3(.153, .172, .121)\r
	#define c_rock  vec3(.080, .050, .030)\r
	#define c_snow  vec3(.600, .600, .600)

	
	#define l_water .05\r
	#define l_shore .17\r
	#define l_grass .211\r
	#define l_rock .351

	float s = smoothstep(.4, 1., h);\r
	vec3 rock = mix(\r
		c_rock, c_snow,\r
		smoothstep(1. - .3*s, 1. - .2*s, N));

	vec3 grass = mix(\r
		c_grass, rock,\r
		smoothstep(l_grass, l_rock, h));\r
		\r
	vec3 shoreline = mix(\r
		c_beach, grass,\r
		smoothstep(l_shore, l_grass, h));

	vec3 water = mix(\r
		c_water / 2., c_water,\r
		smoothstep(0., l_water, h));

#ifdef LIGHT\r
	vec3 L = mul(local_xform, normalize(vec3(1, 1, 0)));\r
	shoreline *= setup_lights(L, normal);\r
	vec3 ocean = setup_lights(L, w_normal) * water;\r
#else\r
	vec3 ocean = water;\r
#endif\r
	\r
	return mix(\r
		ocean, shoreline,\r
		smoothstep(l_water, l_shore, h));\r
}

vec3 render(\r
	_in(ray_t) eye,\r
	_in(vec3) point_cam\r
){\r
	mat3 rot_y = rotate_around_y(27.);\r
	mat3 rot = mul(rotate_around_x(u_time * -12.), rot_y);\r
	mat3 rot_cloud = mul(rotate_around_x(u_time * 8.), rot_y);\r
    if (u_mouse.z > 0.) {\r
        rot = rotate_around_y(-u_mouse.x);\r
        rot_cloud = rotate_around_y(-u_mouse.x);\r
        rot = mul(rot, rotate_around_x(u_mouse.y));\r
        rot_cloud = mul(rot_cloud, rotate_around_x(u_mouse.y));\r
    }

	sphere_t atmosphere = planet;\r
	atmosphere.radius += max_height;

	hit_t hit = no_hit;\r
	intersect_sphere(eye, atmosphere, hit);\r
	if (hit.material_id < 0) {\r
		return background(eye);\r
	}

	float t = 0.;\r
	vec2 df = vec2(1, max_height);\r
	vec3 pos;\r
	float max_cld_ray_dist = max_ray_dist;\r
	\r
	for (int i = 0; i < TERR_STEPS; i++) {\r
		if (t > max_ray_dist) break;\r
		\r
		vec3 o = hit.origin + t * eye.direction;\r
		pos = mul(rot, o - planet.origin);

		df = sdf_terrain_map(pos);

		if (df.x < TERR_EPS) {\r
			max_cld_ray_dist = t;\r
			break;\r
		}

		t += df.x * .4567;\r
	}

#ifdef CLOUDS\r
	cloud = begin_volume(hit.origin, vol_coeff_absorb);\r
	clouds_march(eye, cloud, max_cld_ray_dist, rot_cloud);\r
#endif\r
	\r
	if (df.x < TERR_EPS) {\r
		vec3 c_terr = illuminate(pos, eye.direction, rot, df);\r
		vec3 c_cld = cloud.C;\r
		float alpha = cloud.alpha;\r
		float shadow = 1.;

#ifdef CLOUDS 
		pos = mul(transpose(rot), pos);\r
		cloud = begin_volume(pos, vol_coeff_absorb);\r
		vec3 local_up = normalize(pos);\r
		clouds_shadow_march(local_up, cloud, rot_cloud);\r
		shadow = mix(.7, 1., step(cloud.alpha, 0.33));\r
#endif

		return mix(c_terr * shadow, c_cld, alpha);\r
	} else {\r
		return mix(background(eye), cloud.C, cloud.alpha);\r
	}\r
}

#define FOV tan(radians(30.))\r

void mainImage(\r
	_out(vec4) fragColor,\r
#ifdef SHADERTOY\r
	vec2 fragCoord\r
#else\r
	_in(vec2) fragCoord\r
#endif\r
){\r
	
	vec2 aspect_ratio = vec2(u_res.x / u_res.y, 1);

	vec3 color = vec3(0, 0, 0);

	vec3 eye, look_at;\r
	setup_camera(eye, look_at);

	setup_scene();

	vec2 point_ndc = fragCoord.xy / u_res.xy;\r
#ifdef HLSL\r
		point_ndc.y = 1. - point_ndc.y;\r
#endif\r
	vec3 point_cam = vec3(\r
		(2.0 * point_ndc - 1.0) * aspect_ratio * FOV,\r
		-1.0);

	ray_t ray = get_primary_ray(point_cam, eye, look_at);

	color += render(ray, point_cam);

	fragColor = vec4(linear_to_srgb(color), 1);\r
}`;const n={width:window.innerWidth,height:window.innerHeight},v=new T,k=document.querySelector("canvas.webgl"),a=new h;let m=null,_=null,i=null,u=null,e=null,l=null;const E=()=>{m=new s(100,100),u=new s(n.width,n.height),_=new c({vertexShader:L,fragmentShader:S,uniforms:{iTime:{value:0},iResolution:{value:new d(1,1,1)}},side:y}),e=new c({vertexShader:C,fragmentShader:z,uniforms:{time:{value:0},mouse:{value:new d(0)},resolution:{value:new w(2560,1600)}}}),i=new f(m,_),l=new f(u,e),i.visible=!1,a.add(i),a.add(l)};window.addEventListener("mousemove",r=>{e.uniforms.mouse.x=r.clientX,e.uniforms.mouse.y=r.clientY});window.addEventListener("resize",()=>{n.width=window.innerWidth,n.height=window.innerHeight,t.aspect=n.width/n.height,t.updateProjectionMatrix(),o.setSize(n.width,n.height),o.setPixelRatio(Math.min(window.devicePixelRatio,2))});const t=new g(75,n.width/n.height,.1,100);t.position.set(0,0,40);a.add(t);const o=new x({canvas:k});o.setSize(n.width,n.height);o.setPixelRatio(Math.min(window.devicePixelRatio,2));E();v.add(l,"visible").name("earch");v.add(i,"visible").name("waterPlane");const F=new b,p=()=>{const r=F.getElapsedTime();_.uniforms.iTime.value=r,e.uniforms.time.value=r,o.render(a,t),window.requestAnimationFrame(p)};p();
