const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
ctx.fillStyle = "white"; // Set fill color to white
const ratio = window.devicePixelRatio || 1;
//canvas.style.width = "1250px";
//canvas.style.height = "1000px";
canvas.width = 2500 * ratio;
canvas.height = 2000 * ratio;
//ctx.scale(ratio, ratio);
ctx.font = "25px Arial";
//Data
const begin = 9;
const end = 21;
const initialGridx = 50;
const initialGridy = 150;
const initialInterfacey = 20;
const divisionHeight = 30;
const hourLine = 70; //width of the time labels e.g 9:00, 9:30 etc
const shiftLenght  = 30;
const initialInfoX = initialGridx + 30;
const initialInfoY = initialGridy + (divisionHeight * ((end - begin + 1) * 2)) + 25;
let isPressed = false;
const backgroundColor = "black";
const days = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado","Domingo"];
let selectedWorker;
const posMatrix = [];
let gapBetweenWorkersInterface = 400;
const data = {
	"Angela M":{
		"horarios":[
			[],
			[],
			[],
			[],
			[],
			[],
			[]
		],
		"color": null,
		"posInDay": 1
	},
	"Julian T":{
		"horarios":[
			[],
			[],
			[],
			[],
			[],
			[],
			[]
		],
		"color": null,
		"posInDay": 2
	},
	"Jeferson":{
		"horarios": [
			[],
			[],
			[],
			[],
			[],
			[],
			[]
		],
		"color": null,
		"posInDay": 3
	}		
};

const binId = '67d1a3748561e97a50ea96c6';
const apiKey = '$2a$10$26MQUYwmBw7j8E164kr.YOe2CMDsXYQDGyK9qo5CzAuGe428N30IW';

async function getJsonData() {
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
      headers: { 'X-Master-Key': apiKey }
    });

    if (!response.ok) throw new Error('Failed to fetch data');

    const data = await response.json();
    //console.log('Schedule data:', data.record);
    return data.record; // Your JSON content
  } catch (error) {
    console.error('Error fetching JSON:', error);
  }
}

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
const transformTime2 = (hour) => {
    let period = hour >= 12 ? "pm" : "am"; // Determine if it's AM or PM
    let adjustedHour = hour > 12 ? hour - 12 : hour; // Convert to 12-hour format
    adjustedHour = hour === 12 || hour === 12.5 ? hour : adjustedHour; // Handle noon (12:00pm, 12:30pm) correctly
    adjustedHour = adjustedHour === 0 ? 12 : adjustedHour; // Handle midnight (0:00) as 12 AM

    let hourPart = Math.floor(adjustedHour); // Extract the hour part
    let minutePart = (adjustedHour % 1) === 0.5 ? ":30" : ":00"; // Determine minutes

    return `${hourPart}${minutePart}:${period}`; // Return formatted time as a string
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
const drawHelpSquare = (x, y, color) => {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, 30, 30);
	ctx.fillStyle = "black";
};
const drawGrid = (totalWorkers, dayLineLength, hourLine) => { 
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
		//addRow(posMatrix, days.length); //Adds a row to the posMatrix with the number of workers
		howManyHours++;
	};
	hoursPerDay = howManyHours;
	//console.log("total hours is = ", howManyHours)
	//Separation line between hours and schedule
	ctx.moveTo(initialGridx + hourLine, initialGridy);
	//ctx.lineTo(posx + hourLine, posy);
	//Moves to the 0,0 of the schedule, initialGridx + hourLine
	//Updating posx, posy
	posx = initialGridx + hourLine;
	posy = initialGridy;
	ctx.moveTo(initialGridx + hourLine, posy);
	//Drawing the days and the separation line between them 
	//console.log("total hours per day ", howManyHours);
	for (let i = 0; i <= days.length; i++){
		ctx.fillText(i < days.length ? days[i]:"", posx, posy);
		ctx.moveTo(posx, posy);
		ctx.lineTo(posx, (howManyHours * divisionHeight) + initialGridy);
		posx += dayLineLength;
	};
	ctx.closePath();
	ctx.stroke();
};
//Draws the color indicanting the hours of each worker
const drawColors = (data, shiftLenght, igx, igy, dll, hourLine, divisionHeight, begin) => {
	for (const worker in data){
		const color = data[worker]["color"];
		let l = data[worker]["horarios"].length;
		for (let i = 0; i < l; i++){
			let x = (igx + hourLine) + (i * dll) + (shiftLenght * (data[worker]["posInDay"] - 1));
			let y = igy;
			//console.log("im in the 2cond for and x =", x);
			//console.log("y = ", y);
			for (let hour of data[worker]["horarios"][i]){ 
				let yn = y;
				for (let i = begin; i < hour; i += 0.5){
					yn += divisionHeight;
				}
				drawHelpSquare(x,yn,color);
			}
		}
	}
}
const drawInterface = (data, dayLineLength) => {
	let x = initialGridx + hourLine;
    let y = initialInterfacey;
    ctx.closePath();
    ctx.beginPath();
    ctx.moveTo(initialGridx + hourLine, initialInterfacey);

    // Iterate over workers
    for (let worker in data) {
        let color = data[worker]["color"];
        if (color == null) {
            // Generate a random color if not already set
            const r = Math.floor((Math.random() * 255));
            const g = Math.floor((Math.random() * 255));
            const b = Math.floor((Math.random() * 255));
            color = `rgb(${r} ${g} ${b})`;
            data[worker].color = color;
        }
        // Draw the worker's color and name
		console.log("initial x when drawing the interface for worker = ", worker, " is =", x);
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 30, 30);
        ctx.fillStyle = "white"; // Set text color to white for visibility
		let textLenght = ctx.measureText(worker).width;
		x += 40;
		console.log("the x after the square was drawn = ", x); 	
        ctx.fillText(worker, x, y + 20);
        //x += gapBetweenWorkersInterface;
		x += textLenght + 70;
    }
    ctx.closePath();
};
const drawInGrid = (x, y, worker, dayLineLength, data, totalWorkers) => {
	//console.log("in drawInGrid x = ", x, " y = ", y);
	if (x >= -0.1 && y >= 0){
		let mx = (x * dayLineLength) + hourLine + initialGridx;
		let my = (y * divisionHeight) + initialGridy;
		//console.log("inside the if of drawInGrid x = ", mx, " y = ", my);
		const color = data[worker].color;
		const pos = data[worker]["posInDay"];
		//console.log("this should be the color we about to draw = ", color);
		//This for loop tell were to draw in the day based on the pos atributte in data
		for (let i = 1; i <= totalWorkers; i++){
			if (i == pos){
				drawHelpSquare(mx, my, color);
				//console.log("drawin in day = ", days[x]);
			}
			else{
				mx += shiftLenght;
			};
		};
	};
};
const drawStatistics = (data) => {
	let x = initialGridx;
	let y = initialInfoY;
	const hoursWorked = getTotalHoursWorked(data);
	for (worker in data){
		let hw = hoursWorked[worker];
		ctx.fillStyle = data[worker].color;
		ctx.fillText(worker, x, y);
		x += 10;
		if (parseFloat(hw) % 1 !== 0){//is not int //'12.5'
			hw = parseInt(hw);
			ctx.fillText('-> ' + hw.toString() + ":30 h", x + ctx.measureText(worker).width, y);	
		}else{
			ctx.fillText('-> ' + hw + "h", x + ctx.measureText(worker).width , y);
		}
		x += 250;
	}
};
const clearCanvas = (ctx, canvas, bc) => {
	console.log("this is the bc = ", bc);
	ctx.fillStyle = bc;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}
//Funct to export as image
const exportImg = () => {
	const link = document.createElement("a");
	link.download = "canvas_image.png";
	link.href = canvas.toDataURL("image/png");
	link.click();
};
//Function to get the position in the matrix
const getMatrixPos = (x, y, dayLineLength) => {
	x = (x - (initialGridx + hourLine)) / dayLineLength;
	y = (y - initialGridy) / divisionHeight;
	//console.log("x in matrix ", Math.floor(x));
	//console.log("y in matrix ", Math.floor(y));
	return {x: Math.floor(x), y: Math.floor(y)};
};
const schedule = (x, y, data) => {
	//x and y must be checked so no invalid scheduling happens
	if (x < 0 || y < 0) return;
	let j = begin;
	for (let i = 0; i < y; i++){
		j += 0.5;
	};
	let hour = j;//transformTime2(j);
	console.log("THIS IS THE DESIGNED HOUR: ", hour);
	if (!data[selectedWorker]["horarios"][x].includes(hour)){
		data[selectedWorker]["horarios"][x].push(hour);
	};
};
//Checks if the interface is being clicked
const checkIfInterfaceClicked = (x, y, gap, data) => {
	if (x > initialGridx + hourLine && y < 110) { // Check if the click is within the interface area
        let currentX = initialGridx + hourLine; // Start at the initial x position
        for (let worker in data) {
            const textWidth = ctx.measureText(worker).width; // Get the width of the worker's name
            const boxWidth = 30; // Width of the color box
            const padding = 40; // Padding between the box and the name
            const totalWidth = padding + textWidth + 70; // Total clickable width for this worker
			console.log("this is the totalwidth of the worker ", worker, " = ", totalWidth, "and the currentZ = ", currentX);
			
            if (x >= currentX && x <= currentX + totalWidth) {
                return worker; // Return the worker if the click is within their area
            }
            currentX += totalWidth; // Move to the next worker's area (add extra padding between workers)
        }
        return null; // Return null if no worker matches
    } else {
        return false; // Return false if the click is outside the interface area
    }
};
//Function to remove workHours
const removeHourFromData = (x, y, dayLineLength, data) => {
	//Is the index of the day
	//Y must be calculated
	//console.log("This are the x and the y = ", x, y);
	let j = begin;
	for (let i = 0; i < y; i++){
		j += 0.5;
	};
	hour = j;//transformTime(j);
	//console.log("This is the hour that should be removed = ", hour);
	//When i delete the hour i must update the grid drawing
	//console.log("This is the selected worker = ", selectedWorker);
	data[selectedWorker]["horarios"][x] = data[selectedWorker]["horarios"][x].filter(val => val != hour);
	//console.log("This is the new data = ", data);
};
const getTotalHoursWorked = (data) => {
	let hoursWorked = {};
	for (let worker in data){
		hoursWorked[worker] = 0;
		for (let day in data[worker]["horarios"]){
			for (hour in data[worker]["horarios"][day]){
				hoursWorked[worker] += 0.5;
			}
		}
	}
	//console.log(hoursWorked);
	return hoursWorked;
}
const getMousePos = (event) => {
	const rect = canvas.getBoundingClientRect();
	return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top
	};
};

//Mouse events
canvas.addEventListener("mouseup", (event) => {
	isPressed = false;
});

/*
canvas.addEventListener("click", (event) => {
	let mpos = getMousePos(event);
	getMatrixPos(mpos.x, mpos.y);
});
*/
async function main(){
	//data = await getJsonData();
	if (!data){
		//console.log("Data fetching failed, returning");
		return;
	}

	const totalWorkers = Object.keys(data).length;
	const dayLineLength = totalWorkers * shiftLenght;
	let hoursPerDay;

	canvas.addEventListener("mousedown", (event) => {
		if (event.button == 0){
			isPressed = true;
			const pos = getMousePos(event);
			//console.log("this is the pos of the click ", pos);
			let name = checkIfInterfaceClicked(pos.x, pos.y, gapBetweenWorkersInterface, data);
			if (name){
				selectedWorker = name;
				drawStatistics(data);
			};
			clearCanvas(ctx, canvas, backgroundColor);
			drawGrid(totalWorkers, dayLineLength, hourLine);
			drawColors(data, shiftLenght, initialGridx, initialGridy, dayLineLength, hourLine, divisionHeight, begin);
			drawStatistics(data);
			drawInterface(data,dayLineLength);
		}
	});

	canvas.addEventListener("mousemove", (event) => {
		if (isPressed == true){
			const pos = getMousePos(event);
			const mpos = getMatrixPos(pos.x, pos.y, dayLineLength);
			//console.log("this is the pos ", pos);
			//console.log("this is the matrix pos", mpos);
			drawInGrid(mpos.x, mpos.y, selectedWorker, dayLineLength, data, totalWorkers);
			schedule(mpos.x, mpos.y, data);
			clearCanvas(ctx, canvas, backgroundColor);
			drawGrid(totalWorkers, dayLineLength, hourLine);
			drawColors(data, shiftLenght, initialGridx, initialGridy, dayLineLength, hourLine, divisionHeight, begin);
			drawStatistics(data);
			drawInterface(data,dayLineLength);
		};
		//console.log("im moving ",getMousePos(event));
	});

	canvas.addEventListener("contextmenu", (event) => {
		event.preventDefault();
    	event.stopPropagation(); // Prevent bubbling

    	const x = event.offsetX;
    	const y = event.offsetY;
    	const pos = getMatrixPos(x, y, dayLineLength);

    	//console.log("This is the data before the remove= ", data);
    	removeHourFromData(pos.x, pos.y, dayLineLength, data);
		clearCanvas(ctx, canvas, backgroundColor);
		drawGrid(totalWorkers, dayLineLength, hourLine);
		drawColors(data, shiftLenght, initialGridx, initialGridy, dayLineLength, hourLine, divisionHeight, begin);
		drawStatistics(data);
		drawInterface(data,dayLineLength);
	});

	drawGrid(totalWorkers, dayLineLength, hourLine);
	drawInterface(data, dayLineLength);
	//addReferenceLines(ctx, initialGridx, initialGridy, divisionHeight, begin, hourLine);
}
main();