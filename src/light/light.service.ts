import { IlluminanceLevel } from "./light.enum";
import samplesService from "../samples/samples.service";

class LightService {
  async getCurrentLighting(): Promise<IlluminanceLevel> {
    const meanIlluminanceValue = await samplesService.aggregateLastValues(2);
    console.log(`Last Aggregated Raw Value: ${meanIlluminanceValue}`);
    const normalizedValue = this.normalizeValues({
      inMin: 1,
      inMax: 800,
      outMin: 0.6,
      outMax: 5,
      value: meanIlluminanceValue,
    });
    console.log(`Normalized Data: ${normalizedValue}`);
    return Math.ceil(normalizedValue);
  }

  private normalizeValues(params: {
    inMin: number;
    inMax: number;
    outMin: number;
    outMax: number;
    value: number;
  }) {
    const { inMax, inMin, outMax, outMin, value } = params;
    const fixedValue = value > 800 ? 800 : value;
    return Number(
      (
        ((fixedValue - inMin) * (outMax - outMin)) / (inMax - inMin) +
        outMin
      ).toFixed(1)
    );
  }
}

export default new LightService();
