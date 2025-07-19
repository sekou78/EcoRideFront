const btnConfirmerSuppression = document.getElementById(
  "btnConfirmerSuppression"
);
btnConfirmerSuppression.addEventListener("click", () => {
  const token = getCookie(tokenCookieName);

  const myHeaders = new Headers();
  myHeaders.append("X-AUTH-TOKEN", token);

  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(apiUrl + "deleteAccount/me", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      dIsconnect();
      window.location.href = "/";
    })
    .catch((error) => console.error(error));
});
