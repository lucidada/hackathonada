function createTransition(summary, context) {
  return {
    summary,
    context
  }
}
function introduceHierarchy(objects, pages, shapes, lines) {
  const overviewContext = createContext(`
    Diagram Overview.
    There ${pluralize(pages.length, "is", "are")} ${pages.length} ${pluralize(pages.length, "page", "pages")}.
  `, []);

  const h = objects.map(o => {
    o.parents = [];
    o.children = [];
    return o;
  });

  // name pages
  pages.forEach(p => {
    p.parents.push(createTransition("Diagram Overview", overviewContext));
    p.summary = mergeTextAreas(p);
    overviewContext.children.push(createTransition(p.summary, p));
  });

  // connect shapes to pages
  shapes.forEach(s => {
    const page = h[s["Page ID"] - 1];
    const shape = h[s["Id"] - 1];
    shape.summary = mergeTextAreas(shape);
    page.children.push(createTransition(shape.summary, shape));
    shape.parents.push(createTransition(page.summary, page));
  });

  // connect shapes to eachother
  lines.forEach(l => {
    if (!l["Line Source"] && !l["Line Destination"]) {
      return;
    }
    const lineSource = h[l["Line Source"] - 1];
    const lineDest = h[l["Line Destination"] - 1];
    const text = mergeTextAreas(l);
    lineSource.children.push(createTransition(`${text === ""?"Line":text}! goes to ${lineDest.summary}`, lineDest));
    lineDest.parents.push(createTransition(`${text === ""?"Line":text}! from ${lineSource.summary}`, lineSource));
  });

  return overviewContext;
}

function mergeTextAreas(obj) {
  let i = 1;
  let text = obj[`Text Area ${i++}`];
  while (obj[`Text Area ${i}`]) {
    text += ". " + obj[`Text Area ${i++}`]
  }
  return text;
}
