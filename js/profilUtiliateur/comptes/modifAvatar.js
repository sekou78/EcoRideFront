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

// Étape 1 : récupérer les données de l'utilisateur
fetch(apiUrl + "account/me", requestOptions)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Impossible de récupérer l'utilisateur");
    }
    return response.json();
  })
  .then((userData) => {
    // Vérifier que l'utilisateur a une image
    if (!userData.image || !userData.image.id) {
      throw new Error("Aucune image associée à l'utilisateur");
    }

    const imageId = userData.image.id;

    // Étape 2 : récupérer l'image via son ID
    return fetch(apiUrl + "image/" + imageId, requestOptions);
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
  .catch((error) => {
    console.error(error);
    alert("Image non chargée");
  });

function chargeImage() {
  const token = getCookie(tokenCookieName);

  const myHeaders = new Headers();
  myHeaders.append("X-AUTH-TOKEN", token);

  const formdata = new FormData();
  const imageFile = avatar.files[0];

  if (!imageFile) {
    console.error("Aucun fichier sélectionné");
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
      if (response.ok) {
        return response.json();
      } else {
        alert("Erreur lors du chargement de l'image");
      }
    })
    .then((result) => {
      console.log(result);
      avatarDisplay.src = urlImg + result.filePath;
    })
    .catch((error) => {
      console.error(error);
      alert("Image non charger");
    });
}

async function modifImage() {
  const token = getCookie(tokenCookieName);

  const myHeaders = new Headers();
  myHeaders.append("X-AUTH-TOKEN", token);

  // Étape 1 : Récupérer l'utilisateur
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

    // Étape 2 : Préparer l'image à modifier
    const imageFile = avatar.files[0];
    if (!imageFile) {
      console.error("Aucun fichier sélectionné");
      return;
    }

    const formdata = new FormData();
    formdata.append("image", imageFile);

    // Étape 3 : Modifier l'image
    const updateResponse = await fetch(apiUrl + "image/" + imageId, {
      method: "POST",
      headers: myHeaders,
      body: formdata,
    });

    if (!updateResponse.ok) {
      throw new Error("Erreur lors de la modification de l'image");
    }

    const blob = await updateResponse.blob();
    const imageUrl = URL.createObjectURL(blob);
    window.location.reload();
  } catch (error) {
    console.error(error);
    alert("Image non modifiée");
  }
}

async function supprimeImage() {
  const token = getCookie(tokenCookieName);

  const myHeaders = new Headers();
  myHeaders.append("X-AUTH-TOKEN", token);

  try {
    // Étape 1 : Récupérer l'utilisateur
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

    // Étape 2 : Supprimer l'image
    const deleteResponse = await fetch(apiUrl + "image/" + imageId, {
      method: "DELETE",
      headers: myHeaders, // Pas de body ici
    });

    if (!deleteResponse.ok) {
      throw new Error("Erreur lors de la suppression de l'image");
    }

    // Étape 3 : Rafraîchir ou vider l'affichage
    avatarDisplay.src = ""; // Efface l'image affichée
    window.location.reload();
  } catch (error) {
    console.error(error);
    alert("Image non supprimée");
  }
}
