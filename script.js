function toggleContent(id) {
  let sections = document.querySelectorAll('.content');
  sections.forEach(sec => sec.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

// --- GESTOR DE DOCUMENTOS ---
let filesArray = [];

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const fileList = document.getElementById("fileList");

  fileInput.addEventListener("change", () => {
    // convertir FileList en array y sumarlo al array principal
    filesArray = [...filesArray, ...fileInput.files];
    renderFileList();
    fileInput.value = ""; // limpiar input para permitir volver a elegir
  });

  function renderFileList() {
    fileList.innerHTML = ""; 
    if (filesArray.length > 0) {
      const ul = document.createElement("ul");
      filesArray.forEach((file, index) => {
        const li = document.createElement("li");
        li.textContent = file.name;

        // botón de eliminar
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "❌";
        removeBtn.classList.add("remove-btn");
        removeBtn.onclick = () => {
          filesArray.splice(index, 1);
          renderFileList();
        };

        li.appendChild(removeBtn);
        ul.appendChild(li);
      });
      fileList.appendChild(ul);
    } else {
      fileList.innerHTML = "<p>No hay archivos seleccionados.</p>";
    }
  }
});


// --- PROGRESO CAPACITACIÓN ---
let progress = 0;

function increaseProgress() {
  if (progress < 100) {
    progress += 25; // cada click aumenta 25%
    const bar = document.getElementById("progress-bar");
    bar.style.width = progress + "%";
    bar.textContent = progress + "%";
  }
}

// --- MINI QUIZ ---
function checkAnswer(option) {
  const result = document.getElementById("quizResult");
  if (option === "b") {
    result.textContent = "✅ ¡Correcto! La ISO 9001 se enfoca en la satisfacción del cliente y la mejora continua.";
    result.style.color = "green";
  } else {
    result.textContent = "❌ Incorrecto. Intenta de nuevo.";
    result.style.color = "red";
  }
}