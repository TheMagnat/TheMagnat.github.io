
class GLShape {

	constructor(parent, rotations) {

		this.container = document.createElement("div");


		this.animationId = null;

		if (rotations == undefined)
			this.axisRotationDelta = [Math.random()-0.5, Math.random()-0.5, Math.random()-0.5]	

		else
			this.axisRotationDelta = rotations


		this.container.style.height = 300+"px"

		parent.appendChild(this.container);
		this.container.addEventListener("DOMNodeRemoved", () => this.onRemove())

		const canvasWidth = this.container.clientWidth
		const canvasHeight = this.container.clientHeight

		//console.log(width, height)

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 80, canvasWidth / canvasHeight, 0.1, 1000 );

		this.renderer = new THREE.WebGLRenderer( { alpha: true } );
		this.renderer.setSize( canvasWidth, canvasHeight );
		this.renderer.setClearColor( 0x000000, 0 );

		this.container.appendChild( this.renderer.domElement );



		//const 

		let geometry;
		switch( Math.floor(Math.random() * 5) ) {

			case 0:
				geometry = new THREE.BoxGeometry( 2.5, 2.5, 2.5, 3, 3, 3 );
				break;
			case 1:
				geometry = new THREE.DodecahedronGeometry(2, 0)
				break;
			case 2:
				geometry = new THREE.TorusGeometry( 1.5, 0.75, 8, 13 );
				break;

			case 3:
				geometry = new THREE.TorusKnotGeometry( 1.3, 0.5, 30, 8 );
				break;

			default:
				geometry = new THREE.SphereGeometry( 2, 10, 7 );
				break;


		}

		const material = new THREE.MeshPhongMaterial({
		      color : 0x06c939,
		      // flatShading: true,
		      shininess: 30,
		      wireframe : true,
		      wireframeLinewidth: 10
		    });
		this.object = new THREE.Mesh( geometry, material );
		this.scene.add( this.object );

		this.light = new THREE.PointLight( 0x404040, 5, 0, 2 );
		this.light.position.set( 50, 50, 50 );
		this.scene.add( this.light );

		const ambientLight = new THREE.AmbientLight( 0x404040, 0.4 ); // soft white ambientLight
		//const ambientLight = new THREE.AmbientLight( 0x404040, 10 ); // soft white ambientLight
		this.scene.add( ambientLight );
		

		this.camera.position.z = 4;

		//TEST
		this.composer = new POSTPROCESSING.EffectComposer( this.renderer );

		this.composer.addPass(new POSTPROCESSING.RenderPass(this.scene, this.camera));

		const blurPass = new POSTPROCESSING.BlurPass({
			kernelSize: 2,
			height: canvasHeight*2
		});
		this.composer.addPass( blurPass );

		//const luminosityPass = new POSTPROCESSING.ShaderPass( LuminosityShader );
		//

		this.startTime = Math.round(window.performance.now());
		this.animationId = requestAnimationFrame( time => this.render(time) );


		
	}


	onRemove(){
		cancelAnimationFrame(this.animationId);
	}


	render(time){

		let elapsedTime = (time - this.startTime) / 1000

		this.animationId = requestAnimationFrame( time => this.render(time) );

		this.object.rotation.x = this.axisRotationDelta[0] * elapsedTime;
		this.object.rotation.y = this.axisRotationDelta[1] * elapsedTime;
		this.object.rotation.z = this.axisRotationDelta[2] * elapsedTime;

		this.light.position.x = 25 * Math.cos(elapsedTime/2)
		this.light.position.z = 25 * Math.sin(elapsedTime/2)

		this.light.position.y = 5


		this.composer.render();
		//this.renderer.render(this.scene, this.camera);
	}

}