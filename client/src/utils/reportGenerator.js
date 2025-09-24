import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Genera un PDF a partir de un elemento HTML
 * @param {string} elementId - ID del elemento HTML a convertir
 * @param {string} fileName - Nombre del archivo PDF generado
 */
export const generatePDF = async (elementId, fileName) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Elemento no encontrado');
    }

    // Usar html2canvas para capturar el elemento
    const canvas = await html2canvas(element, {
      scale: 2, // Mejor calidad
      useCORS: true,
      allowTaint: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // Ancho en mm para A4
    const pageHeight = 297; // Alto en mm para A4
    const imgHeight = canvas.height * imgWidth / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Añadir la primera página
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Si el contenido es más largo que una página, añadir páginas adicionales
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Guardar el PDF
    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('Error al generar PDF:', error);
    throw error;
  }
};

/**
 * Genera el reporte de inventario de alimentos
 * @param {Array} foods - Lista de alimentos
 * @param {Array} stock - Lista de stocks
 */
export const generateFoodInventoryReport = (foods, stock) => {
  const content = `
    <div style="padding: 20px;">
      <h1 style="text-align: center;">Inventario de Alimentos</h1>
      <p style="text-align: center;">Fecha: ${new Date().toLocaleDateString()}</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Alimento</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Unidad</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Cantidad</th>
          </tr>
        </thead>
        <tbody>
          ${stock.map(item => {
            const food = foods.find(f => f.id === item.food_item_id);
            return `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${food ? food.name : 'Desconocido'}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${food ? food.unit : ''}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
  
  return content;
};

/**
 * Genera el reporte de estado de salud de animales
 * @param {Array} animals - Lista de animales
 */
export const generateAnimalHealthReport = (animals) => {
  const content = `
    <div style="padding: 20px;">
      <h1 style="text-align: center;">Estado de Salud de Animales</h1>
      <p style="text-align: center;">Fecha: ${new Date().toLocaleDateString()}</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Tag</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Nombre</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Especie</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Área</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Estado</th>
          </tr>
        </thead>
        <tbody>
          ${animals.map(animal => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${animal.tag_code || 'N/A'}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${animal.name || 'N/A'}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${animal.species_name || 'Desconocida'}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${animal.area_name || 'N/A'}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${animal.status || 'Desconocido'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  
  return content;
};

/**
 * Genera el reporte de limpieza del día
 * @param {Array} cleaningLogs - Lista de registros de limpieza
 * @param {Array} tasks - Lista de tareas de limpieza
 */
export const generateCleaningReport = (cleaningLogs, tasks) => {
  const content = `
    <div style="padding: 20px;">
      <h1 style="text-align: center;">Registro de Limpieza del Día</h1>
      <p style="text-align: center;">Fecha: ${new Date().toLocaleDateString()}</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Tarea</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Área</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Realizado por</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Fecha</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Notas</th>
          </tr>
        </thead>
        <tbody>
          ${cleaningLogs.map(log => {
            const task = tasks.find(t => t.id === log.task_id);
            return `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${task ? task.description : 'Desconocida'}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${task ? task.area_name : 'N/A'}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${log.performed_by || 'N/A'}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${new Date(log.performed_at).toLocaleString()}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${log.notes || 'N/A'}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
  
  return content;
};

/**
 * Genera el reporte de ventas de entradas
 * @param {Array} tickets - Lista de entradas vendidas
 * @param {Array} ticketTypes - Lista de tipos de entrada
 */
export const generateTicketSalesReport = (tickets, ticketTypes) => {
  const content = `
    <div style="padding: 20px;">
      <h1 style="text-align: center;">Resumen de Ventas de Entradas</h1>
      <p style="text-align: center;">Fecha: ${new Date().toLocaleDateString()}</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Tipo</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Fecha de Visita</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Precio Pagado</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Promoción</th>
          </tr>
        </thead>
        <tbody>
          ${tickets.map(ticket => {
            const type = ticketTypes.find(t => t.id === ticket.ticket_type_id);
            return `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${type ? type.name : 'Desconocido'}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${new Date(ticket.visit_date).toLocaleDateString()}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">$${ticket.price_paid || 0}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${ticket.promotion_id ? 'Sí' : 'No'}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
  
  return content;
};