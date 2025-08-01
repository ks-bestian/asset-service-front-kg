import * as tus from 'tus-js-client';
import { useStore } from "@/store";
const store = useStore();

/**
 * tus로 여러 개의 파일을 순차 업로드하고, 완료된 URL 리스트를 반환합니다.
 * @param {Array<HTMLInputElement>} inputElements - 여러 개의 file input DOM 엘리먼트
 * @param {string} endpoint - tus 업로드 엔드포인트
 * @returns {Promise<string[]>} 업로드된 파일의 URL 배열
 */
export async function uploadTusFiles(files, endpoint = import.meta.env.VITE_API_BASE_URL+"/tus/upload", authToken) {
  const uploadedUrls = []

  const token = store.jwtToken;

  for (const file of files) {

    if (!file) continue

    await new Promise((resolve, reject) => {
      const upload = new tus.Upload(file, {
        endpoint,
        metadata: {
          filename: file.name,
          filetype: file.type,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        onSuccess: () => {
          uploadedUrls.push(upload.url)
          resolve()
        },
        onError: (err) => {
          console.error(`Upload failed for ${file.name}`, err)
          reject(err)
        },
      })

      upload.start()
    })
  }

  return uploadedUrls
}