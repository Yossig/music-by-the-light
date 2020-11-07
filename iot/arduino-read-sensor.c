int sensorPin = A0; // select the input pin for LDR

int sensorValue = 0; // variable to store the value coming from the sensor
void setup()
{
  Serial.begin(9600); //sets serial port for communication
}

int singleSampleInterval = 100;
int meanSamplesInterval = 1000;
int intervalCounter = 0;
int totalValues = 0;
void loop()
{
  totalValues += analogRead(sensorPin);
  delay(singleSampleInterval);
  intervalCounter += singleSampleInterval;
  if (intervalCounter >= meanSamplesInterval)
  {
    Serial.println(totalValues / (meanSamplesInterval / singleSampleInterval));
    intervalCounter = 0;
    totalValues = 0;
  }
}