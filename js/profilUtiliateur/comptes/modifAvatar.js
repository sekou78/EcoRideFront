const modifAvatar = document.getElementById("avatar-form");
const avatarDisplay = document.getElementById("avatar-display");
const avatar = document.getElementById("avatar");
const btnChargerAvatar = document.getElementById("btn-charger-avatar");
const btnModifAvatar = document.getElementById("btn-modif-avatar");
const btnSupprimerAvatar = document.getElementById("btn-supprimer-avatar");

btnChargerAvatar.addEventListener("click", chargeImage);
btnModifAvatar.addEventListener("click", modifImage);
btnSupprimerAvatar.addEventListener("click", supprimeImage);

const token = getCookie(tokenCookieName);

const myHeaders = new Headers();
myHeaders.append("X-AUTH-TOKEN", token);

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

//Récupération des données de l'utilisateur connecté
fetch(apiUrl + "account/me", requestOptions)
  .then((response) => {
    if (!response.ok) {
      return response.json().then((errorData) => {
        compteSuspendu(errorData);
        throw new Error(
          "Impossible de charger les informations de l'utilisateur."
        );
      });
    }
    return response.json();
  })
  .then((userData) => {
    if (userData.image && userData.image.id) {
      // S'il y a déjà une image
      btnChargerAvatar.style.display = "none"; // cacher le bouton "Charger l'avatar"
      btnModifAvatar.style.display = "inline-block"; // montrer "Modifier"
      btnSupprimerAvatar.style.display = "inline-block"; // montrer "Supprimer"

      const imageId = userData.image.id;

      // Récupérer l'image via son ID
      return fetch(apiUrl + "image/" + imageId, requestOptions);
    } else {
      // S'il n'y a pas d'image
      btnChargerAvatar.style.display = "inline-block"; // montrer "Charger l'avatar"
      btnModifAvatar.style.display = "none"; // cacher "Modifier"
      btnSupprimerAvatar.style.display = "none"; // cacher "Supprimer"

      throw new Error("Aucune image associée à l'utilisateur");
    }
  })
  .then((response) => {
    if (response.blob) {
      return response.blob();
    } else {
      throw new Error("Erreur lors du chargement de l'image");
    }
  })
  .then((blob) => {
    const imageUrl = URL.createObjectURL(blob);
    avatarDisplay.src = imageUrl;
  })
  .catch((error) => {});

function chargeImage() {
  const token = getCookie(tokenCookieName);

  const myHeaders = new Headers();
  myHeaders.append("X-AUTH-TOKEN", token);

  const formdata = new FormData();
  const imageFile = avatar.files[0];

  if (!imageFile) {
    afficherErreurModalBodyModifAvatar("Aucun fichier sélectionné");
    return;
  }

  formdata.append("image", imageFile);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };

  fetch(apiUrl + "image", requestOptions)
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          const message = data.error || data.message || "Image non charger.";
          throw new Error(message);
        });
      }
      return response.json();
    })
    .then((result) => {
      avatarDisplay.src = urlImg + result.filePath;
      window.location.reload();
    })
    .catch((error) => {
      afficherErreurModalBodyModifAvatar(error.message);
    });
}

async function modifImage() {
  const token = getCookie(tokenCookieName);

  const myHeaders = new Headers();
  myHeaders.append("X-AUTH-TOKEN", token);

  //Récupération des données de l'utilisateur connecté
  try {
    const userResponse = await fetch(apiUrl + "account/me", {
      method: "GET",
      headers: myHeaders,
    });

    if (!userResponse.ok) {
      throw new Error("Impossible de récupérer l'utilisateur");
    }

    const userData = await userResponse.json();

    if (!userData.image || !userData.image.id) {
      throw new Error("Aucune image associée à l'utilisateur");
    }

    const imageId = userData.image.id;

    //Préparation de l'image à modifier
    const imageFile = avatar.files[0];
    if (!imageFile) {
      afficherErreurModalBodyModifAvatar("Aucun fichier sélectionné");
      return;
    }

    const formdata = new FormData();
    formdata.append("image", imageFile);

    //Modification de l'image
    const updateResponse = await fetch(apiUrl + "image/" + imageId, {
      method: "POST",
      headers: myHeaders,
      body: formdata,
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json().catch(() => null);
      const errorMessage =
        errorData?.error || "Erreur lors de la modification de l'image";
      throw new Error(errorMessage);
    }

    const blob = await updateResponse.blob();
    const imageUrl = URL.createObjectURL(blob);
    window.location.reload();
  } catch (error) {
    afficherErreurModalBodyModifAvatar(error.message || "Image non modifiée");
  }
}

async function supprimeImage() {
  const token = getCookie(tokenCookieName);

  const myHeaders = new Headers();
  myHeaders.append("X-AUTH-TOKEN", token);

  try {
    //Récupération des données de l'utilisateur connecté
    const userResponse = await fetch(apiUrl + "account/me", {
      method: "GET",
      headers: myHeaders,
    });

    if (!userResponse.ok) {
      throw new Error("Impossible de récupérer l'utilisateur");
    }

    const userData = await userResponse.json();

    if (!userData.image || !userData.image.id) {
      throw new Error("Aucune image associée à l'utilisateur");
    }

    const imageId = userData.image.id;

    //Suppression de l'image
    const deleteResponse = await fetch(apiUrl + "image/" + imageId, {
      method: "DELETE",
      headers: myHeaders,
    });

    if (!deleteResponse.ok) {
      const errorData = await updateResponse.json().catch(() => null);
      const errorMessage =
        errorData?.error || "Erreur lors de la suppression de l'image";
      throw new Error(errorMessage);
    }

    //Rafraîchir l'affichage
    avatarDisplay.src = "";
    window.location.reload();
  } catch (error) {
    afficherErreurModalBodyModifAvatar(error.message || "Image non supprimée");
  }
}

function afficherErreurModalBodyModifAvatar(message) {
  const errorModalBody = document.getElementById("errorModalBodyModifAvatar");
  errorModalBody.textContent = message;

  // Initialiser et afficher la modal Bootstrap
  const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
  errorModal.show();
}

// Fonction si l'utilisateur n'est pas connecté
loadMonCompte();
