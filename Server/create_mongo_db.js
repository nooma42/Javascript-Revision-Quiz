// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/", function(err, db) {
	
	if(!err) 
	{
		var dbo = db.db("SOFT352Quiz");
		
		dbo.dropCollection("questions", function(err, delOK) 
		{
			if (delOK) console.log("Collection deleted");
		});
		  
		dbo.createCollection("questions", function(err,res) 
		{
			console.log("Collection created!");
			db.close();
		});
	}
	else
	{
		console.log("oh no :( " + err);
	}
});