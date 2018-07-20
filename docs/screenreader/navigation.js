function createContext(summary, sequence) {
  return {
    index: 0,
    summary,
    sequence,
    parents: [],
    children: sequence
  }
}
function getExploreItem(context) {
  return context.sequence[context.index];
}
function summarize(item) {
  readSpeech(item.summary);
}
function setActiveContext(context) {
  if (!getExploreItem(context)) {
    readSpeech("There are no structures below this one.")
    return context;
  }
  else {
    const newContext = getExploreItem(context);
    console.log(context, newContext)
    newContext.index = 0;
    newContext.sequence = newContext.children;
    readSpeech(`${newContext.Name}: ${newContext.summary}`);
    return newContext;
  }
}
function right(context) {
  context.index = (context.index + 1 + context.sequence.length) % context.sequence.length;
  summarize(getExploreItem(context));
}
function left(context) {
  context.index = (context.index - 1 + context.sequence.length) % context.sequence.length;
  summarize(getExploreItem(context));
}
function up(context) {
  if (!context.parents || context.parents.length === 0) {
    readSpeech("There are no structures above this one.");
  }
  else {
    context.sequence = context.parents;
    const s = context.sequence.length;
    readSpeech(`${s} above`)
  }
}
function down(context) {
  if (!context.children || context.children.length === 0) {
    readSpeech("There are no structures below this one.");
  }
  else {
    context.sequence = context.children;
    const s = context.sequence.length;
    readSpeech(`${s} below`)
  }
}
