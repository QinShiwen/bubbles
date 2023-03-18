/*ParticleMaterial.js*/

var ParticleMaterial = function( params ) {

	params = params || {};

	var matParams = {
		transparent: true,
		blending: params.blending || 1,
		depthTest: false,
		depthWrite: false,
		// TODO: if radius is staying at 1 lets remove it

		uniforms: {
			color: {type: 'c', value: params.color || new THREE.Color( 1, 1, 1 ) },
			opacity: {type: 'f', value: params.opacity || 1.},
			size: { type: 'f', value: params.size || 5},
			scale: { type: 'f', value: params.scale || 20},
			noiseScale: { type: 'f', value: params.noiseScale || 1. },
			noiseSpeed: { type: 'f', value: params.noiseSpeed || 1 },
			noiseAmount: { type: 'f', value: params.noiseAmount || .5},
			time: {type: 'f', value: 0},
			map: {type: 't', value: params.map }
		},

		// attributes: 
		// {
		// 	vertexColor: { type: 'c', value: params.vertexColor || [] }
		// },

		vertexShader: [
		'uniform vec2 uvScale;',
		'uniform float size;',
		'uniform float noiseScale;',
		'uniform float noiseAmount;',
		'uniform float noiseSpeed;',
		'uniform float time;',

		'float hash( float n ) { return fract(sin(n)*43758.5453123); }',

		'float noise3( in vec3 x )',
		'{',
		'    vec3 p = floor(x);',
		'    vec3 f = fract(x);',
		'    f = f*f*(3.0-2.0*f);',
		'	',
		'    float n = p.x + p.y*157.0 + 113.0*p.z;',
		'    return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),',
		'                   mix( hash(n+157.0), hash(n+158.0),f.x),f.y),',
		'               mix(mix( hash(n+113.0), hash(n+114.0),f.x),',
		'                   mix( hash(n+270.0), hash(n+271.0),f.x),f.y),f.z) * 2. - 1.;',
		'}',

		'float mapLinear( in float x, in float a1, in float a2, in float b1, in float b2 ) {',
		'	return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );',
		'}',

		'void main() {',
		'	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
		'	gl_Position = projectionMatrix * mvPosition;',
		'	gl_PointSize =  max(.1, size * ( 1000. / length( mvPosition.xyz ) ) );',

		'}'].join('\n'),

		fragmentShader: [

		'uniform sampler2D map;',

		'uniform float opacity;',

		'uniform vec3 color;',

		'void main()',
		'{',

		'	vec2 uv = gl_PointCoord.xy * 2. - 1.;',
		
		'	float alpha = max(0., (1. - dot(uv, uv) ) * opacity);',

		'	gl_FragColor = texture2D( map, uv ) * vec4( color, alpha * dot(uv, uv) );',

		'}'
		].join('\n')

	}
	
	THREE.ShaderMaterial.call( this, matParams );
}

ParticleMaterial.prototype = Object.create( THREE.ShaderMaterial.prototype );
