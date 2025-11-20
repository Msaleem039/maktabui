import dbConnect from '@/server/utils/dbConnect';
import { removeCardDetail } from '@/server/controllers/ParentController';

dbConnect();

export async function POST(req) {
    return removeCardDetail(req);
}
