const embedCaptureFrameButton = () => {
  const actionsContainer = document.querySelector('.shot-detail-actions');
  if (!actionsContainer) return;
  let captureFrameButton = actionsContainer.querySelector('.dve-capture-frame');
  if (!captureFrameButton) {
    captureFrameButton = document.createElement('li');
    captureFrameButton.innerHTML = `<a title="Capture current frame" class="form-btn outlined" href=""><svg xmlns="http://www.w3.org/2000/svg" style="fill: none;" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="arcs"><g transform="translate(2 3)"><path d="M20 16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3l2-3h6l2 3h3a2 2 0 0 1 2 2v11z"/><circle cx="10" cy="10" r="4"/></g></svg> Capture frame</a>`;
    captureFrameButton.classList.add('dve-capture-frame');
    actionsContainer.appendChild(captureFrameButton);
    captureFrameButton.addEventListener('click', captureVideo);

    // hidden button to trigger download
    const hiddenDownloadButton = document.createElement('a');
    hiddenDownloadButton.classList.add('hidden-download-button');
    hiddenDownloadButton.style.display = 'none';
    actionsContainer.appendChild(hiddenDownloadButton);
  }
};
const captureVideo = event => {
  event.preventDefault();
  const videoShot = document.querySelector('.detail-shot video');
  let captureLink = document.querySelector(
    '.shot-detail-actions .hidden-download-button'
  );
  const canvas = document.createElement('canvas');
  canvas.height = videoShot.videoHeight;
  canvas.width = videoShot.videoWidth;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(videoShot, 0, 0, canvas.width, canvas.height);
  let url = canvas.toDataURL();
  captureLink.href = url;
  const fileName =
    document.querySelector('.shot-header .shot-title').innerText.trim() ||
    'shot';
  captureLink.setAttribute('download', `${fileName}.png`);
  captureLink.click();
};
const addVideoControls = () => {
  const videoShot = document.querySelector('.video-container video');
  if (!videoShot) return;
  videoShot.controls = true;
};
const init = () => {
  addVideoControls();
  embedCaptureFrameButton();
};
init();
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'dve_ajax_finished') {
    init();
  }
  if (message.action === 'updateVideoSrc') {
    const videoShot = document.querySelector('.video-container video');
    if (!videoShot) return;
    videoShot.crossOrigin = 'anonymous';
    videoShot.src = `${videoShot.src}?dve_modified=true`;
  }
});
