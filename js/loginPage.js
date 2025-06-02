const allStarsArr = []


class Star {
  constructor(x, y,id) {
    this.x = x;
    this.y = y;
    this.id = id;
  }
  setAsBeingTracked(){
    let el = document.getElementById(`star_${this.id}`);
    el.classList.add("tracked")
  }
  remove(){
    let el = document.getElementById(`star_${this.id}`);
    if (el) {
        el.remove(); 
    } else {
        console.warn(`Element #star_${this.id} not found.`);
    }
  }
}

class Pacman {
    constructor(x, y) {
        this.x = x;                         // Current x position
        this.y = y;                         // Current y position
        this.target = null;       // Target position (defaults to current)
        this.curMovingDir = null;          // Current movement direction: 'up', 'down', 'left', 'right'
        this.lastMovingDir = null; 
        this.stepsize = 15 
        this.animationFrame = 1;   
        this.EL = document.getElementById("pacman");
    }

    getTarget(){
        return this.target;
    }

    setTarget(star) {
        this.target = star;
        star.setAsBeingTracked()
    }

    
    //return true or false if reaced
    moveToTarget() {
        if(this.target == null) return true;
        //Check distance from target
        const distanceX = Math.abs(this.target.x - this.x);
        const distanceY = Math.abs(this.target.y - this.y);
        const closeness = (this.stepsize)

        // If the target is close enough, kill target
        if( distanceX <= closeness && distanceY <= closeness) {
            this.x = this.target.x;
            this.y = this.target.y;

            this.target.remove();
            this.target = null; 
            this.animationFrame=2 // Set to one before my eating frame;
            this.updateVisuals();
            return true;
        }

        // Move towards the target
        if(distanceY > closeness){
            if (this.target.y > this.y) {
                this.moveDown();
            } else if (this.target.y < this.y) {
                this.moveUp();
            }
        }else{
            if(this.target.y !== this.y) this.y = this.target.y; // Snap to target y
            if (this.target.x > this.x) {
                this.moveRight();
            } else if (this.target.x < this.x) {
                this.moveLeft();
            }
        }
        return false
    }

    moveLeft(){
        this.x -= this.stepsize;
        this.lastMovingDir = this.curMovingDir;
        this.curMovingDir = 'left';

        this.updateVisuals();
    }
    moveRight(){
        this.x += this.stepsize;
        this.lastMovingDir = this.curMovingDir;
        this.curMovingDir = 'right';

        this.updateVisuals();
    }
    moveUp(){
        this.y -= this.stepsize;
        this.lastMovingDir = this.curMovingDir;
        this.curMovingDir = 'up';

        this.updateVisuals();
    }
    moveDown(){
        this.y += this.stepsize;
        this.lastMovingDir = this.curMovingDir;
        this.curMovingDir = 'down';

        this.updateVisuals();
    }
    updateAnimationFrame(){
        this.animationFrame+=1;
        if(this.animationFrame > 3){
            this.animationFrame = 1;
        }
    }
    updateElementPosition(){
        // Update the element's position based on current x and y
        this.EL.style.left = `${this.x}px`;
        this.EL.style.top = `${this.y}px`;
    }
    updatePacmanImage(){
        this.EL.src = `/public/pacman/pacman${this.animationFrame}.png`;
    }
    rotatePacman(){
        if(this.curMovingDir === this.lastMovingDir) return;

        switch(this.curMovingDir){
            case 'up':
                this.EL.style.transform = ' translate(-50%, -50%) rotate(270deg)';
                break;
            case 'down':
                this.EL.style.transform = ' translate(-50%, -50%) rotate(90deg)';
                break;
            case 'left':
                this.EL.style.transform = ' translate(-50%, -50%) rotate(180deg)';
                break;
            case 'right':
                this.EL.style.transform = ' translate(-50%, -50%) rotate(0deg)';
                break;
        }
    }
    updateVisuals(){
        this.updateAnimationFrame();
        this.updateElementPosition();
        this.updatePacmanImage();
        this.rotatePacman();
    }
}

function randomBetween(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

document.addEventListener("mousemove", (e) => {
    const sun = document.getElementById("cassette-main");

    // Get mouse position relative to center
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;


    let sunXStrenght = 10;
    let sunYStrenght = 3.11; 

    // Move the elements with slight offsets
    sun.style.transform = `translate(${(x * sunXStrenght)}%, ${(y * sunYStrenght)}%) `;       // stronger shift
    // stars.style.transform = `translate(-${50+(x * starsXStrenght)}%, -${100+(y * starsYStrenght)}%) `;     // subtle shift
});

document.querySelector('.loginWrapper').addEventListener('click', function(event) {
    const container = document.querySelector('.loginContainer');
    if (!container.contains(event.target)) {
        this.classList.add('closedModal');
    }
});

document.querySelector('.signupWrapper').addEventListener('click', function(event) {
    const container = document.querySelector('.signupContainer');
    if (!container.contains(event.target)) {
        this.classList.add('closedModal');
    }
});

function openSignupModal(){
    const container = document.querySelector('.signupWrapper');
    container.classList.remove('closedModal');
    
}
function closeSignupModal(){
    const container = document.querySelector('.signupWrapper');
    container.classList.add('closedModal');
    
}
function openLoginModal(){
    const container = document.querySelector('.loginWrapper');
    container.classList.remove('closedModal');
    
}
function closeLoginModal(){
    const container = document.querySelector('.loginWrapper');
    container.classList.add('closedModal');
    
}
function togglePasswordVisibility(event) {
    const wrapper = event.target.closest('.password-wrapper');
    const input = wrapper.querySelector('input');
    const icon = wrapper.querySelector('img');

    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';

    // Toggle the icon
    icon.src = isPassword 
        ? './public/svg/eye_closed.svg' 
        : './public/svg/eye_opened.svg';
}

const makeStars = () => {
    const allStarsContainerEl = document.querySelector('.stars-container');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const thirdW = windowWidth / 3;
    const thirdH = windowHeight / 3;
    let id = 0;

    const spawnStar = (x, y) => {
        const starContainer = document.createElement('div');
        starContainer.classList.add('starContainer');
        const innerStarEl = document.createElement('div');
        innerStarEl.classList.add('star');
        starContainer.id = `star_${id}`;

        const newStarObj = new Star(x, y, id++);
        allStarsArr.push(newStarObj);

        starContainer.style.top = `${y}px`;
        starContainer.style.left = `${x}px`;

        const size = randomBetween(4, 10);
        innerStarEl.style.width = `${size}px`;
        innerStarEl.style.height = `${size}px`;
        innerStarEl.style.opacity = Math.random().toFixed(2);

        const delay = Math.random() * 3;
        innerStarEl.style.animationDelay = `${delay}s`;

        starContainer.appendChild(innerStarEl);
        allStarsContainerEl.appendChild(starContainer);
    };

    // Top 1/3
    for (let i = 0; i < 25; i++) {
        const x = Math.random() * windowWidth;
        const y = Math.random() * thirdH;
        spawnStar(x, y);
    }

    // Bottom 1/3
    for (let i = 0; i < 25; i++) {
        const x = Math.random() * windowWidth;
        const y = Math.random() * thirdH + thirdH * 2;
        spawnStar(x, y);
    }

    // Left 1/3 (excluding top and bottom thirds)
    for (let i = 0; i < 25; i++) {
        const x = Math.random() * thirdW;
        const y = Math.random() * thirdH + thirdH;
        spawnStar(x, y);
    }

    // Right 1/3 (excluding top and bottom thirds)
    for (let i = 0; i < 25; i++) {
        const x = Math.random() * thirdW + thirdW * 2;
        const y = Math.random() * thirdH + thirdH;
        spawnStar(x, y);
    }
}



function goToSignup(){
    closeLoginModal();
    openSignupModal();
}

function gotoLogin(){
    
}

function switchToLoginModal(){
    closeSignupModal();
    openLoginModal();
}


function switchToSignupModal(){
    closeLoginModal();
    openSignupModal();
}







function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main(){
    makeStars()
    const pacman = new Pacman(100, 100);
    
    let targetIndex = 0
    while (targetIndex < allStarsArr.length) {
        if (pacman.getTarget() == null) {
            pacman.setTarget(allStarsArr[targetIndex]);
            targetIndex++;
        }

        const reached = pacman.moveToTarget();

        if (reached) {
            await sleep(1000); // wait 1 second
        }

        await sleep(1000 / 15); // simulate 15 FPS
  }
}   

main()