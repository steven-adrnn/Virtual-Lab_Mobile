let array = [];
let steps = [];
let currentStep = 0;
let sortingInterval;
let isPaused = false;
let isDragging = false;
let draggedBar = null;
let dragStartIndex = null;
let dragOffset = { x: 0, y: 0 };
let mousePos = { x: 0, y: 0 };
let targetPos = { x: 0, y: 0 };
let currentPos = { x: 0, y: 0 };
let animationFrameId = null;
let simulationSpeed = 100;
let touchStartY;
let touchStartX;
let lastTouchX;
let lastTouchY;
let isTouch = false;


const algorithmSelect = document.getElementById('algorithm-select');
const arraySizeInput = document.getElementById('array-size');
const generateArrayButton = document.getElementById('generate-array');
const startSimulationButton = document.getElementById('start-simulation');
const pauseSimulationButton = document.getElementById('pause-simulation');
const resetSimulationButton = document.getElementById('reset-simulation');
const sortingCanvas = document.getElementById('sorting-canvas');
const algorithmDescriptionElement = document.getElementById('algorithm-description');
const algorithmComplexityElement = document.getElementById('algorithm-complexity');
const speedSlider = document.getElementById('speed-slider');
const speedValue = document.getElementById('speed-value');
const MAX_SPEED = 200;


function generateRandomArray(size) {
    array = Array.from({length: size}, () => Math.floor(Math.random() * 100) + 1);
    steps = [];
    currentStep = 0;
    drawArray();
}

function drawArray() {
    const ctx = sortingCanvas.getContext('2d');
    ctx.clearRect(0, 0, sortingCanvas.width, sortingCanvas.height);
    
    const barWidth = (sortingCanvas.width / array.length);
    const maxValue = Math.max(...array);
    const scaleFactor = (sortingCanvas.height - 30) / maxValue;

    array.forEach((value, index) => {
        if (index !== dragStartIndex || !isDragging) {
            const barHeight = value * scaleFactor;
            const x = index * barWidth;
            const y = sortingCanvas.height - barHeight;

            ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;

            ctx.fillStyle = '#02a9f7';
            ctx.fillRect(x, y, barWidth - 2, barHeight);

            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            ctx.fillStyle = 'black';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(value, x + barWidth / 2, y - 5);
        }
    });

    if (isDragging && draggedBar !== null) {
        const barHeight = draggedBar.value * scaleFactor;
        
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;

        ctx.fillStyle = '#ff4444';
        ctx.fillRect(
            currentPos.x, 
            currentPos.y, 
            barWidth - 2, 
            barHeight
        );

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            draggedBar.value, 
            currentPos.x + barWidth / 2, 
            currentPos.y - 5
        );
    }
}

function animateSteps() {
    if (sortingInterval) clearInterval(sortingInterval);
    
    sortingInterval = setInterval(() => {
        if (isPaused) {
            clearInterval(sortingInterval);
            return;
        }
        
        if (currentStep < steps.length) {
            array = steps[currentStep].slice(0, array.length);
            let highlightIndices = steps[currentStep].slice(array.length);
            drawArray(highlightIndices);
            currentStep++;
        } else {
            clearInterval(sortingInterval);
            drawArray();
            showCompletionMessage();
        }
    }, simulationSpeed);
}

function convertSliderToSpeed(sliderValue) {
    return MAX_SPEED - sliderValue + 1;
}

function showCompletionMessage() {
    console.log("Sorting selesai!");
    isPaused = false;
    pauseSimulationButton.textContent = 'Pause';
}

function updateProgress(percentage) {
}

function getBarIndexFromPosition(x) {
    const barWidth = sortingCanvas.width / array.length;
    return Math.floor(x / barWidth);
}

function bubbleSort(arr) {
    steps = [];
    let tempArray = [...arr];
    const n = tempArray.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (tempArray[j] > tempArray[j + 1]) {
                [tempArray[j], tempArray[j + 1]] = [tempArray[j + 1], tempArray[j]];
                steps.push([...tempArray]);
            }
        }
    }
    return steps;
}

function insertionSort(arr) {
    steps = [];
    let tempArray = [...arr];
    const n = tempArray.length;
    for (let i = 1; i < n; i++) {
        let key = tempArray[i];
        let j = i - 1;
        while (j >= 0 && tempArray[j] > key) {
            tempArray[j + 1] = tempArray[j];
            j = j - 1;
        }
        tempArray[j + 1] = key;
        steps.push([...tempArray]);
    }
    return steps;
}

function quickSort(arr) {
    steps = [];
    let tempArray = [...arr];
    
    function partition(arr, low, high) {
        let pivot = arr[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            steps.push([...arr, j, high]); 
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                steps.push([...arr, i, j]); 
            }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        steps.push([...arr, i + 1, high]);
        return i + 1;
    }
    
    function sort(arr, low, high) {
        if (low < high) {
            let pi = partition(arr, low, high);
            sort(arr, low, pi - 1);
            sort(arr, pi + 1, high);
        }
    }
    
    sort(tempArray, 0, tempArray.length - 1);
    return steps;
}

function mergeSort(arr) {
    steps = [];
    let tempArray = [...arr];
    
    function merge(arr, l, m, r) {
        let n1 = m - l + 1;
        let n2 = r - m;
        let L = new Array(n1);
        let R = new Array(n2);
        for (let i = 0; i < n1; i++) {
            L[i] = arr[l + i];
        }
        for (let j = 0; j < n2; j++) {
            R[j] = arr[m + 1 + j];
        }
        let i = 0;
        let j = 0;
        let k = l;
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }
            k++;
            steps.push([...arr]);
        }
        while (i < n1) {
            arr[k] = L[i];
            i++;
            k++;
            steps.push([...arr]);
        }
        while (j < n2) {
            arr[k] = R[j];
            j++;
            k++;
            steps.push([...arr]);
        }
    }
    
    function sort(arr, l, r) {
        if (l < r) {
            let m = l + parseInt((r - l) / 2);
            sort(arr, l, m);
            sort(arr, m + 1, r);
            merge(arr, l, m, r);
        }
    }
    
    sort(tempArray, 0, tempArray.length - 1);
    return steps;
}

function startSimulation() {
    if (isPaused) {
        isPaused = false;
        animateSteps();
        return;
    }

    clearInterval(sortingInterval);
    currentStep = 0;
    isPaused = false;
    
    const algorithm = algorithmSelect.value;
    let tempArray = [...array];
    
    switch (algorithm) {
        case 'bubble':
            steps = bubbleSort(tempArray);
            break;
        case 'insertion':
            steps = insertionSort(tempArray);
            break;
        case 'quick':
            steps = quickSort(tempArray);
            break;
        case 'merge':
            steps = mergeSort(tempArray);
            break;
    }
    
    animateSteps();
    updateAlgorithmInfo(algorithm);
}

function updateAlgorithmInfo(algorithm) {
    switch (algorithm) {
        case 'bubble':
            algorithmDescriptionElement.textContent = 'Bubble Sort membandingkan elemen berdekatan dan menukarnya jika tidak dalam urutan yang benar.';
            algorithmComplexityElement.textContent = 'Kompleksitas Waktu: O(n^2)';
            break;
        case 'insertion':
            algorithmDescriptionElement.textContent = 'Insertion Sort membandingkan elemen berdekatan dan menukarnya jika tidak dalam urutan yang benar.';
            algorithmComplexityElement.textContent = 'Kompleksitas Waktu: O(n^2)';
            break;
        case 'quick':
            algorithmDescriptionElement.textContent = 'Quick Sort memilih pivot dan mempartisi array menjadi dua bagian.';
            algorithmComplexityElement.textContent = 'Kompleksitas Waktu: O(n log n)';
            break;
        case 'merge':
            algorithmDescriptionElement.textContent = 'Merge Sort membagi array menjadi dua bagian dan menggabungkannya kembali.';
            algorithmComplexityElement.textContent = 'Kompleksitas Waktu: O(n log n)';
            break;
    }
}

function pauseSimulation() {
    if (sortingInterval) {
        clearInterval(sortingInterval);
        sortingInterval = null;
    } else {
        animateSteps();
    }
}

generateArrayButton.addEventListener('click', () => generateRandomArray(parseInt(arraySizeInput.value)));

startSimulationButton.addEventListener('click', startSimulation);

pauseSimulationButton.addEventListener('click', () => {
    isPaused = !isPaused;
    
    if (isPaused) {
        clearInterval(sortingInterval);
    } else {
        animateSteps();
    }
});

resetSimulationButton.addEventListener('click', () => {
    clearInterval(sortingInterval);
    isPaused = false;
    currentStep = 0;
    pauseSimulationButton.textContent = 'Pause';
    generateRandomArray(parseInt(arraySizeInput.value));
});

function resizeCanvas() {
    const canvas = document.getElementById('sorting-canvas');
    canvas.width = Math.min(800, window.innerWidth - 40);
    canvas.height = 400;
    drawArray();
}



sortingCanvas.addEventListener('mousedown', (e) => {
    if (!isPaused) {
        const rect = sortingCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        dragStartIndex = getBarIndexFromPosition(x);
        if (dragStartIndex >= 0 && dragStartIndex < array.length) {
            draggedBar = { value: array[dragStartIndex], index: dragStartIndex };
            isDragging = true;
            mousePos = { x, y };
            dragOffset = { x: x - (dragStartIndex * (sortingCanvas.width / array.length)), y: y - (sortingCanvas.height - (array[dragStartIndex] * (sortingCanvas.height - 30) / Math.max(...array))) };
            targetPos = { x: x - dragOffset.x, y: y - dragOffset.y };
            currentPos = { x: x - dragOffset.x, y: y - dragOffset.y };
            animate();
        }
    }
});

function animate() {
    if (!isDragging) return;

    // Smooth interpolation untuk pergerakan
    const easing = isTouch ? 0.4 : 0.2; // Lebih responsif untuk touch
    
    currentPos.x += (targetPos.x - currentPos.x) * easing;
    currentPos.y += (targetPos.y - currentPos.y) * easing;

    drawArray();
    
    animationFrameId = requestAnimationFrame(animate);
}

sortingCanvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const rect = sortingCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePos = { x, y };
    targetPos = { x: x - dragOffset.x, y: y - dragOffset.y };
    
    currentPos.x = targetPos.x;
    currentPos.y = sortingCanvas.height - (draggedBar.value * (sortingCanvas.height - 30) / Math.max(...array));
    
    drawArray();
});

sortingCanvas.addEventListener('mouseup', () => {
    if (isDragging) {
        const newIndex = getBarIndexFromPosition(targetPos.x);
        
        if (newIndex >= 0 && newIndex < array.length) {
            array.splice(draggedBar.index, 1);
            array.splice(newIndex, 0, draggedBar.value);
        }

        resetDragVariables();
        drawArray();
    }
});

function resetDragVariables() {
    isDragging = false;
    draggedBar = null;
    dragStartIndex = null;
    dragOffset = { x: 0, y: 0 };
    mousePos = { x: 0, y: 0 };
    targetPos = { x: 0, y: 0 };
    currentPos = { x: 0, y: 0 };
    cancelAnimationFrame(animationFrameId);
}

sortingCanvas.addEventListener('touchstart', handleTouchStart, { passive: false });
sortingCanvas.addEventListener('touchmove', handleTouchMove, { passive: false });
sortingCanvas.addEventListener('touchend', handleTouchEnd);

function handleTouchStart(e) {
    e.preventDefault();
    isTouch = true;
    const rect = sortingCanvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    touchStartX = x;
    touchStartY = y;
    lastTouchX = x;
    lastTouchY = y;
    
    dragStartIndex = getBarIndexFromPosition(x);
    if (dragStartIndex >= 0 && dragStartIndex < array.length) {
        draggedBar = { value: array[dragStartIndex], index: dragStartIndex };
        isDragging = true;
        mousePos = { x, y };
        dragOffset = { 
            x: x - (dragStartIndex * (sortingCanvas.width / array.length)), 
            y: y - (sortingCanvas.height - (array[dragStartIndex] * (sortingCanvas.height - 30) / Math.max(...array)))
        };
        targetPos = { x: x - dragOffset.x, y: y - dragOffset.y };
        currentPos = { ...targetPos };
        
        requestAnimationFrame(animate);
    }
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!isDragging || !isTouch) return;

    const rect = sortingCanvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    // Calc delta movement untuk smooth animation
    const deltaX = x - lastTouchX;
    const deltaY = y - lastTouchY;
    
    // Update posisi dengan interpolasi
    targetPos.x += deltaX;
    targetPos.y = sortingCanvas.height - (draggedBar.value * (sortingCanvas.height - 30) / Math.max(...array));
    
    // Update last position
    lastTouchX = x;
    lastTouchY = y;
    
    mousePos = { x, y };
}

function handleTouchEnd(e) {
    if (isDragging && isTouch) {
        const newIndex = getBarIndexFromPosition(targetPos.x);
        
        if (newIndex >= 0 && newIndex < array.length && newIndex !== dragStartIndex) {
            // Animate the bar dropping into place
            array.splice(dragStartIndex, 1);
            array.splice(newIndex, 0, draggedBar.value);
        }
        
        isTouch = false;
        resetDragVariables();
        drawArray();
    }
}

speedSlider.addEventListener('input', function() {
    if (!isDragging) {
        const sliderValue = parseInt(this.value);
        simulationSpeed = convertSliderToSpeed(sliderValue);
        
        updateSpeedDisplay(sliderValue);
        
        if (sortingInterval) {
            clearInterval(sortingInterval);
            animateSteps();
        }
    }
});

function updateSpeedDisplay(sliderValue) {
    let speedText;
    if (simulationSpeed > 150) {
        speedText = "Sangat Lambat";
    } else if (simulationSpeed > 100) {
        speedText = "Lambat";
    } else if (simulationSpeed > 50) {
        speedText = "Sedang";
    } else if (simulationSpeed > 20) {
        speedText = "Cepat";
    } else {
        speedText = "Sangat Cepat";
    }
    
    speedValue.textContent = speedText;
    
    const percentage = (sliderValue / MAX_SPEED) * 100;
    speedSlider.style.background = `linear-gradient(to right, #007bff ${percentage}%, #e9ecef ${percentage}%)`;
}

speedSlider.addEventListener('mouseover', function() {
    this.style.transform = 'scale(1.02)';
});

speedSlider.addEventListener('mouseout', function() {
    this.style.transform = 'scale(1)';
});

window.addEventListener('resize', resizeCanvas);


resizeCanvas();
generateRandomArray(parseInt(arraySizeInput.value));