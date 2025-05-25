document.addEventListener('DOMContentLoaded', function () {
    let draggedWord = null;
    let currentQuestions = []; // Track shuffled questions

    const answerBoxesContainer = document.querySelector('.identification-question-wrapper');
    const feedbackDiv = document.querySelector('.identification-feedback');
    const quizContainer = document.querySelector('.identification-quiz-container');
    const resetButton = document.querySelector('.identification-reset-button');
    const wordBank = document.querySelector('.identification-word-bank');
    const checkAnswerButton = document.getElementById('checkAnswerBtn');

    const allQuestions = [
        { text: "Who first demonstrated the relationship between electricity and magnetism through induction?", answer: "Michael Faraday" },
        { text: "What principle explains how a changing magnetic field can generate an electric current?", answer: "Faraday’s Law of Induction" },
        { text: "What kind of electric current is produced by an electric generator using Faraday’s Law?", answer: "Alternating Current (AC)" },
        { text: "What is the unit of the induced electromotive force (EMF) in the formula EMF = -N * (dΦ/dt)?", answer: "Volts (V)" },
        { text: "In Faraday's law, what is represented by the symbol Φ in the formula EMF = -N * (dΦ/dt)?", answer: "Magnetic Flux (in Weber, Wb)" },
        { text: "What does the term dΦ/dt represent in the formula EMF = -N * (dΦ/dt)?", answer: "The rate of change of magnetic flux (in Weber per second, Wb/s)" },
        { text: "In which of these devices is Faraday’s Law used to step up or step down voltage?", answer: "Transformer" },
        { text: "According to Faraday’s law, what happens to the induced EMF if the rate of change of magnetic flux is doubled?", answer: "The induced EMF is also doubled." },
        { text: "Faraday’s law is essential in the operation of which household device?", answer: "Electric Generator" },
        { text: "What does 'EMF' stand for in Faraday’s Law?", answer: "Electromotive Force" }
    ];

    const extraWords = ["Spiral Vortex", "Diode"];

    let checkAnswerClicked = false;

    function shuffleArray(array) {
        return [...array].sort(() => Math.random() - 0.5);
    }

    function loadQuestions(randomize = true) {
        currentQuestions = randomize ? shuffleArray(allQuestions) : [...allQuestions];
        answerBoxesContainer.innerHTML = '';
        wordBank.innerHTML = '';
        feedbackDiv.textContent = '';
        feedbackDiv.style.color = "";
        checkAnswerClicked = false;

        const allAnswers = currentQuestions.map(q => q.answer);
        const shuffledAnswers = shuffleArray(allAnswers);
        const allWords = [...shuffledAnswers, ...shuffleArray(extraWords)];
        const limitedWords = allWords.slice(0, currentQuestions.length + extraWords.length);

        limitedWords.forEach(word => {
            const draggableWord = document.createElement('div');
            draggableWord.classList.add('identification-draggable-word');
            draggableWord.textContent = word;
            draggableWord.dataset.word = word;
            draggableWord.draggable = true;

            draggableWord.addEventListener('dragstart', (e) => {
                draggedWord = e.target;
                e.dataTransfer.setData('text/plain', e.target.dataset.word);
                draggableWord.classList.add('dragging');
            });

            draggableWord.addEventListener('dragend', () => {
                draggableWord.classList.remove('dragging');
            });

            wordBank.appendChild(draggableWord);
        });

        currentQuestions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('identification-question');
            questionDiv.dataset.question = index + 1;

            questionDiv.innerHTML = ` 
                <div class="identification-question-text">${index + 1}. ${question.text}</div>
                <div class="identification-answer-box" data-question="${index + 1}"></div>
            `;
            answerBoxesContainer.appendChild(questionDiv);

            const answerBox = questionDiv.querySelector('.identification-answer-box');
            answerBox.addEventListener('dragover', e => e.preventDefault());
            answerBox.addEventListener('dragleave', () => answerBox.classList.remove('drag-over'));
            answerBox.addEventListener('drop', handleDrop);
        });

        if (checkAnswerButton) {
            checkAnswerButton.style.display = 'block';
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        const answerBox = e.target.closest('.identification-answer-box');
        if (answerBox && draggedWord) {
            const currentWord = answerBox.querySelector('.dropped-word');

            if (currentWord) {
                const newWord = document.createElement('div');
                newWord.classList.add('identification-draggable-word');
                newWord.textContent = currentWord.textContent;
                newWord.dataset.word = currentWord.textContent;
                newWord.draggable = true;
                newWord.addEventListener('dragstart', (e) => {
                    draggedWord = e.target;
                    e.dataTransfer.setData('text/plain', e.target.dataset.word);
                    newWord.classList.add('dragging');
                });
                newWord.addEventListener('dragend', () => {
                    newWord.classList.remove('dragging');
                });
                wordBank.appendChild(newWord);
                currentWord.remove();
            }

            const droppedWord = document.createElement('div');
            droppedWord.textContent = draggedWord.dataset.word;
            droppedWord.classList.add('dropped-word');
            answerBox.appendChild(droppedWord);

            if (draggedWord.parentNode === wordBank) {
                draggedWord.remove();
            }
        }
        draggedWord = null;
    }

    resetButton.addEventListener('click', () => {
        answerBoxesContainer.innerHTML = '';
        wordBank.innerHTML = '';
        loadQuestions();
        feedbackDiv.textContent = '';
        checkAnswerButton.disabled = false;  // Enable the button after reset
        enableDragOnWords(); // Re-enable dragging after reset
    });

    function enableDragOnWords() {
        const words = wordBank.querySelectorAll('.identification-draggable-word');
        words.forEach(word => {
            word.draggable = true;
            word.addEventListener('dragstart', (e) => {
                draggedWord = e.target;
                e.dataTransfer.setData('text/plain', e.target.dataset.word);
                word.classList.add('dragging');
            });
            word.addEventListener('dragend', () => {
                word.classList.remove('dragging');
            });
        });
    }

    function introductionAnswer() {
        if (checkAnswerClicked) {
            feedbackDiv.textContent = "You have already checked your answers. Please review or reset.";
            feedbackDiv.style.color = "orange";
            return;
        }

        if ([...answerBoxesContainer.querySelectorAll('.identification-answer-box')].some(box => box.textContent.trim() === "")) {
            feedbackDiv.textContent = "Please fill all boxes before checking.";
            feedbackDiv.style.color = "red";
            return;
        }

        feedbackDiv.style.color = "";
        checkAnswerClicked = true;

        const results = {};
        let correctCount = 0;
        const currentAnswerBoxes = answerBoxesContainer.querySelectorAll('.identification-answer-box');

        currentAnswerBoxes.forEach(box => {
            const qNum = parseInt(box.dataset.question);
            const droppedWordElement = box.querySelector('.dropped-word');
            const userAnswer = droppedWordElement ? droppedWordElement.textContent.trim() : "";
            const correctAnswer = currentQuestions[qNum - 1].answer.trim();
            results[qNum] = (userAnswer === correctAnswer);
            if (results[qNum]) {
                correctCount++;
                box.classList.add('correct');
            } else {
                box.classList.add('incorrect');
            }
        });

        const scoreMsg = `You got ${correctCount} out of ${currentQuestions.length} correct!`;

        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.innerHTML = `<h3>Quiz Results</h3><p>${scoreMsg}</p>
                            <button class="back-button">Back to Quiz & Assessment</button>
                            <button class="review-button">Review Answers</button>`;

        quizContainer.appendChild(popup);

        popup.querySelector('.back-button').addEventListener('click', () => window.location.href = 'quiz.html');
        popup.querySelector('.review-button').addEventListener('click', () => {
            popup.remove();
            reviewAnswers(results);
        });

        feedbackDiv.textContent = '';

        if (checkAnswerButton) {
            checkAnswerButton.disabled = true;  // Disable the check answer button
        }

        disableDragOnRemainingWords();  // Disable dragging on remaining words after submission
    }

    function disableDragOnRemainingWords() {
        const remainingWords = wordBank.querySelectorAll('.identification-draggable-word');
        remainingWords.forEach(word => {
            word.draggable = false; // Disable dragging
        });
    }

    function reviewAnswers(results) {
        const currentAnswerBoxes = answerBoxesContainer.querySelectorAll('.identification-answer-box');
        currentAnswerBoxes.forEach(box => {
            const qNum = parseInt(box.dataset.question);
            const droppedWordElement = box.querySelector('.dropped-word');
            const userAnswer = droppedWordElement ? droppedWordElement.textContent.trim() : "";
            const correctAnswer = currentQuestions[qNum - 1].answer.trim();

            box.classList.remove('correct', 'incorrect');

            if (results[qNum]) {
                box.style.backgroundColor = '#c8e6c9';
                if (droppedWordElement) {
                    droppedWordElement.textContent = correctAnswer;
                } else {
                    box.textContent = correctAnswer;
                }
            } else {
                box.style.backgroundColor = '#ffcdd2';
                if (droppedWordElement) {
                    droppedWordElement.textContent = `(Your Answer: ${userAnswer}) Correct: ${correctAnswer}`;
                } else {
                    box.textContent = `Correct: ${correctAnswer}`;
                }
            }
        });

        const existingBackButton = quizContainer.querySelector('.back-to-quiz-button');
        if (existingBackButton) {
            existingBackButton.remove();
        }

        const backToQuizButton = document.createElement('button');
        backToQuizButton.textContent = 'Back to Quiz List';
        backToQuizButton.className = 'back-to-quiz-button';
        backToQuizButton.addEventListener('click', () => {
            window.location.href = 'quiz.html';
        });

        backToQuizButton.style.display = 'block';
        backToQuizButton.style.width = 'fit-content';
        backToQuizButton.style.backgroundColor = '#00a0e9';
        backToQuizButton.style.color = 'white';
        backToQuizButton.style.padding = '0.8rem 1.5rem';
        backToQuizButton.style.borderRadius = '5px';
        backToQuizButton.style.fontWeight = 'bold';
        backToQuizButton.style.cursor = 'pointer';
        backToQuizButton.style.border = 'none';
        backToQuizButton.style.margin = '1rem auto';
        backToQuizButton.style.textDecoration = 'none';

        quizContainer.appendChild(backToQuizButton);
    }

    loadQuestions();

    if (checkAnswerButton) {
        checkAnswerButton.addEventListener('click', introductionAnswer);
    }
});
