// Sélection des éléments du DOM nécessaires pour l'application
const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");

// Récupération des tâches depuis le localStorage, ou initialisation d'un tableau vide
const taskData = JSON.parse(localStorage.getItem("data")) || [];
let currentTask = {}; // Objet pour stocker la tâche en cours d'édition

// Fonction pour supprimer les caractères spéciaux d'une chaîne
const removeSpecialChars = (val) => {
  return val.trim().replace(/[^A-Za-z0-9\-\s]/g, '');
}

// Fonction pour ajouter ou mettre à jour une tâche
const addOrUpdateTask = () => {
   // Vérifie si le champ titre est vide
   if (!titleInput.value.trim()) {
    alert("Please provide a title");
    return;
  }

  // Recherche l'index de la tâche en cours dans le tableau des tâches
  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);

  // Création de l'objet tâche avec un identifiant unique basé sur le titre et la date actuelle
  const taskObj = {
    id: `${removeSpecialChars(titleInput.value).toLowerCase().split(" ").join("-")}-${Date.now()}`,
    title: removeSpecialChars(titleInput.value),
    date: removeSpecialChars(dateInput.value),
    description: removeSpecialChars(descriptionInput.value),
  };

  // Si la tâche n'existe pas, l'ajouter au tableau, sinon la mettre à jour
  if (dataArrIndex === -1) {
    taskData.unshift(taskObj); // Ajoute la nouvelle tâche en début de liste
  } else {
    taskData[dataArrIndex] = taskObj; // Met à jour la tâche existante
  }

  // Sauvegarde des tâches dans le localStorage
  localStorage.setItem("data", JSON.stringify(taskData));
  
  updateTaskContainer(); // Met à jour l'affichage des tâches
  reset(); // Réinitialise le formulaire
};

// Fonction pour mettre à jour l'affichage des tâches dans le conteneur
const updateTaskContainer = () => {
  tasksContainer.innerHTML = ""; // Réinitialise le contenu du conteneur

  // Boucle à travers chaque tâche pour générer l'affichage
  taskData.forEach(({ id, title, date, description }) => {
    tasksContainer.innerHTML += `
        <div class="task" id="${id}">
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Description:</strong> ${description}</p>
          <button onclick="editTask(this)" type="button" class="btn">Edit</button>
          <button onclick="deleteTask(this)" type="button" class="btn">Delete</button> 
        </div>
      `;
  });
};

// Fonction pour supprimer une tâche
const deleteTask = (buttonEl) => {
  // Recherche de l'index de la tâche à supprimer
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );

  // Suppression de l'élément du DOM
  buttonEl.parentElement.remove();
  taskData.splice(dataArrIndex, 1); // Suppression de la tâche du tableau
  
  // Mise à jour du localStorage
  localStorage.setItem("data", JSON.stringify(taskData));
}

// Fonction pour éditer une tâche existante
const editTask = (buttonEl) => {
  // Recherche de l'index de la tâche à éditer
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );

  // Récupération de la tâche et remplissage du formulaire avec ses valeurs
  currentTask = taskData[dataArrIndex];

  titleInput.value = currentTask.title;
  dateInput.value = currentTask.date;
  descriptionInput.value = currentTask.description;

  // Modification du bouton pour indiquer une mise à jour
  addOrUpdateTaskBtn.innerText = "Update Task";

  // Affichage du formulaire
  taskForm.classList.toggle("hidden");  
}

// Fonction pour réinitialiser le formulaire après ajout/mise à jour d'une tâche
const reset = () => {
  addOrUpdateTaskBtn.innerText = "Add Task"; // Réinitialise le texte du bouton
  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
  taskForm.classList.toggle("hidden"); // Cache le formulaire
  currentTask = {}; // Réinitialise la tâche en cours
}

// Vérifie si des tâches existent déjà et met à jour l'affichage
if (taskData.length) {
  updateTaskContainer();
}

// Événement pour ouvrir le formulaire d'ajout de tâche
openTaskFormBtn.addEventListener("click", () =>
  taskForm.classList.toggle("hidden")
);

// Événement pour fermer le formulaire, avec confirmation si des modifications sont en cours
closeTaskFormBtn.addEventListener("click", () => {
  const formInputsContainValues = titleInput.value || dateInput.value || descriptionInput.value;
  const formInputValuesUpdated = titleInput.value !== currentTask.title || dateInput.value !== currentTask.date || descriptionInput.value !== currentTask.description;

  // Si le formulaire contient des modifications non sauvegardées, afficher une boîte de confirmation
  if (formInputsContainValues && formInputValuesUpdated) {
    confirmCloseDialog.showModal();
  } else {
    reset();
  }
});

// Événement pour annuler la fermeture du formulaire
cancelBtn.addEventListener("click", () => confirmCloseDialog.close());

// Événement pour confirmer l'abandon des modifications et fermer le formulaire
discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  reset();
});

// Événement de soumission du formulaire pour ajouter ou mettre à jour une tâche
taskForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Empêche le rechargement de la page
  addOrUpdateTask(); // Ajoute ou met à jour la tâche
});

