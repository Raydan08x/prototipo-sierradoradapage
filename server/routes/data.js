import express from 'express';
import db from '../db.js';

const router = express.Router();

// Helper to build dynamic queries
// WARNING: In production, use a library like Knex.js to avoid SQL Injection risks more robustly.
// For this local prototype, we use basic sanitization.

// GET /api/data/:table
router.get('/:table', async (req, res) => {
    const { table } = req.params;
    const { select, order, limit } = req.query;
    // 'select' parsing is complex for joins, for now we assume select=* or simple columns
    // If the frontend asks for relations (e.g. *, recipe_ingredients(*)), we might fail or need simpler logic.

    // Basic whitelist of tables for safety
    const allowedTables = [
        'products', 'users', 'profiles', 'orders', 'order_items', 'cart_items',
        'suppliers', 'raw_materials', 'beer_recipes', 'recipe_ingredients',
        'production_schedule', 'purchase_orders', 'purchase_order_items',
        'shipments', 'inventory_transactions', 'reservations'
    ];

    if (!allowedTables.includes(table)) {
        return res.status(400).json({ error: 'Invalid table' });
    }

    try {
        let query = `SELECT * FROM ${table}`;
        const params = [];

        // Simple filtering: ?status=eq.active -> WHERE status = 'active'
        // This is a very simplified parser of Supabase syntax
        const filters = [];
        Object.keys(req.query).forEach(key => {
            if (['select', 'order', 'limit', 'offset'].includes(key)) return;

            const val = req.query[key];
            // Expecting format like 'column=eq.value' from our api client
            // But standard express query is key=val. 
            // We will implement our Client to send standard params: ?column=value

            filters.push(`${key} = $${params.length + 1}`);
            params.push(val);
        });

        if (filters.length > 0) {
            query += ' WHERE ' + filters.join(' AND ');
        }

        if (order) {
            // Very basic order handling: column.asc or column.desc
            const [col, dir] = order.split('.');
            // validate col to be safe... assuming it's safe for prototype
            query += ` ORDER BY ${col} ${dir === 'desc' ? 'DESC' : 'ASC'}`;
        }

        if (limit) {
            query += ` LIMIT ${parseInt(limit)}`;
        }

        const result = await db.query(query, params);

        // If it's a join request (like recipes fetching ingredients), we might need manual handling here or in specific routes.
        // For now, let's keep it simple. If the UI needs deep nesting, we might need a specific route.

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/data/:table (Insert)
router.post('/:table', async (req, res) => {
    const { table } = req.params;
    const data = req.body;

    // Check whitelist for POST as well!
    const allowedTables = [
        'products', 'users', 'profiles', 'orders', 'order_items', 'cart_items',
        'suppliers', 'raw_materials', 'beer_recipes', 'recipe_ingredients',
        'production_schedule', 'purchase_orders', 'purchase_order_items',
        'shipments', 'inventory_transactions', 'reservations'
    ];

    if (!allowedTables.includes(table)) {
        return res.status(400).json({ error: 'Invalid table' });
    }

    try {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const slots = values.map((_, i) => `$${i + 1}`).join(', ');

        const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${slots}) RETURNING *`;
        const result = await db.query(query, values);

        // Supabase returns { data, error }
        res.json(result.rows[0]); // Return the single inserted row
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/data/:table (Update)
router.patch('/:table', async (req, res) => {
    const { table } = req.params;
    const updates = req.body;
    const { id } = req.query; // Assume ID is passed as query param for simplicity

    const allowedTables = [
        'products', 'users', 'profiles', 'orders', 'order_items', 'cart_items',
        'suppliers', 'raw_materials', 'beer_recipes', 'recipe_ingredients',
        'production_schedule', 'purchase_orders', 'purchase_order_items',
        'shipments', 'inventory_transactions', 'reservations'
    ];

    if (!allowedTables.includes(table)) {
        return res.status(400).json({ error: 'Invalid table' });
    }

    if (!id) return res.status(400).json({ error: 'Missing ID' });

    try {
        const keys = Object.keys(updates);
        const values = Object.values(updates);

        const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
        values.push(id);

        const query = `UPDATE ${table} SET ${setClause} WHERE id = $${values.length} RETURNING *`;
        const result = await db.query(query, values);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE
router.delete('/:table', async (req, res) => {
    const { table } = req.params;
    const { id } = req.query;

    const allowedTables = [
        'products', 'users', 'profiles', 'orders', 'order_items', 'cart_items',
        'suppliers', 'raw_materials', 'beer_recipes', 'recipe_ingredients',
        'production_schedule', 'purchase_orders', 'purchase_order_items',
        'shipments', 'inventory_transactions', 'reservations'
    ];

    if (!allowedTables.includes(table)) {
        return res.status(400).json({ error: 'Invalid table' });
    }

    if (!id) return res.status(400).json({ error: 'Missing ID' });

    try {
        const query = `DELETE FROM ${table} WHERE id = $1 RETURNING *`;
        const result = await db.query(query, [id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
