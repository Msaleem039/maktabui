import dbConnect from '@/server/utils/dbConnect';
import { addCardDetail } from '@/server/controllers/ParentController';

dbConnect();

export async function POST(req) {
    return addCardDetail(req);
}
