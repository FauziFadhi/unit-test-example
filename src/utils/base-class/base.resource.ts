import * as JsonAPISerializer from 'json-api-serializer';

export const resourceNames = ['users'] as const;

export type Resource = typeof resourceNames[number];

export class BaseResource {
  protected serializer = new JsonAPISerializer();

  /**
   * resource string name
   * @param resourceName
   * @param data
   */
  constructor(resourceName: Resource, data: any) {
    /**
     * @see {resource}
     * register all defined resource
     * */
    resourceNames.forEach((market: Resource) => {
      this.serializer.register(market, {
        id: 'id',
      });
    });

    return this.serializer.serialize(resourceName, data);
  }
}
