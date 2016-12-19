#Grilla con datatables y Sharepoint Framework

En este post voy a explicar cómo integrar las DataTables un plugi de jquery, en SPF para mostrar los datos como un gridview, este plugin es impresionante, ya que le permite paginar de manera asincrona, búsqueda asíncrona/en la pantalla, y tiene muy buen estilo. Incluso podríamos utilizar esto como reemplazo para las vista estandares de Sharepoint. No entiendo por qué después de tantos años la vista de lista elemento Web es tan fea y lenta, tal vez con los sitios modernos que viene pronto, esto se vea mejor y sea más rápida.

Como saben en el workbench local no podemos hacer llamadas API REST a Sharepoint, por lo tanto tenemos que crear un cliente Mock para simular los datos de las listas de sharepoint.

######MockHttpClient.ts
```Typescript
import { IListItem } from './PnpcrudSampleWebPart';

export default class MockHttpClient {
//Title,h7vv,v7nw,mczsId,mczsStringId,BooleanColumn
    private static _items: IListItem[] =
    [
      { Title: 'Mock List', h7vv: '1',v7nw :'01-01-2016',mczsId:'Luis Esteban Valencia',BooleanColumn:'Yes' },
      { Title: 'Mock List2', h7vv: '1',v7nw :'01-01-2016',mczsId:'Luis Esteban Valencia',BooleanColumn:'Yes' },
    ];

    public static get(restUrl: string, options?: any): Promise<IListItem[]> {
      return new Promise<IListItem[]>((resolve) => {
              resolve(MockHttpClient._items);
          });
      }
}
```

Cuando yo cree mi lista, Agregue algunas comunas con nombres: datecolumn, personcolumn, sin embargo Sharepoint agrego nombres especiales a estas columnas, segun lo pueden ver en el codigo anterior.

En nuestro webpart tenemos que chequear si estamos trabajando localmente, es por eso que tuvimos que agregar el MockHttpClient.

```Typescript
 private _renderListAsync(): void {
    // Local environment
    if (this.context.environment.type === EnvironmentType.Local) {
      this._getMockListData().then((response) => {
        this._renderList(response.value);
      });
    }
    else{
      this._getListData()
        .then((response) => {
          this._renderList(response.value);
        });
    }
  }
```

Como puedes ver si es local utilizamos el Mock, y si es remoto utilizamos el REST API de sharepoint.

```typescript
  private _getListData(): Promise<IListItems> {
    return this.context.httpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Lista')/items?$select=Title,h7vv,v7nw,mczsId,mczsStringId,BooleanColumn`)
      .then((response: Response) => {
        return response.json();
      });
  }
```

Como sabes, el punto de entrada de todos los webparts es el metodo render, es por eso que en este metodo construimos el html que va a alojar nuestra tabla construida con el plugin de Datatables.

```typescript
  public render(): void {
    debugger;
    ModuleLoader.loadCss('//cdn.datatables.net/1.10.12/css/jquery.dataTables.min.css');
    if (this.renderedOnce === false) {
       this.domElement.innerHTML = `<table id="example" class="display" cellspacing="0" width="100%">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>NumberColumn</th>
                    <th>DateColumn</th>
                    <th>PersonColumn</th>
                    <th>BooleanColumn</th>
                </tr>
            </thead>
        </table>`;
    }
   this._renderListAsync();
  }
```

Y en el metodo render list es donde llamamos el API de Datatables para renderizar el json en pantalla.

```typescript
  ///Render list on the datatable
  private _renderList(items: IListItem[]): void {
    $('#example').DataTable({
      data: items,
      columns: [
          { "data": "Title" },
          { "data": "h7vv" },//just the columnd names sharepoint generated.
          { "data": "v7nw" },
          { "data": "mczsId" },
          { "data": "BooleanColumn" }
      ]
    });
  }
```

El resultado final, una grilla de datos, que puede ordenar, pagina e incluso buscar mas rapido que los controles estandares de Sharepoint.

Full code [here](https://github.com/levalencia/SharepointFrameworkCodeSamples/tree/master/Datatables)

![](/content/images/2016/10/2016-10-15_18-44-19.png)