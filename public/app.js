// feature: fronend autorefresh
async function fetchJSON(url, opts) {
  const res = await fetch(url, opts);
  return res.json();
}

async function loadNotes() {
  const notes = await fetchJSON("/api/notes");
  const container = document.getElementById("notes");
  container.innerHTML = "";

  notes.forEach(n => {
    const div = document.createElement("div");
    div.className = "note";
    div.innerHTML = `<b>${n.title}</b><br>${n.content}<br><br>
    <button onclick="deleteNote(${n.id})">Delete</button>`;
    container.appendChild(div);
  });
}

async function addNote() {
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  await fetchJSON("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content })
  });
  loadNotes();
}

async function deleteNote(id) {
  await fetchJSON("/api/notes/" + id, { method: "DELETE" });
  loadNotes();
}

loadNotes();
