

// Récupération des éléments du DOM
const gallery = document.querySelector(".gallery")
const categories = document.querySelector("#categories")
const token = sessionStorage.getItem("token") // Le nom que tu auras donné


//  Récupéreration des travaux
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}

async function createWorks(work) {
  //création des balises 
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");
  img.src = work.imageUrl; // récupération de l'image de travaux
  figcaption.textContent = work.title;
  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
}

async function displayWorks() {
  const works = await getWorks();
  gallery.innerHTML = ""; // Vide la galerie avant de l'afficher
  works.forEach((work) => {
    createWorks(work)
  });
}
displayWorks();

// le tableau des catégories

async function getCategorys() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}

async function displayCategorysButtons() {
  const categorys = await getCategorys();

  categorys.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.id = category.id;
    categories.appendChild(btn);
  });
}

//Gestion de l'affichage des boutons catégories 


if (!token) {
  displayCategorysButtons();
} else {
  //Hide categories
  document.querySelector("#categories").style.display = "none";
  document.querySelector("#edit-works").style.display = "flex";
  document.querySelector(".barNoir").style.display = "flex";
  //ICI 
}

// filtrer par catégorie au click 

async function filterCategory() {
  const works = await getWorks();
  
  const buttons = document.querySelectorAll("#categories button");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      let btnId = e.target.id;
      gallery.innerHTML = "";
      if (btnId !== "0") {
        const worksTriCategory = works.filter((works) => {
          return works.categoryId == btnId;
        });
        worksTriCategory.forEach((works) => {
          createWorks(works);
        });
      } else {
        displayWorks();
      }
      
    });
  });
}

filterCategory();
//********ADMIN MODE******//
const isLoggedIn = false;

// Get reference to the login/logout button

function getlogin() {

  const logBtn = document.querySelector(".logBtn");
  const xmark = document.querySelector(".modal .fa-xmark");
  const xmarks = document.querySelector(".modals .fa-xmark");
  const modifier = document.querySelector("#edit-works");
  const modal = document.querySelector(".modal");
  const modals = document.querySelector(".modals");
  const arrow = document.querySelector(".fa-arrow-left")
  const addPictureBtn = document.querySelector("#addPictureBtn");
  //display admin mode if token is found and has the expected length (optional chaining)
  if (sessionStorage.getItem("token")?.length == 143) {
    //change login en logout
    logBtn.innerText = "logout";
    logBtn.addEventListener("click", (e) => {
      e.preventDefault()
      sessionStorage.removeItem("token");
      window.location.href = "./index.html"; // Redirige vers l'accueil après déconnexion
    });
  }
  //supression du modal work 
  xmark.addEventListener("click", () =>{
    modal.style.display = "none";
  })

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
  //supression du modal ajout 
  xmarks.addEventListener("click", () =>{
    modals.style.display = "none";
  })
   // ouverture du modal
  modifier.addEventListener("click", () => {
    modal.style.display = "flex";
  })
   // du modal ajout au modal element 
  arrow.addEventListener("click", () => {
    modal.style.display = "flex";
    modals.style.display = "none";
  })
  
  // ouverture de l'ajout 
  addPictureBtn.addEventListener("click", () => {
    modals.style.display = "flex";
    modal.style.display = "none";
  })

}
getlogin();


/////////////////////////// MODAL //////////////////////////
const modifier = document.querySelector("#edit-works");
const modalContent = document.querySelector(".modalContent");

async function displaymodal() {
  modalContent.innerHTML = ""
  const works = await getWorks()
  works.forEach(work => {
    const figure = document.createElement("figure")
    const img = document.createElement("img") 
    const span = document.createElement("span") 
    const trash = document.createElement("i")
    trash.classList.add("fa-solid", "fa-trash-can")
    trash.id = work.id
    img.src = work.imageUrl
    span.appendChild(trash)
    figure.appendChild(span)
    figure.appendChild(img)
    modalContent.appendChild(figure)
  });
  deleteWorks()
}
displaymodal();

// Suppression d'un Work à l'appui de l'icone

function deleteWorks() {
  const trashAll = document.querySelectorAll(".fa-trash-can")
  trashAll.forEach(trash => {
    trash.addEventListener("click", (e) =>{
      const id = trash.id
      const init = { 
        method:"DELETE",
        headers:{"content-type":"application/json", "Authorization": "Bearer " + token},
      }
      
      fetch("http://localhost:5678/api/works/" +id,init)
  
      .then((data) => {

        displaymodal()
        getWorks()
        location.reload();
      })
    })
  });
}

// ajout d'un image dans notre modal
const ajoutImg = document.querySelector("#labelPhoto img")
const inputFile = document.querySelector("#labelPhoto input")
const labelFile = document.querySelector("#labelPhoto label")
const pFile = document.querySelector("#labelPhoto p")
const iconeFile = document.querySelector("#labelPhoto .fa-image")

//le changement dans l'input

inputFile.addEventListener("change",()=>{
  const file = inputFile.files[0]
  
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e){
      ajoutImg.src = e.target.result
      ajoutImg.style.display = "flex" 
      labelFile.style.display = "none" 
      iconeFile.style.display = "none"
      pFile.style.display = "none"
    }
    reader.readAsDataURL(file);
  }

})

//créer une liste de categories dans "select"
async function displayCategoryModal(){
  const categorys = await getCategorys()
  categorys.forEach(category =>{
    const option = document.createElement("option")
    option.value = category.id
    option.textContent = category.name
    document.querySelector("#selectCategory").appendChild(option)
  })
}
displayCategoryModal()


// ajouter une image avec un "POST"
const addToWorksData = function(data, categoryName) {
  const newWork = {};
  newWork.title = data.title;
  newWork.id = data.id;
  newWork.category = {"id" : data.categoryId, "name" : categoryName};
  newWork.imageUrl = data.imageUrl;
  worksData.push(newWork);
}
//pour le btn valide
const btnValider = document.getElementById("valider");
btnValider.addEventListener("click", addNewWork);

function addNewWork(e) {
  e.preventDefault(); 

  const token = sessionStorage.getItem("token");

  const title = document.getElementById("title").value;
  const category = document.getElementById("selectCategory").value;
  const image = document.getElementById("file").files[0];


  if(!title || !category || !image) {
    alert('Veuillez remplir tous les champs du formulaire.')
    return;
  } 
 
  
  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", category);
  formData.append("image", image);

  fetch("http://localhost:5678/api/works", {
    method: "POST",
    body: formData,
    headers: {
      "Accept" : 'application/json', 
      "Authorization" : `Bearer ${token}`
    }
  })
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      console.error("Erreur:", response.status);
    }
  }) 
  .then ((data) => {
    displayWorks()
    document.querySelector(".modals").style.display = "none";
    location.reload();
  }) 
  
}

const title = document.getElementById("title");
const selectCategory = document.getElementById("selectCategory");
const photo = document.getElementById("photo");
const valider = document.getElementById("valider");

function checkForm() {
  if (title.value != "" || selectCategory.value != "" || photo.value != "") {
    valider.style.backgroundColor = "#1D6154";
  } else {
    valider.style.backgroundColor = "";
    }
  }

title.addEventListener('input', checkForm);
selectCategory.addEventListener('change', checkForm);
photo.addEventListener('change', checkForm);
