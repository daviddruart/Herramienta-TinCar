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


/* ======= MÓDULO AUDITORÍA ======= */
// Estructura: { id, type, title, desc, severity, owner, due (ISO), status: "Abierto"/"Cerrado", created }
let auditFindings = [];

// Cargar desde localStorage si existe
(function loadAudit() {
  try {
    const raw = localStorage.getItem("auditFindings_v1");
    if (raw) auditFindings = JSON.parse(raw);
  } catch (e) {
    auditFindings = [];
  }
  renderAuditTable();
  updateAuditStats();
})();

// DOM references
const addAuditBtn = document.getElementById("addAuditBtn");
const clearAuditBtn = document.getElementById("clearAuditBtn");

if (addAuditBtn) addAuditBtn.addEventListener("click", addFinding);
if (clearAuditBtn) clearAuditBtn.addEventListener("click", clearAuditForm);

function saveAuditStorage() {
  localStorage.setItem("auditFindings_v1", JSON.stringify(auditFindings));
}

function addFinding() {
  const type = document.getElementById("auditType").value;
  const title = document.getElementById("auditTitle").value.trim();
  const desc = document.getElementById("auditDesc").value.trim();
  const severity = document.getElementById("auditSeverity").value;
  const owner = document.getElementById("auditOwner").value.trim();
  const due = document.getElementById("auditDue").value; // ISO yyyy-mm-dd

  if (!title || !desc || !owner || !due) {
    alert("Por favor completa título, descripción, responsable y fecha límite.");
    return;
  }

  const id = Date.now(); // simple id
  const created = new Date().toISOString();
  auditFindings.unshift({ id, type, title, desc, severity, owner, due, status: "Abierto", created });
  saveAuditStorage();
  renderAuditTable();
  updateAuditStats();
  clearAuditForm();
}

function clearAuditForm() {
  document.getElementById("auditTitle").value = "";
  document.getElementById("auditDesc").value = "";
  document.getElementById("auditOwner").value = "";
  document.getElementById("auditDue").value = "";
  document.getElementById("auditSeverity").value = "Mayor";
  document.getElementById("auditType").value = "Interna";
}

function renderAuditTable() {
  const tbody = document.querySelector("#auditTable tbody");
  const noFindings = document.getElementById("noFindings");
  if (!tbody) return;

  tbody.innerHTML = "";
  if (auditFindings.length === 0) {
    noFindings.style.display = "block";
    return;
  } else {
    noFindings.style.display = "none";
  }

  auditFindings.forEach((f, idx) => {
    const tr = document.createElement("tr");

    // index
    const tdIndex = document.createElement("td");
    tdIndex.textContent = auditFindings.length - idx; // contador descendente
    tr.appendChild(tdIndex);

    // type
    const tdType = document.createElement("td");
    tdType.textContent = f.type;
    tr.appendChild(tdType);

    // title (hover show desc)
    const tdTitle = document.createElement("td");
    const titleEl = document.createElement("div");
    titleEl.textContent = f.title;
    titleEl.title = f.desc;
    tdTitle.appendChild(titleEl);
    tr.appendChild(tdTitle);

    // severity badge
    const tdSev = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = `badge ${f.severity.replace(/\s/g, '')}`;
    badge.textContent = f.severity;
    tdSev.appendChild(badge);
    tr.appendChild(tdSev);

    // owner
    const tdOwner = document.createElement("td");
    tdOwner.textContent = f.owner;
    tr.appendChild(tdOwner);

    // due date (format)
    const tdDue = document.createElement("td");
    tdDue.textContent = f.due;
    // mark overdue with red if past and still open
    const dueDate = new Date(f.due + "T23:59:59");
    if (f.status === "Abierto" && dueDate < new Date()) {
      tdDue.style.color = "#c82333";
      tdDue.style.fontWeight = "700";
    }
    tr.appendChild(tdDue);

    // status
    const tdStatus = document.createElement("td");
    tdStatus.textContent = f.status;
    tdStatus.className = f.status === "Cerrado" ? "status-closed" : "status-open";
    tr.appendChild(tdStatus);

    // actions
    const tdActions = document.createElement("td");

    // close button
    if (f.status === "Abierto") {
      const closeBtn = document.createElement("button");
      closeBtn.textContent = "Cerrar";
      closeBtn.className = "audit-action-btn close";
      closeBtn.onclick = () => closeFinding(f.id);
      tdActions.appendChild(closeBtn);
    }

    // delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Eliminar";
    delBtn.className = "audit-action-btn delete";
    delBtn.onclick = () => {
      if (confirm("Eliminar hallazgo? Esta acción es irreversible.")) deleteFinding(f.id);
    };
    tdActions.appendChild(delBtn);

    tr.appendChild(tdActions);

    tbody.appendChild(tr);
  });
}

function closeFinding(id) {
  const idx = auditFindings.findIndex(x => x.id === id);
  if (idx === -1) return;
  auditFindings[idx].status = "Cerrado";
  saveAuditStorage();
  renderAuditTable();
  updateAuditStats();
}

function deleteFinding(id) {
  auditFindings = auditFindings.filter(x => x.id !== id);
  saveAuditStorage();
  renderAuditTable();
  updateAuditStats();
}

function updateAuditStats() {
  const total = auditFindings.length;
  const closed = auditFindings.filter(x => x.status === "Cerrado").length;
  const open = auditFindings.filter(x => x.status === "Abierto").length;
  const overdue = auditFindings.filter(x => {
    if (x.status !== "Abierto") return false;
    const due = new Date(x.due + "T23:59:59");
    return due < new Date();
  }).length;

  // DOM updates
  const setText = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  setText("statTotal", total);
  setText("statClosed", closed);
  setText("statOpen", open);
  setText("statOverdue", overdue);

  // progress bars: closed %
  const closedPct = total === 0 ? 0 : Math.round((closed / total) * 100);
  const openPct = total === 0 ? 0 : Math.round((open / total) * 100);

  const barClosed = document.getElementById("barClosed");
  const barOpen = document.getElementById("barOpen");
  if (barClosed) { barClosed.style.width = closedPct + "%"; barClosed.textContent = closedPct + "%"; }
  if (barOpen) { barOpen.style.width = openPct + "%"; barOpen.textContent = openPct + "%"; }

  // if any overdue, color barOpen red a bit
  if (overdue > 0) {
    if (barOpen) barOpen.style.background = "#dc3545"; // rojo
  } else {
    if (barOpen) barOpen.style.background = "#f0ad4e"; // naranja para abiertos
  }
}
