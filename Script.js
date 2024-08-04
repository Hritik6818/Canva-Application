
const colorPicker = document.getElementById("colorPicker"); // Color picker element ko select kar rahe hain
const canvasColor = document.getElementById("canvasColor"); // Canvas color change karne ke element ko select kar rahe hain
const fontPicker = document.getElementById("fontPicker"); // Font size picker element ko select kar rahe hain
const canvas = document.getElementById("myCanva"); // Canvas element ko select kar rahe hain
const clearButton = document.getElementById("clear"); // Clear button element ko select kar rahe hain
const saveButton = document.getElementById("save"); // Save button element ko select kar rahe hain
const retrieveButton = document.getElementById("retrieve"); // Retrieve button element ko select kar rahe hain
const undoButton = document.getElementById("undo"); // Undo button element ko select kar rahe hain
const redoButton = document.getElementById("redo"); // Redo button element ko select kar rahe hain
const shapePicker = document.getElementById("shapePicker"); // Shape picker element ko select kar rahe hain
const textInput = document.getElementById("textInput"); // Text input field ko select kar rahe hain
const addTextButton = document.getElementById("addText"); // Add text button element ko select kar rahe hain
const imageUpload = document.getElementById("imageUpload"); // Image upload input field ko select kar rahe hain
const imageWidth = document.getElementById("imageWidth"); // Image width input field ko select kar rahe hain
const imageHeight = document.getElementById("imageHeight"); // Image height input field ko select kar rahe hain
const resizeImageButton = document.getElementById("resizeImage"); // Resize image button element ko select kar rahe hain
const ctx = canvas.getContext('2d'); // Canvas ka 2D context ko get kar rahe hain

let isDrawing = false; // Drawing state ko track karne ke liye flag
let lastX = 0; // Last X coordinate ko store kar rahe hain
let lastY = 0; // Last Y coordinate ko store kar rahe hain
let history = []; // Drawing history ko store karne ke liye array
let redoList = []; // Redo history ko store karne ke liye array
let shape = 'freehand'; // Default shape ko set kar rahe hain
let uploadedImage = null; // Uploaded image ko store karne ke liye variable

function saveState() { // Canvas ka current state save karne ka function
    history.push(canvas.toDataURL()); // Canvas ka data URL ko history array me add kar rahe hain
    if (history.length > 10) history.shift(); // Agar history length 10 se zyada ho jaye to pehla item remove kar do
    redoList = []; // Redo list ko clear kar do
}

function restoreState(state) { // Canvas ka state restore karne ka function
    let img = new Image(); // Naya image object bana rahe hain
    img.src = state; // Image source ko state data URL set kar rahe hain
    img.onload = () => ctx.drawImage(img, 0, 0); // Image load hone par canvas pe draw kar rahe hain
}

colorPicker.addEventListener('change', (e) => { // Color picker change event listener
    ctx.strokeStyle = e.target.value; // Stroke color set kar rahe hain
    ctx.fillStyle = e.target.value; // Fill color set kar rahe hain
});

canvas.addEventListener('mousedown', (e) => { // Canvas mousedown event listener
    isDrawing = true; // Drawing state ko true set kar rahe hain
    lastX = e.offsetX; // Last X coordinate set kar rahe hain
    lastY = e.offsetY; // Last Y coordinate set kar rahe hain
    saveState(); // Current state ko save kar rahe hain
});

canvas.addEventListener('mousemove', (e) => { // Canvas mousemove event listener
    if (isDrawing) { // Agar drawing mode on hai
        ctx.beginPath(); // Naya path shuru kar rahe hain
        if (shape === 'freehand') { // Agar shape freehand hai
            ctx.moveTo(lastX, lastY); // Last coordinates se shuru karte hain
            ctx.lineTo(e.offsetX, e.offsetY); // Current coordinates tak line draw kar rahe hain
        } else if (shape === 'rectangle') { // Agar shape rectangle hai
            ctx.rect(lastX, lastY, e.offsetX - lastX, e.offsetY - lastY); // Rectangle draw kar rahe hain
        } else if (shape === 'circle') { // Agar shape circle hai
            let radius = Math.sqrt(Math.pow((e.offsetX - lastX), 2) + Math.pow((e.offsetY - lastY), 2)); // Radius calculate kar rahe hain
            ctx.arc(lastX, lastY, radius, 0, Math.PI * 2); // Circle draw kar rahe hain
        } else if (shape === 'line') { // Agar shape line hai
            ctx.moveTo(lastX, lastY); // Line start point set kar rahe hain
            ctx.lineTo(e.offsetX, e.offsetY); // Line end point set kar rahe hain
        }
        ctx.stroke(); // Path ko stroke kar rahe hain
        lastX = e.offsetX; // Last X coordinate update kar rahe hain
        lastY = e.offsetY; // Last Y coordinate update kar rahe hain
    }
});

canvas.addEventListener('mouseup', () => { // Canvas mouseup event listener
    isDrawing = false; // Drawing state ko false set kar rahe hain
    if (shape !== 'freehand') saveState(); // Agar shape freehand nahi hai to state save kar rahe hain
});

canvasColor.addEventListener('change', (e) => { // Canvas color change event listener
    ctx.fillStyle = e.target.value; // Canvas fill color set kar rahe hain
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Canvas ko fill kar rahe hain
    saveState(); // Current state ko save kar rahe hain
});

fontPicker.addEventListener('change', (e) => { // Font picker change event listener
    ctx.lineWidth = e.target.value; // Line width set kar rahe hain
});

clearButton.addEventListener('click', () => { // Clear button click event listener
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Canvas ko clear kar rahe hain
    saveState(); // Current state ko save kar rahe hain
});

saveButton.addEventListener('click', () => { // Save button click event listener
    localStorage.setItem('canvasContents', canvas.toDataURL()); // Canvas data URL ko localStorage me save kar rahe hain

    let link = document.createElement('a'); // Naya anchor element bana rahe hain

    link.download = 'my-canvas.png'; // File name set kar rahe hain
    link.href = canvas.toDataURL(); // File URL set kar rahe hain

    link.click(); // Link click kar rahe hain to initiate download
});

retrieveButton.addEventListener('click', () => { // Retrieve button click event listener
    let savedCanvas = localStorage.getItem('canvasContents'); // LocalStorage se saved canvas data get kar rahe hain

    if (savedCanvas) { // Agar saved canvas data available hai
        let img = new Image(); // Naya image object bana rahe hain
        img.src = savedCanvas; // Image source set kar rahe hain
        ctx.drawImage(img, 0, 0); // Canvas pe image draw kar rahe hain
    }
});

undoButton.addEventListener('click', () => { // Undo button click event listener
    if (history.length > 0) { // Agar history array empty nahi hai
        redoList.push(history.pop()); // Last state ko redo list me add kar rahe hain
        if (history.length > 0) { // Agar history me ab bhi items hain
            restoreState(history[history.length - 1]); // Last state ko restore kar rahe hain
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Agar history empty hai to canvas clear kar rahe hain
        }
    }
});

redoButton.addEventListener('click', () => { // Redo button click event listener
    if (redoList.length > 0) { // Agar redo list empty nahi hai
        let state = redoList.pop(); // Last state ko redo list se nikal rahe hain
        restoreState(state); // State ko restore kar rahe hain
        history.push(state); // State ko history me add kar rahe hain
    }
});

shapePicker.addEventListener('change', (e) => { // Shape picker change event listener
    shape = e.target.value; // Selected shape ko set kar rahe hain
});

addTextButton.addEventListener('click', () => { // Add text button click event listener
    const text = textInput.value; // Text input value get kar rahe hain
    if (text) { // Agar text available hai
        ctx.font = `${fontPicker.value}px Arial`; // Font set kar rahe hain
        ctx.fillText(text, canvas.width / 2, canvas.height / 2); // Canvas pe text draw kar rahe hain
        saveState(); // Current state ko save kar rahe hain
    }
});

imageUpload.addEventListener('change', (e) => { // Image upload input change event listener
    const file = e.target.files[0]; // Uploaded file ko get kar rahe hain
    if (file) { // Agar file available hai
        const reader = new FileReader(); // Naya FileReader object bana rahe hain
        reader.onload = (event) => { // FileReader load event listener
            const img = new Image(); // Naya image object bana rahe hain
            img.onload = () => { // Image load event listener
                uploadedImage = img; // Uploaded image ko store kar rahe hain
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Canvas pe image draw kar rahe hain
                saveState(); // Current state ko save kar rahe hain
            };
            img.src = event.target.result; // Image source set kar rahe hain
        };
        reader.readAsDataURL(file); // File ko read as Data URL
    }
});

resizeImageButton.addEventListener('click', () => { // Resize image button click event listener
    if (uploadedImage) { // Agar uploaded image available hai
        const width = parseInt(imageWidth.value) || canvas.width; // Image width ko get kar rahe hain ya default canvas width set kar rahe hain
        const height = parseInt(imageHeight.value) || canvas.height; // Image height ko get kar rahe hain ya default canvas height set kar rahe hain
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Canvas ko clear kar rahe hain
        ctx.drawImage(uploadedImage, 0, 0, width, height); // Image ko nayi dimensions ke saath draw kar rahe hain
        saveState(); // Current state ko save kar rahe hain
    }
});

/*
1.) Event Handling:

1. Question: How do you handle mouse events to enable drawing on the canvas?

Answer: I handle mouse events by adding event listeners for mousedown, mousemove, and mouseup on the canvas element. When the mouse button is pressed down (mousedown), it starts the drawing process by setting isDrawing to true and saving the initial coordinates. During the mousemove event, if isDrawing is true, it continues drawing based on the selected shape (freehand, rectangle, circle, or line). When the mouse button is released (mouseup), it stops the drawing process by setting isDrawing to false and, if a shape other than freehand is drawn, saves the current state of the canvas.

2. Question: Can you explain how the mousedown, mousemove, and mouseup events are used in this project?

Answer:
The mousedown event sets isDrawing to true and records the starting coordinates of the mouse. It also saves the current state of the canvas for undo functionality.
The mousemove event checks if isDrawing is true. If it is, it draws the selected shape on the canvas. For freehand drawing, it draws lines between the last recorded coordinates and the current mouse position. For other shapes, it calculates and draws the shape based on the starting and current mouse positions.
The mouseup event sets isDrawing to false, indicating that the drawing action is complete. It also saves the canvas state if a shape other than freehand is drawn.


2.) State Management:

1. Question: How do you manage the state of the drawing history for undo and redo functionality?

Answer: The state of the drawing history is managed using two arrays: history and redoList. Every time a significant change occurs on the canvas (like starting a new drawing action or applying a shape), the current state of the canvas is saved as a data URL in the history array. The redoList array stores states that can be redone after an undo operation. This ensures that users can undo and redo their actions as needed.

2. Question: What is the purpose of the saveState and restoreState functions?
Answer: The saveState function saves the current state of the canvas by converting it to a data URL and pushing it to the history array. It also clears the redoList to ensure that redo actions are not available after a new action is performed. The restoreState function restores the canvas to a previous state by creating an Image object from a data URL and drawing it onto the canvas. This is used in undo and redo operations to revert the canvas to previous states.


3.) Shape Drawing:

1. Question: How do you handle drawing different shapes like rectangles, circles, and lines?
Answer: The shape drawing is handled based on the shape variable, which is set by the user through the shape picker. During the mousemove event, the canvas context (ctx) is used to draw the selected shape. For freehand drawing, lines are drawn between consecutive mouse positions. For rectangles, the rect method is used to draw a rectangle from the starting to the current mouse position. For circles, the arc method calculates the radius and draws a circle. For lines, a simple line is drawn from the starting to the current mouse position.

2. Question: How is the shape selected and applied during the drawing process?
Answer: The shape is selected using the shape picker (shapePicker) element, which updates the shape variable based on the user's choice. During the drawing process, the selected shape is applied by checking the value of the shape variable in the mousemove event handler. Depending on the value, the corresponding drawing method (freehand, rectangle, circle, or line) is executed to draw the shape on the canvas.


4.) Color and Style:

1. Question: How is the color of the drawing tool and canvas background managed?
Answer: The color of the drawing tool is managed using the color picker (colorPicker) element, which sets the strokeStyle and fillStyle of the canvas context (ctx). The canvas background color is managed using the canvas color picker (canvasColor), which sets the fillStyle of the context and fills the entire canvas with the selected color when changed.

2. Question: How do you change the line width and apply it to the drawings?
Answer: The line width is changed using the font picker (fontPicker) element, which sets the lineWidth property of the canvas context (ctx). This line width is applied to all subsequent drawings on the canvas.


5.) Text and Images:

1. Question: How do you add text to the canvas, and how is the font size managed?
Answer: Text is added to the canvas using the text input field (textInput) and the add text button (addTextButton). When the button is clicked, the value from the text input is retrieved, and the font size is set using the value from the font picker. The text is then drawn on the canvas at a specified position (center of the canvas in this case) using the fillText method of the canvas context.

2. Question: How does the image upload functionality work, and how do you resize an uploaded image on the canvas?
Answer: The image upload functionality works by allowing the user to select an image file through the file input (imageUpload). When a file is selected, it is read as a data URL using a FileReader object. The image is then created and drawn on the canvas using the drawImage method. The image can be resized using the resize image button (resizeImageButton), which takes the width and height values from the input fields (imageWidth and imageHeight) and redraws the image with the new dimensions on the canvas.


6.) Canvas State Persistence:

1. Question: How do you save and retrieve the canvas state using localStorage?
Answer: The canvas state is saved using the localStorage.setItem method, which stores the canvas data URL under a specific key (canvasContents). The state is retrieved using the localStorage.getItem method, which gets the stored data URL. If the retrieved data URL is valid, an Image object is created and drawn onto the canvas using the drawImage method.

2. Question: Can you explain the process of saving the canvas as an image file?
Answer: The canvas is saved as an image file by creating a data URL of the canvas content using the toDataURL method. An anchor (<a>) element is then created with the download attribute set to the desired file name (my-canvas.png) and the href attribute set to the data URL. The anchor element is programmatically clicked to initiate the download of the canvas content as an image file.
Undo and Redo Functionality:

Question: How do the undo and redo buttons work in this project?

Answer: The undo button works by popping the last state from the history array and pushing it onto the redoList array. It then restores the previous state from the history array or clears the canvas if the history is empty. The redo button works by popping the last state from the redoList array, restoring it on the canvas, and pushing it back onto the history array.
Question: What are the history and redoList arrays used for?

Answer: The history array stores the canvas states (as data URLs) in the order they were saved, allowing for undo functionality by reverting to previous states. The redoList array stores states that were undone, allowing for redo functionality by reapplying these states to the canvas.
User Interaction:

Question: How do you handle the clear canvas functionality?

Answer: The clear canvas functionality is handled by adding an event listener to the clear button (clearButton). When clicked, it calls the clearRect method of the canvas context to clear the entire canvas, and then saves the current (cleared) state using the saveState function.
Question: What is the process for picking and applying a new color to the drawing tool?

Answer: The process for picking and applying a new color involves using the color picker (colorPicker). An event listener is added to this element, which updates the strokeStyle and fillStyle properties of the canvas context to the selected color whenever the user picks a new color.
Performance Considerations:

Question: How do you ensure that the canvas drawing performs well, even with multiple shapes and actions?

Answer: Performance is ensured by limiting the history array to a maximum of 10 states, reducing memory usage. The use of efficient drawing methods (like requestAnimationFrame for continuous drawing) and keeping the canvas clear of unnecessary elements also help maintain performance.
Question: Are there any limitations to the number of undo/redo actions you can perform? Why?

Answer: Yes, the number of undo actions is limited by the size of the history array, which stores up to 10 states to manage memory usage efficiently. Similarly, redo actions are limited by the number of states stored in the redoList array.
Advanced Features:

Question: How would you extend this project to support more complex shapes or tools?

Answer: To support more complex shapes or tools, I would add new options in the shape picker and implement additional drawing methods in the mousemove event handler. I could also introduce tools like polygon drawing, bezier curves, or custom brushes by enhancing the event handling logic and updating the canvas context accordingly.
Question: What additional features could be added to enhance the user experience?

Answer: Additional features could include layers for more advanced editing, different brush types and textures, an eraser tool, more text styling options, and better image manipulation tools (like cropping and rotating). Adding keyboard shortcuts for common actions like undo, redo, and clearing the canvas could also improve user experience.
Code Organization:

Question: How is the code structured to handle different functionalities like drawing, state management, and user interactions?

Answer: The code is structured with separate event listeners for handling drawing (mousedown, mousemove, mouseup), state management (saveState, restoreState, undo, redo), and user interactions (color picker, shape picker, image upload). Each functionality is encapsulated within its respective event handler or function, making the code modular and easy to maintain.
Question: What are some best practices you followed while writing this code?

Answer: Some best practices followed include:
Encapsulating related functionality within dedicated functions (like saveState and restoreState).
Using descriptive variable and function names for better readability.
Managing state efficiently to ensure optimal performance.
Adding comments to explain complex logic and enhance code understandability.
Keeping the code modular by separating different functionalities into distinct event handlers and functions.
These answers provide a comprehensive understanding of the canvas drawing project and its various aspects, from event handling and state management to advanced features and best practices.
*/
