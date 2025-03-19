const slideOne = document.getElementById("slideOne");
const slideTwo = document.getElementById("slideTwo");
const slideThree = document.getElementById("slideThree");

const funcList = [one, two, three];
let currentFunc = 1;

function callFunctions() {
	funcList[currentFunc]();
	currentFunc = (currentFunc + 1) % funcList.length;
}

let myInterval = setInterval(callFunctions, 5000);

function one() {
	slideOne.style.left = "0%";
	slideTwo.style.left = "100%";
	slideThree.style.left = "200%";
}
function two() {
	slideOne.style.left = "-100%";
	slideTwo.style.left = "0%";
	slideThree.style.left = "100%";
}
function three() {
	slideOne.style.left = "-200%";
	slideTwo.style.left = "-100%";
	slideThree.style.left = "0%";
}
one();
