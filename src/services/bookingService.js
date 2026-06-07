const pool = require('../config/database');
const redisClient = require('../config/redis');
const { broadcastSeatUpdate } = require('../config/websocket');

async function reserveSeat(eventId, seatId, userId) {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        const findSeatQuery = `
            SELECT id, status, locked_until 
            FROM seats 
            WHERE id = $1 AND event_id = $2 
            FOR UPDATE;
        `;
        
        const res = await client.query(findSeatQuery, [seatId, eventId]);
        
        if (res.rows.length === 0) {
            throw new Error("Target seat structural mapping not found");
        }

        const seat = res.rows[0];
        const currentTime = new Date();
        const isCurrentlyLocked = seat.locked_until && new Date(seat.locked_until) > currentTime;

        if (seat.status === 'BOOKED' || isCurrentlyLocked) {
            throw new Error("Concurrency Conflict: Seat is already booked or temporarily reserved");
        }

        const lockExpiration = new Date(Date.now() + 5 * 60 * 1000);
        
        const updateSeatQuery = `
            UPDATE seats 
            SET status = 'LOCKED', locked_until = $1, user_id = $2 
            WHERE id = $3;
        `;
        await client.query(updateSeatQuery, [lockExpiration, userId, seatId]);

        await client.query('COMMIT');

        await redisClient.set(`seat:status:${seatId}`, 'LOCKED', { EX: 300 });

        broadcastSeatUpdate({ seatId, eventId, status: 'LOCKED', lockedUntil: lockExpiration });

        return { success: true, message: "Seat lock successfully acquired for 5 minutes." };

    } catch (error) {
        await client.query('ROLLBACK');
        return { success: false, error: error.message };
    } finally {
        client.release();
    }
}

async function confirmBooking(eventId, seatId, userId) {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        const verifyLockQuery = `
            SELECT id, status, locked_until, user_id 
            FROM seats 
            WHERE id = $1 AND event_id = $2 
            FOR UPDATE;
        `;
        const res = await client.query(verifyLockQuery, [seatId, eventId]);
        
        if (res.rows.length === 0) {
            throw new Error("Seat mapping not found");
        }

        const seat = res.rows[0];
        const currentTime = new Date();
        const isLockValid = seat.locked_until && new Date(seat.locked_until) > currentTime;

        if (seat.status !== 'LOCKED' || !isLockValid || seat.user_id !== userId) {
            throw new Error("Booking authorization expired or matching reservation hold not found");
        }

        const finalizeBookingQuery = `
            UPDATE seats 
            SET status = 'BOOKED', locked_until = NULL 
            WHERE id = $1;
        `;
        await client.query(finalizeBookingQuery, [seatId]);

        await client.query('COMMIT');

        await redisClient.set(`seat:status:${seatId}`, 'BOOKED');

        broadcastSeatUpdate({ seatId, eventId, status: 'BOOKED', lockedUntil: null });

        return { success: true, message: "Booking confirmed successfully. Ticket issued." };

    } catch (error) {
        await client.query('ROLLBACK');
        return { success: false, error: error.message };
    } finally {
        client.release();
    }
}

// Paste this EXACT block at the very bottom of your src/services/bookingService.js file
module.exports = { 
    reserveSeat, 
    confirmBooking 
};

