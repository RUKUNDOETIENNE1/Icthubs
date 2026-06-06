// Provider-agnostic storage service
export type UploadParams = { file: File | Blob; filename: string; contentType?: string }
export type UploadResult = { url: string; provider: 'supabase' | 'cloudinary'; key?: string }

export interface StorageProvider {
  uploadMedia(params: UploadParams): Promise<UploadResult>
  deleteMedia(key: string): Promise<void>
  getMediaUrl(key: string): string
}

// Factory (current: Supabase)
export { supabaseStorage } from './supabase'
