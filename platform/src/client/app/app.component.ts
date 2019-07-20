import { Component, OnInit } from '@angular/core';
import { PluginsStore } from '@app/core/store';
import { HttpClient } from '@angular/common/http';
import { PluginHandlerService } from '@app/core/services/plugin-handler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private plugins: PluginsStore,
    private httpClient: HttpClient,
    private pluginsHandler: PluginHandlerService
  ) {}

  search$;

  ngOnInit(): void {
    this.search$ = this.httpClient.get<any>(
      'https://registry.npmjs.com/-/v1/search?text=keywords:odessajs-pluggable-app'
    );
  }

  doLoadPlugin(plugin: any): void {
    this.plugins.next(plugin.package);
  }

  doInstallPlugin(plugin: any): void {
    this.pluginsHandler.install(plugin).subscribe(installed => {
      if (installed) {
        this.plugins.next(installed);
      }
    });
  }
}
