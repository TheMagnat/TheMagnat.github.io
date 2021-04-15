

//import {TerminalSquare} from 'TerminalSquare.js';

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
		smoothScroll("exec");

}


let clear = () => {

	while (terminalDiv.lastElementChild) {
		terminalDiv.removeChild(terminalDiv.lastElementChild);
	}

}


const execution = () => {


	let executed = textarea.value;
	let command = executed.split(" ")[0].toLowerCase();
	textarea.value = ""


	//Special commands
	if (executed == ""){
		return
	}
	else if (executed == "clear"){
		clear();
		addText("> Terminal cleared", 0, 50, false);
		return
	}


	addText('> ' + executed, 0, 50, false);

	switch (command){
		case "help":
			new TerminalSquare(terminalDiv, [
				{type: "div", group:0, text: "#1 ME - Tell you about myself"},
				{type: "div", group:1, text: "#2 CLEAR - Clear the terminal"},
			]);
			smoothScroll("exec");
			break;

		case "me":
			new TerminalSquare(terminalDiv, [
				{type: "div", group:0, text: "Name: MAGNIADAS Guillaume"},
				{type: "div", group:1, text: "Age: 22 years"},
				{type: "div", group:2, text: "Activity: First year master's student at Sorbonne Université"},
			]);
			smoothScroll("exec");
			break;
		case "projects":


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

	const regReturn = /\r?\n|\r/g;
	if (regReturn.test(el.value)) {
		el.value = el.value.replace(/\r?\n|\r/g, '')
		execution();
	}

	setTimeout(() => {
		el.style.cssText = 'height:0; padding:0';
		el.style.cssText = 'height:' + el.scrollHeight + 'px';
	}, 0);

}

let textarea = document.getElementById("fname");
textarea.addEventListener('input', autosize);
			 

const main = event => {
	
	showText("#msg", "Terminal", 0, 100);
	//showText("#msg1", "My portfolio, type help", 0, 100);
	//addText("My portfolio, type help", 0, 100);
	new TerminalSquare(document.getElementById("first"), [
		{type:"div", group:0, text:"Hello and welcome to my computer"},
		{type:"div", group:1, text:"Here you have access to a large database about me"},
		{type:"div", group:2, text:"I obviously did not give you access to all the commands, to have the list of those you have :"},
		{type:"div", group:3, text:"Enter the command \"help\""}
	]);
	//setTimeout(() => textarea.focus(), 500);


	//textarea.focus({ preventScroll: true });

}

document.addEventListener("DOMContentLoaded", main);
