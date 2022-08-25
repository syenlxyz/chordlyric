//
'use strict';

//
function ProToData(input, data) {
  //
  let text = input.value;
  let lines = text.split('\n');

  //
  lines.map(function(line) {
    //
    let pattern = /{(.*?)}/;
    let result = pattern.exec(line);

    if (result) {
      //
      let directive = result[1];
      if (directive.includes(':')) {
        //
        let key = directive.split(':')[0].trim();
        let value = directive.split(':')[1].trim();

        //
        let metadata = data['metadata'];
        let metaKeys = Object.keys(metadata);
        if (metaKeys.includes(key)) {
          metadata[key] = value;
        } else if (key == 'section') {
          //
          let content = data['content'];
          let item = {'section': value};
          content.push(item);
        }
      } 
    } else {
      //
      line = line.trim();
      if (!line) {
        let content = data['content'];
        content.push('');
      } else {
        //
        let chord = [];
        let lyric = [];

        //
        while (line) {
          //
          let pattern = /\[(.*?)\]/;
          let result = pattern.exec(line);

          //
          if (result && result.index == 0) {
            chord.push(result[1]);
            line = line.replace(result[0], '');
          } else {
            chord.push('');
          }

          //
          if (line) {
            lyric.push(line[0]);
            line = line.slice(1);
          } else {
            lyric.push('');
          }
        }

        //
        let content = data['content'];
        let item = {'chord': chord, 'lyric': lyric};
        content.push(item);
      }
    }
  });
  return data;
}

//
function DataToLyric(output, data) {
  let head = output.contentDocument.head;
  let body = output.contentDocument.body;
}

//
function ProToLyric() {
  //
  let input = document.getElementById('chordpro');
  let output = document.getElementById('chordlyric');

  //
  let data = {
    'metadata': {
      'title': null,
      'artist': null,
      'key': null,
    },
    'content': []
  }

  //
  data = ProToData(input, data);
  console.log(data);
  DataToLyric(output, data);
}

//
let btn = document.getElementById('btn');
btn.addEventListener('click', ProToLyric);