import dbConnect from '@/server/utils/dbConnect';
import { addToWaitList } from '@/server/controllers/ParentController';

dbConnect();

export async function POST(req) {
    return addToWaitList(req);
}
