import { TuyaDeviceSchema } from '../../device/TuyaDevice';
import BaseAccessory from '../BaseAccessory';
import FakeGatoHistoryService = require('fakegato-history');

export function configureHistory(
  accessory: BaseAccessory,
  schema?: TuyaDeviceSchema,
) {
  if (!schema) {
    return;
  }

  const FakeGatoHistory = FakeGatoHistoryService(accessory.platform.api);
  const service = new FakeGatoHistory('switch', accessory.platform, {
    storage: 'fs',
  });

  // Poll every 5 minutes
  (function poll() {
    setTimeout(() => {
      const status = accessory.getStatus(schema.code)!;
      service.addEntry({
        time: Math.round(new Date().valueOf() / 1000),
        status: status,
      });
      poll();
    }, 5 * 60 * 1000);
  })();
}
