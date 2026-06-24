import app from '@/app';
import config from '@/config/env.config';
import connectDatabase from '@/config/database';

const PORT = config.PORT;

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {}
};

startServer();
