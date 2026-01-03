// Upload images to Cloudinary using unsigned preset (client-side)
// Requires these env vars:
// NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
// NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

export type UploadResult = {
  url: string
  path: string // Cloudinary public_id
  name: string // original filename (with extension)
}

export const uploadImage = async (
  file: File,
  folder: string,
  onProgress?: (percent: number) => void
): Promise<UploadResult> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset || uploadPreset.startsWith("your_")) {
    throw new Error(
      "Cloudinary is not configured or using the placeholder preset. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and a valid NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET (unsigned preset name) in your environment."
    )
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

  const form = new FormData()
  form.append("file", file)
  form.append("upload_preset", uploadPreset)
  // Put files inside a folder in Cloudinary for organization
  form.append("folder", folder)

  return await new Promise<UploadResult>((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.open("POST", url)

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100)
        onProgress?.(percent)
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const resp = JSON.parse(xhr.responseText)
          const secureUrl = resp.secure_url
          const publicId = resp.public_id
          const originalFilename = resp.original_filename
          const format = resp.format
          const name = originalFilename && format ? `${originalFilename}.${format}` : file.name

          resolve({ url: secureUrl, path: publicId, name })
        } catch (err) {
          reject(new Error("Failed to parse Cloudinary response: " + String(err)))
        }
      } else {
        // Try to extract Cloudinary error message for clearer guidance
        let cloudErrMsg = xhr.responseText
        try {
          const json = JSON.parse(xhr.responseText)
          if (json?.error?.message) cloudErrMsg = json.error.message
        } catch (e) {
          // ignore parse errors
        }

        if (/upload preset not found/i.test(cloudErrMsg)) {
          reject(
            new Error(
              `Cloudinary upload preset not found. Ensure the unsigned upload preset '${uploadPreset}' exists for cloud '${cloudName}', or use a signed upload. See Cloudinary docs: https://cloudinary.com/documentation/upload_images#unsigned_uploads`
            )
          )
        } else {
          reject(new Error(`Cloudinary upload failed: ${xhr.status} ${xhr.statusText} - ${cloudErrMsg}`))
        }
      }
    }

    xhr.onerror = () => reject(new Error("Network error while uploading to Cloudinary"))

    xhr.send(form)
  })
}
