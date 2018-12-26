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
	//resetVariables();
	connectSocket(false);
	toggleTests();
	quizLoader();
}

function quizLoader() {
	//check if there is a question data set in local storage
	if (localStorage.questionData == undefined || localStorage.questionData == "undefined" )
	{
		//if no local storage, load home page
		factory.create("home","");
	}
	else
	{
		//alert(localStorage.questionData);
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
	var quizLength = document.getElementById("quizLength").value
	resetVariables();
	clearContent();
	getQuestions(quizLength,setResults);
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
	if (data != null)
	{
		//if data is present, store it and proceed
		questionData = JSON.parse(data);
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
	
	if ((parseInt(localStorage.questionIndex)) == questionData.length)
	{
		finishQuiz();
		return;
	}
	
	//load vars from local storage
	clearContent();
	var qIndex = localStorage.questionIndex;
	
	var html = document.createElement("div");
	html.id = "content";
	
	questionAnswered = false;
	var questionHTML = '<p id="questionText">' + questionData[localStorage.questionIndex].question + '</p>';
	
	var answerHTML = '<div class="grid2x2">'
	
	//dynamically create the answer boxes dependant on the options available
	for (i = 0; i < questionData[localStorage.questionIndex].options.length; i++) {
		answerHTML += '<div class="box" id="a' + i + '" onclick="answerQuestion(this)">' + questionData[localStorage.questionIndex].options[i].text + '</div>';
	}
	answerHTML += '</div>';
	
	html.innerHTML = questionHTML + "</br>" + answerHTML;
	
	document.getElementById('mainbox').appendChild(html);
		if ((parseInt(localStorage.questionIndex)+1) == questionData.length)
	{
		//its the last question, change button to finish
		var finishBtn = document.createElement("button");
		finishBtn.id = "finishBtn";
		finishBtn.innerHTML = "Finish";
		finishBtn.style.visibility = "hidden";
		finishBtn.onclick = function(){finishQuiz()};
		var br = document.createElement("br");
		html.appendChild(br);
		html.appendChild(finishBtn);		
	}
	else
	{
		var nextBtn = document.createElement("button");
		nextBtn.id = "nextBtn";
		nextBtn.onclick = function(){nextQuestion()};
		nextBtn.innerHTML = "Next Question";
		nextBtn.style.visibility = "hidden";
		var br = document.createElement("br");
		html.appendChild(br);
		html.appendChild(nextBtn);
	}
}

function arrayShuffle(array) {
	//this will shuffle the options of the questions!
}

function finishQuiz() {
	if(document.getElementById("content") != null)
	{
		var content = document.getElementById("content")
		content.parentNode.removeChild(content);
	}
	var html = document.createElement("div");
	html.id = "content";	
	
	var score = localStorage.score;
	var quizLength = questionData.length;
	var percentage = calculatePercentage(score,quizLength);
	
	var response = gaugeScore(percentage)
	
	var questionHTML = '<p id="finishText">' + response +  "\nYou Scored: " + localStorage.score + "/" + questionData.length + " (" + percentage + "%)" + '</p>';
	
		html.innerHTML = questionHTML;
	
	document.getElementById('mainbox').appendChild(html);
	
	var restartBtn = document.createElement("button");
	restartBtn.id = "restartBtn";
	restartBtn.innerHTML = "Try Again";
	restartBtn.onclick = function(){restartQuiz()};
	var br = document.createElement("br");
	html.appendChild(br);
	html.appendChild(restartBtn);	
}

function restartQuiz() {
	resetVariables();
	clearContent();
	quizLoader();
}

function calculatePercentage(score, quizLength) {
	var percentage = ((score / quizLength) * 100).toFixed(2);
	return percentage;
}

function gaugeScore(percentage) {
	//this calculates how well they did, and responds appropriately!
	
	var response = "";
	
	if (percentage == 100)
	{
		response = "Wow!";
	}
	else if (percentage >= 70)
	{
		response = "Great Job!";
	}
	else if (percentage >= 60)
	{
		response = "Not bad!";
	}
	else if (percentage >= 50)
	{
		response = "Keep practicing!";
	}
	else if (percentage >= 40)
	{
		response = "Needs improvement!";
	}
	else
	{
		response = "Oh no!";
	}
	return response;
}

function answerQuestion(optionSelected) {
	var selectedID = optionSelected.id
	var optionNum = selectedID.replace('a', '');

	if (questionAnswered) {
		return
	} else {
		questionAnswered = true;
	}

	optionSelected.style.border = '5px solid white';

	//loop through options, select correct one
	for (i = 0; i < questionData[localStorage.questionIndex].options.length; i++) {
		if (questionData[localStorage.questionIndex].options[i].correct == "1") {
			
			var correctID = "a";
			correctID = correctID.concat(i);
			document.getElementById(correctID).style.backgroundColor = "green";
			if (selectedID == correctID) {
				//they got it right, incriment score 
				incrimentScore();
			}
			break;
		}
	}
	incrimentIndex();
	
	//DOM handling
	var nextBtn = document.getElementById("nextBtn");
	var finishBtn = document.getElementById("finishBtn");
	if (nextBtn != null) {
		nextBtn.style.visibility = "visible";
	} else if (finishBtn != null) {
		finishBtn.style.visibility = "visible";
	}
}

function incrimentScore() {
	localStorage.score++;
}

function incrimentIndex() {
	localStorage.questionIndex++;
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
			var selectOptions = '<option value="5">Short (5 Questions)</option><option value="10">Medium (10 Questions)</option><option value="20">Long (20 Questions)</option>';
			html.innerHTML = '<p id="introtext">Welcome to this SOFT352 Revision Tool!</br>Your knowledge on the module will be tested in quiz format!</p><select id="quizLength">'+selectOptions+'</select><button id="startbtn"  onclick="startQuiz()">START</button>';		
		}
		if (type == "multi")
		{
			qData[qIndex].question;
		}
		
		document.getElementById('mainbox').appendChild(html);
		
	}
}