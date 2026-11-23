export const config = {
    port: process.env.PORT || 8080,
    mongoUrl: process.env.MONGODB_URI || '',
    jwtSecret: process.env.JWT_SECRET || 'tokenSecretJWT'
};
