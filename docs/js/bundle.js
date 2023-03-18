!function e(n,t,o){function a(i,s){if(!t[i]){if(!n[i]){var c="function"==typeof require&&require;if(!s&&c)return c(i,!0);if(r)return r(i,!0);var u=new Error("Cannot find module '"+i+"'");throw u.code="MODULE_NOT_FOUND",u}var d=t[i]={exports:{}};n[i][0].call(d.exports,function(e){var t=n[i][1][e];return a(t?t:e)},d,d.exports,e,n,t,o)}return t[i].exports}for(var r="function"==typeof require&&require,i=0;i<o.length;i++)a(o[i]);return a}({1:[function(e,n,t){function o(e){function n(){var e=(new CANNON.Body({mass:0}),new THREE.OBJLoader);e.load("models/sphere.obj",function(e){var n=e.children[0];K=n.geometry,K.computeTangents();var t=K.vertices,o=new THREE.Vector3(0,0,10);K.faces.sort(function(e,n){return t[e.a].distanceToSquared(o)<t[n.a].distanceToSquared(o)}),console.log("bubbleGeometry",K);for(var a=0;140>a;a++)u()})}function t(){O=F.getElapsedTime(),ee.uniforms.time.value=O,I.update();var e=.1*O;G.x=100*de(0,e,0),G.z=100*de(0,e,0);for(var n,t=(new CANNON.Vec3,new THREE.Vector3),o=0,r=(new THREE.Vector3,new THREE.Vector3),i=z.length-1;i>=0;i--)z[i].bubbleInfo.death<O&&(a(z[i]),s(i),u());z.forEach(function(e){n=e.rigidBody.position,t.copy(e.rigidBody.velocity),t.setLength(Math.min(t.length(),Y)),e.rigidBody.velocity.copy(t),r.copy(n).sub(G),o=r.length(),r.setLength(-Math.min(o*e.bubbleInfo.mass,j*e.bubbleInfo.mass)),r.y+=THREE.Math.clamp(THREE.Math.mapLinear(n.y,-400,0,0,-300),-300,0),e.rigidBody.applyForce(r,n),e.material.uniforms.radius.value=e.bubbleInfo.radius,e.material.uniforms.speed.value=Math.max(.985*e.material.uniforms.speed.value,1.5*t.length()/Y)}),m(O)}function o(){N.render(C,B,null,!0),se&&se.update()}function a(e){if(e&&e.bubbleInfo){for(var n=new THREE.Geometry,t=new ParticleMaterial({map:SEM}),o=0;o<e.bubbleInfo.radius;o++)n.vertices[o]=new THREE.Vector3(THREE.Math.randFloat(-1,1),THREE.Math.randFloat(-1,1),THREE.Math.randFloat(-1,1)).normalize();var a=new THREE.PointCloud(n,t);a.position.copy(e.position),a.scale.copy(e.scale),a.quaternion.copy(e.quaternion);var r=250;new TWEEN.Tween(t).to({},r+100).onComplete(function(){a.geometry.dispose(),a.material.dispose(),C.remove(a)}).start(),new TWEEN.Tween(t.uniforms.size).to({value:0},r).onComplete(function(){a.geometry.dispose(),a.material.dispose(),C.remove(a)}).start(),new TWEEN.Tween(a.scale).to(a.scale.clone().multiplyScalar(.75),r).onComplete(function(){C.remove(a)}).start();var i=a.quaternion.clone(),s=(new THREE.Euler).setFromQuaternion(i);s.x+=THREE.Math.randFloat(-.25,.25),s.y+=THREE.Math.randFloat(-.15,.15),i.setFromEuler(s),new TWEEN.Tween(a.quaternion).to({},r).onUpdate(function(e){a.quaternion.slerp(i,e)}).onComplete(function(){C.remove(a)}).start(),C.add(a)}}function r(e,n,t){var o=new THREE.Vector3,a=1;z.forEach(function(r){o.copy(r.position).sub(e),a=t*(n-Math.min(o.length(),n))/n,a>1&&(o.setLength(a),r.rigidBody.applyImpulse(o,r.rigidBody.position))})}function s(e){var n=z[e];C.remove(n),P.remove(n.rigidBody),z.splice(e,1)}function c(e){C.remove(e),P.remove(e.rigidBody),z.splice(z.indexOf(e),1)}function u(){d({position:new THREE.Vector3(THREE.Math.randFloat(-200,200),THREE.Math.randFloat(-2500,-1300),THREE.Math.randFloat(-200,200)),radius:THREE.Math.randFloat(_,X)})}function d(e){e=e||{};var n=(new THREE.Vector3).copy(e.position),t=e.radius||_,o=Math.max(1,t*t*t*.005),a=new THREE.Mesh(K,ee.clone());a.material.uniforms.map.value=SEM,a.scale.set(t,t,t),C.add(a);var r=new CANNON.Body({mass:o,position:new CANNON.Vec3(n.x,n.y,n.z),shape:new CANNON.Sphere(t),linearDamping:.01,material:Q});a.bubbleInfo={birth:O,death:O+THREE.Math.mapLinear(Math.random(),0,1,k,U),radius:t,mass:o},f(r,a)}function l(e){if(e&&e.bubbleInfo){var n=10*Math.round(.1*e.bubbleInfo.radius);return ue[n]||"C4"}return"C4"}function E(e,n){e&&(ae.triggerAttackRelease(l(e),.5),a(e),e.material.dispose(),c(e),r(e.position,5*e.bubbleInfo.radius,1e6),n&&p(parseInt(le(e.bubbleInfo.radius,_,X,10,1))))}function p(e){S+=e,A.text("score: "+parseInt(S))}function f(e,n){n.rigidBody=e,P.addBody(e),z.push(n)}function m(e){if(void 0!==V){var n=e-V;P.step(W,n,L)}V=e,z.forEach(function(e){e.position.copy(e.rigidBody.position)})}function w(e){e.preventDefault();var n=window.innerWidth,t=window.innerHeight;i?(clearTimeout(ie),ie=setTimeout(function(){N.setSize(n,t)},100)):N.setSize(n,t),B.aspect=n/t,B.updateProjectionMatrix()}function v(e){e.preventDefault(),ne.x=e.clientX/window.innerWidth*2-1,ne.y=2*-(e.clientY/window.innerHeight)+1,raycaster.setFromCamera(ne,B);var n=raycaster.intersectObjects(C.children);if(n.length){var t=n[0].object;E(t,!0),u()}}function h(e){e.preventDefault();var n=e.touches||e.originalEvent.touches;for(var t in n){ne.x=n[t].pageX/window.innerWidth*2-1,ne.y=2*-(n[t].pageY/window.innerHeight)+1,raycaster.setFromCamera(ne,B);var o=raycaster.intersectObjects(C.children);if(o.length){var a=o[0].object;E(a,!0),u()}}}function T(){N=new THREE.WebGLRenderer({antialias:!0,devicePixelRatio:1}),N.setClearColor(16777215),N.sortObjects=!0,N.setSize(window.innerWidth,window.innerHeight),N.autoClear=!1,M.append(N.domElement)}function y(){TWEEN.update(),t(),o(),requestAnimationFrame(y)}function b(){T(),n(),$(document).on("mousedown",v),$(document).on("touchstart",h),$(window).on("resize",w),y()}var g=void 0!==e?e:!0,R=[255,0,255,255],H=new THREE.DataTexture(new Uint8Array(R),1,1,THREE.RGBAFormat);H._needsUpdate=!0;var M=$(document.createElement("div"));M.css({width:"100%",height:"100%",position:"absolute",left:0,top:0,margin:0,overflow:"hidden"}),document.body.appendChild(M[0]);var N,C=new THREE.Scene,x=new THREE.Group,F=new THREE.Clock,O=0;C.add(x);var S=(new THREE.LoadingManager,0),q=$("<div>",{text:"bubbles"}).css({position:"absolute",left:10,top:10}).appendTo(M),A=$("<div>",{text:"score:"}).appendTo(q),B=new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,1,4e3);B.position.set(0,-400,800);var I=new THREE.OrbitControls(B);I.target.set(0,-400,0),I.noRotate=!0,I.noZoom=!0,I.noPan=!0;var P=new CANNON.World;P.gravity.set(0,100,0);var V,W=1/60,L=3,z=[],D=new CANNON.Body({mass:0}),G=new THREE.Vector3,j=500,U=5,k=20,_=10,X=100,Y=500,J=new CANNON.Plane;D.addShape(J),P.addBody(D),D.quaternion.setFromAxisAngle({x:1,y:0,z:0},.5*Math.PI);var Q=new CANNON.Material({friction:.1}),Z=new CANNON.ContactMaterial(Q,Q,{friction:.1,restitution:.1,contactEquationStiffness:1e8,contactEquationRelaxation:3,frictionEquationStiffness:1e8,frictionEquationRegularizationTime:3});P.addContactMaterial(Z);var K=pickGeometry=new THREE.SphereGeometry(1,10,10);K.computeTangents(),SEM=THREE.ImageUtils.loadTexture("images/SEM.png");var ee=new FacingRatioMaterial({map:SEM}),ne=new THREE.Vector2;raycaster=new THREE.Raycaster;var te=new Tone.PingPongDelay("4n",.25).toMaster(),oe=(new Tone.Filter).connect(te).toMaster(),ae=(new Tone.AMSynth).connect(oe),re=new Tone.LFO("16n",100,1400);re.connect(oe.frequency),re.sync();var ie,se,ce=((new Tone.PluckSynth).toMaster(),4),ue={100:"C"+ce,90:"D"+ce,80:"E"+ce,70:"F"+ce,60:"G"+ce,50:"B"+ce,40:"A"+ce,30:"C"+(ce+1),20:"D"+(ce+1),10:"E"+(ce+1)},de=(new ImprovedNoise).noise,le=THREE.Math.mapLinear;return g&&(se=new Stats,$(se.domElement).css({}).appendTo(q)),{begin:b}}function a(e,n){null==n&&(n=""),e=e.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var t=new RegExp("[\\?&]"+e+"=([^&#]*)"),o=t.exec(window.location.href);return null==o?n:o[1]}var r;$(window).bind("load",function(){var e="true"==a("debug");r=new o(e),r.begin()});var i=["iPad","iPhone","iPod"].indexOf(navigator.platform)>=0},{}]},{},[1]);