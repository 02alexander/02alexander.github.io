
var timeLimit = 30;
var kryssTimeLeft = timeLimit;
var ringTimeLeft = timeLimit;
var bufferTimeLimit = 3;
var bufferTime = bufferTimeLimit;

var isPaused = true;

function submitButton() {
	let seconds = parseInt(document.getElementById("seconds").value);
	document.getElementById("seconds").value = "";
	if (!Number.isNaN(seconds)) {
		timeLimit = seconds;
	} 
	let buffer = parseInt(document.getElementById("buffer").value);
	document.getElementById("buffer").value = "";
	if (!Number.isNaN(buffer)) {
		bufferTimeLimit = buffer;
	}
	console.log(timeLimit);
	console.log(bufferTimeLimit);
	resetTime();
}

function checkBox() {
	let check = document.getElementById("check");
	let timer = document.getElementById("timer");
	let input = document.getElementById("timer-set-form");
	if (check.checked == true) {
		timer.style.display = "block";
		input.style.display = "block";
	} else {
		timer.style.display = "none";
		input.style.display = "none";
	}
}

function isTimerOn() {
	let c = document.getElementById("check");
	return c.checked;
}

function startTimer() {
	isPaused = false;
}

function pauseTimer() {
	isPaused = true;
}

function updateTimer() {
	let kryssTimer = document.getElementById("kryss-time");
	let ringTimer = document.getElementById("ring-time");
	kryssTimer.innerHTML = Math.floor(kryssTimeLeft/60) + ":" + Math.round(kryssTimeLeft%60);
	ringTimer.innerHTML = Math.floor(ringTimeLeft/60) + ":" + Math.round(ringTimeLeft%60);
}

setInterval(function() {
	if (!isPaused && isTimerOn() && !gameIsOver) {
		updateTimer();
		if (bufferTime <= 0) {
			if (stack4x4.whoseTurn == 2) {
				kryssTimeLeft -= 0.01;
			} else {
				ringTimeLeft -= 0.01;
			}
			if (kryssTimeLeft <= 0) {
				let timer = document.getElementById("kryss-time-div");
				timer.style.border = "1px solid red";
				gameIsOver = true;
			} else if (ringTimeLeft <= 0) {
				let timer = document.getElementById("ring-time-div");
				timer.style.border = "1px solid red";
				gameIsOver = true;
			}
		} else {
			bufferTime -= 0.01;
		}
	}
}, 10);

function resetTime() {
	kryssTimeLeft = timeLimit;
	ringTimeLeft = timeLimit;
	bufferTime = bufferTimeLimit;
	pauseTimer();
	updateTimer();
}