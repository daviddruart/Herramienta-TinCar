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
let currentQuestion = 1;

function updateProgress() {
  const bar = document.getElementById("progress-bar");
  bar.style.width = progress + "%";
  bar.textContent = progress + "%";
  if (progress === 100) {
    document.getElementById("finalMessage").style.display = "block";
  }
}

// --- QUIZ MULTIPREGUNTA ---
function checkAnswer(questionNumber, option) {
  const correctAnswers = {
    1: "b",
    2: "a",
    3: "b",
    4: "a"
  };

  const result = document.getElementById("quizResult" + questionNumber);

  if (option === correctAnswers[questionNumber]) {
    result.textContent = "✅ Correcto";
    result.style.color = "green";

    // aumentar progreso solo si está en la pregunta actual
    if (questionNumber === currentQuestion) {
      progress += 25;
      updateProgress();

      // mostrar siguiente pregunta si existe
      const nextQuestion = document.querySelectorAll(".question")[questionNumber];
      if (nextQuestion) {
        nextQuestion.style.display = "block";
      }
      currentQuestion++;
    }
  } else {
    result.textContent = "❌ Incorrecto. Intenta de nuevo.";
    result.style.color = "red";
  }
}
