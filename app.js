// ==========================================
// LOGIN & REGISTRIERUNG LOGIK
// ==========================================

function register() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    const msg = document.getElementById('auth-message');

    if (!user || !pass) {
        msg.innerText = "Bitte fülle beide Felder aus!";
        msg.style.color = "#ef4444"; // Rot
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || {};
    
    if (users[user]) {
        msg.innerText = "Benutzername existiert bereits!";
        msg.style.color = "#ef4444"; // Rot
    } else {
        users[user] = pass;
        localStorage.setItem('users', JSON.stringify(users));
        msg.style.color = "#4ade80"; // Grün
        msg.innerText = "Erfolgreich registriert! Du kannst dich jetzt einloggen.";
        
        // Felder leeren
        document.getElementById('username').value = "";
        document.getElementById('password').value = "";
    }
}

function login() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    const msg = document.getElementById('auth-message');

    let users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[user] && users[user] === pass) {
        localStorage.setItem('loggedInUser', user);
        window.location.href = 'notizen-app.html'; // Weiterleitung zur App
    } else {
        msg.style.color = "#ef4444"; // Rot
        msg.innerText = "Falscher Benutzername oder Passwort.";
    }
}

function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'notizen-login.html';
}

// Prüft auf der App-Seite, ob jemand eingeloggt ist
function checkAuth() {
    const user = localStorage.getItem('loggedInUser');
    if (!user) {
        window.location.href = 'notizen-login.html';
    } else {
        document.getElementById('display-username').innerText = user;
    }
}

// ==========================================
// NOTIZEN LOGIK (CRUD)
// ==========================================

function getNotesKey() {
    const user = localStorage.getItem('loggedInUser');
    return `notes_${user}`;
}

function loadNotes() {
    const container = document.getElementById('notes-container');
    if (!container) return; // Stoppen, wenn wir nicht auf der App-Seite sind

    const notes = JSON.parse(localStorage.getItem(getNotesKey())) || [];
    container.innerHTML = '';

    if(notes.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--muted);">Du hast noch keine Notizen angelegt.</p>';
        return;
    }

    notes.forEach((note, index) => {
        const card = document.createElement('div');
        card.className = 'note-card';
        card.innerHTML = `
            <p id="note-text-${index}" style="color: var(--text); white-space: pre-wrap;">${note}</p>
            <div class="note-actions">
                <button class="note-btn" onclick="editNote(${index})">Bearbeiten</button>
                <button class="note-btn delete" onclick="deleteNote(${index})">Löschen</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function addNote() {
    const input = document.getElementById('note-input');
    const text = input.value.trim();

    if (text) {
        let notes = JSON.parse(localStorage.getItem(getNotesKey())) || [];
        notes.push(text);
        localStorage.setItem(getNotesKey(), JSON.stringify(notes));
        input.value = '';
        loadNotes();
    }
}

function deleteNote(index) {
    let notes = JSON.parse(localStorage.getItem(getNotesKey())) || [];
    notes.splice(index, 1); // Entfernt genau diese Notiz
    localStorage.setItem(getNotesKey(), JSON.stringify(notes));
    loadNotes();
}

function editNote(index) {
    let notes = JSON.parse(localStorage.getItem(getNotesKey())) || [];
    const newText = prompt("Notiz bearbeiten:", notes[index]);
    
    if (newText !== null && newText.trim() !== "") {
        notes[index] = newText.trim();
        localStorage.setItem(getNotesKey(), JSON.stringify(notes));
        loadNotes();
    }
}
