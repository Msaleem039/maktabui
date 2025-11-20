import dbConnect from '@/server/utils/dbConnect';
import { updateAdmin } from '@/server/controllers/AdminController';

dbConnect();

export async function POST(req) {
    return updateAdmin(req);
}
