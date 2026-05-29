let people = [];

/* GETTERS */

function getCur() {
  return document.getElementById('currency').value;
}

function getDur() {
  return parseFloat(
    document.getElementById('duration').value
  ) || 0;
}

/* CTC TO HOURLY */

function ctcToHourly(ctc) {
  return ctc / 2080;
}

/* TOTAL COST */

function getTotalCost() {
  const duration = getDur();

  return people.reduce((sum, person) => {
    return sum + (
      person.hourly * duration / 60
    );
  }, 0);
}

/* ADD PERSON */

function addPerson() {

  const nameInput =
    document.getElementById('pname');

  const roleInput =
    document.getElementById('prole');

  const ctcInput =
    document.getElementById('pctc');

  const name =
    nameInput.value.trim();

  const role =
    roleInput.value;

  const ctc =
    parseFloat(ctcInput.value);

  if (!name || !ctc) {
    alert('Please fill all fields');
    return;
  }

  people.push({
    id: Date.now(),
    name,
    role,
    ctc,
    hourly: ctcToHourly(ctc)
  });

  nameInput.value = '';
  ctcInput.value = '';

  renderPeople();
  updateAll();
}

/* REMOVE PERSON */

function removePerson(id) {

  people = people.filter(person => {
    return person.id !== id;
  });

  renderPeople();
  updateAll();
}

/* RENDER PEOPLE */

function renderPeople() {

  const list =
    document.getElementById('people-list');

  if (people.length === 0) {

    list.innerHTML = `
      <div class="empty">
        No attendees yet.
      </div>
    `;

    return;
  }

  const cur = getCur();

  const duration = getDur();

  list.innerHTML = people.map(person => {

    const cost =
      person.hourly * duration / 60;

    return `
      <div class="person-item">

        <div>
          <strong>${person.name}</strong>
          <div>${person.role}</div>
        </div>

        <div>
          ${cur}${Math.round(cost)}
        </div>

        <button
          onclick="removePerson(${person.id})"
        >
          ✕
        </button>

      </div>
    `;
  }).join('');
}

/* UPDATE UI */

function updateAll() {

  const total =
    getTotalCost();

  const cur =
    getCur();

  document.getElementById(
    'total-cost'
  ).textContent =
    cur + Math.round(total);

  document.getElementById(
    'stat-people'
  ).textContent =
    people.length;

  document.getElementById(
    'stat-dur'
  ).textContent =
    getDur() + 'm';

  renderPeople();
}

/* AI ANALYSIS */

function analyzeAgenda() {

  const agenda =
    document
      .getElementById('agenda')
      .value
      .trim();

  if (!agenda) {
    alert('Please enter meeting agenda');
    return;
  }

  const total =
    Math.round(getTotalCost());

  const peopleCount =
    people.length;

  const duration =
    getDur();

  let result = '';

  if (
    agenda.toLowerCase().includes('decision') ||
    agenda.toLowerCase().includes('planning') ||
    agenda.toLowerCase().includes('roadmap')
  ) {

    result =
      `✅ Worth It\n\n` +
      `This meeting has a clear goal.\n\n` +
      `Estimated Cost: ₹${total}\n` +
      `People: ${peopleCount}\n` +
      `Duration: ${duration} minutes`;

  } else {

    result =
      `⚠️ Might Not Be Necessary\n\n` +
      `This meeting may be handled async.\n\n` +
      `Estimated Cost: ₹${total}`;
  }

  alert(result);
}

/* SAVE MEETING */

function saveMeeting() {

  const history =
    JSON.parse(
      localStorage.getItem(
        'meeting_history'
      ) || '[]'
    );

  history.unshift({
    total: getTotalCost(),
    people: people.length,
    duration: getDur(),
    date: new Date().toLocaleString()
  });

  localStorage.setItem(
    'meeting_history',
    JSON.stringify(history)
  );

  renderHistory();

  /* RESET VALUES */

  people = [];

  document.getElementById('pname').value = '';

  document.getElementById('pctc').value = '';

  document.getElementById('duration').value = 30;

  document.getElementById('agenda').value = '';

  document.getElementById('currency').value = '₹';

  renderPeople();

  updateAll();

  alert('Meeting saved successfully!');
}

/* RENDER HISTORY */

function renderHistory() {

  const list =
    document.getElementById(
      'history-list'
    );

  const history =
    JSON.parse(
      localStorage.getItem(
        'meeting_history'
      ) || '[]'
    );

  if (history.length === 0) {

    list.innerHTML = `
      <div class="empty">
        No saved meetings yet.
      </div>
    `;

    return;
  }

  list.innerHTML = history.map(item => {

    return `
      <div class="history-item">

        <div>
          ${item.people} people ·
          ${item.duration} min
        </div>

        <div>
          ₹${Math.round(item.total)}
        </div>

      </div>
    `;
  }).join('');
}

/* EVENT LISTENERS */

document.addEventListener(
  'DOMContentLoaded',
  () => {

    document
      .getElementById('duration')
      .addEventListener(
        'input',
        updateAll
      );

    document
      .getElementById('currency')
      .addEventListener(
        'change',
        updateAll
      );

    renderHistory();

    updateAll();
  }
);