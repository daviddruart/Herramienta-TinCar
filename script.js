// --- CAMBIAR DE SECCIONES ---
function toggleContent(id) {
  let sections = document.querySelectorAll('.content');
  sections.forEach(sec => sec.style.display = 'none');
  const el = document.getElementById(id);
  if (el) el.style.display = 'block';
}

// ===============================
//  IMPLEMENTACIÓN: GESTOR DE DOCUMENTOS
// ===============================
let filesArray = [];

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const fileList = document.getElementById("fileList");

  if (fileInput) {
    fileInput.addEventListener("change", () => {
      // convertir FileList en array y añadir al arreglo principal
      filesArray = [...filesArray, ...fileInput.files];
      renderFileList();
      fileInput.value = ""; // limpiar input para permitir nuevas selecciones
    });
  }

  function renderFileList() {
    if (!fileList) return;
    fileList.innerHTML = ""; 
    if (filesArray.length > 0) {
      const ul = document.createElement("ul");
      filesArray.forEach((file, index) => {
        const li = document.createElement("li");
        li.textContent = file.name;

        // botón eliminar
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

  // opcional: mostrar la sección implementación por defecto
  // toggleContent('impl');
});

// ===============================
//  CAPACITACIÓN: NOMBRE + QUIZ Y PROGRESO
// ===============================
let progress = 0;
let currentQuestion = 1;
let participant = ""; // 👉 Nombre del participante

// Iniciar capacitación pidiendo nombre
function startTraining() {
  const nameInputEl = document.getElementById("participantName");
  if (!nameInputEl) return;
  const nameInput = nameInputEl.value.trim();
  if (nameInput === "") {
    alert("Por favor ingresa tu nombre antes de iniciar.");
    return;
  }

  participant = nameInput; // guardar nombre
  document.getElementById("startSection").style.display = "none";

  const welcome = document.getElementById("welcomeMessage");
  if (welcome) {
    welcome.textContent = `Bienvenido, ${participant}. Inicia el cuestionario.`;
    welcome.style.display = "block";
  }

  const quizDiv = document.getElementById("quiz");
  if (quizDiv) quizDiv.style.display = "block";
}

function updateProgress() {
  const bar = document.getElementById("progress-bar");
  if (!bar) return;
  bar.style.width = progress + "%";
  bar.textContent = progress + "%";

  if (progress === 100) {
    const finalMsg = document.getElementById("finalMessage");
    if (finalMsg) finalMsg.style.display = "block";
    const dl = document.getElementById("downloadCert");
    if (dl) dl.style.display = "inline-block";
  }
}

function checkAnswer(questionNumber, option) {
  const correctAnswers = {
    1: "b",
    2: "a",
    3: "b",
    4: "a"
  };

  const result = document.getElementById("quizResult" + questionNumber);
  if (!result) return;

  if (option === correctAnswers[questionNumber]) {
    result.textContent = "✅ Correcto";
    result.style.color = "green";

    // avanzar solo si es la pregunta actual
    if (questionNumber === currentQuestion) {
      progress += 25;
      updateProgress();

      // mostrar la siguiente pregunta si existe
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

// ===============================
//  GENERAR CERTIFICADO EN PDF
// ===============================
function generateCertificate() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Título
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Certificado de Capacitación", 55, 40);

  // Contenido
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.text("Se certifica que:", 30, 65);

  // 👉 Nombre dinámico
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(participant || "Participante", 30, 80);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.text("Ha completado satisfactoriamente el curso de", 30, 100);
  doc.text("capacitación en Gestión de Calidad ISO 9001.", 30, 110);

  // Firma simulada
  doc.setFont("helvetica", "italic");
  doc.text("Otorgado por: Simulador ISO 9001", 30, 130);

  // Fecha actual
  const today = new Date();
  const date = today.toLocaleDateString();
  doc.text("Fecha: " + date, 30, 140);

  // Guardar PDF
  doc.save("Certificado_ISO9001.pdf");
}
