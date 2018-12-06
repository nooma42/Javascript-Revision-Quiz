//this aggregation op randomly selects 3 documents from the questions

var MongoClient = require('mongodb').MongoClient;
var app = require('express')();
var url = "mongodb://localhost:27017/";
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = 80;

var numUsers = 0;
var usernameIncriment = 0;

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});


app.get("/questions/:numQuestions", function(request, response) 
{
	console.log("############# " + request.params.numQuestions + " Question/s requested..." + " #############");
	var text = getQuestions(parseInt(request.params.numQuestions)).then(function(result){
		console.log(result);
		var data = JSON.stringify(result);
		response.end(data);
	});
});



function getQuestions(numQuestions)
{
	return new Promise(function(resolve, reject) {
		MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
			if (err) throw reject(err);
			var dbo = db.db("SOFT352Quiz");
			dbo.collection("questions").aggregate([ { $sample: { size: numQuestions } } ]).toArray(function(err, result) {
			if (err) throw reject(err);
				resolve(result);
				db.close();
			});
		});
	});
}

io.on('connection', function(socket){
	console.log('a user connected');
	
	numUsers++;
	usernameIncriment++;
	socket.username = usernameIncriment;
	console.log('assigning username: ' + usernameIncriment);
	socket.broadcast.emit('broadcast',"User " + socket.username + " connected.");
	socket.emit('username', usernameIncriment);
	io.emit('userCount',numUsers-1);
	
		
	socket.on('chat', function(msg){
		console.log('message: ' + msg);
		socket.broadcast.emit('chat',"User " + socket.username + ": " + msg);
	});
	
	socket.on('disconnect', function(){
		--numUsers;
		console.log('a user disconnected');
		socket.broadcast.emit('broadcast',"User " + socket.username + " disconnected.");
		io.emit('userCount',numUsers-1);
    });

});

http.listen ( port , function () {
	console.log ( " Server listening on port " + port );
});