import { supabase } from './supabaseClient';

export const getPeritagens = async () => {
    const { data, error } = await supabase
        .from('peritagens')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao buscar peritagens:', error);
        throw error;
    }
    return data || [];
};

export const savePeritagem = async (peritagem) => {
    // Get current user session for created_by
    const { data: { session } } = await supabase.auth.getSession();

    // Convert property names if they differ from DB snake_case (optional, but good practice)
    // Here I'll match the DB table columns I created
    const peritagemData = {
        orcamento: peritagem.orcamento,
        cliente: peritagem.cliente,
        equipamento: peritagem.equipamento,
        cidade: peritagem.cidade,
        cx: peritagem.cx,
        tag: peritagem.tag,
        nf: peritagem.nf,
        responsavel_tecnico: peritagem.responsavel_tecnico,
        items: peritagem.items || [],
        status: peritagem.status || 'Peritagem Criada',
        stage_index: peritagem.stage_index || 0,
        created_by: session?.user?.id
    };

    const { data, error } = await supabase
        .from('peritagens')
        .insert([peritagemData])
        .select()
        .single();

    if (error) {
        console.error('Erro ao salvar peritagem:', error);
        throw error;
    }
    return data;
};

export const updatePeritagemStatus = async (id, newStageIndex, newStatus) => {
    const { data, error } = await supabase
        .from('peritagens')
        .update({
            stage_index: newStageIndex,
            status: newStatus
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Erro ao atualizar status da peritagem:', error);
        throw error;
    }
    return data;
};

export const getPeritagemById = async (id) => {
    const { data, error } = await supabase
        .from('peritagens')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Erro ao buscar peritagem por ID:', error);
        throw error;
    }
    return data;
};

export const updatePeritagem = async (updatedPeritagem) => {
    // Exclude metadata fields that shouldn't be patched directly if they are sensitive
    // or just pass the whole object if it matches the schema
    const { id, ...dataToUpdate } = updatedPeritagem;

    const { data, error } = await supabase
        .from('peritagens')
        .update(dataToUpdate)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Erro ao atualizar peritagem:', error);
        throw error;
    }
    return data;
};

export const deletePeritagem = async (id) => {
    const { error } = await supabase
        .from('peritagens')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Erro ao excluir peritagem:', error);
        throw error;
    }
    return true;
};
