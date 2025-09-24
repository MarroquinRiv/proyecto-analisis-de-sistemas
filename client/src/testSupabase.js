// Archivo de prueba para verificar conexión a Supabase
import { supabase } from './supabaseClient';

const testSupabaseConnection = async () => {
  console.log('Probando conexión a Supabase...');
  
  try {
    // Probar conexión básica
    const { data, error } = await supabase
      .from('zoo.areas')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error al conectar con zoo.areas:', error);
      return false;
    }
    
    console.log('Conexión exitosa con zoo.areas');
    console.log('Datos obtenidos:', data);
    return true;
    
  } catch (err) {
    console.error('Error general al probar conexión:', err);
    return false;
  }
};

// Exportar para usar en otros componentes
export { testSupabaseConnection };