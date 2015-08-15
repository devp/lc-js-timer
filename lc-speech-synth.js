var LCSpeechSynth = {
	voiceEnabled: true,
	randomVoice: false,
	currentVoice: 0,
	configureVoice: function() {
		if (!LCSpeechSynth.hasSpeechSynth()) return;
		LCSpeechSynth.voiceEnabled = confirm("Do you want voice alerts?");
		if (LCSpeechSynth.voiceEnabled) {
			var voiceChoices = speechSynthesis.getVoices().map(function(v, i){
				return i + ":" + v.name
			}).join(" ");
			var voiceChoice = parseInt(
				prompt("Please enter a voice number, or -1 for random pick. "  + voiceChoices) || 0);
			if (voiceChoice == -1) {
				LCSpeechSynth.randomVoice = true;
				LCSpeechSynth.currentVoice = 0;
			} else {				
				LCSpeechSynth.randomVoice = false;
				LCSpeechSynth.currentVoice = voiceChoice;
			}
			LCSpeechSynth.testCurrentVoice();
		}
	},
	testCurrentVoice: function() {
		var choices = [
			"Hello Commander", "Hello Commander", "Hello Commander", "Hello Commander",
			"Greetings Commander", "Greetings Commander", "Greetings Commander",
			"Commander on bridge", "Commander on bridge", "Commander on bridge",
			"We missed you commander",
			"ALL HAIL THE HUMAN FEDERATION!",
			"Hostile life forms detected",
			"Have you eaten breakfast today?",
		];
		var msg = choices[(Math.floor(Math.random() * choices.length))]
		LCSpeechSynth.tryMessage(msg);
	},
	hasSpeechSynth: function() {
		return window.speechSynthesis ? true : false;
	},
	tryMessage: function(msg) {
		if (!LCSpeechSynth.hasSpeechSynth()) return;
		if (!LCSpeechSynth.voiceEnabled) return;
		var sMsg = new SpeechSynthesisUtterance(msg);
		if (LCSpeechSynth.randomVoice) {
			LCSpeechSynth.currentVoice =
				Math.floor(Math.random() * speechSynthesis.getVoices().length);
		}
		sMsg.voice = speechSynthesis.getVoices()[LCSpeechSynth.currentVoice];
    	window.speechSynthesis.speak(sMsg);
	}
};