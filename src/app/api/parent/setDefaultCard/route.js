import dbConnect from '@/server/utils/dbConnect';
import {setCardDefault } from '@/server/controllers/ParentController';

dbConnect();

export async function POST(req) {
    return setCardDefault(req);
}
