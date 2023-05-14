// Selector
const board = document.querySelector('.board')
const timeNodes = document.querySelectorAll('.time')
const scoreNodes = document.querySelectorAll('.score')
const healthNode = document.querySelector('.health')
const startBtn = document.querySelector('.start-btn')
const gameOverModal = document.querySelector('.gameover')
const restartBtn = document.querySelector('.restart-btn')
const settingsBtn = document.querySelector('.settings-btn')
const helpBtn = document.querySelector('.help-btn')
const settingModal = document.querySelector('.setting')
const checkboxModeConehead = document.getElementById('mode-conehead')
const highscoreNode = document.querySelector('.highscore')
const currentHighscore = document.querySelector('.current-highscore')

// initial game variable
let hideCircle = 5
let speed
let score
let health
let second
checkboxModeConehead.checked = true

// intervals variable
let increaseSpeed
let updateNode
let gameTime

// set css variable
document.documentElement.style.setProperty('--hide-circle', hideCircle)

// functions
function reset() {
    speed = 1
    score = 0
    health = 5
    second = 0
    highscoreNode.innerHTML = ''
    currentHighscore.textContent = localStorage.highscore ?? '0'
    updateGameNode()
}

function getLocalHighscore() {
    if (!localStorage.getItem('highscore')) {
        localStorage.setItem('highscore', 0)
    }
    return localStorage.getItem('highscore')
}

function isNewHighScore(currentScore) {
    const highscore = getLocalHighscore()
    if (currentScore > highscore) {
        localStorage.setItem('highscore', currentScore)
        return true
    }
}

function acak(min, max) {
    const range = max - min + 1
    const hasil = Math.floor(Math.random() * range) + min
    return hasil
}

function updateGameNode() {
    healthNode.textContent = health

    const scoreNodeArr = [...scoreNodes]
    const timeNodeArr = [...timeNodes]

    scoreNodeArr.forEach((node) => {
        node.textContent = score
    })
    timeNodeArr.forEach((node) => {
        node.textContent = second
    })
}

function runGameIntervals() {
    // Intervals
    increaseSpeed = setInterval(() => {
        speed += 0.5
    }, hideCircle * 1000)

    updateNode = setInterval(() => {
        if (health < 0) return
        updateGameNode()
    }, 0)

    gameTime = setInterval(() => {
        second++
    }, 1000)
}

function isGameOver() {
    if (health < 1) {
        clearInterval(increaseSpeed)
        clearInterval(updateNode)
        clearInterval(gameTime)
        const circles = [...board.children]
        circles.map((c) => {
            board.removeChild(c)
        })
        startBtn.classList.remove('active')
        startBtn.style.pointerEvents = 'all'
        gameOverModal.classList.add('active')
        if (isNewHighScore(score)) {
            highscoreNode.innerHTML = `NEW HIGHSCORE : ${score}`
        }
        return true
    }
}

function popCircle() {
    if (isGameOver()) return

    let isClicked = false

    const x = acak(20, 480)
    const y = acak(20, 480)

    const circle = document.createElement('span')
    circle.classList.add('circle')
    if (checkboxModeConehead.checked) {
        circle.classList.add('conehead')
    }
    circle.style.setProperty('--x', x)
    circle.style.setProperty('--y', y)

    board.appendChild(circle)

    circle.onclick = function () {
        score++
        board.removeChild(this)
        isClicked = true
    }

    setTimeout(popCircle, 2000 / speed)

    setTimeout(() => {
        if (!isClicked && health > 0) {
            board.removeChild(circle)
            health--
        }
    }, hideCircle * 1000)
}

// event listeners
board.addEventListener('click', (e) => {
    if (e.target.className === 'board') {
        health--
    }
})

settingModal.addEventListener('click', (e) => {
    if (e.target.className.includes('setting')) {
        e.target.classList.remove('active')
    }
})

startBtn.addEventListener('click', function () {
    this.classList.add('active')
    this.style.pointerEvents = 'none'
    reset()
    runGameIntervals()
    popCircle()
})

restartBtn.addEventListener('click', function () {
    reset()
    gameOverModal.classList.remove('active')
})

// settingsBtn.onclick = () => document.querySelector('.setting').classList.add('active')
// helpBtn.onclick = () => alert('menu help blom jadi')

reset()
