document
  .querySelector("input[type=submit]")
  .addEventListener("click", function (e) {
      e.preventDefault();
      
      login();
   
   });

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const msgErreur = document.getElementById("loginForm p")

   fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
   })
   
  .then((response) => {
    if (response.status !== 200) {
      msgErreur.textContent = ""
    
    } else {
      response.json()
      .then((data) => {
        sessionStorage.setItem("token", data.token); 
        window.location.replace("index.html");
      });
    }
  });
}
