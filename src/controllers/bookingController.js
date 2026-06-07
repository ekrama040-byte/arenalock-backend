const { reserveSeat, confirmBooking } = require('../services/bookingService');

async function handleHoldReservation(req, res) {
    const { eventId, seatId, userId } = req.body;

    if (!eventId || !seatId || !userId) {
        return res.status(400).json({ error: "Missing required parameter payloads: eventId, seatId, userId" });
    }

    try {
        // Call the direct destructured function reference
        const result = await reserveSeat(Number(eventId), Number(seatId), Number(userId));

        if (!result.success) {
            return res.status(409).json({ error: result.error });
        }

        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

async function handleFinalizeBooking(req, res) {
    const { eventId, seatId, userId } = req.body;

    if (!eventId || !seatId || !userId) {
        return res.status(400).json({ error: "Missing required parameter payloads: eventId, seatId, userId" });
    }

    try {
        const result = await confirmBooking(Number(eventId), Number(seatId), Number(userId));

        if (!result.success) {
            return res.status(422).json({ error: result.error });
        }

        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports = { handleHoldReservation, handleFinalizeBooking };


