import { cleanEnv, str, port } from 'envalid';

// සිස්ටම් එක පටන් ගන්න කලින් මේ ටික check කරනවා
const validateEnv = () => {
  cleanEnv(process.env, {
    MONGO_URI: str(), // Database URL එක අනිවාර්යයි
    PORT: port({ default: 5000 }), // PORT එක නැත්නම් 5000 ගන්නවා
    JWT_SECRET: str(), // Token හදන්න රහස් වචනය අනිවාර්යයි
  });
};

export default validateEnv;