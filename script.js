function connectSocket(isReconnect) {
	//disable text entry while connection hasn't been established
	document.getElementById("sendMsg").disabled = true;

	if (isReconnect) {
		//if reconnecting, remove the reconnect button and state we're trying to reconnect
		var reconnectBtn = document.getElementById("reconnectBtn");
		reconnectBtn.parentNode.removeChild(reconnectBtn);
	}

	var newMsg = document.createElement("div");
	newMsg.innerHTML = "Attempting to Connect...";
	newMsg.className = "msgBroadcast";
	
	var msgArea = document.getElementById("msgInsert");
	msgArea.appendChild(newMsg);

	//try to connect to chat socket 3 times
	socket = io.connect('http://localhost', {
		'connect timeout': 5000,
		'reconnectionAttempts': 3
	});

	socket.on('connect', function () {

		document.getElementById("sendMsg").disabled = false;
		var newMsg = document.createElement("div");
		newMsg.className = "msgSuccess";
		newMsg.innerHTML = "Connected!";
		msgArea.appendChild(newMsg);
	});

	socket.io.on('reconnect_attempt', function (attemptNumber) {
		document.getElementById("sendMsg").disabled = true;
		var msgArea = document.getElementById("msgInsert");
		var newMsg = document.createElement("div");
		if (attemptNumber != 3) {
			newMsg.innerHTML = "<div class='msgError'>" + "ERROR: Connection Failed! " + attemptNumber + " Retrying.." + "</div>";
			msgArea.appendChild(newMsg);
		} else {
			socket.close();
			socket = null;
			newMsg.innerHTML = "<div class='msgError'>" + "ERROR: Connection Failed!</div>";
			msgArea.appendChild(newMsg);
			
			var reconnectBtn = document.createElement("button");
			reconnectBtn.id = "reconnectBtn";
			reconnectBtn.onclick = function () {connectSocket(true)};
			reconnectBtn.innerHTML = "Reconnect";
			
			msgArea.appendChild(reconnectBtn);
		}
	});

	socket.on('chat', function (msg) {
		var msgArea = document.getElementById("msgInsert");
		var newMsg = document.createElement("div");
		newMsg.innerHTML = "<div class='msgReceive'>" + msg + "</div>";
		msgArea.appendChild(newMsg);
	});

	socket.on('broadcast', function (msg) {
		var msgArea = document.getElementById("msgInsert");
		var newMsg = document.createElement("div");
		newMsg.innerHTML = "<div class='msgBroadcast'>" + msg + "</div>";
		msgArea.appendChild(newMsg);
	});

	socket.on('userCount', function (msg) {
		var chatTitle = document.getElementById("chatTitle");
		if (msg == "1") {
			chatTitle.innerHTML = 'Chat With ' + msg + ' Other!';
		} else {
			chatTitle.innerHTML = 'Chat With ' + msg + ' Others!';
		}
	});

	socket.on('username', function (msg) {
		chatUsername = msg;
	});
}

window.onload = function () {
	connectSocket(false);
}

function quizLoader() {
}

function toggleTests() {
}

function clearContent() {
}

function startQuiz() {
}

function resetVariables() {
}

function getQuestions(numQuestions,callback) {
}

function setResults(data) {
}

function callAjax(numQuestions,callback) {

}

function nextQuestion() {
}

function arrayShuffle(array) {
	//this will shuffle the options of the questions!
}

function finishQuiz() {
}

function restartQuiz() {
}

function calculatePercentage(score, quizLength) {
}

function gaugeScore(percentage) {
}

function answerQuestion(optionSelected) {
}

function incrimentScore() {
}

function incrimentIndex() {
}

function toggleChat() {

	var img = document.getElementById('toggleArrow');
	$('.chatBody').slideToggle('fast');
	if (img.src == "https://img.icons8.com/ios/50/000000/sort-up-filled.png") {
		img.src = "https://img.icons8.com/ios/50/000000/sort-down-filled.png";
	} else {
		img.src = "https://img.icons8.com/ios/50/000000/sort-up-filled.png";
	}
}


function sendMsg(event) {
	//13 == enter button
	if (event.keyCode == 13) {
		var msg = document.getElementById("sendMsg").value
		//set msg value back to nothing

		document.getElementById("sendMsg").value = "";
		var msgArea = document.getElementById("msgInsert");

		var newMsg = document.createElement("div");
		newMsg.className = "msgSend";
		newMsg.innerHTML = "User " + chatUsername + ": " + msg;
		msgArea.appendChild(newMsg)

		socket.emit('chat', msg);
	}
}

function timer () {
}