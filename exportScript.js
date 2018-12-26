var resultsData;
var score = 0;

window.onload = function () {
	console.log(localStorage.resultsData)
	if (localStorage.resultsData == undefined) 
	{
		window.close();
	}
	resultsData = JSON.parse(localStorage.resultsData);
	populate();
}

function populate()
{
	var content = document.getElementById("quizSummary");
	
	for (i = 0; i < resultsData.length; i++)
	{
		var questionInfo = document.createElement("div");
		questionInfo.id = ("a"+i+1)
		questionInfo.innerHTML = "You Answered: " + resultsData[i][1];
		
		if(resultsData[i][1] == resultsData[i][2])
		{
			//they answered correct! make it green
			questionInfo.style.colour = "green";
			score++;
		}
		else
		{
			//they got it wrong! make it red
			questionInfo.style.color = "#f7706a";
		}
		
		var question = document.createElement("div");
		question.id = ("q"+i+1);
		question.innerHTML =  (i+1) + ": " + resultsData[i][0];
		content.appendChild(question);
		
		content.appendChild(questionInfo);
		
		var correctInfo = document.createElement("div");
		correctInfo.id = ("c"+i+1);
		correctInfo.innerHTML = "Correct Answer: " + resultsData[i][2];
		content.appendChild(correctInfo);	
		
		var br = document.createElement("br");
		content.appendChild(br);
	}
	
	//summary!
	var summary = document.createElement("div");
	summary.id = "summary";
	summary.innerHTML = "You scored: " + score + "/" + resultsData.length;
	content.appendChild(summary);
}
