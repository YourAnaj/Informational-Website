document.addEventListener('DOMContentLoaded', function() {
    const quizForm = document.getElementById('introductionmc'); // Keep this ID
    const resultDiv = document.getElementById('result');
    const backButton = document.getElementById('backButton');
    const quizContainer = document.querySelector('.quiz-container');
    const allQuestions = [
        {
            question: "What is the formula for calculating magnetic flux (Φ) through a single loop?",
            options: ["Φ = B / A", "Φ = B + A", "Φ = B * A", "Φ = A / B"],
            answer: "Φ = B × A"
        },
        {
            question: "If the magnetic field changes from 0.3 T to 0.5 T over an area of 0.8 m², what is the change in magnetic flux (△Φ)?",
            options: ["0.2 Wb", "0.24 Wb", "0.4 Wb", "0.16 Wb"],
            answer: "0.16 Wb"
        },
        {
            question: "According to Faraday’s Law, what is the induced EMF in a single loop when the magnetic flux changes by 0.16 Wb over 4 seconds?",
            options: ["-0.04 V", "0.04 V", "0.4 V", "-0.4 V"],
            answer: "-0.04 V"
        },
        {
            question: "In the given example, what is the orientation of the magnetic field with respect to the wire loop?",
            options: ["Parallel to the loop", "Perpendicular to the loop", "At a 45° angle", "Tangential to the loop"],
            answer: "Perpendicular to the loop"
        },
        {
            question: "What does the negative sign in Faraday’s Law indicate about the induced EMF?",
            options: ["The current increases", "The magnetic field increases", "The direction of induced current opposes the change in flux", "The magnetic field is parallel to the loop"],
            answer: "The direction of induced current opposes the change in flux"
        },
        {
            question: "Which of the following statements is true regarding the induced EMF in a single loop of wire?",
            options: ["The induced EMF is independent of the rate of change of the magnetic flux.", "The induced EMF is directly proportional to the rate of change of the magnetic flux.", "The induced EMF decreases as the magnetic field strength increases.", "The induced EMF is not affected by the area of the loop."],
            answer: "The induced EMF is directly proportional to the rate of change of the magnetic flux."
        },
        {
            question: "What is the effect of increasing the area of the loop on the induced EMF, while keeping the rate of change of magnetic flux constant?",
            options: ["The induced EMF decreases.", "The induced EMF increases.", "The induced EMF remains the same.", "The induced EMF becomes zero."],
            answer: "The induced EMF increases."
        },
        {
            question: "If the magnetic field changes from 0.2 T to 0.6 T in 5 seconds over an area of 0.5 m², what is the induced EMF?",
            options: ["0.08 V", "0.12 V", "0.16 V", "0.10 V"],
            answer: "0.08 V"
        },
        {
            question: "According to Lenz’s Law, the induced EMF in a loop will:",
            options: ["Always oppose the change in magnetic flux.", "Always enhance the change in magnetic flux.", "Be independent of the direction of the magnetic field.", "Always be in the same direction as the changing magnetic field."],
            answer: "Always oppose the change in magnetic flux."
        },
        {
            question: "What happens to the induced EMF when the rate of change of the magnetic flux is increased, while keeping the magnetic field and area constant?",
            options: ["The induced EMF decreases.", "The induced EMF increases.", "The induced EMF remains unchanged.", "The induced EMF becomes zero."],
            answer: "The induced EMF increases."
        },
        {
            question: "What effect does increasing the number of turns in a coil have on the induced EMF?",
            options: ["It decreases the EMF", "It has no effect", "It increases the EMF", "It reverses the EMF direction"],
            answer: "It increases the EMF"
        },
        {
            question: "According to Faraday’s Law, what causes an EMF to be induced in a coil?",
            options: ["A constant magnetic field", "A magnetic field parallel to the coil", "A change in magnetic flux through the coil", "The resistance of the wire"],
            answer: "A change in magnetic flux through the coil"
        },
        {
            question: "What does the negative sign in Faraday’s Law of Induction represent?",
            options: ["Decrease in coil turns", "Loss of magnetic material", "Opposing direction of induced current (Lenz's Law)", "Negative energy transfer"],
            answer: "Opposing direction of induced current (Lenz's Law)"
        },
        {
            question: "Which combination would result in a larger induced EMF in a coil?",
            options: ["Fewer turns, slow change in magnetic field", "More turns, rapid change in magnetic field", "Smaller coil area, constant field", "Coil placed parallel to magnetic field"],
            answer: "More turns, rapid change in magnetic field"
        },
        {
            question: "What is the unit of magnetic flux used in electromagnetic induction problems?",
            options: ["Tesla", "Ampere", "Weber", "Volt"],
            answer: "Weber"
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
