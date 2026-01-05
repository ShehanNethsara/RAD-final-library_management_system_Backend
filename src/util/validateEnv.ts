import { cleanEnv, str, port } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    MONGO_URI: str(), 
    PORT: port({ default: 5000 }), 
    JWT_SECRET: str(), 
  });
};

export default validateEnv;