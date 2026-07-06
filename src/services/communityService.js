// src/services/communityService.js
import { supabase } from '../lib/SupabaseClient';

export const communityService = {
  /**
   * Busca todas as comunidades (com filtro opcional por tipo)
   */
  async getComunidades(tipo = null) {
    try {
      let query = supabase
        .from('comunidades')
        .select('*')
        .eq('ativo', true)
        .order('membros', { ascending: false });

      if (tipo && tipo !== 'todos') {
        query = query.eq('tipo', tipo);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar comunidades:', error);
      return [];
    }
  },

  /**
   * Busca comunidades globais
   */
  async getComunidadesGlobais() {
    return this.getComunidades('global');
  },

  /**
   * Busca comunidades privadas
   */
  async getComunidadesPrivadas() {
    return this.getComunidades('privada');
  },

  /**
   * Busca comunidades que um usuário participa
   */
  async getComunidadesDoUsuario(usuarioId) {
    try {
      const { data, error } = await supabase
        .from('comunidades_usuarios')
        .select(`
          id,
          comunidade_id,
          participa,
          joined_at,
          comunidades (*)
        `)
        .eq('user_id', usuarioId)
        .eq('participa', true);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar comunidades do usuário:', error);
      return [];
    }
  },

  /**
   * Verifica se um usuário participa de uma comunidade
   */
  async verificarParticipacao(comunidadeId, usuarioId) {
    try {
      const { data, error } = await supabase
        .from('comunidades_usuarios')
        .select('id')
        .eq('comunidade_id', comunidadeId)
        .eq('user_id', usuarioId)
        .eq('participa', true)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      console.error('Erro ao verificar participação:', error);
      return false;
    }
  },

  /**
   * Adiciona um usuário a uma comunidade
   */
  async participar(comunidadeId, usuarioId) {
    try {
      // Verificar se já existe registro
      const { data: existente, error: checkError } = await supabase
        .from('comunidades_usuarios')
        .select('id')
        .eq('comunidade_id', comunidadeId)
        .eq('user_id', usuarioId)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Erro ao verificar existência:', checkError);
      }

      if (existente) {
        // Se já existe, atualizar para participa = true
        const { data, error } = await supabase
          .from('comunidades_usuarios')
          .update({ participa: true, joined_at: new Date().toISOString() })
          .eq('id', existente.id)
          .select();

        if (error) throw error;
        return data?.[0];
      }

      // Inserir novo registro
      const { data, error } = await supabase
        .from('comunidades_usuarios')
        .insert({
          comunidade_id: comunidadeId,
          user_id: usuarioId,
          participa: true,
          joined_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Erro ao participar:', error);
      throw new Error(error.message || 'Erro ao participar da comunidade');
    }
  },

  /**
   * Remove um usuário de uma comunidade
   */
  async sair(comunidadeId, usuarioId) {
    try {
      const { data, error } = await supabase
        .from('comunidades_usuarios')
        .update({ participa: false })
        .eq('comunidade_id', comunidadeId)
        .eq('user_id', usuarioId)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error('Usuário não encontrado nesta comunidade');
      }

      return data[0];
    } catch (error) {
      console.error('Erro ao sair:', error);
      throw new Error(error.message || 'Erro ao sair da comunidade');
    }
  },

  /**
   * Busca total de membros em todas as comunidades
   */
  async getTotalMembros() {
    try {
      const { data, error } = await supabase
        .from('comunidades')
        .select('membros');

      if (error) throw error;
      return data.reduce((acc, curr) => acc + (curr.membros || 0), 0);
    } catch (error) {
      console.error('Erro ao buscar total de membros:', error);
      return 0;
    }
  },

  /**
   * Busca total de comunidades
   */
  async getTotalComunidades() {
    try {
      const { count, error } = await supabase
        .from('comunidades')
        .select('id', { count: 'exact', head: true })
        .eq('ativo', true);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Erro ao buscar total de comunidades:', error);
      return 0;
    }
  },

  /**
   * Cria uma nova comunidade (qualquer usuário logado pode criar)
   */
  async criarComunidade(dados, userId) {
    try {
      // Verificar se o usuário está logado
      if (!userId) {
        throw new Error('Você precisa estar logado para criar uma comunidade');
      }

      // Validar link do WhatsApp
      let whatsappUrl = dados.whatsapp;
      if (whatsappUrl && !whatsappUrl.includes('https://chat.whatsapp.com/')) {
        if (whatsappUrl.includes('whatsapp.com')) {
          if (!whatsappUrl.startsWith('https://')) {
            whatsappUrl = 'https://' + whatsappUrl;
          }
        } else {
          whatsappUrl = `https://chat.whatsapp.com/${whatsappUrl}`;
        }
      }

      // Inserir a comunidade
      const { data, error } = await supabase
        .from('comunidades')
        .insert({
          nome: dados.nome,
          descricao: dados.descricao,
          tipo: dados.tipo || 'global',
          whatsapp: whatsappUrl || null,
          cor: dados.cor || '#8b5e3c',
          icone: dados.icone || 'Globe',
          ativo: true,
          membros: 0,
          criado_por: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Adicionar o criador como membro automaticamente
      if (data && data.id) {
        try {
          await this.participar(data.id, userId);
        } catch (participarError) {
          console.error('Erro ao adicionar criador como membro:', participarError);
          // Não falha a criação da comunidade se não conseguir adicionar como membro
        }
      }

      return data;
    } catch (error) {
      console.error('Erro ao criar comunidade:', error);
      throw new Error(error.message || 'Erro ao criar comunidade');
    }
  },

  /**
   * Verifica se o usuário é criador da comunidade
   */
  async isCriador(comunidadeId, userId) {
    try {
      const { data, error } = await supabase
        .from('comunidades')
        .select('criado_por')
        .eq('id', comunidadeId)
        .single();

      if (error) throw error;
      return data?.criado_por === userId;
    } catch (error) {
      console.error('Erro ao verificar criador:', error);
      return false;
    }
  },

  /**
   * Atualiza uma comunidade (apenas o criador pode editar)
   */
  async atualizarComunidade(id, dados, userId) {
    try {
      const isCriador = await this.isCriador(id, userId);
      if (!isCriador) {
        throw new Error('Apenas o criador da comunidade pode editá-la');
      }

      const { data, error } = await supabase
        .from('comunidades')
        .update({
          nome: dados.nome,
          descricao: dados.descricao,
          tipo: dados.tipo,
          whatsapp: dados.whatsapp,
          cor: dados.cor,
          icone: dados.icone,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar comunidade:', error);
      throw new Error(error.message || 'Erro ao atualizar comunidade');
    }
  },

  /**
   * Deleta uma comunidade (apenas o criador pode deletar)
   */
  async deletarComunidade(id, userId) {
    try {
      const isCriador = await this.isCriador(id, userId);
      if (!isCriador) {
        throw new Error('Apenas o criador da comunidade pode deletá-la');
      }

      const { data, error } = await supabase
        .from('comunidades')
        .update({ ativo: false })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao deletar comunidade:', error);
      throw new Error(error.message || 'Erro ao deletar comunidade');
    }
  }
};

export default communityService;