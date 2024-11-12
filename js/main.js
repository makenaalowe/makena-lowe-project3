// Carousel functionality
let currentIndex = 0;

function showCarouselItem(index) {
    const container = document.querySelector('.carousel-container');
    const itemWidth = 220;  // Width of each carousel item
    container.style.transform = `translateX(-${index * itemWidth}px)`;
}

document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel-container');
    
    // Swiping functionality for the carousel
    let startX = 0;
    let isSwiping = false;

    // Handle touch start event
    carousel.addEventListener('touchstart', (event) => {
        startX = event.touches[0].clientX;
        isSwiping = true;
    });

    // Handle touch move event
    carousel.addEventListener('touchmove', (event) => {
        if (!isSwiping) return;
        
        let touchX = event.touches[0].clientX;
        if (touchX - startX > 50) {
            currentIndex = Math.max(currentIndex - 1, 0);  // Move left
            showCarouselItem(currentIndex);
            isSwiping = false;  // Stop swiping
        } else if (touchX - startX < -50) {
            currentIndex = Math.min(currentIndex + 1, carousel.children.length - 1);  // Move right
            showCarouselItem(currentIndex);
            isSwiping = false;  // Stop swiping
        }
    });

    // Handle touch end event to stop swiping
    carousel.addEventListener('touchend', () => {
        isSwiping = false;
    });

    // Optional: Add button functionality for desktop view
    document.querySelector('.next-btn').addEventListener('click', () => {
        currentIndex = Math.min(currentIndex + 1, carousel.children.length - 1);
        showCarouselItem(currentIndex);
    });

    document.querySelector('.prev-btn').addEventListener('click', () => {
        currentIndex = Math.max(currentIndex - 1, 0);
        showCarouselItem(currentIndex);
    });
});

// Three.js setup for animation
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('threejs-canvas') });

renderer.setSize(window.innerWidth, window.innerHeight);  // Dynamically adjust to full width
camera.position.z = 5;

// Add lighting for better visual effect
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

// Variables for music notes
const musicNotes = [];
const noteCount = 10; // Number of notes

// Initialize music notes with a sphere and cylinder to resemble a musical eighth note
for (let i = 0; i < noteCount; i++) {
    const noteGroup = new THREE.Group();

    // Create the note head
    const headGeometry = new THREE.SphereGeometry(0.15, 12, 12);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0x85a0ad });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 0, 0); // Position the head at the base of the note
    noteGroup.add(head);

    // Create the note stem
    const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 12);
    const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x85a0ad });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.set(0, 0.4, 0); // Position the stem above the head
    noteGroup.add(stem);

    // Set initial position and add to scene
    noteGroup.position.set(
        Math.random() * 4 - 2, 
        Math.random() * 4 - 2, 
        Math.random() * 4 - 2
    );
    scene.add(noteGroup);
    musicNotes.push(noteGroup);
}

// Mouse tracking for music notes
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
    // Normalize mouse position
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update music notes positions
    raycaster.setFromCamera(mouse, camera);
    const intersect = raycaster.ray.direction.multiplyScalar(2.5);
    musicNotes.forEach((noteGroup, i) => {
        // Make each note follow the cursor with slight offset
        noteGroup.position.lerp(intersect, 0.1 + i * 0.01); // Gradual lerp for smooth trailing effect
        noteGroup.position.y += Math.sin(Date.now() * 0.001 + i) * 0.01; // Floating effect
    });
}

// Function to generate a random movement for each note
function generateRandomMovement() {
    return {
        x: Math.random() * 500 - 250,  // Random X offset
        y: Math.random() * 500 - 250,  // Random Y offset
        rotation: Math.random() * 360 // Random rotation in degrees
    };
}

// Function to generate a random color for the notes
function getRandomColor() {
    const colors = ['#d5a8d8', '#b6c5f1', '#85a0ad', '#f1c1b6'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Animation loop for music notes movement
function animateNotes() {
    musicNotes.forEach(note => {
        const randomMovement = generateRandomMovement();
        const randomColor = getRandomColor();

        note.children[0].material.color.set(randomColor); // Change the note head color
        note.children[1].material.color.set(randomColor); // Change the note stem color
        
        note.position.x += randomMovement.x * 0.001;
        note.position.y += randomMovement.y * 0.001;
        note.rotation.z += randomMovement.rotation * 0.001;
    });

    requestAnimationFrame(animateNotes); // Continuously loop the animation
}

// Handle window resize
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Function to animate the scene
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    animateNotes(); // Start the music note animations
}

// Function to create music notes (for DOM-based animation)
function createMusicNotes() {
    const noteContainer = document.createElement('div');
    noteContainer.classList.add('music-note-container');

    for (let i = 0; i < 10; i++) {  // Create 10 notes for example
        const note = document.createElement('div');
        note.classList.add('music-note');
        note.textContent = "♪";  // Use musical note character
        note.style.top = `${Math.random() * 100}%`;  // Random top position
        note.style.left = `${Math.random() * 100}%`; // Random left position
        noteContainer.appendChild(note);
    }

    document.body.appendChild(noteContainer);
}

// Call the function to create the notes when the page loads
window.addEventListener('DOMContentLoaded', createMusicNotes);

// Start animation
animate();
