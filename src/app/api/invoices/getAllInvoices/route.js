import dbConnect from '@/server/utils/dbConnect';
import { getAllInvoices } from '@/server/controllers/InvoiceController';

dbConnect();

export async function POST(req) {
    return getAllInvoices(req);
}
