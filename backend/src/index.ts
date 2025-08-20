import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import cardRoutes from './routes/cards';
import transactionRoutes from './routes/transactions';
import paymentRoutes from './routes/payments';
import rewardRoutes from './routes/rewards';
import disputeRoutes from './routes/disputes';
import notificationRoutes from './routes/notifications';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/cards', cardRoutes);
app.use('/transactions', transactionRoutes);
app.use('/payments', paymentRoutes);
app.use('/rewards', rewardRoutes);
app.use('/disputes', disputeRoutes);
app.use('/notifications', notificationRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
