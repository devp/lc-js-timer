(function() {
	var assertCount = 0, assertSuccessCount = 0;

	var assert = function(value, message) {
		assertCount++;
		if (value) assertSuccessCount++;
		console.assert(value, message || "Assertion " + assertCount + " failed");
	};

	var assertDiffTime = function(value1, value2, diffmod, message) {
		return assert((Math.abs(value1 - value2) <= diffmod), message);
	};

	console.log("Test Assertions: " + assertSuccessCount + "/" + assertCount);
})();