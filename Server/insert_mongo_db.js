var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("SOFT352Quiz");
  var questionsObj = [
    { 
		_id: 1,
		question: 'What kind of error has occurred if the interpreter can\'t make sense of the code?',
		type: 'multi',
		options: [
		{
			text: 'Syntax error',
			correct: 0
		},
		{
			text: 'Semantic error',
			correct: 1
		},
		{
			text: 'Runtime error',
			correct: 0
		},
		{
			text: 'User error',
			correct: 0
		}
		]
	},
	{
		_id: 2,
		question: 'An AJAX call must use XML to pass its data.',
		type: 'multi',
		options: [
		{
			text: 'True',
			correct: 0
		},
		{
			text: 'False',
			correct: 1
		}
		]
	},
	{
		_id: 3,
		question: 'Which of these technologies defines the look and feel of a website?',
		type: 'multi',
		options: [
		{
			text: 'Cascading Style Sheets',
			correct: 1
		},
		{
			text: 'JavaScript',
			correct: 0
		},
		{
			text: 'Internet Explorer',
			correct: 0
		},
		{
			text: 'Hyper-Text Markup Language',
			correct: 0
		}
		]
	},
	{
		_id: 4,
		question: 'What does DOM stand for?',
		type: 'multi',
		options: [
		{
			text: 'Downloaded Object Model',
			correct: 0
		},
		{
			text: 'Desensitised old  Man',
			correct: 0
		},
		{
			text: 'Document of Markup',
			correct: 0
		},
		{
			text: 'Document Object Model',
			correct: 1
		}
		]
	},
	{
		_id: 5,
		question: 'How do you count the elements in a JavaScript array?',
		type: 'multi',
		options: [
		{
			text: 'The .length method',
			correct: 0
		},
		{
			text: 'The .size method',
			correct: 0
		},
		{
			text: 'The .size property',
			correct: 0
		},
		{
			text: 'The .length property',
			correct: 1
		}
		]
	},
	{
		_id: 6,
		question: 'Which event is triggered when a webpage is loaded?',
		type: 'multi',
		options: [
		{
			text: 'page.onload',
			correct: 0
		},
		{
			text: 'window.onload',
			correct: 1
		},
		{
			text: 'No Event is triggered',
			correct: 0
		},
		{
			text: 'website.load',
			correct: 0
		}
		]
	},
	{
		_id: 7,
		question: 'At runtime, JavaScript variables are ____',
		type: 'multi',
		options: [
		{
			text: 'awesome',
			correct: 0
		},
		{
			text: 'downloaded',
			correct: 0
		},
		{
			text: 'hoisted',
			correct: 1
		},
		{
			text: 'injected',
			correct: 0
		}
		]
	},
	{
		_id: 8,
		question: 'What is the protocol that allows web browsers to request pages from a server?',
		type: 'multi',
		options: [
		{
			text: 'SCP',
			correct: 0
		},
		{
			text: 'FTP',
			correct: 0
		},
		{
			text: 'HTTP',
			correct: 1
		},
		{
			text: 'SFTP',
			correct: 0
		}
		]
	},
	{
		_id: 9,
		question: 'What element is used to define a hyperlink within an HTML document?',
		type: 'multi',
		options: [
		{
			text: '&lt;link&gt;',
			correct: 0
		},
		{
			text: '&lt;ref&gt;',
			correct: 0
		},
		{
			text: '&lt;a&gt;',
			correct: 1
		},
		{
			text: '&lt;h&gt;',
			correct: 0
		}
		]
	},
	{
		_id: 10,
		question: '____ are used to debug the code as it executes',
		type: 'multi',
		options: [
		{
			text: 'bug sprays',
			correct: 0
		},
		{
			text: 'breakpoints',
			correct: 1
		},
		{
			text: 'methods',
			correct: 0
		},
		{
			text: 'requests',
			correct: 0
		}
		]
	},
	{
		_id: 11,
		question: 'The output produced when an error occurs in JavaScript is called _____',
		type: 'multi',
		options: [
		{
			text: 'uh oh',
			correct: 0
		},
		{
			text: 'death',
			correct: 0
		},
		{
			text: 'stack trace',
			correct: 1
		},
		{
			text: 'iterate',
			correct: 0
		}
		]
	},
	{
		_id: 12,
		question: 'How is a variable shared to an object from a factory?',
		type: 'multi',
		options: [
		{
			text: 'shared to the programs global scope',
			correct: 0
		},
		{
			text: 'shared to the local scope of the object',
			correct: 1
		},
		{
			text: 'copied from the object prototype',
			correct: 0
		},
		{
			text: 'copied from the object prototype',
			correct: 0
		}
		]
	},
	{
		_id: 13,
		question: 'Load testing is important to',
		type: 'multi',
		options: [
		{
			text: 'ensure the application works under heavy load',
			correct: 1
		},
		{
			text: 'ensure viruses arent loaded by the application',
			correct: 0
		},
		{
			text: 'ensure the browser loads',
			correct: 0
		},
		{
			text: 'make sure the page loads',
			correct: 0
		}
		]
	},
	{
		_id: 14,
		question: 'What is a persona?',
		type: 'multi',
		options: [
		{
			text: 'person whos name starts with A',
			correct: 0
		},
		{
			text: 'person who might interact with a system',
			correct: 1
		},
		{
			text: 'person who will never use a system',
			correct: 0
		},
		{
			text: 'a cyborg',
			correct: 0
		}
		]
	},
	{
		_id: 15,
		question: 'Which of these is the HTML5 variable for local data persistence?',
		type: 'multi',
		options: [
		{
			text: 'localData',
			correct: 0
		},
		{
			text: 'offlineData',
			correct: 0
		},
		{
			text: 'local.stuff',
			correct: 0
		},
		{
			text: 'localStorage',
			correct: 1
		}
		]
	},
	{
		_id: 16,
		question: 'Inside which HTML element do we put the JavaScript?',
		type: 'multi',
		options: [
		{
			text: '&lt;javascript&gt;',
			correct: 0
		},
		{
			text: '&lt;scripting&gt;',
			correct: 0
		},
		{
			text: '&lt;script&gt;',
			correct: 1
		},
		{
			text: '&lt;js&gt;',
			correct: 0
		}
		]
	},	
	{
		_id: 17,
		question: 'an external JavaScript file must contain the &lt;script&gt; tag.',
		type: 'multi',
		options: [
		{
			text: 'True',
			correct: 0
		},
		{
			text: 'False',
			correct: 1
		}
		]
	},	
	{
		_id: 18,
		question: 'How do you declare a function in JavaScript?',
		type: 'multi',
		options: [
		{
			text: 'function::myFunction()',
			correct: 0
		},
		{
			text: 'function myFunction()',
			correct: 1
		},
		{
			text: 'function = myFunction()',
			correct: 0
		},
		{
			text: 'func.myFunction()',
			correct: 0
		}
		]
	},
	{
		_id: 19,
		question: 'Which of these is the correct way to write an if statement in javascript?',
		type: 'multi',
		options: [
		{
			text: 'if i == 5 then',
			correct: 0
		},
		{
			text: 'if i = 5',
			correct: 0
		},
		{
			text: 'if i = 5 then',
			correct: 0
		},
		{
			text: 'if (i == 5)',
			correct: 1
		}
		]
	},
	{
		_id: 20,
		question: 'Which of these is the correct notation for NOT equal',
		type: 'multi',
		options: [
		{
			text: '!=',
			correct: 1
		},
		{
			text: '&lt;&gt;',
			correct: 0
		},
		{
			text: 'noEqual',
			correct: 0
		},
		{
			text: '¬',
			correct: 0
		}
		]
	},	
	{
		_id: 21,
		question: 'How can you add a comment in a JavaScript?',
		type: 'multi',
		options: [
		{
			text: '//Hello',
			correct: 1
		},
		{
			text: '(Hello)',
			correct: 0
		},
		{
			text: '$Hello',
			correct: 0
		},
		{
			text: '--Hello',
			correct: 0
		}
		]
	},
	{
		_id: 22,
		question: 'What is the correct HTML element for inserting a line break?',
		type: 'multi',
		options: [
		{
			text: '&lt;br&gt;',
			correct: 1
		},
		{
			text: '&lt;break&gt;',
			correct: 0
		},
		{
			text: '&lt;bk&gt;',
			correct: 0
		},
		{
			text: '&lt;lb&gt;',
			correct: 0
		}
		]
	},
	{
		_id: 23,
		question: 'Which HTML tag is used to define an internal style sheet?',
		type: 'multi',
		options: [
		{
			text: '&lt;style&gt;',
			correct: 1
		},
		{
			text: '&lt;script&gt;',
			correct: 0
		},
		{
			text: '&lt;css&gt;',
			correct: 0
		},
		{
			text: '&lt;aesthetic&gt;',
			correct: 0
		}
		]
	},
	{
		_id: 24,
		question: 'Varying the behaviour of an inherited function is called',
		type: 'multi',
		options: [
		{
			text: 'funcVar',
			correct: 1
		},
		{
			text: 'overloading',
			correct: 0
		},
		{
			text: 'overriding',
			correct: 1
		},
		{
			text: 'function Mapping',
			correct: 0
		}
		]
	},
	{
		_id: 25,
		question: 'Information hiding in JavaScript objects is provided by closure',
		type: 'multi',
		options: [
		{
			text: 'True',
			correct: 1
		},
		{
			text: 'False',
			correct: 0
		}
		]
	},
	{
		_id: 26,
		question: 'In test driven development, tests are viewed as',
		type: 'multi',
		options: [
		{
			text: 'validation',
			correct: 0
		},
		{
			text: 'justification',
			correct: 0
		},
		{
			text: 'specification',
			correct: 1
		},
		{
			text: 'verification',
			correct: 0
		}
		]
	}
  ];
  dbo.collection("questions").insertMany(questionsObj, function(err, res) {
    if (err) throw err;
    console.log("Number of documents inserted: " + res.insertedCount);
    db.close();
  });
});