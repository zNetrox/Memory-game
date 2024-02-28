// timer
let startTime = 0
let isRunning = false
let isPaused = false
let timerInterval

let minutes = 0
let seconds = 0
let milliseconds = 0

function updateClock() {
    if (isRunning) {
        const elapsedTime = Date.now() - startTime
        const totalMilliseconds = Math.floor(elapsedTime)
        milliseconds = totalMilliseconds % 1000
        const totalSeconds = Math.floor(totalMilliseconds / 1000)
        seconds = totalSeconds % 60
        minutes = Math.floor(totalSeconds / 60)

        document.querySelector('#timer').innerText = `${minutes}:${seconds}.${milliseconds}`
    }
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        if (isPaused) {
            startTime += Date.now() - startTime;
        } else {
            startTime = Date.now();
        }
        timerInterval = setInterval(updateClock, 10); // Met à jour chaque 10 millisecondes
    }
}

function stopTimer() {
    if (isRunning) {
        document.querySelector('#timer').innerText = `${minutes}:${seconds}.${milliseconds}`
        isRunning = false;
        isPaused = false;
        clearInterval(timerInterval);     
    }
}

// main

const allCards = document.querySelectorAll('[class*="card-"]')
const allBackCards = document.querySelectorAll('.back')

let durationPause = 750 // en ms

function randomInt(max) {
    return Math.floor(Math.random() * max);
}

emoji = ['😈', '👻', '❤️', '😯', '🤮', '😂', '😨', '🐱']

// met les cartes aleatoirement sur le tapis
const randomCards = function() {
    emojiArray = [...emoji, ...emoji]

    allBackCards.forEach((card) => {
        const r = randomInt(emojiArray.length)
        card.innerText = emojiArray[r]
        emojiArray.splice(r, 1)
    })
}

randomCards()

const check = function() {
    cardClicked = []
    // ajoute les 2 cartes qui ont était cliqué dans cardClicked
    allCards.forEach((card) => {
        if(card.getAttribute("data-click") === 'true') {
            cardClicked.push(card)
        }
    })
    // si 2 cartes a était cliqué on enlever tous les listener
    if(cardClicked.length === 2) {
        removeListener()
        if(cardClicked[0].innerText === cardClicked[1].innerText) { // si les emoji des 2 cartes correspondent on laisse les cartes retourné, on remet les listener et on met a jour le data-find des 2 cartes cliqué 
            cardClicked.forEach((card) => {
                card.dataset.find = 'true'
            })
            addListener()
        } else { // sinon on attend 800ms pour finir l'animation et pour voir l'emoji, on enleve les class 'active' des 2 cartes cliqué et on remet les listener
            setTimeout(() => {
                cardClicked.forEach((card) => {
                    card.classList.remove('active')
                })
                addListener()
            }, durationPause)
        }
        // on remet toute les data-click a false
        allCards.forEach((card) => {
            card.dataset.click = 'false'
        })
    }

    // on verfie si toute les carte on était trouvé
    let nbCardFind = 0
    allCards.forEach((card) => {
        if(card.getAttribute("data-find") === 'true') {
            nbCardFind++
        }
    })
    if(nbCardFind === allCards.length) {
        console.log('bravo!')
        stopTimer()
    }
}
let nbCardCheck = 0
function clickHandler() {
    this.classList.add('active')
    this.dataset.click = 'true'
    check()
    nbCardCheck++
    if(nbCardCheck === 1) {
        startTimer()
    }
}

// permet d'ajouté les listener aux cartes qui n'ont pas étaient trouvé quand il est appeller
const addListener = function() {
    allCards.forEach((card) => {
        if(card.getAttribute("data-find") === 'false') {
            card.addEventListener('click', clickHandler)
        }
    })
}

// permet de ne plus pouvoir cliquer sur les cartes quand il est appeller
const removeListener = function() {
    allCards.forEach((card) => {
        card.removeEventListener('click', clickHandler)
    })
}

addListener()

// restart
document.querySelector('#restart').addEventListener('click', () => {
    allCards.forEach((card) => {
        card.classList.remove('active')
        card.dataset.find = 'false'
        card.dataset.click = 'false'
        nbCardCheck = 0
        document.querySelector('#timer').innerText = '0:0.0'
        stopTimer()
        addListener()
        setTimeout(() => {
            randomCards()
        }, durationPause)
    })
})