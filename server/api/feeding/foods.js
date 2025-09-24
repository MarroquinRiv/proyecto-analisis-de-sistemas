import { createClient } from '@supabase/supabase-js';
import { VercelRequest, VercelResponse } from '@vercel/node';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Autenticación básica
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso no autorizado' });
  }

  const token = authHeader.substring(7);
  
  try {
    // Verificar el token con Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }

    // Procesar las solicitudes según el método HTTP
    switch (req.method) {
      case 'GET':
        // Obtener todos los alimentos
        const { data, error: fetchError } = await supabase
          .from('food_items')
          .select('*')
          .order('id', { ascending: true });
        
        if (fetchError) throw fetchError;
        return res.status(200).json(data);
        
      case 'POST':
        // Crear un nuevo alimento
        const { name, unit } = req.body;
        
        const { data: insertData, error: insertError } = await supabase
          .from('food_items')
          .insert([{ name, unit }])
          .select();
        
        if (insertError) throw insertError;
        return res.status(201).json(insertData[0]);
        
      case 'PUT':
        // Actualizar un alimento
        const { id } = req.query;
        const { name: updateName, unit: updateUnit } = req.body;
        
        const { data: updateData, error: updateError } = await supabase
          .from('food_items')
          .update({ name: updateName, unit: updateUnit })
          .eq('id', id)
          .select();
        
        if (updateError) throw updateError;
        return res.status(200).json(updateData[0]);
        
      case 'DELETE':
        // Eliminar un alimento
        const { id: deleteId } = req.query;
        
        const { data: deleteData, error: deleteError } = await supabase
          .from('food_items')
          .delete()
          .eq('id', deleteId)
          .select();
        
        if (deleteError) throw deleteError;
        return res.status(200).json({ message: 'Alimento eliminado correctamente' });
        
      default:
        return res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}