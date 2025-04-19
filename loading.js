
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // Set canvas size to full window size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Update canvas size if window is resized
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Re-initialize shapes and stars on resize for better distribution
    initShapes();
    initStars();
    // Update center coordinates
    cx = canvas.width / 2;
    cy = canvas.height / 2;
    // Reset animation start time on resize to restart progress bar
    animationStartTime = null;
  });

  let cx = canvas.width / 2;
  let cy = canvas.height / 2;

  // Existing rings animation
  const rings = [
    { radius: 80, angle: 0, speed: 0.015, hueOffset: 0 },
    { radius: 60, angle: 0, speed: -0.02, hueOffset: 120 },
    { radius: 40, angle: 0, speed: 0.025, hueOffset: 240 }
  ];
  const trailLength = 1.6 * Math.PI;

  function hslToColor(hue) {
    return `hsl(${hue % 360}, 100%, 70%)`;
  }

  function drawRing(x, y, radius, angle, hue) {
    const color = hslToColor(hue);
    ctx.beginPath();
    ctx.arc(x, y, radius, angle, angle + trailLength);
    ctx.strokeStyle = color;
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.shadowColor = color;
    ctx.shadowBlur = 50;
    ctx.stroke();
  }

  // --- Background Animation ---
  let color = { r: 50, g: 50, b: 255 }; // Start with a blue-ish color
  let targetColor = { r: 128, g: 0, b: 128 }; // Target purple color
  const colorTransitionSpeed = 0.005; // Speed of color change

  function updateBackground() {
    // Smoothly transition color components
    color.r += (targetColor.r - color.r) * colorTransitionSpeed;
    color.g += (targetColor.g - color.g) * colorTransitionSpeed;
    color.b += (targetColor.b - color.b) * colorTransitionSpeed;

    // Switch target color when close enough
    if (Math.abs(targetColor.r - color.r) < 1 &&
        Math.abs(targetColor.g - color.g) < 1 &&
        Math.abs(targetColor.b - color.b) < 1) {
      if (targetColor.r > color.r) { // Was blue, switch to purple
        targetColor = { r: 50, g: 50, b: 255 };
      } else { // Was purple, switch to blue
         targetColor = { r: 128, g: 0, b: 128 };
      }
    }

    // Draw the background
    ctx.fillStyle = `rgb(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // --- Floating Shapes (Circles and Squares) ---
  const shapes = [];
  const numberOfShapes = 50; // Decreased number of shapes

  function initShapes() {
    shapes.length = 0; // Clear existing shapes
    for (let i = 0; i < numberOfShapes; i++) {
      const isCircle = Math.random() > 0.5; // Randomly choose circle or square
      const size = isCircle ? (Math.random() * 8 + 4) : (Math.random() * 12 + 6); // Slightly smaller sizes
      const speed = Math.random() * 0.4 + 0.1; // Slightly slower speed
      const angle = Math.random() * Math.PI * 2;

      shapes.push({
        type: isCircle ? 'circle' : 'square',
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: size,
        speed: speed,
        angle: angle,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        alpha: Math.random() * 0.6 + 0.2, // Partial transparency
        rotation: Math.random() * Math.PI * 2, // Initial rotation for squares
        rotationSpeed: isCircle ? 0 : (Math.random() * 0.015 - 0.0075) // Rotate squares slower
      });
    }
  }

  function updateAndDrawShapes() {
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)"; // Color of the shapes with more transparency
    ctx.shadowColor = "rgba(255, 255, 255, 0.3)"; // Softer shadow
    ctx.shadowBlur = 8;

    shapes.forEach(shape => {
      // Update position
      shape.x += shape.dx;
      shape.y += shape.dy;

      // Bounce off edges
      if (shape.x < 0 || shape.x > canvas.width) shape.dx *= -1;
      if (shape.y < 0 || shape.y > canvas.height) shape.dy *= -1;

      // Update rotation for squares
      if (shape.type === 'square') {
          shape.rotation += shape.rotationSpeed;
      }

      // Draw shape
      ctx.save(); // Save current context state
      ctx.translate(shape.x, shape.y); // Move to the shape's position
      ctx.rotate(shape.rotation); // Apply rotation

      ctx.globalAlpha = shape.alpha; // Apply individual shape transparency

      if (shape.type === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, shape.size, 0, Math.PI * 2);
        ctx.fill();
      } else { // Square
        ctx.fillRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
      }

      ctx.restore(); // Restore context state
    });
     ctx.shadowBlur = 0; // Reset shadow blur
     ctx.globalAlpha = 1; // Reset global alpha
  }

    // --- Filled Stars ---
    const stars = [];
    const numberOfStars = 300; // Increased for "filled all over" effect

    function initStars() {
        stars.length = 0; // Clear existing stars
        for (let i = 0; i < numberOfStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                alpha: Math.random(),
                delta: (Math.random() * 0.01) + 0.002 // Slower twinkling
            });
        }
    }


    function drawStars() {
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"; // Star color with slight transparency
        ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
        ctx.shadowBlur = 7; // Increased blur for a glow effect

        stars.forEach((star) => {
            star.alpha += star.delta;
            if (star.alpha <= 0 || star.alpha >= 1) star.delta = -star.delta;

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.globalAlpha = star.alpha; // Apply individual star twinkling
            ctx.fill(); // Fill the stars
        });
         ctx.shadowBlur = 0; // Reset shadow blur
         ctx.globalAlpha = 1; // Reset global alpha
    }

    // --- Loading Text and Progress Bar ---
    const preloaderDuration = 5000; // 5 seconds
    let animationStartTime = null;

    function drawLoadingText() {
        ctx.font = "italic 30px cursive"; // Stylish cursive font (browser fallback)
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)"; // White color with some transparency
        ctx.textAlign = "center"; // Center the text horizontally
        ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
        ctx.shadowBlur = 10;

        // Position the text above the progress bar
        const textY = cy + 120; // Adjust position as needed
        ctx.fillText("Loading...", cx, textY);

        ctx.shadowBlur = 0; // Reset shadow blur
    }

    // Helper function to draw a rounded rectangle
function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill(); // Use fill to draw the shape
}

function drawProgressBar(progress) {
    const barWidth = 200;
    const barHeight = 8;
    const barX = cx - barWidth / 2;
    const barY = cy + 140; // Position below the loading text
    const cornerRadius = barHeight / 2; // Make the radius half of the height for perfect semi-circles on the ends

    // Draw the background of the progress bar
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    roundRect(ctx, barX, barY, barWidth, barHeight, cornerRadius);

    // Draw the filled part of the progress bar
    const filledWidth = barWidth * progress;
    if (filledWidth > 0) { // Only draw the filled part if there is progress
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"; // White color for the filled bar
        ctx.shadowColor = "rgba(255, 255, 255, 0.7)";
        ctx.shadowBlur = 15; // Glow effect for the progress bar

        // Draw the filled rounded rectangle.
        // We need to adjust how the rounded rectangle is drawn for the filled part
        // to handle the case where it's not a full bar.
        // A simpler approach is to draw the filled bar as a rounded rectangle
        // and let the background rounded rectangle handle the full shape.
        // For a partial bar with rounded ends, it's more complex.
        // Let's keep the filled part a simple rectangle for simplicity and
        // rely on the background to give the overall rounded shape.
        // Or, we can draw a rounded rectangle for the filled part as well.
        // If progress is less than 1, the right edge won't be fully rounded by
        // drawing a standard rounded rect up to filledWidth.
        // A better approach for the filled part when partial is to just fill
        // a rectangle and clip it, or draw based on the segment.

        // Let's stick to drawing a rounded rectangle for the filled part too,
        // it will look good when the bar is near full or full.
        // For partial fills, the right edge won't be perfectly rounded unless
        // we implement more complex path drawing logic, but this is usually
        // acceptable visually for a loading bar.

        roundRect(ctx, barX, barY, filledWidth, barHeight, cornerRadius);


        ctx.shadowBlur = 0; // Reset shadow blur
    }
}


    // --- Initialization ---
    initShapes();
    initStars();

    // --- Animation Loop ---
    function animate(time) {
        if (!animationStartTime) {
            animationStartTime = time;
        }

        const elapsedTime = time - animationStartTime;
        const progress = Math.min(elapsedTime / preloaderDuration, 1); // Progress from 0 to 1

        // Draw background with smooth color transition
        updateBackground();

        // Update and draw floating shapes
        updateAndDrawShapes();

        // Draw filled stars
        drawStars();

        // Draw rings
        const globalHue = (time * 0.05) % 360;
        rings.forEach((ring) => {
          const hue = globalHue + ring.hueOffset;
          drawRing(cx, cy, ring.radius, ring.angle, hue);
          ring.angle += ring.speed;
        });

        // Draw loading text
        drawLoadingText();

        // Draw progress bar
        drawProgressBar(progress);

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    // Hide preloader after 5 seconds
    setTimeout(() => {
        const preloader = document.getElementById("preloader");
        preloader.style.opacity = 0; // Start the CSS transition
        // Remove the element after the transition is complete
        preloader.addEventListener('transitionend', () => {
            preloader.remove();
        }, { once: true }); // Use { once: true } to automatically remove the listener
    }, preloaderDuration); // Use the defined duration


