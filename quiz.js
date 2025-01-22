const apiUrl = "https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple";

    async function fetchTriviaQuestions() {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch trivia questions.");
        const data = await response.json();
        renderQuiz(data.results);
      } catch (error) {
        console.error(error);
        document.getElementById('quiz').textContent = "Error loading quiz.";
      }
    }

    function renderQuiz(questions) {
      const quizDiv = document.getElementById('quiz');
      let score = 0;

      questions.forEach((questionObj, index) => {
        const answers = [...questionObj.incorrect_answers, questionObj.correct_answer]
          .sort(() => Math.random() - 0.5)
          .map(answer => `
            <li>
              <label>
                <input type="radio" name="question${index}" value="${answer}">
                ${answer}
              </label>
            </li>
          `).join('');

        quizDiv.innerHTML += `
          <div class="question">
            <h3>Question ${index + 1}:</h3>
            <p>${questionObj.question}</p>
            <ul class="answers">${answers}</ul>
            <button onclick="checkAnswer(${index}, '${questionObj.correct_answer.replace(/'/g, "\\'")}')">Submit Answer</button>
            <p class="result" id="result${index}"></p>
          </div>
        `;
      });

      window.checkAnswer = function (index, correctAnswer) {
        const selected = document.querySelector(`input[name="question${index}"]:checked`);
        const resultDiv = document.getElementById(`result${index}`);

        if (!selected) {
          resultDiv.textContent = "Please select an answer!";
          resultDiv.className = "incorrect";
          return;
        }

        resultDiv.textContent = selected.value === correctAnswer ? "Correct!" : `Incorrect! The correct answer was: ${correctAnswer}`;
        resultDiv.className = selected.value === correctAnswer ? "correct" : "incorrect";

        // Disable further interaction
        document.querySelectorAll(`input[name="question${index}"]`).forEach(input => input.disabled = true);

        // Update score
        if (selected.value === correctAnswer) score++;
        document.getElementById('score').innerHTML = `<h2>Score: ${score} / ${questions.length}</h2>`;
      };
    }

    fetchTriviaQuestions();