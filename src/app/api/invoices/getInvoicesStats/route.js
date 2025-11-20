import dbConnect from '@/server/utils/dbConnect';
import { getInvoicesStats } from '@/server/controllers/InvoiceController';

dbConnect();

export async function POST(req) {
    return getInvoicesStats(req);
}
