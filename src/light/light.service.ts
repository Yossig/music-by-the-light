import { IlluminanceLevel } from "./light.enum";
import samplesService from "../samples/samples.service";

class LightService {
  async getCurrentLighting(): Promise<IlluminanceLevel> {
    const meanIlluminanceValue = await samplesService.aggregateLastValues(5);
    const normalizedValue = this.normalizeValues({
      inMin: 1,
      inMax: 800,
      outMin: 1,
      outMax: 5,
      value: meanIlluminanceValue,
    });
    console.log(normalizedValue);
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
    return Number((((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin).toFixed(1));
  }
}

export default new LightService();
