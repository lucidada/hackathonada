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
  console.log(context)
  return getTransitionItem(context).context;
}
function getTransitionItem(context) {
  return context.sequence[context.index];
}
function summarize(item) {
  console.log("hey", item)
  readSpeech(item.summary);
}
function setActiveContext(context) {
  if (!getExploreItem(context)) {
    readSpeech("There are no structures below this one.")
    return context;
  }
  else {
    const newContext = getExploreItem(context);
    newContext.index = 0;
    newContext.sequence = newContext.children;
    readSpeech(`${newContext.Name}: ${newContext.summary}`);
    return newContext;
  }
}
function right(context) {
  if (context.sequence.length == 0) {
    readSpeech("No structures. Try a different direction");
  }
  else {
    context.index = (context.index + 1 + context.sequence.length) % context.sequence.length;
    summarize(getTransitionItem(context));
  }
}
function left(context) {
  if (context.sequence.length == 0) {
    readSpeech("No structures. Try a different direction");
  }
  else {
    context.index = (context.index - 1 + context.sequence.length) % context.sequence.length;
    summarize(getTransitionItem(context));
  }
}
function up(context) {
  if (!context.parents || context.parents.length === 0) {
    readSpeech("There are no structures above.");
  }
  else {
    context.sequence = context.parents;
    context.index = 0;
    const s = context.sequence.length;
    readSpeech(`There ${pluralize(s, "is", "are")} ${s} ${pluralize(s, "structure", "structures")} above`)
  }
}
function down(context) {
  if (!context.children || context.children.length === 0) {
    readSpeech("There are no structures below.");
  }
  else {
    context.sequence = context.children;
    context.index = 0;
    const s = context.sequence.length;
    readSpeech(`There ${pluralize(s, "is", "are")} ${s} ${pluralize(s, "structure", "structures")} below`)
  }
}
