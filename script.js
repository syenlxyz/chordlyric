//
'use strict';

//
let metadata = {
  'title': null,
  'artist': null,
  'key': null
}

//
let content = [];

//
function ProToData(input) {
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
        let key = directive.split(':')[0];
        let value = directive.split(':')[1];

        //
        let metaKeys = Object.keys(metadata);
        if (metaKeys.includes(key)) {
          metadata[key] = value;
        } else if (key == 'section') {
          //
          let item = {[key]: value};
          content.push(item);
        }
      } 
    } else {
      //
      line = line.trim();
      if (!line) {
        let item = {'line_break': null};
        content.push(item);
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
        let item = {'chord': chord, 'lyric': lyric};
        content.push(item);
      }
    }
  });
}

//
function ProToLyric() {
  let input = document.getElementById('chordpro');
  let output = document.getElementById('chordlyric');
  ProToData(input);
}

//
let btn = document.getElementById('btn');
btn.addEventListener('click', ProToLyric);