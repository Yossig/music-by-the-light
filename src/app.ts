import SpotifyWebApi from "spotify-web-api-node";
import mongoose, { mongo } from "mongoose";
import lightService from "./light/light.service";
import { IlluminanceLevel } from "./light/light.enum";
import readline from "readline";
(async () => {
  await initMongoDbConnection();
  const spotifyApi = await registerSpotifyApi();
  let lastIlluminanceLevel;
  while (true) {
    const currentIlluminanceLevel: IlluminanceLevel = await lightService.getCurrentLighting();
    console.log(currentIlluminanceLevel);
    if (currentIlluminanceLevel !== lastIlluminanceLevel) {
      await decideMusic(currentIlluminanceLevel, spotifyApi);
    }
    await syncTimeOut(1000);
    lastIlluminanceLevel = currentIlluminanceLevel;
  }
})()
  .then(() => {})
  .catch((err) => {
    console.error(err);
  });

async function syncTimeOut(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}

async function syncReadLine(): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("Enter the code:", (answer) => {
      resolve(answer);
      rl.close();
    });
  });
}

async function registerSpotifyApi(): Promise<SpotifyWebApi> {
  const spotifyApi = new SpotifyWebApi({
    clientId: "a8c4767eeca84ba38d3d8c9a86682503",
    clientSecret: "7335050c977e4251bd5709e83bbf103e",
    redirectUri: "https://www.google.com/",
  });
  try {
    const refreshToken = process.env.REFRESH_TOKEN ?? "";
    spotifyApi.setRefreshToken(refreshToken);
    const accessToken = await spotifyApi.refreshAccessToken();
    spotifyApi.setAccessToken(accessToken.body.access_token);
  } catch (err) {
    const url = spotifyApi.createAuthorizeURL(["streaming"], "my-state");
    console.log("Get the code");
    console.log(url);
    let code = await syncReadLine();
    const { body: authData } = await spotifyApi.authorizationCodeGrant(code);
    console.log(authData);
    spotifyApi.setAccessToken(authData.access_token);
    spotifyApi.setRefreshToken(authData.refresh_token);
  }

  return spotifyApi;
}

async function decideMusic(
  illuminanceLevel: IlluminanceLevel,
  spotifyApi: SpotifyWebApi
) {
  switch (illuminanceLevel) {
    case IlluminanceLevel.CompleteDarkness: {
      await spotifyApi.play({
        context_uri: "spotify:playlist:5EqPp1jFbJmit3wRFBJT2w",
      });
      break;
    }
    case IlluminanceLevel.DimLight: {
      await spotifyApi.play({
        context_uri: "spotify:playlist:1QfzeppkIDu9QKs29pfT4n",
      });
      break;
    }
    case IlluminanceLevel.Twilight: {
      await spotifyApi.play({
        context_uri: "spotify:playlist:1kP2MdDfzBbXSWpWVf4Iv3",
      });
      break;
    }
    case IlluminanceLevel.BrightLight: {
      await spotifyApi.play({
        context_uri: "spotify:playlist:2Wj5WRce1HrWJtKmfou6BJ",
      });
      break;
    }
    case IlluminanceLevel.FullBrightness: {
      await spotifyApi.play({
        context_uri: "spotify:playlist:3mtiLE4r15B7c6CV5nLoPb",
      });
      break;
    }
  }
}

async function initMongoDbConnection() {
  const mongoDbUsername = process.env.MONGO_DB_USERNAME;
  const mongoDbPassword = process.env.MONGO_DB_PASSWORD;
  return mongoose.connect(
    `mongodb+srv://${mongoDbUsername}:${mongoDbPassword}@cluster0.dvazg.mongodb.net/samples?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
}
