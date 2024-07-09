class ServiceLocator {
  private static services: Map<string, any> = new Map();

  static register<T>(name: string, service: T): void {
    ServiceLocator.services.set(name, service);
  }

  static get<T>(name: string): T {
    const service = ServiceLocator.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    return service;
  }
}

export default ServiceLocator;
