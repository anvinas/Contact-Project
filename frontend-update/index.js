document.addEventListener("mousemove", (e) => {
    const sun = document.getElementById("vapor-sun");
    const stars = document.querySelector(".stars-container");

    // Get mouse position relative to center
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;


    let sunXStrenght = 80;
    let sunYStrenght = 12; 
    let starsXStrenght = 25;
    let starsYStrenght = 10;

    // Move the elements with slight offsets
    sun.style.transform = `translate(-${50-(x * sunXStrenght)}%, -${50-(y * sunYStrenght)}%) `;       // stronger shift
    stars.style.transform = `translate(-${50+(x * starsXStrenght)}%, -${100+(y * starsYStrenght)}%) `;     // subtle shift
});

const makeStars = ()=>{
    const starsContainer = document.querySelector('.stars-container');
    console.log(starsContainer);
    const numStars = 100; // adjust based on density

    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        // Random position across the viewport
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;

        // Random size and opacity
        const size = Math.random() * 3 + 1; // 1px to 4px
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.opacity = Math.random().toFixed(2);

         // Random blink delay (0–3s)
        const delay = Math.random() * 3;
        star.style.animationDelay = `${delay}s`;
        
        starsContainer.appendChild(star);
    }
}
makeStars();