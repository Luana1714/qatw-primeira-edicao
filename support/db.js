import pgPromise from 'pg-promise';

const pgp = pgPromise()
const db = pgp('postgreesql://dba:dba@paybank-db:5432/UserDB')

export async function obterCodigo2FA() {
   const query = `
        SELECT  code
        FROM public."TwoFactorCode"
        order by id desc
        limit 1;
    ` 

    const result = await db.oneOrNone(query)
    return result.code
}

