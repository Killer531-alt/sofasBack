const PDFDocument = require('pdfkit');
const fs = require('fs-extra');
const path = require('path');

class PDFGenerator {
    constructor() {
        // Asegurar que existe el directorio para PDFs
        this.pdfDir = path.join(__dirname, '../temp');
        fs.ensureDirSync(this.pdfDir);
    }

    async generateFacturaPDF(factura) {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({
                size: 'A4',
                margin: 50
            });

            const filePath = path.join(this.pdfDir, `factura-${factura.numero_factura}.pdf`);
            const stream = fs.createWriteStream(filePath);

            doc.pipe(stream);

            // Encabezado
            doc.fontSize(20).text('Orlando Ortiz Muebles', { align: 'center' });
            doc.moveDown();
            doc.fontSize(16).text('Factura', { align: 'center' });
            doc.moveDown();

            // Información de la factura
            doc.fontSize(12);
            doc.text(`Número de Factura: ${factura.numero_factura}`);
            doc.text(`Fecha de Emisión: ${new Date(factura.fecha_emision).toLocaleDateString()}`);
            doc.moveDown();

            // Información del cliente
            doc.fontSize(14).text('Información del Cliente');
            doc.fontSize(12);
            doc.text(`Nombre: ${factura.cliente.nombre}`);
            doc.text(`Correo: ${factura.cliente.correo}`);
            doc.text(`Teléfono: ${factura.cliente.telefono}`);
            doc.text(`Dirección: ${factura.cliente.direccion}`);
            doc.moveDown();

            // Tabla de items
            doc.fontSize(14).text('Detalles de la Compra');
            doc.fontSize(12);
            
            // Encabezados de la tabla
            const tableTop = doc.y + 10;
            const itemX = 50;
            const cantidadX = 300;
            const precioX = 400;
            const totalX = 500;

            doc.text('Producto', itemX, tableTop);
            doc.text('Cant.', cantidadX, tableTop);
            doc.text('Precio', precioX, tableTop);
            doc.text('Total', totalX, tableTop);

            // Línea horizontal
            doc.moveTo(50, tableTop + 20)
               .lineTo(550, tableTop + 20)
               .stroke();

            let tableY = tableTop + 30;

            // Items
            factura.items.forEach(item => {
                doc.text(item.producto.nombre, itemX, tableY);
                doc.text(item.cantidad.toString(), cantidadX, tableY);
                doc.text(`$${item.precio_unitario.toFixed(2)}`, precioX, tableY);
                doc.text(`$${item.subtotal.toFixed(2)}`, totalX, tableY);
                tableY += 20;
            });

            // Línea horizontal final
            doc.moveTo(50, tableY)
               .lineTo(550, tableY)
               .stroke();

            // Totales
            tableY += 20;
            doc.text('Subtotal:', 400, tableY);
            doc.text(`$${factura.subtotal.toFixed(2)}`, totalX, tableY);
            
            tableY += 20;
            doc.text('IVA:', 400, tableY);
            doc.text(`$${factura.iva.toFixed(2)}`, totalX, tableY);
            
            tableY += 20;
            doc.fontSize(14);
            doc.text('Total:', 400, tableY);
            doc.text(`$${factura.total.toFixed(2)}`, totalX, tableY);

            // Pie de página
            doc.fontSize(10);
            doc.text(
                '¡Gracias por su compra!',
                50,
                doc.page.height - 50,
                { align: 'center' }
            );

            // Finalizar el documento
            doc.end();

            stream.on('finish', () => {
                resolve(filePath);
            });

            stream.on('error', reject);
        });
    }

    async cleanupOldPDFs() {
        try {
            const files = await fs.readdir(this.pdfDir);
            const oneHourAgo = Date.now() - (60 * 60 * 1000);

            for (const file of files) {
                const filePath = path.join(this.pdfDir, file);
                const stats = await fs.stat(filePath);
                if (stats.ctimeMs < oneHourAgo) {
                    await fs.unlink(filePath);
                }
            }
        } catch (error) {
            console.error('Error limpiando PDFs antiguos:', error);
        }
    }
}

module.exports = new PDFGenerator();