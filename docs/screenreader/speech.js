const speechSettings = {
  rate: 1
};
function increaseRate() {
  speechSettings.rate += 0.2;
  speechSettings.rate = speechSettings.rate > 10 ? 10 : speechSettings.rate;
  readSpeech("Increase rate")
}
function decreaseRate() {
  speechSettings.rate -= 0.2;
  speechSettings.rate = speechSettings.rate < 0 ? 0.1 : speechSettings.rate;
  readSpeech("Decrease rate")
}

function readSpeech(message) {
  const msg = new SpeechSynthesisUtterance(message);
  msg.rate = speechSettings.rate;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(msg);
}

function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural;
}
