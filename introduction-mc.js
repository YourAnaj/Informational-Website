document.addEventListener('DOMContentLoaded', function() {
    const quizForm = document.getElementById('introductionmc');
    const resultDiv = document.getElementById('result');
    const backButton = document.getElementById('backButton');
    const quizContainer = document.querySelector('.quiz-container');
    const allQuestions = [
        {
            question: "What fundamental relationship does electromagnetic induction primarily explore?",
            options: ["The relationship between electricity and magnetism.", "The relationship between heat and temperature.", "The relationship between gravity and mass.", "The relationship between light and matter."],
            answer: "The relationship between electricity and magnetism."
        },
        {
            question: "Who is credited with the discovery of electromagnetic induction in 1831, as mentioned in the text?",
            options: ["Isaac Newton", "Albert Einstein", "Michael Faraday", "Nikola Tesla"],
            answer: "Michael Faraday"
        },
        {
            question: "According to the lesson, what is required to induce an electric current in a wire loop?",
            options: ["A high electrical resistance in the loop.", "A changing magnetic field near the loop.", "A constant electric current in the loop.", "A static magnetic field."],
            answer: "A changing magnetic field near the loop."
        },
        {
            question: "What happens to the magnetic field when a wire carrying an electric current is wound into a coil?",
            options: ["The magnetic field disappears.", "The magnetic field is weakened.", "The magnetic field is greatly intensified.", "The magnetic field reverses its direction."],
            answer: "The magnetic field is greatly intensified."
        },
        {
            question: "Hans Christian Ørsted's discovery in 1820 was significant because it showed that:",
            options: ["Changing magnetic fields induce electric currents.", "Magnets can only attract iron.", "Static electricity has no relation to magnetism.", "Electric currents create magnetic fields."],
            answer: "Electric currents create magnetic fields."
        },
        {
            question: "The primary outcome of Faraday's experiments on electromagnetic induction was the understanding that:",
            options: ["Electricity and magnetism are completely separate phenomena.", "Magnets can be used to store electric charge.", "A changing magnetic field can generate an electric current.", "Only permanent magnets can interact with electric currents."],
            answer: "A changing magnetic field can generate an electric current."
        },
        {
            question: "Which of the following is NOT explicitly mentioned as an objective of the lesson?",
            options: ["Calculating the speed of light using electromagnetic principles.", "Explaining Faraday's Law of Induction.", "Describing the relationship between a changing magnetic field and induced EMF.", "Analyzing applications like electric generators and transformers."],
            answer: "Calculating the speed of light using electromagnetic principles."
        },
        {
            question: "What term is used to describe the 'push' that causes electric current to flow when induced by a changing magnetic field?",
            options: ["Electrical Resistance", "Magnetic Flux", "Electromotive Force (EMF)", "Electric Potential Energy"],
            answer: "Electromotive Force (EMF)"
        },
        {
            question: "According to the brief history provided, what was one of Faraday's key experimental observations?",
            options: ["A stationary magnet placed near a coil produces a continuous current.", "Moving a magnet in and out of a coil causes a current to flow in the coil.", "Only very strong magnets can induce an electric current.", "Electric currents can be induced without any magnetic field present."],
            answer: "Moving a magnet in and out of a coil causes a current to flow in the coil."
        },
        {
            question: "The discovery of electromagnetic induction is crucial for the development of which of the following technologies?",
            options: ["Incandescent light bulbs", "Transistors", "Electric generators", "Simple levers"],
            answer: "Electric generators"
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
        submitButton.textContent = 'Submit Answers';
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
        backButtonPopup.textContent = 'Back to Quiz & Assessment List';
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
        popupContainer.appendChild(backButtonPopup);
        popupContainer.appendChild(reviewButtonPopup);

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