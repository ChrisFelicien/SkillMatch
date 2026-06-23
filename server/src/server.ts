import app from "@/app";
import config from "@/config/env.config";
import { UserRoles } from "./interfaces/IUser";

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
