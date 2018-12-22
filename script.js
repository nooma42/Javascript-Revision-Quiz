//global vars
var resultsData;
var questionData;
var questionIndex;

var questionAnswered = false;

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
	socket = io.connect('http://localhost:9001', {
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
	toggleTests();
	quizLoader();
}

function quizLoader() {
	localStorage.removeItem('questionData');
	//check if there is a question data set in local storage
	if (localStorage.questionData == undefined)
	{
		//if no local storage, load home page
		factory.create("home","");
	}
	else
	{
		questionData = JSON.parse(localStorage.questionData);
		nextQuestion();
 		
	}	
}

function toggleTests() {
	if (document.getElementById("testing").style.display == "") {
		document.getElementById("testing").style.display = "none";
	} else {
		document.getElementById("testing").style.display = "";
	}
}

function clearContent() {
	//this clears down the content div which contains everything displayed within the main blue box
	var content = document.getElementById('content');
	if (content != null) {
		content.remove();
	}
}

function startQuiz() {
	clearContent();
	getQuestions(5,setResults);
}

function resetVariables() {
	//resets stored quiz variables 
	localStorage.questionIndex = 0;
	localStorage.score = 0;
	localStorage.removeItem("questionData");
	localStorage.removeItem("resultsData");
	resultsData = [];
}

function getQuestions(numQuestions,callback) {
	callAjax(numQuestions,callback);
}

function setResults(data) {
	//callback function to load data
	if (data != null)
	{
		//if data is present, store it and proceed
		questionData = JSON.parse(data);
		//console.log(data);
		localStorage.questionData = data;
		clearContent();
		nextQuestion();	
	}
}

function callAjax(numQuestions,callback) {
	var ajaxObj = new XMLHttpRequest();

	ajaxObj.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			callback(this.responseText);
		} 
		else if (this.readyState == 4) {
			console.log("Error, Question data could not be aquired...");
		}
	};
	ajaxObj.open("GET", "http://localhost:9001/questions/" + numQuestions, true);
	ajaxObj.send();
}

function nextQuestion() {
	//load vars from local storage
	var qIndex = localStorage.questionIndex;
	
	var html = document.createElement("div");
	html.id = "content";
	
	var questionHTML = '<p id="questionText">' + questionData[0].question + '</p>';
	
	var answerHTML = '<div class="grid2x2">'
	
	//dynamically create the answer boxes dependant on the options available
	for (i = 0; i < questionData[localStorage.questionIndex].options.length; i++) {
		answerHTML += '<div class="box" id="a' + i + '" onclick="answerQuestion(this)">' + questionData[localStorage.questionIndex].options[i].text + '</div>';
	}
	answerHTML += '</div>';
	
	html.innerHTML = questionHTML + "</br>" + answerHTML;
	
	document.getElementById('mainbox').appendChild(html);
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
	var selectedID = optionSelected.id
	var optionNum = selectedID.replace('a','');

	if(questionAnswered)
	{
		return
	}
	else
	{
		questionAnswered = true;
	}

	optionSelected.style.border = '5px solid white';


	//loop through options, select correct one
	for (i = 0; i < questionData[0].options.length; i++)
	{
		if(questionData[0].options[i].correct == "1")
		{
			var correctID = "a";
			//+1 to ofset arrays starting at 0
			correctID = correctID.concat(i+1);
			document.getElementById(correctID).style.backgroundColor = "green";
			if(selectedID == correctID)
			{
				//they got it right, incriment score 
				incrimentScore();
			}
			break;
		}
	}

	var nextBtn = document.createElement("button");
	nextBtn.id = "nextBtn";
	nextBtn.innerHTML = "Next Question";

	var content = document.getElementById("content");
	content.appendChild(nextBtn);
}

function incrimentScore() {
	localStorage.score++;
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

factory = 
{
	create: function(type, subtype) 
	{
		var html = document.createElement("div");
		html.id = "content";
		
		if (type == "home") 
		{
			html.innerHTML = '<p id="introtext">Welcome to this SOFT352 Revision Tool!</br>Your knowledge on the module will be tested in quiz format!</p><button id="startbtn"  onclick="startQuiz()">START</button>';
		}
		
		if (type == "multi")
		{
			qData[qIndex].question;
		}
		
		document.getElementById('mainbox').appendChild(html);
		
	}
}