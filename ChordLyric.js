function ChordLyric() {
  chordWidth();
  columnWidth();
}
function chordWidth() {
  Array.from(document.getElementsByClassName('line')).map(function(row) {
    Array.from(row.firstChild.children).map(function(element, index) {
      element.style.width = window.getComputedStyle(row.lastChild.children[index]).getPropertyValue('width');
    });
  });
}
function columnWidth() {
  var column = Array.from(document.getElementsByClassName('chordlyric-column'));
  column.map(function(element) {
    element.style.width = 100 / column.length + '%';
  });
}