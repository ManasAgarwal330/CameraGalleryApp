let db;
let openDbRequest = indexedDB.open("myDatabase");

openDbRequest.addEventListener("success", function (e) {
  db = openDbRequest.result;
});

openDbRequest.addEventListener("error", function (e) {});

openDbRequest.addEventListener("upgradeneeded", function (e) {
  db = openDbRequest.result;

  db.createObjectStore("vedio", { keyPath: "id" });
  db.createObjectStore("image", { keyPath: "id" });
});
