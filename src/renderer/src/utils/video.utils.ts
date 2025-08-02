export async function downloadBlob(blobUrl: string, filename: string): Promise<void> {
  const blob = await fetch(blobUrl).then((res) => res.blob())

  const downloadUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = downloadUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(downloadUrl)
}
