import { IListItem } from './PnpcrudSampleWebPart';

export default class MockHttpClient {
//Title,h7vv,v7nw,mczsId,mczsStringId,BooleanColumn
    private static _items: IListItem[] =
    [
      { Title: 'Mock List', r3x5: '1' },
      { Title: 'Mock List2', r3x5: '2' },
    ];

    public static get(restUrl: string, options?: any): Promise<IListItem[]> {
      return new Promise<IListItem[]>((resolve) => {
              resolve(MockHttpClient._items);
          });
      }
}