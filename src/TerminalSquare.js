

class TerminalSquare {

	constructor(parent, content, speed=50) {

		//content = [{"type": "div", "text": "test"}, {type:"br"}, {type:"br"}, {type:"a", text:"link", link:"www.google.com"}, {"type": "div", "text": " petit"}]

		this.parent = parent;
		this.speed = speed;

		//Animation variable
		this.currentIndex = 0;

		this.indexArray = [];
		this.limitArray = [];
		this.childIndex = [];

		this.msgDiv = [];
		
		//Create a new id string
		this.id = "square" + TerminalSquare.count++;

		this.parseContent(content);

		//To animate the elements, we clear the text content then we animate the insertion of each letters
		this.clearContent();
		this.animate();

	}

	parseContent(content, parent){

		content.forEach((cont, index) => {

			let elem = document.createElement(cont.type);


			if ("link" in cont) {
				elem.setAttribute("href", cont.link);
				elem.setAttribute("class", "clickable");
				elem.setAttribute("target", "_blank");
			}

			let len = 0;
			//Content
			if ("text" in cont) {
				elem.append(cont.text); //This line allow the element to take the space it will need to show the whole text
				elem.setAttribute("text", cont.text);
				len = cont.text.length;
			}

			let group = 0;
			if ("group" in cont) {
				group = cont.group;
			}

			if ("onClick" in cont) {
				elem.addEventListener("click", cont.onClick);
				elem.setAttribute("class", "clickable");

			}

			let image = false;
			if ( cont.type === "img") {
				image = true;
				elem.setAttribute("src", cont.src);
				elem.style.width = "100%";
				elem.style.height = "auto";

			}
			else{

				//Style
				elem.style.whiteSpace = "normal";
				elem.style.display = "inline";

			}
			

			//Cumulative sum
			while (this.limitArray.length <= group) {
				this.limitArray.push([]);
				this.indexArray.push([]);
				this.childIndex.push([]);
				this.msgDiv.push(undefined);
			}

			this.limitArray[group].push(len);
			this.indexArray[group].push(0);
			this.childIndex[group].push(index);


			//Create the div if needed
			if (this.msgDiv[group] === undefined) {
				this.msgDiv[group] = document.createElement("div");
				this.msgDiv[group].setAttribute("id", this.id+"_"+group);
			}

			this.msgDiv[group].appendChild(elem);

			if ( image ) {
				this.msgDiv[group] = elem;
				this.msgDiv[group].setAttribute("id", this.id+"_"+group);		
			}

		});



		this.msgDiv.forEach(elem => {

			let buzzDiv = document.createElement("div");
			buzzDiv.setAttribute("class", "buzz_wrapper");

			let textDiv = document.createElement("div");
			

			let span = document.createElement("span");

			//2 - Not mandatory
			let scanLine = document.createElement("div");
			scanLine.setAttribute("class", "scanline");


			span.appendChild(elem);

			textDiv.appendChild(span);

			buzzDiv.appendChild(textDiv);
			buzzDiv.appendChild(scanLine);

			this.parent.appendChild(buzzDiv);

			if ( elem.tagName === "IMG" ) {

				textDiv.setAttribute("class", "image");

				elem.addEventListener("load", event => {
					buzzDiv.style.height = (buzzDiv.scrollHeight - 100)+"px";
				});

			}
			else{

				textDiv.setAttribute("class", "text");

			}

			buzzDiv.style.height = (buzzDiv.scrollHeight - 100)+"px";

		});

	}


	getGroupId(group){

		return this.msgDiv[group].getAttribute("id");

	}


	clearContent(){

		this.msgDiv.forEach(element =>{

			[...element.children].forEach(elem => elem.innerHTML = "");

		});

	}


	animate(){


		let done = true;
		for (let i = 0; i < this.limitArray.length; ++i){

			let childIndex = 0;
			while(childIndex < this.limitArray[i].length){

				if ( this.indexArray[i][childIndex] < this.limitArray[i][childIndex] ) {
					break;
				}

				++childIndex;

			}

			//FINI
			if (childIndex == this.limitArray[i].length){
				continue;
			}

			let currentElement = this.msgDiv[i].children[ childIndex ];

			currentElement.append(currentElement.getAttribute("text")[this.indexArray[i][childIndex]++]);

			done = false;
		}

		if (!done) setTimeout(() => this.animate(), this.speed);

	}

}

TerminalSquare.count = 0;
