import dbConnect from '@/server/utils/dbConnect';
import { getAllAdmin } from '@/server/controllers/AdminController';

dbConnect();

export async function POST(req) {
    return getAllAdmin(req);
}
