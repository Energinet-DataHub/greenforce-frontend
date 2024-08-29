/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
document.addEventListener('DOMContentLoaded', function () {
  const content = document.getElementById('content');
  const onboardingStatus = getQueryParam('state');

  if (onboardingStatus === 'success') {
    content.innerHTML = `
      <div class="alert success">
        <strong>Success!</strong><br>
        You have successfully completed the onboarding process.
      </div>
    `;
  } else if (onboardingStatus === 'declined') {
    content.innerHTML = `
      <div class="alert error">
        <strong>Error</strong><br>
        There was an issue with your onboarding. Please try again or contact support.
      </div>
    `;
  } else {
    content.innerHTML = `
      <button class="button" id="startOnboardingButton">Start Onboarding</button>
    `;
    document
      .getElementById('startOnboardingButton')
      .addEventListener('click', () => startOnboarding());
  }
});

function startOnboarding(clientId) {
  let language = navigator.language.split('-')[0];
  if (language !== 'da' && language !== 'en') {
    language = 'en';
  }
  clientId = clientId ?? getQueryParam('client-id');
  const redirectUrl = window.location.href;

  if (!clientId) {
    clientId = prompt('Client ID is missing. Please enter a valid client ID:');
    if (!clientId) {
      alert('Client ID is required to proceed.');
      return;
    }
    window.location.assign(window.location.href + '?client-id=' + clientId);
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
