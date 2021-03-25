function ProToLyric() {
  var Song = ProToData();
  DataToLyric(Song);
}
function ProToData() {
  var data = {metadata: {}, chordlyric: []};
  var input = document.getElementById('chordpro').innerText.split('\n\n').join('\n'); 
  var column = [];
  input.split('\n').map(function(line) {
    var line = line.trim();
    var directive = /\{(.*?)\}/.exec(line);
    if (directive) {
      var name = directive[1].split(':')[0].trim();
      var value = directive[1].split(':')[1].trim();
      if (name == 'section') {
        column.push({'section': value});
      } else if (name == 'break' && value == 'column') {
        data.chordlyric.push(column);
        column = [];
      } else {
        data.metadata[name] = value;
      }
    } else if (line == '') {
      column.push({'line-break': ''});
    } else {
      var chord = []
      var lyric = []
      while (line) {
        var match = /\[(.*?)\]/.exec(line);
        if (match && match.index == 0) {
          chord.push(match[1])
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
      column.push({'line': {'chord': chord, 'lyric': lyric}});
    }
  });
  data.chordlyric.push(column);
  return data;
}
function DataToLyric(data) {
  var header = document.createElement('div');
  header.setAttribute('class', 'chordlyric-header');
  for (var property in data['metadata']) {
    var element = document.createElement('div');
    element.setAttribute('class', property);
    var value = property == 'key'? data['metadata'][property] + ' Key': data['metadata'][property];
    element.innerText = value;
    header.appendChild(element);
  }
  var content = document.createElement('div');
  content.setAttribute('class', 'chordlyric-content');
  data['chordlyric'].map(function(item) {
    var column = document.createElement('div');
    column.setAttribute('class', 'chordlyric-column');
    item.map(function(property) {
      var name = Object.keys(property)[0];
      var element = document.createElement('div');
      element.setAttribute('class', name);
      if (name == 'section') {
        element.innerText = property['section'];
      } else if (name == 'line-break') {
        element.innerHTML = '<br>';
      } else {
        for (var group in property['line']) {
          var row = document.createElement('div');
          property['line'][group].map(function(cell) {
            var value = document.createElement('div');
            value.setAttribute('class', group);
            value.innerHTML = !cell.trim() ? '&nbsp;': cell;
            row.appendChild(value);
          });
          element.appendChild(row);
        }
      }
      column.appendChild(element);
    });
    content.appendChild(column);
  });
  var chordlyric = document.getElementById('chordlyric');
  chordlyric.innerHTML = '';
  chordlyric.appendChild(header);
  chordlyric.appendChild(content);
}