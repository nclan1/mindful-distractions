
const distractBox = document.getElementById('distractionBox');
// const canvas = document.createElement('canvas');

// canvas.width = 300;
// canvas.height = 300;
// distractBox.appendChild(canvas);
const ctx = distractBox.getContext('2d');


// function to draw the lines
// function drawLines() {
    
//     // ctx.fillRect(0, 0, distractBox.width, distractBox.height); 
//     // ctx.clearRect(0,0, canvas.width, canvas.height);
//     ctx.lineWidth = 30;

//     ctx.beginPath();
//     ctx.moveTo(randomInt(0, distractBox.width), randomInt(0, distractBox.height));
//     ctx.lineTo(randomInt(0, distractBox.width), randomInt(0, distractBox.height));
//     ctx.strokeStyle = '#f7cac9';
//     ctx.lineCap = 'round';
//     ctx.stroke();

// }

function drawLines(targetLength) { 
    let currentLength = 0;
    const startX = randomInt(0, distractBox.width);
    const startY = randomInt(0, distractBox.height);
    const endX = randomInt(0, distractBox.width);
    const endY = randomInt(0, distractBox.height);
    
  
    function animateLine() {
        if (currentLength < targetLength) {
            ctx.lineWidth=20;
            ctx.strokeStyle = "#f7cac9";
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX + (endX - startX) * (currentLength / targetLength), 
                    startY + (endY - startY) * (currentLength / targetLength));
            ctx.lineCap = 'round';
            ctx.stroke();

            currentLength++;
            requestAnimationFrame(animateLine); 
        } else {
            saveCanvas();
        }
    }
  
    animateLine(); // Start the animation

  }
  

function clearLines() {
    ctx.clearRect(0,0, distractBox.width, distractBox.height);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max-min +1) + min);
}

function loadCount() {
    chrome.storage.local.get(['count'], function(result) {
        if (result.count !== undefined) {
            count = result.count;
            document.getElementById("distractCount").innerHTML = count;
            
        }
    });
}

function saveCount() {
    chrome.storage.local.set({count: count}, function() {
        // console.log("count saved: " + count);
    })
}

function saveCanvas() {
    const canvasData = distractBox.toDataURL();
    chrome.storage.local.set({canvasData: canvasData}, function() {
    });
}

function loadCanvas() {
    chrome.storage.local.get(['canvasData'], function(result) {
        if(result.canvasData) {
            const image = new Image();
            image.onload = function() {
                ctx.drawImage(image, 0,0);
            };
            image.src = result.canvasData;
        }
    });
}


let count = 0;

document.getElementById("increase").onclick = function(){
    count+=1;
    document.getElementById("distractCount").innerHTML = count
    drawLines(60);
    saveCount();
}

document.getElementById("reset").onclick = function(){
    count=0;
    document.getElementById("distractCount").innerHTML = count;
    clearLines();
    saveCount();
    saveCanvas();
}

loadCount();
loadCanvas();


