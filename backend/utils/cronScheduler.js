import cron from 'node-cron';

import BookingSchema from '../models/BookingSchema.js';

const initializeScheduler = () => {
    // Run every hour (at minute 0)
    cron.schedule('0 * * * *', async () => {
        console.log('Running appointment status update check...');
        try {
            const result = await BookingSchema.updateExpiredAppointments();
            console.log('Successfully updated expired appointments');
        } catch (error) {
            console.error('Failed to update expired appointments:', error);
            // You might want to add notification/alerting logic here
        }
    });

    // Optional: Run immediately on server start
    (async () => {
        try {
            await Booking.updateExpiredAppointments();
            console.log('Initial appointment status update completed');
        } catch (error) {
            console.error('Initial appointment status update failed:', error);
        }
    })();
};

export default initializeScheduler;