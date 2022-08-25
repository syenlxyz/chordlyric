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
        content.push('\n');
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
  //
  let head = output.contentDocument.head;
  let body = output.contentDocument.body;

  //
  let metadata = data['metadata'];
  let h2 = document.createElement('h2');
  h2.innerText = metadata['title'];
  body.appendChild(h2);

  //
  let p = document.createElement('p');
  p.innerText = metadata['artist'] + ' | Key:' + metadata['key'];
  body.appendChild(p);

  // 
  let content = data['content'];
  content.map(function(item) {
    if (item) {
      let keys = Object.keys(item);
      if (keys.includes('section')) {
        let h4 = document.createElement('h4');
        h4.innerText = item['section'];
        body.appendChild(h4);
      } else {
        let table = document.createElement('table');
      }
    } else {
      let br = document.createElement('br');
      body.appendChild(br);
    }
  });
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