/**
 * FacingRatioMaterial.js
 */


var FacingRatioMaterial = function(params)
{
	params = params || {};

	var qTangent = new THREE.Quaternion(), qBitangent = new THREE.Quaternion();
	qTangent.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), .1 );
	qBitangent.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), .1 );

	var matParams = {
		opacity: 1,
		transparent: true,
		blending: params.blending || 1,
		depthTest: true,
		depthWrite: true,

		side: params.side || 2,

		uniforms: {
			c0: {type: 'c', value: params.c0 || new THREE.Color( 0xFFFFFF )},
			c1: {type: 'c', value: params.c1 || new THREE.Color( 0x000000 )},
			alpha0: {type: 'f', value: params.alpha0 || .75 },
			alpha1: {type: 'f', value: params.alpha1 || .1 },
			time: {type: 'f', value: 0 },
			radius: {type: 'f', value: 30 },
			noiseAmount: {type: 'f', value: .65 },
			speed: {type: 'f', value: 1 },
			qTangent: {type: 'v4', value: qTangent },
			qBitangent: {type: 'v4', value: qBitangent },
			tangentScale: {type: 'f', value: .1}, 
			noiseScale: {type: 'f', value: .01},
			map: {type: 't', value: params.map }
		},

		vertexShader: [
		'uniform float time;',
		'uniform float radius;',
		'uniform float speed;',
		'uniform float tangentScale;',
		'uniform float noiseScale;',
		'uniform float noiseAmount;',

		'uniform vec4 qTangent;',
		'uniform vec4 qBitangent;',

		'attribute vec3 tangent;',
		// 'attribute vec3 bitangent;',

		'varying vec3 eye;',
		'varying vec3 vNormal;',
		'varying vec2 vN;',


		'//rotate vector',
		'vec3 qrot(vec4 q, vec3 v){',
		'        return v + 2.0*cross(q.xyz, cross(q.xyz,v) + q.w*v);',
		'}',

		'//rotate vector (alternative)',
		'vec3 qrot_2(vec4 q, vec3 v)     {',
		'        return v*(q.w*q.w - dot(q.xyz,q.xyz)) + 2.0*q.xyz*dot(q.xyz,v) + 2.0*q.w*cross(q.xyz,v);',
		'}',

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
		'                   mix( hash(n+270.0), hash(n+271.0),f.x),f.y),f.z) - .5;',
		'}',

		'float noiseFunc( in vec3 p){	return noise3( p * vec3(1., .5, 1.) * noiseScale + vec3(0., time, 0.));}',

		
		'vec3 normalFrom3Points( vec3 p0, vec3 p1, vec3 p2){',
		'	return normalize( cross( p2-p1, p0-p1 ) );',
		'}',

		'vec4 getModelPos( vec3 p){',
		'	return modelMatrix * vec4(p, 1.);',
		'}',


		'void main() {', 
		'	vNormal = normalize(normalMatrix * normal);',

		'	vec3 t = vec3(0., -time, 0.);',

		'	vec3 binormal = cross( normal, tangent );',

		'	vec3 vTangent = normalize( normalMatrix * -tangent );// * tangentScale;',
		'	vec3 bitangent = normalize( normalMatrix * binormal );// * tangentScale;',

		
		'	vec4 ecPosition = modelMatrix * vec4(position, 1.);',
		'	vec3 samplePos = ecPosition.xyz;',
		'	vec3 samplePos1 = (ecPosition.xyz + vTangent);',
		'	vec3 samplePos2 = (ecPosition.xyz + bitangent);',

		'	float dipslacement = radius * speed * noiseAmount;',

		'	vec3 deformedPos = vNormal * noiseFunc( samplePos ) * dipslacement;',
		'	vec3 deformedTangent = vTangent + vNormal * noiseFunc( samplePos1 ) * dipslacement;',
		'	vec3 deformedBitangent = bitangent + vNormal * noiseFunc( samplePos2 ) * dipslacement;',

		'	vNormal = normalFrom3Points( deformedTangent, deformedPos, deformedBitangent );',

		'	ecPosition = viewMatrix * ecPosition + vec4( deformedPos, 0.);',

		'	eye = normalize(ecPosition.xyz);',

		'	gl_Position = projectionMatrix * ecPosition;',



		'	vec3 e = normalize( ecPosition.xyz );// vec3( modelViewMatrix * p ) );',
		'	vec3 n = vNormal;//normalize( normalMatrix * normal );',

		'	vec3 r = reflect( e, n );',
		'	float m = 2. * sqrt( ',
		'	    pow( r.x, 2. ) + ',
		'	    pow( r.y, 2. ) + ',
		'	    pow( r.z + 1., 2. ) ',
		'	);',
		'	vN = r.xy / m + .5;',


		'}',
		].join('\n'),

		fragmentShader: [

		'float mapLinear( in float x, in float a1, in float a2, in float b1, in float b2 ) {',
		'	return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );',
		'}',

		'uniform vec3 c0;',
		'uniform vec3 c1;',
		'uniform float alpha0;',
		'uniform float alpha1;',
		'uniform sampler2D map;',

		'varying vec3 eye;',
		'varying vec3 vNormal;',
		'varying vec2 vN;',

		'void main()',
		'{',	

		'	vec3 n = normalize(vNormal);',

		'	float lr = abs(dot(n, normalize(vec3(-.5, 1., 2.))));',

		'	float fr = dot(n, normalize(eye));',
		'	float mfr = 1. - abs(fr);',

		'	vec3 mapColor = texture2D( map, vN ).xyz;',

		'	mapColor.y = texture2D( map, ((vN*2.-1.) * .975) * .5 + .5 ).y;',
		'	mapColor.z = texture2D( map, ((vN*2.-1.) * .95) * .5 + .5 ).z;',

		'	gl_FragColor = vec4( mix(vec3(.925,.95,1.), mapColor, pow(mfr*1.5, 2.)), pow(mfr, 4.) * 1.25 + .2);',

		// '	gl_FragColor.xyz = sqrt( gl_FragColor.xyz );',

		'}'
		].join('\n'),

	}

	THREE.ShaderMaterial.call( this, matParams );
}


FacingRatioMaterial.prototype = Object.create( THREE.ShaderMaterial.prototype );