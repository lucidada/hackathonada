window.addEventListener('load', () => {
  let nodoc = true;
  readSpeech("To upload a CSV press enter:");

  const fileUpload = document.querySelector("#csv-input");

  fileUpload.addEventListener('change', function() {
    if (this.files && this.files[0]) {
        const file = this.files[0];
        const reader = new FileReader();
        nodoc = false;
        try {
          const fileName = file.name.split('.')[0];
          const fileExt = file.name.split('.')[1];
          if (fileExt !== "csv") {
            throw "Unrecognized file extension: " + fileExt;
          }
          reader.addEventListener('load', function (e) {
              let csvData = e.target.result;
              initiateDocumentScreenReader(file.name.split(".")[0], parseDocumentCsv(csvData));
          });
          reader.readAsBinaryString(file);
        } catch (e) {
          readSpeech(e);
          nodoc = true;
        }
    }
  });

  window.addEventListener('keypress', (e) => {
    if (e.key === "Enter" && nodoc) {
      document.querySelector("#csv-input").click();
    }
  });

  function parseDocumentCsv(csvData) {
    const arrays = csvToArrays(csvData);
    const objects = arraysToObjects(arrays);
    const pages = objects.filter(propertyEquals("Name", "Page"));
    const shapes = objects.filter(propertyIsNotIn("Name", ["Page", "Line"]));
    const lines = objects.filter(propertyEquals("Name", "Line"));
    return {
      pages,
      shapes,
      lines
    };
  }

  function propertyIsNotIn(key, values) {
    return (obj) => values.indexOf(obj[key]) < 0;
  }

  function propertyEquals(key, value) {
    return (obj) => obj[key] === value;
  }

  function arraysToObjects(arrays) {
    const header = arrays.shift();
    return arrays.map(m => rowToObject(header, m));
  }

  function rowToObject(header, row) {
    return header.reduce((obj, k, index) => {
      obj[k] = row[index];
      return obj;
    }, {});
  }

  // ref: http://stackoverflow.com/a/1293163/2343
  // This will parse a delimited string into an array of
  // arrays. The default delimiter is the comma, but this
  // can be overriden in the second argument.
  function csvToArrays(strData, strDelimiter) {
      strDelimiter = (strDelimiter || ",");
      var objPattern = new RegExp(
            (
              // Delimiters.
              "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

              // Quoted fields.
              "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

              // Standard fields.
              "([^\"\\" + strDelimiter + "\\r\\n]*))"
          ),
          "gi"
          );
      var arrData = [[]];
      var arrMatches = null;
      while (arrMatches = objPattern.exec( strData )){
          var strMatchedDelimiter = arrMatches[ 1 ];
          if (
              strMatchedDelimiter.length &&
              strMatchedDelimiter !== strDelimiter
              ){
              arrData.push( [] );

          }

          var strMatchedValue;
          if (arrMatches[ 2 ]){
              strMatchedValue = arrMatches[ 2 ].replace(
                  new RegExp( "\"\"", "g" ),
                  "\""
                  );
          } else {
              strMatchedValue = arrMatches[ 3 ];
          }
          arrData[ arrData.length - 1 ].push( strMatchedValue );
      }
      return( arrData );
  }
});
