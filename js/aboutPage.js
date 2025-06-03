const ghosts = document.querySelectorAll('.ghost');
let frame = 1;
const maxFrames = 8;

setInterval(() => {
    ghosts.forEach(ghost => {
        const color = ghost.dataset.color;
        frame = (frame % maxFrames) + 1;
        ghost.src = `public/ghosts/${color}/F${frame}_R.png`;
    });
}, 700); 


