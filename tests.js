function rgb2hex(color) {
    digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
    red = parseInt(digits[2],10);
    green = parseInt(digits[3],10);
    blue = parseInt(digits[4],10);
    rgb = blue | (green << 8) | (red << 16);
    if(red == 0){
        return digits[1] + '#00' + rgb.toString(16).toUpperCase();
    }else{
        return digits[1] + '#' + rgb.toString(16).toUpperCase();
    }
}

QUnit.test("Simple test to ensure page title is correct", function(assert){
    assert.equal(document.getElementsByTagName("title")[0].innerHTML, "SOFT352 Quiz","Ensuring SOFT352 is the title.");
});

QUnit.test("Testing the heading of the page is correct", function(assert){
	var title = document.getElementById("quizTitle");
	var compStyles = window.getComputedStyle(title);
    assert.equal(title.textContent, "SOFT352 Quiz","Ensuring SOFT352 is the heading");
	assert.equal(rgb2hex(compStyles.getPropertyValue('color')),"#999999","ensuring color of heading is #999999 (grey)");
});

QUnit.test("Testing the main box is correctly coloured", function(assert){
	var mainBox = document.getElementById("mainbox");
	var compStyles = window.getComputedStyle(mainBox);
	
    assert.equal(rgb2hex(compStyles.getPropertyValue('background-color')), "#3E92CC","Ensuring mainbox colour is #3E92CC");
});


QUnit.test("resetVariables() starting new quiz sets variables to default values", function(assert){
	//store values
	var storedIndex = localStorage.questionIndex;
	var storedData = localStorage.questionData;
	var storedResults = localStorage.resultsData;
	var storedScore = localStorage.score;	
	var storedLocalResults = resultsData;
	
	//ensure that there are some values, fake them!
	localStorage.questionIndex = 4;
	localStorage.storedData = ["data!"];
	localStorage.resultsData = ["results!"];
	localStorage.score = 5;
	resultsData = ["localResults!"];
	
	resetVariables();
	
	assert.equal(localStorage.questionIndex,0, "Ensuring resetVariables() sets questionIndex to 0");
	assert.equal(localStorage.questionData,undefined, "Ensuring resetVariables() sets questionData to undefined");
	assert.equal(localStorage.resultsData,undefined, "Ensuring resetVariables() sets resultsData to undefined");
	assert.equal(localStorage.score,0, "Ensuring resetVariables() sets questionData to 0");
	assert.equal(resultsData.length,0, "Ensuring resultData local variable is set to empty array");
	
	//put variables back..
	localStorage.questionIndex = storedIndex;
	localStorage.score = storedScore;
	
	//workaround as setting empty localstorage back ends up with the string "undefined"
	localStorage.questionData = storedData;
	localStorage.resultsData = storedResults;
	
	resultsData = storedLocalResults;

});

QUnit.test("incrimentScore() correctly incriments score by 1", function(assert){
	//store values
	var storedScore = localStorage.score;
	
	localStorage.score = 0;
	incrimentScore();
	assert.equal(localStorage.score, 1, "Ensuring incrimentScore() adds one to score value");
	
	//put variables back..
	localStorage.score = storedScore;
});

QUnit.test("incrimentIndex() correctly incriments index by 1", function(assert){
	//store values
	var storedIndex = localStorage.questionIndex;
	
	localStorage.questionIndex = 0;
	incrimentIndex();
	assert.equal(localStorage.questionIndex, 1, "Ensuring incrimentIndex() adds one to index value");
	
	//put variables back
	localStorage.questionIndex = storedIndex;
});

QUnit.test("calculatePercentage() correctly calculates the score percentage",function(assert){
	assert.equal(calculatePercentage(10,10),100.00,"10/10 score returns a percentage of 100");
	assert.equal(calculatePercentage(5,10),50.00,"5/10 score returns a percentage of 50");
	assert.equal(calculatePercentage(0,10),0.00,"0/10 score returns a percentage of 0");
	assert.equal(calculatePercentage(1,3),33.33,"1/3 score returns a percentage of 33.33, testing 2dp");
});

QUnit.test("gaugeScore() responds correctly given certain percentages",function(assert){
	assert.equal(gaugeScore(0.00),"Oh no!","0% returns value of 'Oh no!'");
	assert.equal(gaugeScore(39.99),"Oh no!","39.99% returns value of 'Oh no! (extreme edge test)'");
	assert.equal(gaugeScore(40.00),"Needs improvement!","40% returns value of 'Needs improvement!'");
	assert.equal(gaugeScore(50.00),"Keep practicing!","50% returns value of 'Keep practicing!'");
	assert.equal(gaugeScore(60.00),"Not bad!","60% returns value of 'Not bad!'");
	assert.equal(gaugeScore(70.00),"Great Job!","70% returns value of 'Great Job!'");
	assert.equal(gaugeScore(100.00),"Wow!","100% returns value of 'Wow!'");
});

QUnit.test("toggleTests() correctly toggles hiding the 'testing' div",function(assert){
	
	var testingDiv = document.getElementById("testing");
	//store variables
	var storedVisiblity = testingDiv.style.display;
	
	testingDiv.style.display = "";
	toggleTests();
	assert.equal(testingDiv.style.display,"none", "Clicking when '' sets display to 'none'");
	toggleTests();
	assert.equal(testingDiv.style.display,"", "Clicking when 'none' sets display to ''");
	
	//put variables back..
	testingDiv.style.display = storedVisiblity;
});

QUnit.test("toggleChat() correctly toggles chat box",function(assert){
	
	var chatHeader = document.getElementById("chat-head");
	var arrowImg = document.getElementById('toggleArrow');
	
	//store img value
	var storedImg = arrowImg.src;
	
	toggleChat();
	assert.equal(arrowImg.src,"https://img.icons8.com/ios/50/000000/sort-up-filled.png", "Clicking header when up changes arrowImg to down arrow");
	toggleChat();
	assert.equal(arrowImg.src,"https://img.icons8.com/ios/50/000000/sort-down-filled.png", "Clicking header when down changes arrowImg to up arrow");
	
	//put variables back..
	arrowImg.src = storedImg;
});

QUnit.test("resetVariables() starting new quiz sets variables to default values", function(assert){
	
	//store values
	var storedIndex = localStorage.questionIndex;
	var storedData = localStorage.questionData;
	var storedResults = localStorage.resultsData;
	var storedScore = localStorage.score;	
	var storedLocalResults = resultsData;
	
	//ensure that there are values!
	localStorage.questionIndex = 4;
	localStorage.storedData = ["data!"];
	localStorage.resultsData = ["results!"];
	localStorage.score = 5;
	resultsData = ["localResults!"];
	
	resetVariables();
	
	assert.equal(localStorage.questionIndex,0, "Ensuring resetVariables() sets questionIndex to 0");
	assert.equal(localStorage.questionData,undefined, "Ensuring resetVariables() sets questionData to undefined");
	assert.equal(localStorage.resultsData,undefined, "Ensuring resetVariables() sets resultsData to undefined");
	assert.equal(localStorage.score,0, "Ensuring resetVariables() sets questionData to 0");
	assert.equal(resultsData.length,0, "Ensuring resultData local variable is set to empty array");
	
	//put variables back..
	localStorage.questionIndex = storedIndex;
	localStorage.score = storedScore;
	
	//workaround as setting empty localstorage back ends up with the string "undefined"
	localStorage.questionData = storedData;
	localStorage.resultsData = storedResults;
	
	resultsData = storedLocalResults;
});

QUnit.test("stopTimer() stops timer from counting", function(assert){
	var done = assert.async();
	var timerInstance2 = new timer();
	timerInstance2.startTimer();
	timerInstance2.stopTimer(timerInstance2.timerID);
	setTimeout(timerStopCheck,1000);
	
	function timerStopCheck() {
		assert.equal(timerInstance2.seconds,0,"Checking that timePassed is 0 when timer is stopped, and then 1 second passes");
		done();
	}
});

QUnit.test("seconds should be 0 before timer starts,setTime() and resetTime() sets value of seconds correctly", function(assert){
	var timerInstance5 = new timer();
	assert.equal(timerInstance5.seconds,0,"checks that the timer initialises seconds to 0");
	timerInstance5.setTime(50);
	assert.equal(timerInstance5.seconds,50,"checks that the timers seconds are now set to 50");
	timerInstance5.resetTimer();
	assert.equal(timerInstance5.seconds,0,"checks that the timers seconds are now reset to 0");
});

QUnit.test("getTime() function returns the correct time string", function(assert){
	var timerInstance6 = new timer();
	timerInstance6.setTime(36154);
	assert.equal(timerInstance6.getTime(),"10 hours, 2 minutes, 34 seconds","checks that 36154 seconds returns string '10 hours, 2 minutes, 34 seconds' ");
	timerInstance6.setTime(33);
	assert.equal(timerInstance6.getTime(),"0 hours, 0 minutes, 33 seconds","checks that 33 seconds returns string '0 hours, 0 minutes, 33 seconds' ");
	timerInstance6.setTime(120);
	assert.equal(timerInstance6.getTime(),"0 hours, 2 minutes, 0 seconds","checks that 120 seconds returns string '0 hours, 2 minutes, 0 seconds' ");
	timerInstance6.setTime(3666);
	assert.equal(timerInstance6.getTime(),"1 hours, 1 minutes, 6 seconds","checks that 3666 seconds returns string '1 hours, 1 minutes, 6 seconds' ");
});

QUnit.test("calling tickTimer() adds one second to a timer object", function(assert){
	var timerInstance7 = new timer();
	assert.equal(timerInstance7.seconds,0,"checks that the timer initialises seconds to 0");
	timerInstance7.tickTimer();
	assert.equal(timerInstance7.seconds,1,"checks that the timer seconds is 1 after ticking");
});

//use plugin to output results to xml file (results.xml) for use in jenkins auto testing
QUnit.jUnitDone(function(data) {
	var console = window.console;
	if (console) {
		document.output = data.xml;
		//console.log(data.xml);
	}
});