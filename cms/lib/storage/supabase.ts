import { getSupabaseServiceClient } from '../supabase'
import type { StorageProvider, UploadParams, UploadResult } from './index'

const BUCKET = process.env.SUPABASE_MEDIA_BUCKET || 'media'

export const supabaseStorage: StorageProvider = {
  async uploadMedia({ file, filename, contentType }: UploadParams): Promise<UploadResult> {
    const supabase = getSupabaseServiceClient()
    const { data, error } = await supabase.storage.from(BUCKET).upload(filename, file, {
      contentType,
      upsert: false,
    })
    if (error) throw error
    const url = this.getMediaUrl(data.path)
    return { url, provider: 'supabase', key: data.path }
  },
  async deleteMedia(key: string) {
    const supabase = getSupabaseServiceClient()
    const { error } = await supabase.storage.from(BUCKET).remove([key])
    if (error) throw error
  },
  getMediaUrl(key: string) {
    const supabase = getSupabaseServiceClient()
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(key)
    return data.publicUrl
  }
}
