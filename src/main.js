

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
let addText = (message, index, interval, color="green", scroll=true) => {
	
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
	msgDiv.style.color = color;

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

	addText("> Terminal cleared", 0, 50, "#00bf00", false);

}

let getAge = dateString => {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}


const execution = executed => {

	if (executed === undefined) {
		executed = textarea.value;
		textarea.value = ""
	}

	let splitedCommand = executed.split(" ");
	let command = splitedCommand[0].toLowerCase();

	//Special commands
	if (executed == ""){
		return
	}
	else if (executed == "clear"){
		clear();
		return
	}


	addText('> ' + executed, 0, 50, "#00bf00", false);

	switch (command){
		case "help":
			new TerminalSquare(terminalDiv, [
				{type:"div", group:0, text: "#1 "}, {type:"div", group:0, onClick: () => execution("me"), text: "ME"}, {type: "div", group:0, text: " - Tell you about myself"},
				{type:"div", group:1, text: "#2 "}, {type:"div", group:1, onClick: () => execution("education"), text: "EDUCATION"}, {type: "div", group:1, text: " - To get my school path"},
				{type:"div", group:2, text: "#3 "}, {type:"div", group:2, onClick: () => execution("shader"), text: "SHADER"}, {type: "div", group:2, text: " - Display some of my shaders work"},
				{type:"div", group:3, text: "#4 "}, {type:"div", group:3, onClick: () => execution("competition"), text: "COMPETITION"}, {type: "div", group:3, text: " - List of my participation in competitions"},
				{type:"div", group:4, text: "#5 "}, {type:"div", group:4, onClick: () => execution("clear"), text: "CLEAR"}, {type: "div", group:4, text: " - Clear the terminal"},
			]);
			smoothScroll("exec");
			break;

		case "me":
			new GLShape(terminalDiv);
			let meDiv = new TerminalSquare(terminalDiv, [
				{type: "div", group:0, text: "Name: MAGNIADAS Guillaume"},
				{type: "div", group:1, text: `Age: ${getAge("1998/05/25")} years`},
				{type: "div", group:2, text: "Activity: Last year master's student at Sorbonne Universit?? (Paris 6)"},
				{type: "div", group:3, text: "I am currently on an internship at Air France as an Operational Research engineer."},
			]);
			smoothScroll("exec");
			break;

		case "education":
			new GLShape(terminalDiv);
			let educDiv = new TerminalSquare(terminalDiv, [
				{type: "div", group:0, text: "After obtaining my baccalaureate in 2017, I started a bachelor's degree in mathematics at the University of Paris VIII."},
				{type: "img", group:1, src: "static/paris8.jpg"},
				{type: "div", group:2, text: "But very quickly I found a passion for computers science and asked to be transferred to a computer science degree in the same faculty. I finished my bachelor's degree in 2020 with highest honour."},
				{type: "div", group:3, text:
				"Then I continued in 2020 with the ANDROIDE master's degree (the acronym for \
				\"Distributed Agents, Robotics, Operational Research, Interaction, Decision\" in french) \
				from Sorbonne Universit?? (Paris 6)."},
				{type: "div", group:5, text:
				"I made this choice because during my degree, I discovered a passion for Optimization and \
				Artificial Intelligence, subjects in which I decided to deepen my knowledge and this master \
				is a perfect mix between these two areas. \
				I am still in it for my last year."},
				{type: "img", group:4, src: "static/sorbonne.jpg"},
			]);
			smoothScroll(educDiv.getGroupId(1));
			break;

		case "competition":
			new GLShape(terminalDiv);
			let competDiv = new TerminalSquare(terminalDiv, [
				{type: "strong", group:0, text: "#1 API8 Contest, 6th Edition"}, {type: "br", group:0},
				{type: "b", group:0, text: "(Graphical programing competition)"}, {type: "br", group:0},				
				{type: "div", group:1, text: "Obtained the first place of the track 1 : DemoMaker Giga"}, {type: "br", group:1}, {type: "br", group:1},

				{type: "strong", group:2, text: "#2 SWERC 2019 - 2020"}, {type: "br", group:2},
				{type: "b", group:2, text: "(Team Algorithmic Programming competition)"}, {type: "br", group:2},
				{type: "div", group:3, text: "Obtained the 69th place of the competition with my team."},

				{type: "strong", group:4, text: "#3 BattleDev 2021"}, {type: "br", group:4},
				{type: "b", group:4, text: "(Algorithmic programming competition)"}, {type: "br", group:4},
				{type: "div", group:5, text: "Obtained the 142nd place of the competition out of 3000 participants."},
			]);
			smoothScroll("exec");
			break;

		case "shader":

			if (splitedCommand.length > 1){

				let firstArg = splitedCommand[1].toLowerCase();
				switch (firstArg){
					case "test":
						new GLShader(terminalDiv, 0);
						break;

					case "noise":
						new GLShader(terminalDiv, 1);
						break;

					default:
						addText('Shader not found: '+firstArg, 0, 50)
				}

			}
			else{

				new TerminalSquare(terminalDiv, [
					{type:"div", group:0, text: "#1 "}, {type:"div", group:0, onClick: () => execution("shader noise"), text: "SHADER NOISE"}, {type: "div", group:0, text: " - A combinaison of multiple layers of perlin noise with transparents effects"},
					//{type:"div", group:1, text: "#2 "}, {type:"div", group:1, onClick: () => execution("shader test"), text: "SHADER TEST"}, {type: "div", group:1, text: " - A test shader, not by myself"},
				]);

			}

			smoothScroll("exec");
			break;

		case "gl":
			//new GLShape(terminalDiv);
			new GLShader(terminalDiv);
			smoothScroll("exec");
			break;

		case "im":
			new TerminalSquare(terminalDiv, [
				{type:"img", group:0, src:"static/fleur.jpg"},
			]);
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
		case "julie":
			new TerminalSquare(terminalDiv, [
				{type: "h1", group:0, text: "julie"},
				{type: "p", group:1, text: "Je m'appele julie j'habite a tours j'ai 22 ans je suis toute petite et mignonne et j'ai un chat qui va bient??t d??passer mon poid."},
				{type: "a", group:2, onClick: () => document.location.href = "http://www.jolie.com", text: "mon cv"},
			]);
			break;

		default:
			addText('Command not found: '+command, 0, 50)
	}

}

let execButton = document.getElementById("exec");
execButton.addEventListener('click', () => execution());

let clearButton = document.getElementById("clearButton");
clearButton.addEventListener('click', () => clear());



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
	
	showText("#msg", "Shell client", 0, 100);
	//showText("#msg1", "My portfolio, type help", 0, 100);
	//addText("My portfolio, type help", 0, 100);

	new GLShape(document.getElementById("first"));

	new TerminalSquare(document.getElementById("first"), [
		{type:"div", group:0, text:"Hello and welcome to my computer"},
		{type:"div", group:1, text:"Here you have access to a large database about me"},
		{type:"div", group:2, text:"I obviously did not give you access to all the commands, to have the list of those you have :"},
		{type:"div", group:3, text:"Enter the command "}, {type:"div", group:3, onClick: () => execution("help"), text: "help"}
	]);
	//setTimeout(() => textarea.focus(), 500);




	//textarea.focus({ preventScroll: true });

}

document.addEventListener("DOMContentLoaded", main);
