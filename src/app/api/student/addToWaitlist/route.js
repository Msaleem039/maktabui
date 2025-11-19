import dbConnect from '@/server/utils/dbConnect';
import { addToWaitlist } from '@/server/controllers/StudentController';

dbConnect();

export async function POST(req) {
    return addToWaitlist(req);
}
