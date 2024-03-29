//global vars

//array to store correct answer, and the specified answer, for use when exporting
var resultsData = [];
var questionData;
var questionIndex;

var questionAnswered = false;
var quizTimer = new timer();

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
		document.getElementById('mainbox').appendChild(htmlFactory.create("home",""));
	}
	else
	{
		//alert(localStorage.questionData);
		if (localStorage.resultsData != undefined && localStorage.resultsData != "undefined")
		{
			resultsData = JSON.parse(localStorage.resultsData);
		}
		questionData = JSON.parse(localStorage.questionData);
		quizTimer.setTime(parseInt(localStorage.timeTaken));
		quizTimer.startTimer();
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
		quizTimer.startTimer();
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
			toastr.error("Cannot get questions from server...", "Error");
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
	
	questionAnswered = false;
	
	//shuffles the order of the question options, to avoid users learning the place of answers in questions!
	questionData[localStorage.questionIndex].options = arrayShuffle(questionData[localStorage.questionIndex].options)
	
	//load vars from local storage
	clearContent();
	
	var qIndex = localStorage.questionIndex;
	
	var html = htmlFactory.create("div","content");

	
	var questionHTML = htmlFactory.create("p","questionText",questionData[localStorage.questionIndex].question);
	//var questionHTML = '<p id="questionText">' + questionData[localStorage.questionIndex].question + '</p>';
	
	
	var answerHTML = htmlFactory.create("grid2x2");
	
	var questionNum = htmlFactory.create("div","questionNum", (parseInt(localStorage.questionIndex) + 1) + '/' + questionData.length);
	
	
			
	document.getElementById('mainbox').appendChild(html);
	
	document.getElementById('content').appendChild(questionNum);
	document.getElementById('content').appendChild(questionHTML);
	document.getElementById('content').appendChild(answerHTML);
	
	var br = htmlFactory.create("br");
	
	if ((parseInt(localStorage.questionIndex)+1) == questionData.length)
	{
		//its the last question, change button to finish
		var finishBtn = htmlFactory.create("button","finishBtn","Finish");
		finishBtn.style.visibility = "hidden";
		finishBtn.onclick = function(){finishQuiz()};

		html.appendChild(br);
		html.appendChild(finishBtn);		
	}
	else
	{
		var nextBtn = htmlFactory.create("button","nextBtn","Next Question");
		nextBtn.style.visibility = "hidden";
		nextBtn.onclick = function(){nextQuestion()};
		
		html.appendChild(br);
		html.appendChild(nextBtn);
	}
}

function arrayShuffle(array) {
	var i, tem, j, len = array.length;
	for (i = 0; i < len; i++) {
		j = ~~(Math.random() * len);
		tem = array[i];
		array[i] = array[j];
		array[j] = tem;
	}
	return array;
}

function finishQuiz() {
	
	clearContent();
	quizTimer.stopTimer(quizTimer.timerID);
	
	var html = htmlFactory.create("div","content");
	
	var score = localStorage.score;
	var quizLength = questionData.length;
	var percentage = calculatePercentage(score,quizLength);
	
	var response = gaugeScore(percentage)
	
	var timeHTML = htmlFactory.create("div","timeText","Time Taken:" + quizTimer.getTime());

	var resultHTML = htmlFactory.create("p","finishText",response +  "\nYou Scored: " + localStorage.score + "/" + questionData.length + " (" + percentage + "%)");

	var exportHTML = htmlFactory.create("a","export","Export Results");
	exportHTML.target= "_blank";
	exportHTML.href=  "export.html";
	
	var restartBtn = htmlFactory.create("button","restartBtn","Try Again");
	restartBtn.onclick = function(){restartQuiz()};
	
	var br = htmlFactory.create("br");
	
	document.getElementById('mainbox').appendChild(html);
	
	document.getElementById('content').appendChild(timeHTML);
	document.getElementById('content').appendChild(resultHTML);	
	document.getElementById('content').appendChild(br);
	document.getElementById('content').appendChild(restartBtn);
	document.getElementById('content').appendChild(br);
	document.getElementById('content').appendChild(exportHTML);
}

function restartQuiz() {
	//reset everything and run as if first load
	localStorage.timeTaken = 0;
	quizTimer.resetTimer();
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
			//set resultsData with 1. question asked, 2. Correct Result, 3. Answer Given
			resultsData[localStorage.questionIndex] = [questionData[localStorage.questionIndex].question,questionData[localStorage.questionIndex].options[i].text,questionData[localStorage.questionIndex].options[optionNum].text]
			localStorage.resultsData = JSON.stringify(resultsData);
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

htmlFactory = 
{
	create: function(type, subtype, txt) 
	{

		var html;
		
		if (type == "home") 
		{
			html = document.createElement("div");
			html.id = "content";
		
			var selectOptions = '<option value="5">Short (5 Questions)</option><option value="10">Medium (10 Questions)</option><option value="20">Long (20 Questions)</option>';
			html.innerHTML = '<p id="introtext">Welcome to this SOFT352 Revision Tool!</br>Your knowledge on the module will be tested in quiz format!</p><select id="quizLength">'+selectOptions+'</select><br></br><button id="startbtn"  onclick="startQuiz()">START</button>';		
		}		
		else if (type == "br")
		{
			html = document.createElement("br");
		}
		else if (type == "grid2x2")
		{
			html = document.createElement("div");
			html.className = "grid2x2";
			var answerHTML = "";
			//dynamically create the answer boxes dependant on the options available
			for (i = 0; i < questionData[localStorage.questionIndex].options.length; i++) {
				answerHTML += '<div class="box" id="a' + i + '" onclick="answerQuestion(this)">' + questionData[localStorage.questionIndex].options[i].text + '</div>';
			}
			answerHTML += '</div>';
			html.innerHTML = answerHTML;
		}
		else 
		{
			html = document.createElement(type);
			html.id = subtype;
			if(txt != null)
			{
				html.innerHTML = txt;
			}
		}
		return html;
	
	}
}

function timer () {
	var instance = this;
	this.seconds = 0;
	this.timerID;
	this.startTimer = function() {
		//console.log("starting!!!");
		instance.timerID = setInterval(instance.tickTimer, 1000);
	};
	this.tickTimer = function() {
		++instance.seconds;
		localStorage.timeTaken = instance.seconds;
		//console.log(instance.seconds);
	};
	this.stopTimer = function(timerID) {
		clearInterval(timerID);
		//console.log("trying to stop timer..");
	};
	this.resetTimer = function() {
		instance.seconds = 0;
	};
	this.setTime = function(secs) {
		instance.seconds = secs;
		//console.log("set seconds to : " + instance.seconds);
	};
	this.getTime = function() {
		var hours = Math.floor(instance.seconds / 3600);
		var mins = Math.floor((instance.seconds - (hours * 3600)) / 60);
		var secs = instance.seconds %60;
		var timeString = hours + " hours, " + mins + " minutes, " + secs + " seconds"; 
		return timeString;
	};
}