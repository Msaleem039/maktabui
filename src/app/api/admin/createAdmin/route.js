import dbConnect from '@/server/utils/dbConnect';
import { createAdmin } from '@/server/controllers/AdminController';

dbConnect();

export async function POST(req) {
    return createAdmin(req);
}
