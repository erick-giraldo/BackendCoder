export default {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV || 'desarrollo',
    mongodbUri: process.env.MONGODB_URI,
    gitHubClientId: process.env.GITHUB_CLIENT_ID,
    gitHubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    gitHubCallback: process.env.GITHUB_CALLBACK,
    jwtSecret: process.env.JWT_SECRET,
    adminName: process.env.ADMIN_NAME,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
    presistanceType: process.env.PERSISTENCE_TYPE || 'mongodb',
    
};
