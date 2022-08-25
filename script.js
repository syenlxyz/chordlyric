let input = document.getElementById('input');

input.addEventListener('keyup', function(event) {
  let output = document.getElementById('output');
  output.contentDocument.open();
  output.contentDocument.write(input.value);
  output.contentDocument.close();
});