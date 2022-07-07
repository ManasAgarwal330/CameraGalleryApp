let recordBtn = document.querySelector(".record-btn");
let captureBtn = document.querySelector(".capture-btn");
let videoObj = document.querySelector("video");
let timerObj = document.querySelector(".timer");
let filterLayerObj = document.querySelector(".filter-layer");
let filterColorObj = document.querySelectorAll(".filter");
let blendColor = "transparent";
let record = false;
let mediaRecorderObj;
let chunks = [];

let constraints = {
  video: true,
  audio: false,
};
navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
  videoObj.srcObject = stream;
  mediaRecorderObj = new MediaRecorder(stream);

  mediaRecorderObj.addEventListener("start", function (e) {
    chunks = [];
  });

  mediaRecorderObj.addEventListener("dataavailable", function (e) {
    chunks.push(e.data);
  });

  mediaRecorderObj.addEventListener("stop", function (e) {
    let blob = new Blob(chunks, { type: "video/mp4" });
    if (db) {
      let dbTransaction = db.transaction("vedio", "readwrite");
      let videoStore = dbTransaction.objectStore("vedio");
      let videoEntry = {
        blobData: blob,
        id: `vid-${shortid()}`,
      };

      videoStore.add(videoEntry);
    }
    // let videoURL = URL.createObjectURL(blob);
    // let a = document.createElement("a");
    // a.href = videoURL;
    // a.download = "video.mp4";
    // a.click();
  });
});

captureBtn.addEventListener("click", function (e) {
  captureBtn.classList.add("scale-capture");
  let canvas = document.createElement("canvas");
  canvas.width = videoObj.videoWidth;
  canvas.height = videoObj.videoWidth;
  let tool = canvas.getContext("2d");
  tool.drawImage(videoObj, 0, 0, canvas.width, canvas.height);

  tool.fillStyle = blendColor;
  tool.fillRect(0, 0, canvas.width, canvas.height);

  let imageUrl = canvas.toDataURL();

  if (db) {
    let dbTransaction = db.transaction("image", "readwrite");
    let imageStore = dbTransaction.objectStore("image");
    let imageEntry = {
      id: `img-${shortid()}`,
      imgData: imageUrl,
    };
    imageStore.add(imageEntry);
  }
  //   let a = document.createElement("a");
  //   a.href = imageUrl;
  //   a.download = "image.jpg";
  //   a.click();

  setTimeout(() => {
    captureBtn.classList.remove("scale-capture");
  }, 500);
});

recordBtn.addEventListener("click", function (e) {
  if (!mediaRecorderObj) return;

  record = !record;
  if (record) {
    mediaRecorderObj.start();
    recordBtn.classList.add("scale-record");
    timerObj.style.display = "block";
    startTimer();
  } else {
    mediaRecorderObj.stop();
    recordBtn.classList.remove("scale-record");
    stopTimer();
  }
});

let timerId;
let counter = 1;
function startTimer() {
  function calculateTime() {
    let time = counter;
    let hrs = Number.parseInt(time / 3600);
    time = time % 3600;
    let minutes = Number.parseInt(time / 60);
    time = time % 60;
    let seconds = time;
    hrs = hrs < 10 ? `0${hrs}` : hrs;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    timerObj.innerText = `${hrs}:${minutes}:${seconds}`;
    counter++;
  }
  timerId = setInterval(calculateTime, 1000);
}

function stopTimer() {
  clearInterval(timerId);
  counter = 1;
  timerObj.style.display = "none";
  timerObj.innerText = "00:00:00";
}

filterColorObj.forEach((filter) => {
  filter.addEventListener("click", function (e) {
    blendColor = getComputedStyle(filter).getPropertyValue("background-color");
    filterLayerObj.style.backgroundColor = blendColor;
  });
});
