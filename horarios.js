const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
ctx.fillStyle = "white"; // Set fill color to white
ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill entire canvas
//Set canvas resolution for HD displays
const ratio = window.devicePixelRatio || 1;
canvas.width = 1500 * ratio;  // Set actual width for HD
canvas.height = 1000 * ratio; // Set actual height for HD
canvas.style.width = "1500px"; // Display width
canvas.style.height = "1000px"; // Display height
ctx.scale(ratio, ratio);  // Scale context for better resolution
ctx.font = "25px Arial";
//Data
const begin = 7;
const end = 19;
const initialGridx = 50;
const initialGridy = 150;
const initialInterfacey = 20;
const divisionHeight = 30;
const dayLineLength = 170;
const hourLine = 70;
let isPressed = false;
const days = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado","Domingo"];
const data = {
	"julian":{
		"horarios":[],
		"color": null
	},
	"daniela":{
		"horarios":[],
		"color": null
	},
	"pamela":{
		"horarios": [],
		"color": null
	}
};
const posMatrix = [];
const totalWorkers = Object.keys(data).length;
//Functions
const transformTime = (hour) => {
	if (hour > 12.5){
		hour -= 12;
	};
	if (Math.floor(hour) == hour){
		return hour.toString() + ":00";
	}
	else{
		return Math.floor(hour).toString() + ":30";
	};
};
const addRow = (matrix, days) => {
	const row = [];
	for (let i = 0; i < days; i++){
		row.push(null);
		};
	matrix.push(row);
	//console.log(matrix);
};
//Drawing functions
const drawHelpSquare = (x, y, h, w) => {
	ctx.fillStyle = "red";
	ctx.fillRect(x, y, 30, 30);
	ctx.fillStyle = "black";
};
const drawGrid = (totalWorkers) => { 
	ctx.fillStyle = "black"; // Set fill color to white
	ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill entire canvas
	ctx.fillStyle = "white";
	ctx.strokeStyle = "white";
	//Draws the grid
	let posx = initialGridx; 
	let posy = initialGridy;
	let horizontalLine = (dayLineLength * days.length) + hourLine;
	//drawHelpSquarequare(horizontalLine, posy);
	ctx.beginPath(); 
	ctx.moveTo(posx, posy);
	ctx.lineTo(horizontalLine + initialGridx,posy);
	ctx.moveTo(posx,posy);
	let howManyHours = 0;
	for (let i = begin; i <= end; i += 0.5){
		ctx.lineTo(posx, posy += divisionHeight);
		ctx.lineTo(horizontalLine + initialGridx, posy); //Draws hour line
		ctx.moveTo(posx, posy);
		ctx.fillText(transformTime(i), posx, posy);
		addRow(posMatrix, days.length); //Adds a row to the posMatrix with the number of workers
		howManyHours++;
	};
	//Separation line between hours and schedule
	ctx.moveTo(initialGridx + hourLine, initialGridy);
	//ctx.lineTo(posx + hourLine, posy);
	//Moves to the 0,0 of the schedule, initialGridx + hourLine
	//Updating posx, posy
	posx = initialGridx + hourLine;
	posy = initialGridy;
	ctx.moveTo(initialGridx + hourLine, posy);
	//Drawing the days and the separation line between them 
	console.log(howManyHours);
	for (let i = 0; i < days.length; i++){
		ctx.fillText(days[i], posx, posy);
		ctx.moveTo(posx, posy);
		ctx.lineTo(posx, (howManyHours * divisionHeight) + initialGridy);
		posx += dayLineLength;
	};
	ctx.closePath();
	ctx.stroke();
};
const drawInterface = (workers) => {
	let x = initialGridx + hourLine;
	let y = initialInterfacey;
	ctx.beginPath();
	ctx.moveTo(initialGridx + hourLine, initialInterfacey);
	drawHelpSquare(initialGridx + hourLine, initialInterfacey);
	//Iterating over workers
	for (let worker in data){
		console.log(worker);
		if (data[worker]["color"] != null) {
			let color  = data[worker];
		}else {
			const r = Math.floor((Math.random() * 255));
			const g = Math.floor((Math.random() * 255));
			const b = Math.floor((Math.random() * 255));
			let color = `rgb(${r} ${g} ${b})`;
			console.log(color);
			ctx.fillStyle = color;
			ctx.fillRect(x,y,30,30);
			ctx.fillText(worker, x + 40, y + 10);
			x += dayLineLength;
		};
	};
	ctx.closePath();
};
//Funct to export as image
const exportImg = () => {
	const link = document.createElement("a");
	link.download = "canvas_image.png";
	link.href = canvas.toDataURL("image/png");
	link.click();
};
//Function to get the position in the matrix
const getMatrixPos = (x, y) => {
	x = (x - (initialGridx + hourLine)) / dayLineLength;
	y = (y - initialGridy) / divisionHeight;
	console.log("x in matrix ", x);
	console.log("y in matrix ", y)
	return {x: Math.floor(x), y: Math.floor(y)};
};
//Mouse events
const getMousePos = (event) => {
	const rect = canvas.getBoundingClientRect();
	return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top
	};
};
canvas.addEventListener("mousedown", (event) => {
	isPressed = true;
	const pos = getMousePos(event);
});
canvas.addEventListener("mouseup", (event) => {
	isPressed = false;
});
canvas.addEventListener("mousemove", (event) => {
	if (isPressed == true){
		const pos = getMousePos(event);
		const mpos = getMatrixPos(pos.x, pos.y);
		if (posMatrix[mpos.x][mpos.y] == null){
			posMatrix[mpos.x][mpos.y] == "red";
			let x = (mpos.x * dayLineLength)+ initialGridx + hourLine;
			let y = (mpos.y * divisionHeight) + initialGridy;
			//Need to check if x and y are inside the grid
			drawHelpSquare(x, y);
		};
	};
	//console.log("im moving ",getMousePos(event));
});
canvas.addEventListener("click", (event) => {
	let mpos = getMousePos(event);
	getMatrixPos(mpos.x, mpos.y);
});
drawGrid(totalWorkers);
drawInterface();
//drawHelpSquare(initialGridx + 70 + dayLineLength * 7, 50);
//exportImg();
