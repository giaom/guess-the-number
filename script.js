document.addEventListener('DOMContentLoaded', () => {
    const title = document.getElementById('title');
    const form = document.getElementById('guess-form');
    const input = document.getElementById('guess');
    const feedback = document.getElementById('feedback');
    const attemptsDisplay = document.getElementById('attempts');
    const bestScoreDisplay = document.getElementById('best-score');
    const resetButton = document.getElementById('reset');
    const resetScoreButton = document.getElementById('reset-score');

    let target = getRandomNumber();
    let attempts = 0;
    let wrongGuesses = 0;
    let bestScore = localStorage.getItem('bestScore') || null;

    updateBestScore();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const guess = Number(input.value);
        input.value = '';
        attempts++;
        attemptsDisplay.textContent = `Attempts: ${attempts}`;

        if (guess === target) {
            feedback.textContent = `🎉 Correct! It was ${target}`;
            saveBestScore();
            disableInput();
        } else {
            wrongGuesses++;
            giveSmartHint(guess);

            if (wrongGuesses % 10 === 0) {
                evilShift();
            }
        }
    });

    resetButton.addEventListener('click', resetGame);

    resetScoreButton.addEventListener('click', () => {
        localStorage.removeItem('bestScore');
        bestScore = null;
        updateBestScore();
    });

    function getRandomNumber() {
        return Math.floor(Math.random() * 100) + 1;
    }

    function giveSmartHint(guess) {
        const diff = Math.abs(guess - target);
        let hint = '';

        if (diff >= 35) {
            hint = guess > target ? 'Way too high!' : 'Way too low!';
        } else if (diff >= 20) {
            hint = guess > target ? 'Two high!' : 'Two low!';
        } else if (diff >= 15) {
            hint = guess > target ? 'Too high!' : 'Too low!';
        } else if (diff >= 10) {
            hint = guess > target ? 'High!' : 'Low!';
        } else {
            hint = guess > target ? 'A bit high.' : 'A bit low.';
        }

        feedback.textContent = `${guess}: ${hint}`;
    }

    function saveBestScore() {
        if (!bestScore || attempts < bestScore) {
            bestScore = attempts;
            localStorage.setItem('bestScore', bestScore);
            updateBestScore();
        }
    }

    function updateBestScore() {
        bestScoreDisplay.textContent = `Best Score: ${bestScore ?? '—'}`;
    }

    function evilShift() {
        const min = Math.max(0, target - 10);
        const max = Math.min(100, target + 10);
        const newTarget = Math.floor(Math.random() * (max - min + 1)) + min;
        const newColor = getRandomColor();
        target = newTarget;

        console.log(`>:D Evil mode activated! Number changed from ${target} to ${newTarget}`);

        title.style.color = newColor;

        feedback.innerHTML += ` <span style="color:${newColor}">(:D The game just got trickier!)</span>`;
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function disableInput() {
        input.disabled = true;
        form.querySelector('button').disabled = true;
    }

    function resetGame() {
        target = getRandomNumber();
        attempts = 0;
        wrongGuesses = 0;
        input.disabled = false;
        form.querySelector('button').disabled = false;
        feedback.textContent = '';
        attemptsDisplay.textContent = 'Attempts: 0';
        title.style.color = 'black';
    }
});
