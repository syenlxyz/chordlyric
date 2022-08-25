let metadata = {
  'title': null,
  'artist': null,
  'key': null
}

let content = [];

function getLine(line) {
  let chord = [];
  let lyric = [];

  while (line) {
    let pattern = /[(.*?)]/;
    let result = pattern.exec(line);
    
    if (result && result.index == 0) {
      chord.push(result[1]);
      line = line.replace(match[0], '');
    } else {
      chord.push('');
    }

    if (line) {
      lyric.push(line[0]);
      line = line.slice(1);
    } else {
      lyric.push('');
    }
  }

  item = {
    'chord': chord, 
    'lyric': lyric
  }
  return item;
}

function getLines(line) {
  let pattern = /(.*?)/;
  let result = pattern.exec(line);

  if (result) {
    let directive = result[1];
    if (directive.includes(':')) {
      let key = directive.split(':')[0].trim();
      let value = directive.split(':')[1].trim();

      let metaKeys = Object.keys(metadata)
      if (metaKeys.includes(key)) {
        metadata[key] = value;
      } else if (key == 'section') {
        let item = {[key]: value};
        content.push(item);
      }
    }
  } else {
    line = line.trim();
    if (!line) {
      content.push(line);
    } else {
      let item = getLine(line);
      content.push(item);
    }
  }
}

function runCode() {
  let input = document.getElementById('input');
  
  let text = input.value;
  let lines = text.split('\n');

  lines.map(getLines);

  console.log(metadata);
  console.log(content);
  /*
  let output = document.getElementById('output');
  output.contentDocument.open();
  output.contentDocument.write(content);
  output.contentDocument.close();
  */
}