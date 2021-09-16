import dotenv from 'dotenv';

dotenv.config();

export default {
   // prendere valore differente se si è in dev o produzione
   base_url: process.env.RACT_APP_BASE_URL,
}