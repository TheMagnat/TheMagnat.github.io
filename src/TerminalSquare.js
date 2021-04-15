

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
		

		this.parseContent(content);


		this.clearContent();

		this.animate();

	}

	parseContent(content, parent){

		//Create a new id string
		let id = "square" + TerminalSquare.count++;


		content.forEach((cont, index) => {

			let elem = document.createElement(cont.type);

			if ("link" in cont) {
				elem.setAttribute("href", cont.link);
			}

			let len = 0;
			//Content
			if ("text" in cont) {
				elem.append(cont.text);
				elem.setAttribute("text", cont.text);
				len = cont.text.length;
			}

			let group = 0;
			if ("group" in cont) {
				group = cont.group;
			}
			
			//Style
			elem.style.whiteSpace = "normal";
			elem.style.display = "inline";

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
				this.msgDiv[group].setAttribute("id", id+"_"+group);
				this.msgDiv[group].setAttribute("class", "msg")
			}

			this.msgDiv[group].appendChild(elem);

		});



		this.msgDiv.forEach(elem => {

			let buzzDiv = document.createElement("div");
			buzzDiv.setAttribute("class", "buzz_wrapper2");

			let textDiv = document.createElement("div");
			textDiv.setAttribute("class", "text2");

			let span2 = document.createElement("span2");

			//2 - Not mandatory
			let scanLine = document.createElement("div");
			scanLine.setAttribute("class", "scanline2");


			span2.appendChild(elem);

			textDiv.appendChild(span2);

			buzzDiv.appendChild(textDiv);
			buzzDiv.appendChild(scanLine);

			this.parent.appendChild(buzzDiv);

			buzzDiv.style.height = (buzzDiv.scrollHeight - 100)+"px";

		});

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


