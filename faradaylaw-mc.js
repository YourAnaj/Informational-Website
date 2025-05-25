document.addEventListener('DOMContentLoaded', function() {
    const quizForm = document.getElementById('introductionmc'); // Keep this ID
    const resultDiv = document.getElementById('result');
    const backButton = document.getElementById('backButton');
    const quizContainer = document.querySelector('.quiz-container');
    const allQuestions = [
        {
            question: "What is the use of the relationship between electricity and magnetism whereby an electric current flowing through a single wire will produce a magnetic field around it?",
            options: ["Electricity", "Electromagnetic Induction", "Magnetic Field and Forces", "Electricity and Electromagnetism"],
            answer: "Electromagnetic Induction"
        },
        {
            question: "When was electromagnetic induction discovered?",
            options: ["1891", "1931", "1831", "1881"],
            answer: "1831"
        },
        {
            question: "Who discovered electromagnetic induction?",
            options: ["Michael Faraday", "Nikola Tesla", "Thomas Edison", "James Clerk Maxwell"],
            answer: "Michael Faraday"
        },
        {
            question: "What is EMF (Electromotive Force)?",
            options: ["The number of turns", "The magnetic flux", "The induced electromotive force", "The rate of change of magnetic flux"],
            answer: "The induced electromotive force"
        },
        {
            question: "What does \"N\" represent in Faraday's Law of Induction?",
            options: ["The number of turns", "The induced electromotive force", "The magnetic flux", "The rate of change of magnetic flux"],
            answer: "The number of turns"
        },
        {
            question: "What does the negative sign in Faraday’s Law formula indicate?",
            options: ["The current is reversed", "The direction of induced EMF opposes the change in magnetic flux", "The magnetic flux is negative", "The EMF value is always negative"],
            answer: "The direction of induced EMF opposes the change in magnetic flux"
        },
        {
            question: "Which of the following is a real-life application of electromagnetic induction?",
            options: ["Electric Motors", "Nuclear Reactors", "Solar Panels", "Chemical Batteries"],
            answer: "Electric Motors"
        },
        {
            question: "How can the induced EMF in a coil be increased?",
            options: ["By reducing the number of turns in the coil", "By increasing the strength of the magnetic field", "By decreasing the area of the coil", "By decreasing the speed of the coil's rotation"],
            answer: "By increasing the strength of the magnetic field"
        },
        {
            question: "What is the effect of Lenz's Law on the induced EMF?",
            options: ["It increases the magnetic flux", "It causes the induced EMF to cancel out the change in flux", "It makes the EMF independent of time", "It leads to the creation of perpetual motion machines"],
            answer: "It causes the induced EMF to cancel out the change in flux"
        },
        {
            question: "What is the primary function of a transformer?",
            options: ["To change the frequency of the AC supply", "To change the current in a circuit", "To change the voltage levels using electromagnetic induction", "To store electrical energy"],
            answer: "To change the voltage levels using electromagnetic induction"
        }
    ];
    const numQuestionsToShow = 5;
    let currentQuestionsIndices = [];
    let currentQuestions = [];
    const userAnswers = {};
    let quizSubmitted = false; // Flag to track submission

    function getRandomQuestions() {
        const indices = [];
        while (indices.length < numQuestionsToShow && indices.length < allQuestions.length) {
            const randomIndex = Math.floor(Math.random() * allQuestions.length);
            if (!indices.includes(randomIndex)) {
                indices.push(randomIndex);
            }
        }
        currentQuestionsIndices = indices;
        currentQuestions = currentQuestionsIndices.map(index => allQuestions[index]);
    }

    function displayQuestions() {
        quizForm.innerHTML = '';
        currentQuestions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question');

            const questionNumber = document.createElement('p');
            questionNumber.textContent = `${index + 1}. ${q.question}`;
            questionDiv.appendChild(questionNumber);

            const optionsDiv = document.createElement('div');
            optionsDiv.classList.add('options');
            q.options.forEach(option => {
                const label = document.createElement('label');
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = `q${index}`;
                input.value = option;
                input.addEventListener('change', () => {
                    if (!quizSubmitted) {
                        userAnswers[`q${index}`] = option;
                    }
                });
                label.appendChild(input);
                label.appendChild(document.createTextNode(` ${option}`));
                optionsDiv.appendChild(label);
            });
            questionDiv.appendChild(optionsDiv);
            quizForm.appendChild(questionDiv);
        });

        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.classList.add('btn');
        submitButton.textContent = 'Submit Answers'; // Changed button text
        quizForm.appendChild(submitButton);
    }

    getRandomQuestions();
    displayQuestions();

    quizForm.addEventListener('submit', function(event) {
        event.preventDefault();

        if (quizSubmitted) {
            alert('You have already submitted the quiz and reviewed the answers.');
            return;
        }

        let allAnswered = true;
        for (let i = 0; i < currentQuestions.length; i++) {
            if (!userAnswers[`q${i}`]) {
                allAnswered = false;
                break;
            }
        }

        if (!allAnswered) {
            alert('Please answer all questions before submitting.');
            return;
        }

        let score = 0;
        currentQuestions.forEach((q, index) => {
            if (userAnswers[`q${index}`] === q.answer) {
                score++;
            }
        });

        const percentage = (score / currentQuestions.length) * 100;
        const scoreMessage = `You scored ${score} out of ${currentQuestions.length} (${percentage.toFixed(0)}%)`;

        const popupContainer = document.createElement('div');
        popupContainer.classList.add('score-popup');

        const scoreElement = document.createElement('p');
        scoreElement.textContent = scoreMessage;

        const backButtonPopup = document.createElement('button');
        backButtonPopup.textContent = 'Back to Quiz & Assessment List'; // Changed button text
        backButtonPopup.classList.add('back-button');
        backButtonPopup.addEventListener('click', () => {
            window.location.href = 'quiz.html';
        });

        const reviewButtonPopup = document.createElement('button');
        reviewButtonPopup.textContent = 'Review Answers';
        reviewButtonPopup.classList.add('review-button');
        reviewButtonPopup.addEventListener('click', () => {
            popupContainer.remove();
            revealAnswers();
            disableOptions(); // Disable options after review
            quizSubmitted = true;
        });

        popupContainer.appendChild(scoreElement);
        popupContainer.appendChild(reviewButtonPopup);
        popupContainer.appendChild(backButtonPopup); // Rearranged button order

        quizContainer.appendChild(popupContainer);

        if (resultDiv) resultDiv.textContent = '';
        if (backButton) backButton.style.display = 'none';
    });

    function revealAnswers() {
        currentQuestions.forEach((q, index) => {
            const options = document.querySelectorAll(`input[name="q${index}"]`);
            options.forEach(option => {
                const label = option.parentNode;
                label.classList.remove('correct-answer', 'incorrect-answer');
                if (option.value === q.answer) {
                    label.classList.add('correct-answer');
                } else if (userAnswers[`q${index}`] === option.value && option.value !== q.answer) {
                    label.classList.add('incorrect-answer');
                }
                const input = label.querySelector('input[type="radio"]');
                if (input) {
                    input.disabled = true;
                }
            });
        });
        if (backButton) backButton.style.display = 'block';
    }

    function disableOptions() {
        const radioButtons = quizForm.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.disabled = true;
        });
        const labels = quizForm.querySelectorAll('.options label');
        labels.forEach(label => {
            label.style.cursor = 'default';
        });
    }

    backButton.addEventListener('click', function() {
        window.location.href = 'quiz.html';
    });
});