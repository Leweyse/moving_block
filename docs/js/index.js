const board = document.querySelector('.board');
const player = document.querySelector('.player');
const chaserGroup = document.querySelectorAll('.chaser');

const numLives = document.querySelector('.numLives');
const sec = document.querySelector('.seconds');

let interval = null;
let newInterval = null;

let pTop = 0;
let pLeft = 0;

let cTop = 0;
let cLeft = 0;

let lives = [1, 2, 3];
numLives.innerHTML = `Number of lifes: ${lives.length}`;

let boxSize = 50;
console.log(boxSize);

const chaserPositions = (chaser) => {
    cTop = Math.floor(Math.random() * (625 / boxSize)) * boxSize;
    cLeft = Math.floor(Math.random() * (1350 / boxSize)) * boxSize;

    chaser.style.setProperty('--chaser-top', `${cTop}px`);
    chaser.style.setProperty('--chaser-left', `${cLeft}px`);
}

const startConfig = () => {
    alert('Press "Enter" to start the game');
    board.style.setProperty('--box-size', `${boxSize}px`);

    chaserGroup.forEach(chaser => {
        chaserPositions(chaser)
    });
}

startConfig();

window.addEventListener('keydown', function (event) {
    if (event.code == "Enter") {
        let start = Date.now();

        clearInterval(interval)
        clearInterval(newInterval);

        interval = setInterval(() => {
            let delta = Date.now() - start; 
            sec.innerHTML = `Score: ${Math.floor(delta / 1000)}`;
        }, 1000);

        chaserGroup.forEach(chaser => {
            if (
                `${pTop}px` !== chaser.style.getPropertyValue('--chaser-top') && 
                `${pLeft}px` !== chaser.style.getPropertyValue('--chaser-left')
            ) { 
                newInterval = setInterval(() => {
                    let t = chaser.style.getPropertyValue('--chaser-top');
                    let l = chaser.style.getPropertyValue('--chaser-left');
    
                    let pom = Math.random() < 0.5 ? -1 : 1;
    
                    t = parseInt(t) + (boxSize * pom);
                    l = parseInt(l) + (boxSize * pom);
    
                    if (t >= 625) t = 625 - boxSize;
                    else if (t <= 0) t = 0;
    
                    if (l >= 1350) l = 1350 - boxSize;
                    else if (l <= 0) l = 0;
    
                    chaser.style.setProperty('--chaser-top', `${t}px`);
                    chaser.style.setProperty('--chaser-left', `${l}px`);
                }, 500);
            }
        })
    }

    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(event.code) > -1) {
        event.preventDefault();

        switch (event.code) {
            case 'ArrowUp': pTop = pTop - boxSize; break;
            case 'ArrowRight': pLeft = pLeft + boxSize; break;
            case 'ArrowDown': pTop = pTop + boxSize; break;
            case 'ArrowLeft': pLeft = pLeft - boxSize; break;
            default: break;
        }

        if (pTop >= 625) pTop = 625 - boxSize;
        else if (pTop <= 0) pTop = 0;

        if (pLeft >= 1350) pLeft = 1350 - boxSize;
        else if (pLeft <= 0) pLeft = 0;

        player.style.setProperty('--player-top', `${pTop}px`);
        player.style.setProperty('--player-left', `${pLeft}px`);

        chaserGroup.forEach(chaser => {
            if (
                `${pTop}px` === chaser.style.getPropertyValue('--chaser-top') && 
                `${pLeft}px` === chaser.style.getPropertyValue('--chaser-left')
            ) {
                lives.pop();

                if (lives.length === 0) clearInterval(interval);

                numLives.innerHTML = `Number of lifes: ${lives.length}`;
                player.style.border = `2px solid hsl(${board.childElementCount * Math.floor(Math.random() * 100)}, 80%, 45%)`;

                if (board.contains(chaser)) {
                    board.removeChild(chaser);   
                }
            } 
        })
    }
})