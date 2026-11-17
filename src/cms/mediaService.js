import { supabase } from './supabase'

export async function listMedia() {
  const { data, error } = await supabase.from('media_assets').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function uploadMedia({ blob, width, height, altText, focalX = 50, focalY = 50 }) {
  const fileName = `${crypto.randomUUID()}.webp`
  const storagePath = `uploads/${new Date().getFullYear()}/${fileName}`
  const { error: uploadError } = await supabase.storage.from('site-media').upload(storagePath, blob, { contentType: 'image/webp', cacheControl: '31536000', upsert: false })
  if (uploadError) throw uploadError
  const { data: publicData } = supabase.storage.from('site-media').getPublicUrl(storagePath)
  const { data, error } = await supabase.from('media_assets').insert({ storage_path: storagePath, public_url: publicData.publicUrl, alt_text: altText, width, height, size_bytes: blob.size, mime_type: 'image/webp', focal_x: focalX, focal_y: focalY }).select().single()
  if (error) {
    await supabase.storage.from('site-media').remove([storagePath])
    throw error
  }
  return data
}

export async function removeMedia(asset) {
  const { data: inUse, error: checkError } = await supabase.rpc('media_asset_in_use', { asset_url: asset.public_url })
  if (checkError) throw checkError
  if (inUse) throw new Error('La imagen está siendo utilizada y no puede eliminarse.')
  const { error: storageError } = await supabase.storage.from('site-media').remove([asset.storage_path])
  if (storageError) throw storageError
  const { error } = await supabase.from('media_assets').delete().eq('id', asset.id)
  if (error) throw error
}
