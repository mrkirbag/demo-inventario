import { db } from '../db';

export async function GET() {
    try {

        const facturas = await db.execute('SELECT * FROM facturas ORDER BY fecha DESC');

        // Si no hay facturas, retornar un mensaje de error
        if (!facturas || !facturas.rows || facturas.rows.length === 0) {
            return new Response(JSON.stringify({ message: 'No hay facturas registradas' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200
            });
        }

        // Retornar las facturas en formato JSON
        return new Response(JSON.stringify(facturas.rows), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error fetching facturas:', error);
        return new Response('Error fetching facturas', { status: 500 });
    }
}

export async function POST({ request }) {
    try {
        const body = await request.json();
        const { fecha, proveedor, montoNumero } = body;

        // Validar que la factura tenga los campos necesarios
        if (!fecha || !proveedor || !montoNumero) {
            return new Response('Faltan datos de la factura', { status: 400 });
        }

        // Insertar la nueva factura en la base de datos
        const result = await db.execute('INSERT INTO facturas (fecha, proveedor, monto, estado) VALUES (?, ?, ?, ?)', [fecha, proveedor, montoNumero, 'completada']);

        return new Response(JSON.stringify({ message: "Factura agregada exitosamente" }), { status: 201 });


    } catch (error) {
        console.error('Error inserting factura:', error);
        return new Response('Error inserting factura', { status: 500 });
    }
}

export async function PUT({ request }) {
    try {
        const body = await request.json();
        const { id } = body;

        // Validar que la factura tenga los campos necesarios
        if (!id) {
            return new Response('Faltan datos de la factura', { status: 400 });
        }

        // Anular la factura
        const result = await db.execute('UPDATE facturas SET estado = ? WHERE id = ?', ['anulada', id]);

        // Validar si no se encuentra
        if (result.affectedRows === 0) {
            return new Response('Factura no encontrada', { status: 404 });
        }

        return new Response(JSON.stringify({ message: "Factura anulada exitosamente" }), { status: 200 });

    } catch (error) {
        console.error('Error updating factura:', error);
        return new Response('Error updating factura', { status: 500 });
    }
}