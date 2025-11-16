import dbConnect from '@/server/utils/dbConnect';
import { login } from '@/server/controllers/AuthControllers';

dbConnect();

export async function POST(req) {
    return login(req);
}
