import { createClient } from '@supabase/supabase-js';
import { VercelRequest, VercelResponse } from '@vercel/node';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
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

    // Procesar la solicitud POST para comprar entradas
    if (req.method === 'POST') {
      // En una implementación real, aquí se procesaría el pago
      // Por ahora solo simulamos la compra
      
      const { ticket_type_id, promotion_id, visit_date, purchaser_email } = req.body;
      
      const { data, error } = await supabase
        .from('tickets')
        .insert([{
          ticket_type_id,
          promotion_id,
          purchaser_profile_id: null, // En una implementación real, se usaría el perfil del usuario
          purchased_at: new Date(),
          visit_date,
          price_paid: 0 // En una implementación real, se calcularía el precio
        }])
        .select();
      
      if (error) throw error;
      
      return res.status(201).json(data[0]);
    } else {
      return res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}