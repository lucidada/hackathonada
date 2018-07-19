function initiateDocumentScreenReader(documentName, documentData) {
  const pages = documentData.pages;
  const shapes = documentData.shapes;
  const lines = documentData.lines;
  readSpeech(`
    ${documentName} Diagram is loaded.
    There ${pluralize(pages.length, "is", "are")} ${pages.length} ${pluralize(pages.length, "page", "pages")}.
    Use w. a. s. d. to navigate the diagram.
  `)
    // There ${pluralize(shapes.length, "is", "are")} ${shapes.length} ${pluralize(shapes.length, "shape", "shapes")}
    // There ${pluralize(lines.length, "is", "are")} ${lines.length} ${pluralize(lines.length, "line", "lines")}

  let context = {
    index: 0,
    exploreIndex: -1,
    sequence: [
      {summary: "Option 1 to Proccess"},
      {summary: "Option 2 to Proccess"},
      {summary: "Option 3 to Proccess"},
      {summary: "Option 4 to Proccess"},
      {summary: "Option 5 to Proccess"}
    ]
  }

  window.addEventListener("keypress", e => {
    const k = e.key;
    if (keyPressHandlers[k] !== undefined) {
      keyPressHandlers[k]();
    }
    console.log(e)
  });

  function getExploreItem() {
    return context.sequence[context.exploreIndex];
  }
  function summarize(item) {
    readSpeech(item.summary);
  }

  function right(context) {
    context.exploreIndex = (context.exploreIndex + 1 + context.sequence.length) % context.sequence.length;
    summarize(getExploreItem());
  }
  function left(context) {
    context.exploreIndex = (context.exploreIndex - 1 + context.sequence.length) % context.sequence.length;
    summarize(getExploreItem());
  }

  const keyPressHandlers = {
    "w": _ => readSpeech("up"),
    "s": _ => readSpeech("down"),
    "a": _ => left(context),
    "d": _ => right(context),
    "_": _ => decreaseRate(),
    "+": _ => increaseRate(),
  };
}

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
