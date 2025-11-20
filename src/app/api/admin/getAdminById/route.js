import dbConnect from '@/server/utils/dbConnect';
import { getAdminById } from '@/server/controllers/AdminController';

dbConnect();

export async function POST(req) {
    return getAdminById(req);
}
