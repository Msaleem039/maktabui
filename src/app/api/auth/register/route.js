import dbConnect from '@/server/utils/dbConnect';
import { register } from '@/server/controllers/AuthControllers';

dbConnect();

export async function POST(req) {
    return register(req);
}
