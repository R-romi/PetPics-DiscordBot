import path from 'node:path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { getRandomItem } from '../../utils/getRandomItem.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL; 
const SUPABASE_SERVICE_ROL = process.env.SUPABASE_SERVICE_ROL; 

export async function getRandomImageKeyFromBucket(bucket, folder){
    const listUrl = `${SUPABASE_URL}/storage/v1/object/list/${encodeURIComponent(bucket)}`;    
    const listRes = await fetch(listUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_SERVICE_ROL,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROL}`,
        },
        body: JSON.stringify({
            prefix: folder,
            limit: 1000,
        })
    })
    const items = await listRes.json();
    const files = (items || []).filter(it => !it.name.endsWith('/')).map(it => folder ? `${folder}/${it.name}` : it.name);
    const key = getRandomItem(files);
    return key;
}

export async function getImageUrlFromBucket(key, bucket, expiresIn=600) {
    const signUrl = `${SUPABASE_URL}/storage/v1/object/sign/${encodeURIComponent(bucket)}/${encodeURI(key)}`;
    const signRes = await fetch(signUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_SERVICE_ROL,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROL}`,
        },
        body: JSON.stringify({ expiresIn }),
    });
    const data = await signRes.json();
    const url = `${SUPABASE_URL}/storage/v1${data.signedURL}`;
    return url;
}

export async function getImageBufferFromBucket(bucket, folder, expiresIn = 600) {
    const key = await getRandomImageKeyFromBucket(bucket, folder, expiresIn)
    const url  = await getImageUrlFromBucket(key,bucket,expiresIn);
    const res = await fetch(url);
    const buf = Buffer.from(await res.arrayBuffer());
    return  buf;
}
