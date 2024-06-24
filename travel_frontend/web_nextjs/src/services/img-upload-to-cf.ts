
export async function uploadImageToCF(file: File, variant: string): Promise<string | null> {
  try {
    const response = await fetch('/api/upload-image', { method: 'POST' });
    const { ok, id, uploadURL, error } = await response.json();

    if (!ok) {
      console.error("Error fetching upload URL:", error);
      return null;
    }

    const form = new FormData();
    form.append('file', file, file.name);

    const uploadResponse = await fetch(uploadURL, {
      method: 'POST',
      body: form,
    });

    const uploadResult = await uploadResponse.json();
    if (uploadResult.success) {
      return `https://imagedelivery.net/ftV1RpijrL892iGuP8Q6zQ/${uploadResult.result.id}/${variant}`;
    } else {
      console.error('Image upload failed:', uploadResult.errors);
      return null;
    }
  } catch (error) {
    console.error('Image upload failed:', error);
    return null;
  }
}
