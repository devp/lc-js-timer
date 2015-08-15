var LcJsTimerApp = function() {
	console.log("started LcJsTimerApp");
};

LcJsTimerApp.instance_ = null;

LcJsTimerApp.start = function() {
	LcJsTimerApp.instance_ = new LcJsTimerApp();
};