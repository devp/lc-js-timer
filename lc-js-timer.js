//// LcJsTimerApp

var LcJsTimerApp = function() {
	console.log("started LcJsTimerApp");
	this.gameTimer_ = null;
	this.travelTimer_ = null;
};

LcJsTimerApp.instance = null;

LcJsTimerApp.init = function() {
	return LcJsTimerApp.instance = new LcJsTimerApp();
};

LcJsTimerApp.prototype.pauseGame = function() {
	this.pauseGameTimer();
	this.pauseTravelTimer();
};

LcJsTimerApp.prototype.promptAndConfirmAndStartGameTimer = function() {
	var timeObj = Util.parseMinutesAndSeconds(
		prompt("Enter game time in form of X:YY, e.g. 0:30"));
	var confirmString = "Confirm: start game time of " + timeObj.minutes +
		":" + timeObj.seconds + "?";
	if (confirm(confirmString)) {
		this.stopGameTimer();
		this.setGameTimer(timeObj.minutes, timeObj.seconds);
		this.startGameTimer();
	}
};

LcJsTimerApp.prototype.promptAndConfirmAndStartTravelTimer = function() {
	var timeObj = Util.parseMinutesAndSeconds(
		prompt("Enter travel time in form of X:YY, e.g. 0:30"));
	var confirmString = "Confirm: start travel time of " + timeObj.minutes +
		":" + timeObj.seconds + "?";
	if (confirm(confirmString)) {
		this.stopTravelTimer();
		this.setTravelTimer(timeObj.minutes, timeObj.seconds);
		this.startTravelTimer();
	}
};

//// LcJsTimerApp - timer details

LcJsTimerApp.prototype.setGameTimer = function(minutes, seconds) {
	this.gameTimer_ = new LcCountdown(
		Util.minutesAndSecondsToSeconds(minutes, seconds),
		this.onGameTimerTick_);
};

LcJsTimerApp.prototype.startGameTimer = function() {
	if (this.gameTimer_) {
		this.gameTimer_.start();
	}
};

LcJsTimerApp.prototype.pauseGameTimer = function() {
	if (this.gameTimer_) {
		this.gameTimer_.pause();
	}
};

LcJsTimerApp.prototype.stopGameTimer = function() {
	if (this.gameTimer_) {
		this.gameTimer_.stop();
		this.gameTimer_ = null;
	}
};

LcJsTimerApp.prototype.onGameTimerTick_ = function(seconds) {
	console.log("TICK: GAME: " + seconds);
};

LcJsTimerApp.prototype.setTravelTimer = function(minutes, seconds) {
	this.travelTimer_ = new LcCountdown(
		Util.minutesAndSecondsToSeconds(minutes, seconds),
		this.onTravelTimerTick_);
};

LcJsTimerApp.prototype.startTravelTimer = function() {
	if (this.travelTimer_) {
		this.travelTimer_.start();
	}
};

LcJsTimerApp.prototype.pauseTravelTimer = function() {
	if (this.travelTimer_) {
		this.travelTimer_.pause();
	}
};

LcJsTimerApp.prototype.stopTravelTimer = function() {
	if (this.travelTimer_) {
		this.travelTimer_.stop();
		this.travelTimer_ = null;
	}
};

LcJsTimerApp.prototype.onTravelTimerTick_ = function(seconds) {
	console.log("TICK: TRAVEL: " + seconds);
};


//// Util

var Util = {};

Util.parseMinutesAndSeconds = function(timeString) {
	var minutes = 0, seconds = 0;
	var values = timeString.split(":");
	if (values.length == 1) {
		seconds = parseInt(values[0]) || 0;
	} else if (values.length > 1) {
		minutes = parseInt(values[0]) || 0;
		seconds = parseInt(values[1]) || 0;
	}
	return {
		minutes: minutes,
		seconds: seconds
	};
};

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
