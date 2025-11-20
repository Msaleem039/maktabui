import dbConnect from '@/server/utils/dbConnect';
import { createInvoice } from '@/server/controllers/InvoiceController';

dbConnect();

export async function POST(req) {
    return createInvoice(req);
}
