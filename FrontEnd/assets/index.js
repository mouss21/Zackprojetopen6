/*
Récuperer les données de l'API
Méthode fetch
dans des variables const categories = fetch();
*/

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
  console.log(categorys);
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
  //ICI 
}




// filtrer par catégorie au click 

async function filterCategory() {
  const works = await getWorks();
  console.log(works);
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
      console.log(btnId);
    });
  });
}

filterCategory();

//********les modal generale***************



//********ADMIN MODE******//
const isLoggedIn = false;

// Get reference to the login/logout button


function getlogin() {

  const logBtn = document.querySelector(".logBtn");
  const xmark = document.querySelector(".modal .fa-xmark");
  const xmarks = document.querySelector(".modals .fa-xmark");
  const arrow = document.querySelector(".modals .fa-arrow-left");
  const modifier = document.querySelector("#edit-works");
  const modal = document.querySelector(".modal");
  const modals = document.querySelector(".modals");
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
    console.log("xmark");
    modal.style.display = "none";
  })
  //supression du modal ajout 
  xmarks.addEventListener("click", () =>{
    console.log("xmarks");
    modals.style.display = "none";
  })
   // ouverture du modal
  modifier.addEventListener("click", () => {
    console.log("modifier");
    modal.style.display = "flex";
  })
   // du modal ajout au modal element 
  arrow.addEventListener("click", () => {
    console.log("arrow");
    modal.style.display = "flex";
    modals.style.display = "none";
  })
  
  // ouverture de l'ajout 
  addPictureBtn.addEventListener("click", () => {
    console.log("addPictureBtn");
    modals.style.display = "flex";
    modal.style.display = "none";
  })

}
getlogin();


/////////////////////////// MODAL CONTENT //////////////////////////
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

// Suppression d'un Work à l'appui d'une icone

function deleteWorks() {
  const trashAll = document.querySelectorAll(".fa-trash-can")
  trashAll.forEach(trash => {
    trash.addEventListener("click", (e) =>{
      const id = trash.id
      const init = { 
        method:"DELETE",
        headers:{"content-type":"application/json"},
      }
      fetch("http://localhost:5678/api/works/" +id,init)
      .then((response) =>{
        if(!response.ok){
          console.log("la suppression n'a pas fonctionnée")
        }
        return response.json()
      })
      .then((data) => {
        console.log("la suppression a fonctionnée :",data)
        displaymodal()
        getWorks()
      })
    })
  });
}


  // btn ajouter photo . addEventLister pour basculer vers la deuxième page de la modale

// affichage et supression du modal

// ajout d'un image dans notre modal
const ajoutImg = document.querySelector("#labelPhoto img")
const inputFile = document.querySelector("#labelPhoto input")
const labelFile = document.querySelector("#labelPhoto label")
const pFile = document.querySelector("#labelPhoto p")
const iconeFile = document.querySelector("#labelPhoto .fa-image")

//le changement dans l'input

inputFile.addEventListener("change",()=>{
  const file = inputFile.files[0]
  console.log(file);
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
const foem = document.querySelector(".modals form")
const modalTitle = document.querySelector(".modals .modalTitle")
const category = document.querySelector(".modals .category")

foem.addEventListener("submit", async (e) =>{
  e.preventDefault()
  const formData = new formData(form)
  fetch("http://localhost:5678/api/categories",{
    method:"POST",
    body:JSON.stringify(formData),
    headers : {
      "content-type":"application/json"
    }
  })
   .then(response => response.json())
    .then(data => {
      console.log(data);
      console.log("voici l'image ajout",data)
      displayCategorysButtons()
      displayWorks()
    })
    .catch(error => console.log("voici l'erreur",error))
})

// Activer le button de validation

// Vérifie l'état du bouton de soumission en fonction de la complétude du formulaire
document.addEventListener("DOMContentLoaded", () => {
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("categoryInput");
  const inputFile = document.getElementById("file");
  const Valider = document.getElementById("Valider");

  function ButtonState() {
    if (
      titleInput.value.trim() !== "" &&
      categorySelect.value &&
      inputFile.files.length > 0
    ) {
      Valider.disabled = false; // Active le btn si les conditions sont remplies
      Valider.style.backgroundColor = "#1d6154";
      Valider.style.color = "white";
    } 
    // else {
    //   Valider.disabled = true; // Désactive le btn si une condition n'est pas remplie
    //   Valider.style.backgroundColor = "#a7a7a7";
    //   Valider.style.color = "white";
    // }
  }
  ButtonState();
})