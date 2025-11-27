import { InstanceDto } from '@api/dto/instance.dto';
import { ProxyDto } from '@api/dto/proxy.dto';
import { Proxy } from '@prisma/client';

import { WAMonitoringService } from './monitor.service';

export class ProxyService {
  constructor(private readonly waMonitor: WAMonitoringService) {}

  public create(instance: InstanceDto, data: ProxyDto) {
    this.waMonitor.waInstances[instance.instanceName].setProxy(data);

    return { proxy: { ...instance, proxy: data } };
  }

  public async find(instance: InstanceDto): Promise<Proxy> {
    try {
      const result = await this.waMonitor.waInstances[instance.instanceName].findProxy();

      if (Object.keys(result).length === 0) {
        throw new Error('Proxy not found');
      }

      return result;
    } catch {
      return null;
    }
  }
}
