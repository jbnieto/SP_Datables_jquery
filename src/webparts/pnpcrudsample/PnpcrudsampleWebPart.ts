/// <reference path="../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../../typings/jquery.dataTables/jquery.dataTables.d.ts" />

import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

//import styles from './Pnpcrudsample.module.scss';
import ModuleLoader from '@microsoft/sp-module-loader';
import * as strings from 'pnpcrudsampleStrings';
import { IPnpcrudsampleWebPartProps } from './IPnpcrudsampleWebPartProps';
//import * as pnp from 'sp-pnp-js';
import MockHttpClient from './MockHttpClient';
import { EnvironmentType } from '@microsoft/sp-client-base';

require('jquery');
require('datatables');

export interface ISPLists {
    value: ISPList[];
}

export interface ISPList {
  Title?: string;
  Id: number;
}

export interface IListItems{
   value: IListItem[];
}
//Title,h7vv,v7nw,mczsId,mczsStringId,BooleanColumn

export interface IListItem {
  Title: string;
  r3x5: string;
}

export default class PnpcrudsampleWebPart extends BaseClientSideWebPart<IPnpcrudsampleWebPartProps> {
   //private container: JQuery;

  //Default constructor, here we have to load css
  public constructor(context: IWebPartContext) {
    super(context);
    ModuleLoader.loadCss('//cdn.datatables.net/1.10.12/css/jquery.dataTables.min.css');
  }

  ///Gets data from the mock, fake data
  private _getMockListData(): Promise<IListItems> {
    return MockHttpClient.get(this.context.pageContext.web.absoluteUrl)
      .then((data: IListItem[]) => {
          var listData: IListItems = { value: data };
          return listData;
      }) as Promise<IListItems>;
  }

  ///Checks if the environment is local, then we will load data from mock, if not from the list
  private _renderListAsync(): void {
    // Local environment
    //if (this.context.environment.type === EnvironmentType.Local) {
    //  this._getMockListData().then((response) => {
    //    this._renderList(response.value);
    //  });
    //}
    //else{
      this._getListData()
        .then((response) => {
          this._renderList(response.value);
        });
    //}
  }
//Title,h7vv,v7nw,mczsId,mczsStringId,BooleanColumn

  ///Render list on the datatable
  private _renderList(items: IListItem[]): void {
    $('#example').DataTable({
      data: items,
      columns: [
          { "data": "Title" },
          { "data": "r3x5" },
      ]
    });
  }

  ///Get list data
  private _getListData(): Promise<IListItems> {
    console.log('Get list');
    return this.context.httpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('TestList')/items?$select=Title,r3x5`)
      .then((response: Response) => {
        return response.json();
      });
  }

  /// Generar contenido HTML
  public render(): void {
    //debugger;
    ModuleLoader.loadCss('//cdn.datatables.net/1.10.12/css/jquery.dataTables.min.css');
    if (this.renderedOnce === false) {
       this.domElement.innerHTML = `<table id="example" class="display" cellspacing="0" width="100%">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>NumberColumn</th>
                </tr>
            </thead>
        </table>`;
    }
   this._renderListAsync();
  }

  //Property pane fields
  protected get propertyPaneSettings(): IPropertyPaneSettings {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('listName', {
                  label: strings.ListNameFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
