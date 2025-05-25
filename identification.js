let draggedWord = null;

const answerBoxesContainer = document.querySelector('.identification-question-wrapper');
const feedbackDiv = document.querySelector('.identification-feedback');
const quizContainer = document.querySelector('.identification-quiz-container');
const resetButton = document.querySelector('.identification-reset-button');
const wordBank = document.querySelector('.identification-word-bank');

const allQuestions = [
    { text: "The total magnetic field which passes through a given area.", answer: "Magnetic Flux" },
    { text: "The process where an electromotive force (EMF) is induced across an electrical conductor in a changing magnetic field.", answer: "Electromagnetic Induction" },
    { text: "States that the magnitude of the induced EMF is proportional to the rate of change of magnetic flux through the circuit.", answer: "Faraday's Law" },
    { text: "States that the direction of the induced current is such that it opposes the change in magnetic flux that produces it.", answer: "Lenz's Law" },
    { text: "The voltage generated across a conductor due to a changing magnetic field.", answer: "Induced EMF" },
    { text: "A region around a magnetic material or a moving electric charge within which the force of magnetism acts.", answer: "Magnetic Field" },
    { text: "A material that allows the flow of electric current.", answer: "Conductor" },
    { text: "A series of loops or turns of wire.", answer: "Coil" },
    { text: "An electrical device that transfers electrical energy between two or more circuits through electromagnetic induction.", answer: "Transformer" },
    { text: "A device that converts mechanical energy into electrical energy through electromagnetic induction.", answer: "Generator" }
];

// Extra (wrong) words to increase difficulty
const extraWords = [
    "Electrostatic", "Voltage",
];

function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

function loadQuestions(randomize = true) {
    const questionsToLoad = randomize ? shuffleArray(allQuestions) : allQuestions;
    answerBoxesContainer.innerHTML = '';
    wordBank.innerHTML = '';

    const allAnswers = questionsToLoad.map(q => q.answer);
    const shuffledAnswers = shuffleArray(allAnswers);

    // Combine correct and extra (wrong) words for the word bank
    const allWords = [...shuffledAnswers, ...shuffleArray(extraWords)];
    const limitedWords = allWords.slice(0, questionsToLoad.length + extraWords.length); // Limit to fit word bank

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

    questionsToLoad.forEach((question, index) => {
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
});

function introductionAnswer() {
    if ([...answerBoxesContainer.querySelectorAll('.identification-answer-box')].some(box => box.textContent.trim() === "")) {
        feedbackDiv.textContent = "Please fill all boxes.";
        feedbackDiv.style.color = "red";
        return;
    }
    feedbackDiv.style.color = "";

    const answers = {};
    allQuestions.forEach((q, i) => answers[i + 1] = q.answer);

    let correctCount = 0;
    const results = {};
    const currentAnswerBoxes = answerBoxesContainer.querySelectorAll('.identification-answer-box');

    currentAnswerBoxes.forEach(box => {
        const qNum = box.dataset.question;
        const userAnswer = box.textContent.trim();
        const correctAnswer = allQuestions[qNum - 1].answer;
        results[qNum] = (userAnswer === correctAnswer);
        if (results[qNum]) correctCount++;
    });

    const scoreMsg = `You got ${correctCount} out of ${allQuestions.length} correct!`;

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
}

function reviewAnswers(results) {
    const currentAnswerBoxes = answerBoxesContainer.querySelectorAll('.identification-answer-box');
    currentAnswerBoxes.forEach(box => {
        const qNum = box.dataset.question;
        const userAnswer = box.textContent.trim();
        const correct = results[qNum];
        box.style.backgroundColor = correct ? '#c8e6c9' : '#ffcdd2';
    });

    const backToQuizButton = document.createElement('button');
    backToQuizButton.textContent = 'Back to Quiz';
    backToQuizButton.className = 'back-to-quiz-button';
    backToQuizButton.addEventListener('click', () => {
        window.location.href = 'quiz.html'; // Redirect to quiz.html
    });

    // Basic styling for the back button (you can customize this in your CSS)
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
    backToQuizButton.style.textDecoration = 'none'; // To ensure it's not styled like a regular text link

    quizContainer.appendChild(backToQuizButton);
}

loadQuestions();