import { ref, uploadBytesResumable, getDownloadURL } 
from "firebase/storage";
import { storage } from "../firebase";

export const uploadVideo = (file, path, onProgress) => {

  return new Promise((resolve, reject) => {

    const storageRef = ref(storage, path);

    const uploadTask =
      uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",

      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred /
            snapshot.totalBytes) * 100;

        onProgress(progress);
      },

      reject,

      async () => {
        const url = await getDownloadURL(
          uploadTask.snapshot.ref
        );
        resolve(url);
      }
    );
  });
};
