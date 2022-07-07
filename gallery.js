setTimeout(function () {
  if (db) {
    let vedioTransaction = db.transaction("vedio", "readonly");
    let vedioStore = vedioTransaction.objectStore("vedio");
    let vedioRequest = vedioStore.getAll();

    vedioRequest.onsuccess = function (e) {
      let vedioResult = vedioRequest.result;
      let galleryElem = document.querySelector(".gallery-cont");
      vedioResult.forEach((vedio) => {
        let divElem = document.createElement("div");
        divElem.setAttribute("class", "media-cont");
        divElem.setAttribute("id", vedio.id);

        let vedioURL = URL.createObjectURL(vedio.blobData);

        divElem.innerHTML = `
                <div class="media">
                <video autoplay loop src="${vedioURL}"></video>
                </div>
                <div class="delete">Delete</div>
                <div class="download">Download</div>
           `;

        let deleteBtn = divElem.querySelector(".delete");
        deleteBtn.addEventListener("click", deleteFunction);
        let downloadBtn = divElem.querySelector(".download");
        downloadBtn.addEventListener("click", downloadFunction);
        galleryElem.appendChild(divElem);
      });
    };

    let imageTransaction = db.transaction("image", "readonly");
    let imageStore = imageTransaction.objectStore("image");
    let imageRequest = imageStore.getAll();
    imageRequest.onsuccess = function (e) {
      let images = imageRequest.result;
      let galleryElem = document.querySelector(".gallery-cont");
      images.forEach((image) => {
        let divElem = document.createElement("div");
        divElem.setAttribute("class", "media-cont");
        divElem.setAttribute("id", image.id);

        divElem.innerHTML = `
        <div class="media">
        <img src="${image.imgData}" >
        </div>
        <div class="delete">Delete</div>
        <div class="download">Download</div>
        `;

        let deleteBtn = divElem.querySelector(".delete");
        deleteBtn.addEventListener("click", deleteFunction);
        let downloadBtn = divElem.querySelector(".download");
        downloadBtn.addEventListener("click", downloadFunction);
        galleryElem.appendChild(divElem);
      });
    };
  }
}, 100);

function deleteFunction(e) {
  let id = e.target.parentElement.getAttribute("id");
  let type = id.slice(0, 3);
  if (type === "vid") {
    let vedioTransaction = db.transaction("vedio", "readwrite");
    let vedioStore = vedioTransaction.objectStore("vedio");
    vedioStore.delete(id);
    e.target.parentElement.remove();
  } else if (type === "img") {
    let imageTransaction = db.transaction("image", "readwrite");
    let imageStore = imageTransaction.objectStore("image");
    imageStore.delete(id);
    e.target.parentElement.remove();
  }
}

function downloadFunction(e) {
  let id = e.target.parentElement.getAttribute("id");
  let type = id.slice(0, 3);

  if (type === "vid") {
    let vedioTransaction = db.transaction("vedio", "readonly");
    let store = vedioTransaction.objectStore("vedio");
    let vedioRequest = store.get(id);
    vedioRequest.onsuccess = function (e) {
      let vedio = vedioRequest.result;
      let a = document.createElement("a");
      a.href = URL.createObjectURL(vedio.blobData);
      a.download = "vedio.mp4";
      a.click();
    };
  } else if (type === "img") {
    let imageTransaction = db.transaction("image", "readonly");
    let store = imageTransaction.objectStore("image");
    let imageRequest = store.get(id);
    imageRequest.onsuccess = function (e) {
      let image = imageRequest.result;
      let a = document.createElement("a");
      a.href = image.imgData;
      a.download = "image.jpg";
      a.click();
    };
  }
}
