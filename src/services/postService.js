// src/services/postService.js
import { supabase } from './supabase'

export const postService = {
  // Buscar todos os posts
  async getPosts() {
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        curtidas:curtidas(count),
        comentarios:comentarios(*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    return posts.map(post => ({
      ...post,
      curtidas: post.curtidas?.[0]?.count || 0,
      comentariosLista: post.comentarios || [],
      comentarios: post.comentarios?.length || 0,
      curtido: false,
      imagens: post.imagens || []
    }))
  },

  // Criar novo post com imagens
  async criarPost(postData) {
    const { data, error } = await supabase
      .from('posts')
      .insert([{
        user_id: postData.user_id,
        autor: postData.autor,
        avatar: postData.avatar,
        conteudo: postData.conteudo,
        tipo: postData.tipo || 'outros',
        imagens: postData.imagens || []
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Upload de imagens
  async uploadImagens(files, userId) {
    const urls = []
    const errors = []

    for (const file of files) {
      try {
        // Validar tipo e tamanho
        if (!file.type.startsWith('image/')) {
          errors.push(`${file.name}: Tipo de arquivo inválido`)
          continue
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
          errors.push(`${file.name}: Arquivo muito grande (máx 5MB)`)
          continue
        }

        // Gerar nome único
        const fileExt = file.name.split('.').pop()
        const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${fileExt}`

        // Upload para o bucket
        const { data, error } = await supabase.storage
          .from('posts-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (error) throw error

        // Obter URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('posts-images')
          .getPublicUrl(fileName)

        urls.push(publicUrl)
      } catch (error) {
        errors.push(`${file.name}: ${error.message}`)
      }
    }

    if (errors.length > 0) {
      console.warn('Erros no upload:', errors)
    }

    return { urls, errors }
  },

  // Deletar post e suas imagens
  async deletarPost(postId, userId) {
    try {
      // 1. Buscar o post para pegar as imagens
      const { data: post, error: postError } = await supabase
        .from('posts')
        .select('imagens, user_id')
        .eq('id', postId)
        .single()

      if (postError) throw postError

      // Verificar se o usuário é o dono do post
      if (post.user_id !== userId) {
        throw new Error('Você não tem permissão para deletar este post')
      }

      // 2. Deletar imagens do storage
      if (post.imagens && post.imagens.length > 0) {
        for (const imageUrl of post.imagens) {
          try {
            // Extrair o caminho do arquivo da URL
            const path = imageUrl.split('/posts-images/')[1]
            if (path) {
              await supabase.storage
                .from('posts-images')
                .remove([path])
            }
          } catch (error) {
            console.error('Erro ao deletar imagem:', error)
          }
        }
      }

      // 3. Deletar curtidas
      await supabase
        .from('curtidas')
        .delete()
        .eq('post_id', postId)

      // 4. Deletar comentários
      await supabase
        .from('comentarios')
        .delete()
        .eq('post_id', postId)

      // 5. Deletar post
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

      if (deleteError) throw deleteError

      return { success: true }
    } catch (error) {
      console.error('Erro ao deletar post:', error)
      throw error
    }
  },

  // Deletar imagem específica
  async deletarImagem(postId, imageUrl, userId) {
    try {
      // Buscar o post
      const { data: post, error: postError } = await supabase
        .from('posts')
        .select('imagens, user_id')
        .eq('id', postId)
        .single()

      if (postError) throw postError

      // Verificar permissão
      if (post.user_id !== userId) {
        throw new Error('Você não tem permissão para deletar esta imagem')
      }

      // Remover imagem da lista
      const novasImagens = post.imagens.filter(url => url !== imageUrl)

      // Atualizar post
      const { error: updateError } = await supabase
        .from('posts')
        .update({ imagens: novasImagens })
        .eq('id', postId)

      if (updateError) throw updateError

      // Deletar do storage
      const path = imageUrl.split('/posts-images/')[1]
      if (path) {
        await supabase.storage
          .from('posts-images')
          .remove([path])
      }

      return { success: true }
    } catch (error) {
      console.error('Erro ao deletar imagem:', error)
      throw error
    }
  },

  // Resto dos métodos (toggleCurtida, adicionarComentario, etc.)
  async verificarCurtida(postId, userId) {
    const { data, error } = await supabase
      .from('curtidas')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return !!data
  },

  async toggleCurtida(postId, userId) {
    const { data: curtidaExistente } = await supabase
      .from('curtidas')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single()

    if (curtidaExistente) {
      const { error } = await supabase
        .from('curtidas')
        .delete()
        .eq('id', curtidaExistente.id)

      if (error) throw error
      return { curtido: false }
    } else {
      const { error } = await supabase
        .from('curtidas')
        .insert([{ post_id: postId, user_id: userId }])

      if (error) throw error
      return { curtido: true }
    }
  },

  async adicionarComentario(postId, userId, autor, conteudo) {
    const { data, error } = await supabase
      .from('comentarios')
      .insert([{ post_id: postId, user_id: userId, autor, conteudo }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async compartilharPost(postId, userId) {
    console.log(`Post ${postId} compartilhado por ${userId}`)
    return { success: true }
  }
}