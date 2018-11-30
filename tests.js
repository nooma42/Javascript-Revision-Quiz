QUnit.test("Simple test to ensure page title is correct", function(assert){
    assert.equal(document.getElementsByTagName("title")[0].innerHTML, "SOFT352 Quiz","Ensuring SOFT352 is the title.");
});

QUnit.test("Testing the heading of the page is correct", function(assert){
	var title = document.getElementById("quizTitle");
	var compStyles = window.getComputedStyle(title);
    assert.equal(title.textContent, "SOFT352 Quiz","Ensuring SOFT352 is the heading");
	assert.equal(rgb2hex(compStyles.getPropertyValue('color')),"#999999","ensuring color of heading is #999999 (grey)");
});

QUnit.jUnitDone(function(data) {
	var console = window.console;
	if (console) {
		document.output = data.xml;
		console.log(data.xml);
	}
});