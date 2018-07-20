function initiateDocumentScreenReader(documentName, documentData) {
  const objects = documentData.objects
  const pages = documentData.pages;
  const shapes = documentData.shapes;
  const lines = documentData.lines;
  readSpeech(`
    ${documentName} Diagram is loaded.
    Use w. a. s. d. and spacebar. to navigate the diagram.
  `)

  const globalContext = createContext(`
    Diagram Overview.
    There ${pluralize(pages.length, "is", "are")} ${pages.length} ${pluralize(pages.length, "page", "pages")}.
  `, pages);
  let context = globalContext;

  window.addEventListener("keypress", e => {
    const k = e.key;
    if (keyPressHandlers[k] !== undefined) {
      keyPressHandlers[k]();
    }
  });

  const hierarchy = introduceHierarchy(objects, pages, shapes, lines);

  const keyPressHandlers = {
    "w": _ => up(context),
    "s": _ => down(context),
    "a": _ => left(context),
    "d": _ => right(context),
    " ": _ => context = setActiveContext(context),
    "_": _ => decreaseRate(),
    "+": _ => increaseRate(),
  };

  function introduceHierarchy(objects, pages, shapes, lines) {
    const hierarchy = objects.map(o => {
      o.parents = [];
      o.children = [];
      return o;
    });

    // name pages
    pages.forEach(p => {
      p.parents.push(globalContext);
      p.summary = mergeTextAreas(p);
    });

    // connect shapes to pages
    shapes.forEach(s => {
      const page = hierarchy[s["Page ID"] - 1];
      const shape = hierarchy[s["Id"] - 1];
      shape.summary = mergeTextAreas(shape);
      page.children.push(shape);
      shape.parents.push(page);
    });

    console.log("lnes", lines)

    // connect shapes to eachother
    lines.forEach(l => {
      if (!l["Line Source"] && !l["Line Destination"]) {
        return;
      }
      // #TODO add text line between shapes
      const lineSource = hierarchy[l["Line Source"] - 1];
      const lineDest = hierarchy[l["Line Destination"] - 1];
      lineSource.children.push(lineDest);
      lineDest.parents.push(lineSource);
    });

    hierarchy.forEach(h => {
      console.log(h);
    });

    return hierarchy;
  }

  function mergeTextAreas(obj) {
    let i = 1;
    let text = obj[`Text Area ${i++}`];
    while (obj[`Text Area ${i}`]) {
      text += ". " + obj[`Text Area ${i++}`]
    }
    return text;
  }
}
