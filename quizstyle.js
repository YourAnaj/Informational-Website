document.addEventListener('DOMContentLoaded', function() {
    const quizTypeRadios = document.querySelectorAll('input[name="quizType"]');
    const startQuizButtons = document.querySelectorAll('.start-quiz-btn');

    function updateQuizButtons() {
        const selectedType = document.querySelector('input[name="quizType"]:checked').value;

        startQuizButtons.forEach(button => {
            const mcUrl = button.dataset.mcUrl;
            const idUrl = button.dataset.idUrl;

            if (selectedType === 'multiple-choice') {
                button.textContent = 'Start Multiple Choice Quiz';
                button.href = mcUrl;
            } else if (selectedType === 'identification') {
                button.textContent = 'Start Identification Quiz';
                button.href = idUrl;
            }
        });
    }

    quizTypeRadios.forEach(radio => {
        radio.addEventListener('change', updateQuizButtons);
    });

    updateQuizButtons();
});
