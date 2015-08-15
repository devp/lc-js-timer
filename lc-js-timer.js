//// LcJsTimerApp

var LcJsTimerApp = function(eventManager) {
	console.log("started LcJsTimerApp");
	this.eventManager_ = eventManager || {};
	this.gameTimer_ = null;
	this.travelTimer_ = null;
	this.setState(LcJsTimerApp.STATES_ENUM.INITIALIZED);
	this.setTravelState(LcJsTimerApp.STATES_ENUM.TRAVEL_NO);
};

LcJsTimerApp.prototype.pauseGame = function() {
	this.pauseGameTimer();
	this.pauseTravelTimer();
};

LcJsTimerApp.prototype.resumeGame = function() {
	this.resumeGameTimer();
	this.resumeTravelTimer();
};

LcJsTimerApp.prototype.promptAndConfirmAndStartGameTimer = function() {
	var timeObj = Util.parseMinutesAndSeconds(
		prompt("Enter game time in form of X:YY, e.g. 0:30"));
	var confirmString = "Confirm: start game time of " + timeObj.minutes +
		":" + timeObj.seconds + "?";
	if (confirm(confirmString)) {
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
		this.setTravelTimer(timeObj.minutes, timeObj.seconds);
		this.startTravelTimer();
	}
};

LcJsTimerApp.prototype.confirmStopTravelTimer = function() {
	var confirmString = "Confirm: stop travel?";
	if (confirm(confirmString)) {
		this.stopTravelTimer()
	};
}

//// LcJsTimerApp - events

LcJsTimerApp.prototype.onStateChange_ = function(oldState, newState) {
	if (this.eventManager_.onStateChange) {
		this.eventManager_.onStateChange(oldState, newState);
	}
};

LcJsTimerApp.prototype.onGameTimerTick_ = function(seconds) {
	if (this.eventManager_.onGameTimerTick) {
		this.eventManager_.onGameTimerTick(seconds);
	}
};

LcJsTimerApp.prototype.onTravelTimerTick_ = function(seconds) {
	if (this.eventManager_.onTravelTimerTick) {
		this.eventManager_.onTravelTimerTick(seconds);
	}
};

//// LcJsTimerApp - state details

LcJsTimerApp.STATES_ENUM = {};
// General state, starting at 1
LcJsTimerApp.STATES_ENUM.INITIALIZED = 1;
LcJsTimerApp.STATES_ENUM.IN_PROGRESS = 2;
LcJsTimerApp.STATES_ENUM.PAUSED = 3;
LcJsTimerApp.STATES_ENUM.STOPPED = 4;
// Travel states, starting at 100
LcJsTimerApp.STATES_ENUM.TRAVEL_NO = 100;
LcJsTimerApp.STATES_ENUM.TRAVEL_YES = 101;

LcJsTimerApp.prototype.setState = function(newState) {
	var oldState = this.state_ || null;
	this.state_ = newState;
	this.onStateChange_(oldState, this.state_);
};

LcJsTimerApp.prototype.setTravelState = function(newState) {
	var oldState = this.travelState_ || null;
	this.travelState_ = newState;
	this.onStateChange_(oldState, this.state_);
}

//// LcJsTimerApp - timer details

LcJsTimerApp.prototype.setGameTimer = function(minutes, seconds) {
	this.gameTimer_ = new LcCountdown(
		Util.minutesAndSecondsToSeconds(minutes, seconds),
		this.onGameTimerTick_.bind(this));
};

LcJsTimerApp.prototype.startGameTimer = function() {
	this.setState(LcJsTimerApp.STATES_ENUM.IN_PROGRESS);
	if (this.gameTimer_) {
		this.gameTimer_.start();
	}
};

LcJsTimerApp.prototype.pauseGameTimer = function() {
	this.setState(LcJsTimerApp.STATES_ENUM.PAUSED);
	if (this.gameTimer_) {
		this.gameTimer_.pause();
	}
};

LcJsTimerApp.prototype.resumeGameTimer = function() {
	this.setState(LcJsTimerApp.STATES_ENUM.IN_PROGRESS);
	if (this.gameTimer_) {
		this.gameTimer_.resume();
	}
};

LcJsTimerApp.prototype.stopGameTimer = function() {
	this.setState(LcJsTimerApp.STATES_ENUM.STOPPED);
	if (this.gameTimer_) {
		this.gameTimer_.stop();
		this.gameTimer_ = null;
	}
};

LcJsTimerApp.prototype.setTravelTimer = function(minutes, seconds) {
	this.travelTimer_ = new LcCountdown(
		Util.minutesAndSecondsToSeconds(minutes, seconds),
		this.onTravelTimerTick_.bind(this));
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

LcJsTimerApp.prototype.resumeTravelTimer = function() {
	if (this.travelTimer_) {
		this.travelTimer_.resume();
	}
};

LcJsTimerApp.prototype.stopTravelTimer = function() {
	if (this.travelTimer_) {
		this.travelTimer_.stop();
		this.travelTimer_ = null;
	}
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
