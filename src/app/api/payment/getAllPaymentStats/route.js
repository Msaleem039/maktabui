import dbConnect from '@/server/utils/dbConnect';
import { getAllPaymentStats } from '@/server/controllers/PaymentController';

dbConnect();

export async function POST(req) {
    return getAllPaymentStats(req);
}
