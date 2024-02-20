import "@knocklabs/react/dist/index.css";
import jwt from "jsonwebtoken";

import Providers from "./components/providers";
import "./global.css";
import { getAppDetails } from "./lib/app-details";

const { userId, tenant, collection, objectId } = getAppDetails();

const currentTime = Math.floor(Date.now() / 1000);
const expireInSeconds = 60 * 60;
const signingKey = process.env.KNOCK_SIGNING_KEY!;

const userToken = signingKey
  ? jwt.sign(
      {
        sub: userId,
        iat: currentTime,
        exp: currentTime + expireInSeconds,
        grants: {
          [`https://api.knock.app/v1/objects/$tenants/${tenant}`]: {
            "slack/channels_read": [{}],
          },
          [`https://api.knock.app/v1/objects/${collection}/${objectId}`]: {
            "channel_data/read": [{}],
            "channel_data/write": [{}],
          },
        },
      },
      signingKey,
      {
        algorithm: "RS256",
      },
    )
  : "secretOrPrivateKey";

function MyApp({ children }: { children: React.ReactElement }) {
  return (
    <>
      <html>
        <body className="px-12 py-6">
          <h1 className="text-2xl font-bold mb-6">SlackKit Demo App</h1>
          <Providers userToken={userToken} knockUserId={userId} tenant={tenant}>
            {children}
          </Providers>
        </body>
      </html>
    </>
  );
}

export default MyApp;