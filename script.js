let metadata = {
  'title': null,
  'artist': null,
  'key': null
}

let data  = [];

let input = document.getElementById('input');
 
let sync = function(event) {
  let text = input.value;
  let lines = text.split('\n');

  lines.map(function(line) {
    let pattern = /{(.*?)}/;
    let result = pattern.exec(line);
    if (result) {
      let directive = result[1]
      if (directive.includes(':')) {
        let key = directive.split(':')[0].trim();
        let value = directive.split(':')[1].trim();

        let keys = Object.keys(metadata);
        if (keys.includes(key)) {
          metadata[key] = value;
        } else {
          let item = {[key]: value}; 
          data.push(item);
        }
      } else {
        ;
      }
    } else {
      line = line.trim()
      if (!line) {
        data.push(line);
      } else {
        getItem(line)
      }
      
    }
  });

  console.log(data);

  /*
  let output = document.getElementById('output');
  output.contentDocument.open();
  output.contentDocument.write(data);
  output.contentDocument.close();
  */
}

let getItem = function(line) {
  let chord = [];
  let lyric = [];
  
  while (line) {
    let pattern = /[(.*?)]/;
    let result = pattern.exec(line);
    
  }
}

input.addEventListener('keyup', sync);