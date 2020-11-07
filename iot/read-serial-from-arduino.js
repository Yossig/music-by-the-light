const SerialPort = require("serialport");
const mongoose = require("mongoose");
const Readline = require("@serialport/parser-readline");
const port = new SerialPort("/dev/ttyACM0");

mongoose.connect(
  "mongodb+srv://music-by-the-light-service-user:LV1xf7YkaJavw6aU@cluster0.dvazg.mongodb.net/samples?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const Sample = mongoose.model("Sample", {
  timestamp: { type: Date, required: true },
  value: { type: Number, required: true },
});

const parser = port.pipe(new Readline());
parser.on("data", async (val) => {
  try {
    const dummySample = new Sample({ timestamp: Date.now(), value: val });
    await dummySample.save();
  } catch (err) {
    console.error(
      `${new Date().toISOString()} failed to save sample to database`
    );
  } finally {
    console.log(`${new Date().toISOString()} New Sample Value: ${val}`);
  }
});
