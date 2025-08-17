import path from 'node:path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

//obtain variables from .env
const supaBaseUrl = process.env.SUPABASE_URL;
const supaBaseService = process.env.SUPABASE_SERVICE_ROL;


export async function fetchByValue(table, column,value,select) {
    const res = await fetch(`${supaBaseUrl}/rest/v1/${table}?${column}=eq.${value}&select=${select}`,
        {headers: {
            'apikey': supaBaseService,
            'Authorization': `Bearer ${supaBaseService}`

        }
        }
    );
    return res.json();
}

export async function fetchByRandomValue(select, table, column, value) {
    const res = await fetch(`${supaBaseUrl}/rest/v1/rpc/my_random`,{
        'method':'POST',
        headers: {
            'Content-Type': 'application/json', 
            'apikey': supaBaseService,
            'Authorization': `Bearer ${supaBaseService}`
        },
        body: JSON.stringify({
            m_select: select,
            m_table: table,
            m_column: column,
            m_value: value,
            })
        },
    );
    const data = await res.json();
    return data;
}