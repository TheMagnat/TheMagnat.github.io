


document.addEventListener('wheel', event => {

	if ( animationId !== null ){
		window.cancelAnimationFrame(animationId);
		animationEnd();
	}

});



const currentYPosition = () => {
    // Firefox, Chrome, Opera, Safari
    if (self.pageYOffset) return self.pageYOffset;
    // Internet Explorer 6 - standards mode
    if (document.documentElement && document.documentElement.scrollTop)
        return document.documentElement.scrollTop;
    // Internet Explorer 6, 7 and 8
    if (document.body.scrollTop) return document.body.scrollTop;
    return 0;
}


const elmYPosition = eID => {
    var elm = document.getElementById(eID);
    var y = elm.offsetTop;
    var node = elm;
    while (node.offsetParent && node.offsetParent != document.body) {
        node = node.offsetParent;
        y += node.offsetTop;
    } return y;
}


let seconds = 1;

let start = 0;
let stop = 0;

let queue = [];

//During animation
let inAnimation = false;

let startTime = null;


let animationId = null;

const smoothScroll = eID => {
	
	if(eID){
		queue.push(eID);
	}


	if (!inAnimation){

		inAnimation = true;

		elemId = queue.shift();

	    start = currentYPosition();
	    stop = elmYPosition(elemId) - window.innerHeight * 2.5/3;

	    // m2 = 0
	    if (stop < start) {
	    	let tempoStart = start;
	    	start = stop;
	    	stop = tempoStart;
	    }

	    startTime = Math.round(window.performance.now());
		animationId = requestAnimationFrame(animate);

	}

}

const animate = time => {
	
	elapsedTime = (time - startTime) / 1000
	delta = elapsedTime / seconds    

	if (delta >= 1){
		window.scrollTo(0, stop)
		animationEnd();
		return
	}

	//Next animation
	animationId = requestAnimationFrame(animate);

	//End calculs
	deltaCos = (1 - Math.cos(delta*Math.PI)) / 2;

	let leapY = start * (1 - deltaCos) + stop * deltaCos

	window.scrollTo(0, leapY)

}

const animationEnd = () => {

	inAnimation = false;
	animationId = null;

	//If there is more to scroll
	if (queue.length){
		//restart
		smoothScroll();
	}

}