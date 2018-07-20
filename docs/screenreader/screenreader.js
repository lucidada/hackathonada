function initiateDocumentScreenReader(documentName, documentData) {
  const objects = documentData.objects
  const pages = documentData.pages;
  const shapes = documentData.shapes;
  const lines = documentData.lines;
  readSpeech(`
    ${documentName} Diagram is loaded.
    Use w. a. s. d. and spacebar. to navigate the diagram.
  `)

  window.addEventListener("keypress", e => {
    const k = e.key;
    if (keyPressHandlers[k] !== undefined) {
      keyPressHandlers[k]();
    }
  });

  let context = introduceHierarchy(objects, pages, shapes, lines);

  const keyPressHandlers = {
    "w": _ => up(context),
    "s": _ => down(context),
    "a": _ => left(context),
    "d": _ => right(context),
    " ": _ => context = setActiveContext(context)
  };
}
