/*MY FIRST JAVASCRIPT PROJECT not changing it if it works it works right :D*/


let print = obj => console.log("Print:", obj)




let showText = (target, message, index, interval) => {
	if (index < message.length) {
		if (target[0] == '#'){
			doc = document.getElementById(target.substring(1));
			doc.append(message[index++]);
		}

		setTimeout(() => showText(target, message, index, interval), interval);
	}
}


let terminalDiv = document.getElementById("terminal");

let lines = 0;
let addText = (message, index, interval, scroll=true) => {
	
	//Create a new id string
	let id = "line" + lines++;


	let buzzDiv = document.createElement("div");
	buzzDiv.setAttribute("class", "buzz_wrapper2");

	//1
	let textDiv = document.createElement("div");
	textDiv.setAttribute("class", "text2");

	let span1 = document.createElement("span2");

	let msgDiv = document.createElement("div");
	msgDiv.setAttribute("id", id);
	msgDiv.setAttribute("class", "msg")

	//2
	let scanLine = document.createElement("div");
	scanLine.setAttribute("class", "scanline2");

	span1.appendChild(msgDiv)
	textDiv.appendChild(span1)

	buzzDiv.appendChild(textDiv)
	//buzzDiv.appendChild(scanLine)

	terminalDiv.appendChild(buzzDiv)

	if (interval == 0){
		msgDiv.append(message)
	}
	else{
		showText('#'+id, message, index, interval);
	}

	//window.scrollTo(0,document.body.scrollHeight);
	if (scroll)
		smoothScroll(id);

}


let clear = () => {

	while (terminalDiv.lastElementChild) {
		terminalDiv.removeChild(terminalDiv.lastElementChild);
	}

}


let execution = () => {


	let executed = textarea.value;
	let command = executed.split(" ")[0]
	textarea.value = ""


	//Special commands
	if (executed == ""){
		return
	}
	else if (executed == "clear"){
		clear();
		addText('> ' + executed, 0, 50, false);
		return
	}


	addText('> ' + executed, 0, 50, false);

	switch (command){
		case "help":
			addText('commands:', 0, 100, false);
			addText('#1 MAIN, back to MAIN menuek,dedejjdjidejidejidejiedjideijdeijedijeijjidijeijd djejdjjed', 0, 100, false)
			addText('#2 PORT, nav to PORT page', 0, 100, false)
			addText('#3 ABOUT, nav to ABOUT page', 0, 100, false)
			addText('#4 CONT, nav to CONTACT page', 0, 100, false)
			addText('#5 STOP, stop all', 0, 100, true)
			break;
		case "test":
			addText('Debug test ICI loldjdejde ,dek,dek dk,dk, frjzdjde jdjej  djejdejed:', 0, 20);
			break;
		case "ls":
		case "cd":
			addText(command+': Permission denied', 0, 20);
			break;
		case "rm":
			if (executed == "rm -rf *"){
				addText("This is the end of the world.", 0, 20);
			}
			else{
				addText(command+": no.", 0, 20);	
			}
			break;
		default:
			addText('Command not found: '+command, 0, 50)	
	}

}

let execButton = document.getElementById("exec");
execButton.addEventListener('click', execution);


let autosize = event => {

	let el = event.target;

	el.value = el.value.replace(/\r?\n|\r/g, '')

	if (event.inputType == "insertLineBreak"){
		execution();
	}
	else{
		setTimeout(() => {
			el.style.cssText = 'height:0; padding:0';
			el.style.cssText = 'height:' + el.scrollHeight + 'px';
		}, 0);
	}
	
}

let textarea = document.getElementById("fname");
textarea.addEventListener('input', autosize);
			 

let main = event => {
	
	showText("#msg", "Terminal", 0, 100);
	showText("#msg1", "My portfolio, type help", 0, 100);
	setTimeout(() => textarea.focus(), 500);

	textarea.addEventListener('keypress', function(e) {
		if (e.which == 32)
			return false;
	});

}

document.addEventListener("DOMContentLoaded", main);





function currentYPosition() {
    // Firefox, Chrome, Opera, Safari
    if (self.pageYOffset) return self.pageYOffset;
    // Internet Explorer 6 - standards mode
    if (document.documentElement && document.documentElement.scrollTop)
        return document.documentElement.scrollTop;
    // Internet Explorer 6, 7 and 8
    if (document.body.scrollTop) return document.body.scrollTop;
    return 0;
}


function elmYPosition(eID) {
    var elm = document.getElementById(eID);
    var y = elm.offsetTop;
    var node = elm;
    while (node.offsetParent && node.offsetParent != document.body) {
        node = node.offsetParent;
        y += node.offsetTop;
    } return y;
}




let seconds = 0.25;
let step = 1/(60 * seconds);

let start = 0;
let stop = 0;

let queue = [];

//During animation
let iteration = 0;
let inAnimation = false;

function smoothScroll(eID) {

	if(eID){
			console.log("PUSH", eID)
			queue.push(eID);
	}


	if (!inAnimation){

		inAnimation = true;

		elemId = queue.shift();

	    start = currentYPosition();
	    stop = elmYPosition(elemId) - window.innerHeight * 1.9/3;


	    // var distance = stop > startY ? stop - startY : startY - stop;
	    // if (distance < 100) {
	    //     scrollTo(0, stop); return;
	    // }
	    // var speed = Math.round(distance / 100);
	    // if (speed >= 20) speed = 20;
	    // var step = Math.round(distance / 25);
	    // var leapY = stop > startY ? startY + step : startY - step;
	    // var timer = 0;

	    // m2 = 0
	    if (stop < start) {
	    	let tempoStart = start;
	    	start = stop;
	    	stop = tempoStart;
	    }


		animate();

	}

}



function animate (){

    //console.log("ICI:", iteration, iteration/nbIterr)
    mu2 = (1 - Math.cos(iteration*Math.PI)) / 2;
			
	let leapY = start * (1 - mu2) + stop * mu2

	console.log("2", leapY, stop)
	if (leapY >= stop){
		leapY = stop;
		animationEnd();
	}
	else{
		setTimeout(() => animate(), 1000/60);
	}

	//console.log(iteration, leapY)
	window.scrollTo(0, leapY)

	iteration += step;


}

function animationEnd(){
	iteration = 0;
	inAnimation = false;

	//If there is more to scroll
	print(queue.length)
	if (queue.length){
		//restart
		smoothScroll();
	}

}



