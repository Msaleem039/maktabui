import dbConnect from '@/server/utils/dbConnect';
import { removeFromWaitlist } from '@/server/controllers/StudentController';

dbConnect();

export async function POST(req) {
    return removeFromWaitlist(req);
}
