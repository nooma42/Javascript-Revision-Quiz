QUnit.test("Simple test to ensure page title is correct", function(assert){
    assert.equal(document.getElementsByTagName("title")[0].innerHTML, "SOFT352 Quiz","Ensuring SOFT352 is the title.");
});

QUnit.jUnitDone(function(data) {
	var console = window.console;
	if (console) {
		document.output = data.xml;
		console.log(data.xml);
	}
});