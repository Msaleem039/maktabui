import dbConnect from '@/server/utils/dbConnect';
import { removeFromWaitList } from '@/server/controllers/ParentController';

dbConnect();

export async function POST(req) {
    return removeFromWaitList(req);
}
