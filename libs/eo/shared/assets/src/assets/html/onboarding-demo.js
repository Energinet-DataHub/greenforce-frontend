document.addEventListener("DOMContentLoaded", function () {
  const content = document.getElementById("content");
  const onboardingStatus = getQueryParam("state");

  if (onboardingStatus === "success") {
    content.innerHTML = `
      <div class="alert success">
        <strong>Success!</strong><br>
        You have successfully completed the onboarding process.
      </div>
    `;
  } else if (onboardingStatus === "declined") {
    content.innerHTML = `
      <div class="alert error">
        <strong>Error</strong><br>
        There was an issue with your onboarding. Please try again or contact support.
      </div>
    `;
  } else {
    content.innerHTML = `
      <button class="button" onclick="startOnboarding()">Start Onboarding</button>
    `;
  }
});

function startOnboarding(clientId) {
  let language = navigator.language.split("-")[0];
  if (language !== "da" && language !== "en") {
    language = "en";
  }
  clientId = clientId ?? getQueryParam("client-id");
  const redirectUrl = window.location.href;

  if (!clientId) {
    clientId = prompt("Client ID is missing. Please enter a valid client ID:");
    if (!clientId) {
      alert("Client ID is required to proceed.");
      return;
    }
    window.location.assign(window.location.href + "?client-id=" + clientId);
    startOnboarding(clientId);
    return;
  }

  window.location.assign(
    `${window.location.origin}/${language}/onboarding?client-id=${clientId}&redirect-url=${redirectUrl}`
  );
}

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}
