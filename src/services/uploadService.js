// src/services/uploadService.js
import { supabase } from './supabase'

/**
 * Faz upload da foto de perfil para o Supabase Storage
 */
export async function uploadAvatar(userId, file) {
  try {
    // Validar arquivo
    if (!file) throw new Error('Nenhum arquivo selecionado')
    if (!file.type.startsWith('image/')) throw new Error('O arquivo deve ser uma imagem')
    if (file.size > 5 * 1024 * 1024) throw new Error('A imagem deve ter no máximo 5MB')

    // Gerar nome único para o arquivo
    const fileExt = file.name.split('.').pop()
    const fileName = `avatar.${fileExt}`
    const filePath = `${userId}/${fileName}`

    // 1. Se já existe uma foto, deletar a antiga
    const { data: listData, error: listError } = await supabase
      .storage
      .from('avatars')
      .list(userId)

    if (!listError && listData && listData.length > 0) {
      // Deletar arquivos antigos
      const filesToDelete = listData.map(f => `${userId}/${f.name}`)
      await supabase
        .storage
        .from('avatars')
        .remove(filesToDelete)
    }

    // 2. Fazer upload do novo arquivo
    const { error: uploadError } = await supabase
      .storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      })

    if (uploadError) throw uploadError

    // 3. Obter a URL pública
    const { data: urlData } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(filePath)

    return urlData.publicUrl
  } catch (error) {
    console.error('❌ Erro no upload do avatar:', error)
    throw error
  }
}

/**
 * Deleta a foto de perfil
 */
export async function deleteAvatar(userId) {
  try {
    // Listar arquivos do usuário
    const { data: listData, error: listError } = await supabase
      .storage
      .from('avatars')
      .list(userId)

    if (listError) throw listError

    if (listData && listData.length > 0) {
      // Deletar todos os arquivos
      const filesToDelete = listData.map(f => `${userId}/${f.name}`)
      const { error: deleteError } = await supabase
        .storage
        .from('avatars')
        .remove(filesToDelete)

      if (deleteError) throw deleteError
    }

    return true
  } catch (error) {
    console.error('❌ Erro ao deletar avatar:', error)
    throw error
  }
}