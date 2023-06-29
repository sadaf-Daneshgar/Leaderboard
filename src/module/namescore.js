const gameID = 'Zl4d7IVkemOTTVg2fUdz';
const baseURL = `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${gameID}/scores`;

const refreshScores = async () => {
  const table = document.querySelector('.table');

  try {
    const response = await fetch(baseURL);
    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid response from the API');
    }

    table.innerHTML = `
      <tr>
        <th>Name</th>
        <th>Score</th>
      </tr>
    `;

    data.forEach((score) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${score.user}</td>
        <td>${score.score}</td>
      `;
      table.appendChild(row);
    });
  } catch (error) {
    const errorMessage = document.createElement('p');
    table.appendChild(errorMessage);
  }
};

const addScoreToTable = (name, score) => {
  const table = document.querySelector('.table');
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${name}</td>
    <td>${score}</td>
  `;
  table.appendChild(row);
};

const submitScore = async () => {
  const nameInput = document.getElementById('name');
  const scoreInput = document.getElementById('score');
  const formPart = document.querySelector('.form-part');
  const name = nameInput.value.trim();
  const number = scoreInput.value.trim();
  if (name === '' || number === '') {
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'Please enter your name and score.';
    formPart.appendChild(errorMessage);
    return;
  }
  try {
    const response = await fetch(baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: name, score: number }),
    });
    if (!response.ok) {
      throw new Error('Error submitting score. Please try again later.');
    }
    const successMessage = document.createElement('p');
    successMessage.textContent = 'Score submitted successfully.';
    formPart.appendChild(successMessage);
    nameInput.value = '';
    scoreInput.value = '';
    addScoreToTable(name, number);

    const storedScores = localStorage.getItem('scores');
    const scores = storedScores ? JSON.parse(storedScores) : [];
    scores.push({ name, score: number });
    localStorage.setItem('scores', JSON.stringify(scores));
  } catch (error) {
    const errorMessage = document.createElement('p');
    errorMessage.textContent = error.message || 'Error submitting score. Please try again later.';
    formPart.appendChild(errorMessage);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const submitButton = document.querySelector('.btn-sub');
  submitButton.addEventListener('click', submitScore);
  const refreshButton = document.querySelector('.btn-ref');
  refreshButton.addEventListener('click', refreshScores);
  refreshScores();

  const storedScores = localStorage.getItem('scores');
  if (storedScores) {
    const scores = JSON.parse(storedScores);
    scores.forEach((score) => {
      addScoreToTable(score.name, score.score);
    });
  }
});
