var LcJsTimerApp = function() {
	console.log("started LcJsTimerApp");
	this.gameTimer_ = null;
};

LcJsTimerApp.instance_ = null;

LcJsTimerApp.start = function() {
	LcJsTimerApp.instance_ = new LcJsTimerApp();
};

LcJsTimerApp.prototype.setGameTimer = function(minutes, seconds) {
	this.gameTimer_ = new LcCountdown(
		Util.minutesAndSecondsToSeconds(minutes, seconds),
		this.onGameTimerTick_);
};

LcJsTimerApp.prototype.pauseGameTimer = function() {
	if (this.gameTimer_) {
		this.gameTimer_.pause();
	}
}

LcJsTimerApp.prototype.stopGameTimer = function() {
	if (this.gameTimer_) {
		this.gameTimer_.stop();
	}
}

LcJsTimerApp.prototype.onGameTimerTick_ = function(seconds) {

};

LcJsTimerApp.prototype.setTravelTimer = function(minutes, seconds) {
	this.travelTimer_ = new LcCountdown(
		Util.minutesAndSecondsToSeconds(minutes, seconds),
		this.onGameTimerTick_);
};

LcJsTimerApp.prototype.pauseGameTimer = function() {
	if (this.travelTimer_) {
		this.travelTimer_.pause();
	}
}

LcJsTimerApp.prototype.stopGameTimer = function() {
	if (this.travelTimer_) {
		this.travelTimer_.stop();
	}
}

LcJsTimerApp.prototype.onGameTimerTick_ = function(seconds) {

};


//// Util

var Util = {};

Util.minutesAndSecondsToSeconds = function(minutes, seconds) {
	return (seconds || 0) + ((minutes || 0) * 60);
};

Util.secondsToMinutesAndSeconds = function(seconds) {
	return {
		minutes: Math.floor(seconds / 60),
		seconds: seconds % 60
	};
};

//// LC COUNTDOWN

var LcCountdown = function(seconds, tickCallback) {
	this.secondsTotal = seconds;
	this.secondsRemaining = 0;
	this.currentlyRunning = false;

	this.intervalId_ = null;
	this.tickCallback_ = tickCallback || null;
};

LcCountdown.prototype.tick = function() {
	if (this.currentlyRunning) {
		this.secondsRemaining--;
		if (this.tickCallback_) {
			this.tickCallback_(this.secondsRemaining);
		}
		if (this.secondsRemaining == 0) {
			this.stop();
		};
	}
};

LcCountdown.prototype.start = function() {
	this.currentlyRunning = true;
	this.secondsRemaining = this.secondsTotal;
	this.intervalId_ = window.setInterval(
		this.tick.bind(this),
		1000);
};

LcCountdown.prototype.pause = function() {
	this.currentlyRunning = false;
};

LcCountdown.prototype.resume = function() {
	this.currentlyRunning = true;
};

LcCountdown.prototype.stop = function() {
	this.currentlyRunning = false;
	window.clearInterval(this.intervalId_);
	this.intervalId_ = null;
	if (this.completedCallback_) { this.completedCallback_() };
	this.completedCallback_ = null;
};
