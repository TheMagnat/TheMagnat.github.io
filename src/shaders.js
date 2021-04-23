let vertexShader = `varying vec2 vUv;void main(){vUv = uv;gl_Position = vec4(position, 1.0);}`;

let fragmentShader1 = `
uniform float time;

uniform float xRatio;

varying vec2 vUv;

void main(void) {

	//vec2 coord = vec2(vUv.x - 0.5, vUv.y - 0.5);

	//vUv.x *= xRatio;

	vec2 p = - 1.0 + 2.0 * vUv;
	p.x *= xRatio;


	float a = time * 40.0;
	float d, e, f, g = 1.0 / 40.0 ,h ,i ,r ,q;

	e = 400.0 * ( p.x * 0.5 + 0.5 );
	f = 400.0 * ( p.y * 0.5 + 0.5 );
	i = 200.0 + sin( e * g + a / 150.0 ) * 20.0;
	d = 200.0 + cos( f * g / 2.0 ) * 18.0 + cos( e * g ) * 7.0;
	r = sqrt( pow( abs( i - e ), 2.0 ) + pow( abs( d - f ), 2.0 ) );
	q = f / r;
	e = ( r * cos( q ) ) - a / 2.0;
	f = ( r * sin( q ) ) - a / 2.0;
	d = sin( e * g ) * 176.0 + sin( e * g ) * 164.0 + r;
	h = ( ( f + d ) + a / 2.0 ) * g;
	i = cos( h + r * p.x / 1.3 ) * ( e + e + a ) + cos( q * g * 6.0 ) * ( r + h / 3.0 );
	h = sin( f * g ) * 144.0 - sin( e * g ) * 212.0 * p.x;
	h = ( h + ( f - e ) * q + sin( r - ( a + h ) / 7.0 ) * 10.0 + i / 4.0 ) * g;
	i += cos( h * 2.3 * sin( a / 350.0 - q ) ) * 184.0 * sin( q - ( r * 4.3 + a / 12.0 ) * g ) + tan( r * g + h ) * 184.0 * cos( r * g + h );
	i = mod( i / 5.6, 256.0 ) / 64.0;
	if ( i < 0.0 ) i += 4.0;
	if ( i >= 2.0 ) i = 4.0 - i;
	d = r / 350.0;
	d += sin( d * d * 8.0 ) * 0.52;
	f = ( sin( a * g ) + 1.0 ) / 2.0;
	gl_FragColor = vec4( vec3( f * i / 1.6, i / 2.0 + d / 13.0, i ) * d * p.x + vec3( i / 1.3 + d / 8.0, i / 2.0 + d / 18.0, i ) * d * ( 1.0 - p.x ), 1.0 );

}
`


let fragmentShader2 = `
#define M_PI 3.1415926535897932384626433832795

#define NB_LAYERS 10.0


varying vec2 vUv;

uniform float time;

uniform float xRatio;


//Hash function found on the internet
float Hash21(vec2 p) {
	p = fract(p*vec2(234.34, 435.345));
    p += dot(p, p+34.23);
    return fract(p.x*p.y);
}

//Same as Hash21, found on the shader book
float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 Hash22(vec2 p){
	float n = Hash21(p);
	return vec2(n, Hash21(p + n));
}

//Link to this function http://paulbourke.net/miscellaneous/interpolation/
float cosineInterpolate(float y1, float y2, float mu){
   
   float mu2;

   mu2 = (1.0-cos(mu * M_PI))/2.0;
   
   return(y1*(1.0-mu2)+y2*mu2);
}

//2D noise using the random function
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}


void main(){
	const float speed = 0.1;

	float t = time*0.1;

	vec2 coord = vec2(vUv.x - 0.5, vUv.y - 0.5);
	//vec2 coord = vUv;
	coord.x *= xRatio;

	///Controles
	//Zoomer
	//coord *= cosineInterpolate(0, 10, cos(time/5)) + 5.0;

	float s = sin(t);
	float c = cos(t);
	mat2 roation = mat2(c, -s, s, c);

	coord *= roation;
	
	//Avancer
	//coord.y += time*speed;
	//coord.x += cos(time/2)*speed;

	vec2 offset = vec2(0.0, 0.0) * 1.0;
	///Fin controles


	vec3 color = vec3(0);

	float value = 0.0;

	float test1 = smoothstep(0.30*abs(cos(t*3.0)), 0.4*abs(cos(t*3.0)), noise(coord * 10.0 + vec2(t*1.1234, -t*1.1347) + offset*0.8)); // éclaboussure noire
    float test2 = smoothstep(0.4*abs(cos(t*1.78)), 0.35*abs(cos(t*1.78)), noise(coord * 10.0 + vec2(t*1.24368, t*1.1234) + offset*0.9)); // 'trou' dans l'éclaboussure
    float test3 = smoothstep(0.8*abs(cos(t*2.78)), 0.9*abs(cos(t*2.78)), noise(coord * 5.0 + vec2(-t*1.3457, t*1.1243) + offset*1.0 )); // éclaboussure noire
    float test4 = smoothstep(0.7*abs(cos(t*2.38)), 0.8*abs(cos(t*2.38)), noise(coord * 8.0 + vec2(-t*1.1457, -t) + offset*1.1)); // éclaboussure noire

    value = test1 - test2 + test3 - test4;

    float tempo1 = smoothstep(0.35, 0.45, value) * smoothstep(0.65, 0.55, value);// * smoothstep(0.7, 0.8, value);
    //float tempo2 = smoothstep(0.6, 0.7, value) * smoothstep(0.9, 0.8, value);


    if(false){
    	value = tempo1;
    }

	vec3 sceneColor = sin(t * 20.0 * vec3(0.339, 0.414, 0.532)) * 0.4 + 0.6;

	color += value * sceneColor;

	gl_FragColor = vec4(color, 1);

}`
