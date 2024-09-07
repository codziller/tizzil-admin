import heic2any from "heic2any";
export function convertHeicToJpg(inputFile) {
  const fileName = inputFile.name;
  const fileNameExt = fileName.substr(fileName.lastIndexOf(".") + 1);
  if (fileNameExt === "heic") {
    return new Promise(function (resolve, reject) {
      const blob = inputFile;
      heic2any({
        blob,
        toType: "image/jpg",
      })
        .then(function (resultBlob) {
          const url = URL.createObjectURL(resultBlob);
          const file = new File([resultBlob], fileName + ".jpg", {
            type: "image/jpeg",
            lastModified: new Date().getTime(),
          });
          resolve([file, url]);
        })
        .catch(function (err) {
          reject(err);
        });
    });
  } else {
    return inputFile;
  }
}
