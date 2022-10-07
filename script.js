// Use strict mode
'use strict';

// Send data from chordpro to chordlyric
function ProToLyric() {
  // Assign input and output
  let input = $('#chordpro');
  let output = $('#chordlyric');
  
  // Send data from input to output
  let data = ProToData(input);
  DataToLyric(output, data);

  console.log(data); /// remove later
}

// Generate data from chordpro
function ProToData(input) {
  // Extract lines from input
  let text = input.val();
  let lines = text.split('\n');

  // Create data from lines
  let data = _.map(lines, getItem);
  return data;
}

// Extract directive from line
function getItem(line) {
  // Identify directive pattern
  let pattern = /{(.*?)}/;
  let result = pattern.exec(line);

  // Set up item
  let item = null;
  if (result) {
    // If directive exist
    let directive = result[1];

    // If directive contains both key and value
    if (_.includes(directive, ':')) {
      // Extract key and value
      let split = directive.split(':');
      let key = split[0].trim();
      let value = split[1].trim();
      item = {[key]: value};
    } else {
      // Extract key only
      item = {[directive]: null};
    }
  } else { 
    // If directive does not exist
    line = line.trim();
    // Create line break if line is empty
    if (!line) {
      item = {'line-break': null};
    } else if (line[0] == '#') {
      // Create comment if the line starts with #
      line = line.replaceAll('#').trim();
      item = {'comment': line};
    } else {
      // Create table if otherwise
      let table = getTable(line);
      item = {'table': table};
    }
  }
  // Export item with directive
  return item;
}

// Create table from line
function getTable(line) {
  // Set up chord and lyric array
  let chord = [];
  let lyric = [];

  // Extract chord and lyric until line empty
  while (line) {
    // Identify chord pattern
    let pattern = /\[(.*?)\]/;
    let result = pattern.exec(line);

    // Extract chord if exist at beginning
    if (result && result.index == 0) {
      chord.push(result[1]);
      line = line.replace(result[0], '');
    } else {
      chord.push('');
    }

    // Extract lyric if exist
    if (line) {
      lyric.push(line[0]);
      line = line.slice(1);
    } else {
      lyric.push('');
    }
  }
  
  // Export table with chord and lyric
  let table = {'chord': chord, 'lyric': lyric};
  return table;
}

// Output data to chordlyric
function DataToLyric(output, data) {
  // Clear output content
  let body = output.contents().find('body');
  body.html('');

  // 
  let title = $('<h2></h2>');
  let subtitle = $('<h3></h3>');
  body.append(title, subtitle);

  // 
  _.map(data, function(line) {
    // 
    let key = _.keys(line)[0];
    let value = _.values(line)[0];

    // 
    let metadata = ['title', 'artist', 'key'];
    if (_.includes(metadata, key)) {
      // 
      value = value.replaceAll(' ', '\xa0');
      
      // 
      if (key == 'title') {
        title.prepend(value);
      } else if (key == 'artist') {
        // 
        title.append(' (' + value + ')');
      } else if (key == 'key'){
        // 
        if (subtitle.text()) {
          subtitle.append(' | ' + value);
        } else {
          subtitle.text('Key: ' + value);
        }
      }
    } else {
      // 
      let element = $('<div></div>', {'class': key});
      if (key == 'heading') {
        // 
        value = value.replaceAll(' ', '\xa0');
        element.text('[' + value + ']');
        element.css('font-weight', 'bold');
      } else if (key == 'line-break') {
        // 
        element.html('<br>');
      } else if (key == 'table') {
        // 
        let table = createTable(value);
        element.html(table);
      }
      // 
      body.append(element);
    }
  });
}

// 
function createTable(value) {
  // 
  let chord = createRow(value, 'chord');
  let lyric = createRow(value, 'lyric');
  
  // 
  let table = $('<table></table>');
  table.append(chord, lyric);
  table.css('border-collapse', 'collapse');

  // 
  return table;
}

// 
function createRow(value, key) { 
  // 
  let items = value[key];
  // 
  let row = $('<tr></tr>');
  _.map(items, function(item) {
    // 
    let col = $('<td></td>', {'class': key});
    if (key == 'chord') {
      col.css('color', 'blue');
      col.css('font-weight', 'bold');
    }
    item = item.replace(' ', '\xa0');
    col.text(item);
    col.css('padding', 0);
    
    // 
    row.append(col);
  });
  // 
  return row;
}

// Assign function to button
let btn = $('#btn');
btn.click(ProToLyric);

// Add sample input
let input = $('#chordpro');
let sample = '{title: 我心灵得安宁}\n{artist: Stuart Townend}\n{key: E}\n\n{heading: Verse 1}\n有时[E]享平安[A]如\n江河[E]水平又[B]稳\n有时[E]遇忧伤[A]来 似浪[B]滚\n\n不论[E]何种环[A]境\n主已[E]教导我[B]说\n我心[E]灵得安[A]宁 得安[E]宁\n\n{heading: Chorus}\n当寒[A]冬的风暴[E]起\n当世[F#m]上的思虑[C#m]袭\n我心[A]灵得安[E]宁 得安[B]宁\n\n在正[A]午焦阳[E]下\n主的[F#m]恩典够我[C#m]用\n我心[E]灵得安[A]宁 得安[E]宁\n\n{heading: Verse 2}\n当撒[E]旦试探[A]我\n众试[E]炼也来[B]临\n靠这[E]有福确[A]据 来得[B]胜\n\n因主[E]知我的软[A]弱\n祂知[E]我的惧[B]怕\n甘为[E]我流宝[A]血 救赎[E]我';
input.attr('placeholder', sample);
input.val(sample);