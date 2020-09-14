// Setup input fields default values and behavior
function preloadInput(){
  // Set up default values
  var example = {};
  example["input-title"] = "Song Title";
  example["input-artist"] = "Artist";
  example["input-key"] = "Key";
  example["input-content"] = document.getElementById("example").innerHTML;
  // Set up input interaction for every default value
  for (item in example) {
    inputInteraction(item, example[item]);
  }
}

// Set up input interaction behavior
function inputInteraction(id, value){
  document.getElementById(id).innerHTML = value; // Preload the empty field with default value
  document.getElementById(id).classList.add("translucent"); // Make the default value translucent
  // Add an event listener when the element comes into focus
  document.getElementById(id).addEventListener("focus", function(event) {
    // If the field contains default values
    if (document.getElementById(id).innerHTML == value) {
      document.getElementById(id).innerHTML = ""; // Clear up everything in the field
      document.getElementById(id).classList.remove("translucent"); // Makes font completely visible
    }
  });
  // Add an event listener when the element comes out of focus
  document.getElementById(id).addEventListener("focusout", function(event) {
    // If the field is empty
    if (document.getElementById(id).innerHTML == "") {
      document.getElementById(id).innerHTML = value; // Replace the empty string with default value
      document.getElementById(id).classList.add("translucent"); // Make the default value translucent
    }
  });
}

// Setup data processing from input to output
function setupOutput() {
  // Copy song title from input to output on keyup
  document.getElementById("input-title").addEventListener("keyup", function (event) {
    document.getElementById("output-title").innerHTML = document.getElementById("input-title").innerHTML;
  });
  // Copy artist name from input to output on keyup
  document.getElementById("input-artist").addEventListener("keyup", function (event) {
    document.getElementById("output-artist").innerHTML = document.getElementById("input-artist").innerHTML;
  });
  // Copy key info from input to output on keyup
  document.getElementById("input-key").addEventListener("keyup", function (event) {
    // Display nothing if there is no key input
    if (document.getElementById("input-key").innerHTML == "") {
      document.getElementById("output-key").innerHTML = "";
    // Otherwise display the key information to the output
    } else { 
      document.getElementById("output-key").innerHTML = "Key: " + document.getElementById("input-key").innerHTML;
    }
  });
  // Convert raw text data into chordlyric format and display to output on keyup
  document.getElementById("input-content").addEventListener("keyup", getOutput);
}

// Disable keypress text edit feature of the main output window
function disableOutputEdit() {
  document.getElementById("main-output").onkeydown = () => false; // Turn off keydown feature
  document.getElementById("main-output").onkeypress = () => false; // Turn off keydown feature
  document.getElementById("main-output").onkeyup = () => false; // Turn off keydown feature
}

// Highlight border when moouseover and undo when mouseout
function enableMouseHover() {
  // Only applied to the elements with box class
  for (element of document.getElementsByClassName("box")) {
    // Highlight the elements when the mouse cursor hovers over
    element.addEventListener("mouseover", function(event) {
      this.classList.add("hover"); // Add hover to the class list
    });
    // Undo highlight wwhen the mouse cursor moves away
    element.addEventListener("mouseout", function(event) {
      this.classList.remove("hover");
    });
  }
}

// Load data into chordlyric editor
function getOutput(){
  // Load data from input content
  var input = getInput();
  // Create a placeholder for chordlyric display
  var display = document.createElement("div");
  // Map the following function to every object in the input
  input.map(function(line) {
    var property = Object.keys(line)[0]; // Identify object property
    var element = document.createElement("div"); // Create an empty div element
    element.setAttribute("class", property); // Set class to its corresponding property
    if (property == "section") { // If the object is a section
      var content = document.createTextNode(line["section"]); // Create a text node for section
    } else if (property == "break") { // If the object is a line break
      var content = document.createElement("br"); // Create a br element
    } else if (property == "line") { // If the object is a line with chord and lyric
      var content = getContent(line); // Create a table for chord lyric line
    }
    element.appendChild(content); // Append content to element
    display.appendChild(element); // Append element to display
  })
  // Set id name for all table elements
  var index = 0; // Initialize index with 0
  for (item of display.getElementsByClassName("table")) { // Loop through all tables
    item.setAttribute("id", index); // Set table id with index
    index++; // Update index by adding one
  }
  // Return the chordlyric display back to where it is called
  document.getElementById("output-content").innerHTML = display.innerHTML;
}

// Read text input and create a javascript array
function getInput(){
  // Create a placeholder for javascript array
  var content = [];
  // Apply data input function for every line
  document.getElementById("input-content").innerText // Load text string from input
          .split("\n\n").join("\n") // Collapse double newlines into single newlines
          .split("\n").map(function(line) { 
    var pattern = /\[(.*?)\]/; // Regex pattern for identifying string enclosed by brackets
    if (pattern.test(line)){ // If bracket is identified 
      content.push({"section": pattern.exec(line)[1]}); // Extract the content between brackets and push to content
    } else if (line.trim() == "") { // If the line is an empty string or any whitespace character
      content.push({"break": null}); // Push to content as line break
    } else { // Every other cases will be treated as lyric
      var lyric = line.split(""); // Tokenize the string into an array of single characters
      var chord = chord ? chord : new Array(lyric.length).fill(""); // Assign an empty chord to each character
      content.push({"line": {"chord": chord, "lyric": lyric}}); // Push chord and lyric to content as line
    }
  });
  // Return the content back to where it is called
  return content;
}

// Create a table from chord and lyric line
function getContent(object) {
  // Create a placeholder for chord lyric table
  var table = document.createElement("table");
  table.setAttribute("class", "table"); // Set class to table
  table.setAttribute("cellspacing", "0"); // Remove spacing between cells
  table.setAttribute("cellpadding", "0"); // Remove padding within cells
  // Create a row for each object property (i.e. chord and lyric)
  for (property in object["line"]) {
    var row = document.createElement("tr"); // Create a placeholder for table rows
    row.setAttribute("class", property); // Set class to corresponding property (chord or lyric)
    // Create a column for each value of the corresponding object property
    for (var item of object["line"][property]){
      var col = document.createElement("td"); // Create a placeholder for table columns in the row
      col.innerHTML = item.replace(" ", "&nbsp;"); // Replace single whitespace with HTML non breaking space
      row.appendChild(col); // Append columns to the current row
    }
    table.appendChild(row); // Append rows to the table placeholder 
  }
  // Return the chordlyric table back to where it is called
  return table; 
}

 // Turn on chord lyric mode
 function enableChordLyric(){
  // Turn on output edit feature when output in focus
  document.getElementById("main-output").addEventListener("focus", function(event) {
    document.addEventListener("click", mouseclickSelection);
    document.addEventListener("keydown", keypressSelection);
    document.addEventListener("keydown", keypressInput);
    document.addEventListener("keydown", keypressMovement);
  });
}

 // Turn off chord lyric mode
function disableChordLyric(){
  // Turn off output edit feature when output is out of focus (which means input)
  document.getElementById("main-output").addEventListener("focusout", function(event) {
    document.removeEventListener("click", mouseclickSelection);
    document.removeEventListener("keydown", keypressSelection);
    document.removeEventListener("keydown", keypressInput);
    document.removeEventListener("keydown", keypressMovement);
  });
}

// Determine mouse click selection behavior
function mouseclickSelection(event) {
  var clicked = event.target; // Get details of the clicked element
  // If a chord lyric table cell is clicked
  if (clicked.nodeName == "TD"){ 
    selected = clicked.parentElement.parentElement // Identify the parent table of the clicked element
                      .firstChild.children[clicked.cellIndex]; // Find the chord cell with the same index as the clicked element
    // If the clicked cell does not have the class selected
    if (selected.classList.value == ""){ 
      if (!event.ctrlKey && !event.shiftKey) deselectAll(); // Deselect everything if ctrl key is not pressed
      selected.classList.add("selected"); // Select a new element
      rowIndex = parseInt(selected.parentElement.parentElement.parentElement.id); // Set table id as row index
      colIndex = selected.cellIndex; // Set cell index as column index
    // If the clicked cell has the class selected
    } else { 
      selected.classList.remove("selected"); // Deselect if the element is already selected
    }
  // If click elsewhere
  } else { 
    selected = rowIndex = colIndex = null; // Set the current selected, row and column index to null
    deselectAll(); // Deselect everything
  }
}

// Determine keypress selection behavior
function keypressSelection(event) {
  if (event.ctrlKey) { // If Ctrl key is pressed
    // Remove keypress editing and add back immediately (to avoid typing while selecting everything) 
    document.removeEventListener("keydown", keypressInput); 
    document.addEventListener("keydown", keypressInput); 
    if (event.key == "a") { // If "a" is pressed after pressing Ctrl
      event.preventDefault(); // Prevent the default select all function
      selectAll(); // Select all chord cells
    }
  } else if (event.key == "Escape") { // If Escape key is pressed
    selected = rowIndex = colIndex = null; // Set the current selected, row and column index to null
    deselectAll(); // Deselect everything
  }
}

// Determine keypress behavior when editing
function keypressInput(event){
  var pattern = /[A-Za-z0-9#\s]/; // Allow only alphanumeric, whitespace and # symbol input
  if (event.key.match(pattern)) { // Don't do anything if Ctrl key is pressed or regex pattern does not match
    for (element of document.getElementsByClassName("selected")) { // Only the elements with selected class will be edited
      if (event.key.length == 1) { // If the input only has one character (to avoid unwanted keypress input)
        element.innerHTML += event.key // Add one character to the end of the string
                                  .split(" ").join("&nbsp;"); // Replace whitespace with HTML nonbreaking space
      } else if (event.key == "Backspace") { // If Backspace key is pressed
        var str = element.innerHTML.split("&nbsp;").join(" "); // Convert HTML nonbreaking space back into normal whitespace
        element.innerHTML = str.slice(0, str.length - 1).split(" ").join("&nbsp;"); // Remove the last character of the string
      } else if (event.key == "Delete") { // If Delete key is pressed
        element.innerHTML = ""; // Remove everything in the string
      }
    }
  }
}

// Determine arrow keypress movement
function keypressMovement(event) { 
  // Create a few placeholders movement parameters
  var rowMax, colMax, nextRow;
  // Use switch statement to define movement parameters
  switch(event.key) {
    case "ArrowLeft": // If ArrowLeft key is pressed
      colIndex = colIndex - 1 < 0 ? 0 : colIndex - 1; // Move to the left until hitting the left limit
      break;
    case "ArrowRight": // If ArrowRight key is pressed
      colMax = selected.parentElement.children.length - 1; // Find the rightmost index of the current row
      colIndex = colIndex + 1 > colMax ? colMax : colIndex + 1; // Move to the right until hitting the right limit
      break;
    case "ArrowUp": // If ArrowUp key is pressed
      rowIndex = rowIndex - 1 < 0 ? 0 : rowIndex - 1; // Move upward until hitting the top
      break;
    case "ArrowDown": // If ArrowDown key is pressed
      rowMax = document.getElementsByClassName("table").length - 1; // Find the index of the lowest row
      rowIndex = rowIndex + 1 > rowMax ? rowMax : rowIndex + 1; // Move downward until hitting the bottom
      break;
  }
  // Update details of the selected element
  if (event.key == "ArrowLeft" || event.key == "ArrowRight") { // If moving horizontally
    selected = selected.parentElement.children[colIndex]; // Move to the new index in the same row
  } else if (event.key == "ArrowUp" || event.key == "ArrowDown") { // If moving vertically
    nextRow = document.getElementById(rowIndex).firstChild.firstChild.children; // Find the next row based on the new parameters
    colMax = nextRow.length - 1; // Find the rightmost index of the new row
    colIndex = colIndex > colMax ? colMax : colIndex; // Make sure that the index never gets out of bound
    selected = nextRow[colIndex]; // Move to the new position
  }
  // Deselect everything and select the new element
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
    deselectAll(); // Deselect everything
    selected.classList.add("selected"); // Highlight the new selected element
  } 
}

// Select everything
function selectAll() {
  for (var parent of document.getElementsByClassName("chord")){ // Loop through every chord class row
    for (var child of parent.children){ // Loop through every column in the row
      child.classList.add("selected"); // Add selected to the class list
    }
  }
}

// Deselect everything
function deselectAll() {
  for (var parent of document.getElementsByClassName("chord")){ // Loop through every chord class row
    for (var child of parent.children){ // Loop through every column in the row
      child.classList.remove("selected"); // Remove selected from the class list
    }
  }
}