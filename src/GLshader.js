


let allFragmentShader = [fragmentShader1, fragmentShader2]




class GLShader {

	constructor(parent, fsNb=1) {

		this.container = document.createElement("div");


		this.animationId = null;
		

		parent.appendChild(this.container);

		this.container.style.height = this.container.clientWidth+"px"


		this.container.addEventListener("DOMNodeRemoved", () => this.onRemove())

		const canvasWidth = this.container.clientWidth
		const canvasHeight = this.container.clientHeight

		//console.log(width, height)

		this.scene = new THREE.Scene();


		let xRatio = canvasWidth / canvasHeight;

		this.camera = new THREE.PerspectiveCamera(45, xRatio, 1, 1000);

		this.renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true } );

		this.renderer.setSize( canvasWidth, canvasHeight );
		this.renderer.setClearColor( 0x000000, 0 );

		this.container.appendChild( this.renderer.domElement );


		this.uniforms = { time: { value: 0.1 }, xRatio: { value: xRatio } };

		this.quad = new THREE.Mesh(
		  new THREE.PlaneGeometry(2, 2),
		  new THREE.ShaderMaterial({
		  	uniforms: this.uniforms,
		    vertexShader: vertexShader,
		    fragmentShader: allFragmentShader[fsNb],
		    depthWrite: false,
		    depthTest: false
		  })
		);
				
		//this.object = new THREE.Mesh( geometry, material );
		this.scene.add( this.quad );


		//this.camera.position.z = 3;
		//this.camera.position.z = 0;



		this.startTime = Math.round(window.performance.now());
		this.animationId = requestAnimationFrame( time => this.render(time) );


		
	}


	onRemove(){
		cancelAnimationFrame(this.animationId);
	}


	render(time){

		this.animationId = requestAnimationFrame( time => this.render(time) );


		let elapsedTime = (time - this.startTime) / 1000

		this.uniforms["time"].value = elapsedTime

		this.renderer.render(this.scene, this.camera);
	}

}