import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../main/services/auth/auth.service';
import { environment } from '../../../../../api-config/environment';
import {
  CreateCylinder,
  CreateCylinderResponse,
  CreateMenuRequest,
  CreateMenuResponse,
  Menu,
  UpdateMenuRequest,
} from '../../models/Menu';

@Injectable({
  providedIn: 'root',
})
export class MenuService implements OnInit {
  private readonly apiUrl = environment.API_URL + '/menus';
  private backlogId: string | null;

  private menusData = new Subject<Menu[]>();
  menusData$ = this.menusData.asObservable();

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
  ) {
    this.backlogId = this.authService.getBacklogId();
  }

  ngOnInit() {}

  getAllMenus() {
    return this.httpClient
      .get<Menu[]>(this.apiUrl + '/backlog/' + this.backlogId)
      .subscribe((menus) => {
        this.menusData.next(menus);
      });
  }

  createMenu(request: CreateMenuRequest) {
    return this.httpClient.post<CreateMenuResponse>(this.apiUrl, request);
  }

  createMenuCylinder(menuId: string, request: CreateCylinder) {
    return this.httpClient.post<CreateCylinderResponse>(
      this.apiUrl + '/' + menuId + '/cylinders',
      request,
    );
  }

  addMenuCategory(menuId: string, request: CreateCylinder) {
    return this.httpClient.post(
      this.apiUrl + '/' + menuId + '/categories',
      request,
    );
  }

  getMenuById(menuId: string) {
    return this.httpClient.get<Menu>(this.apiUrl + '/' + menuId);
  }

  updateMenu(menuId: string, request: UpdateMenuRequest) {
    return this.httpClient.patch(this.apiUrl + '/' + menuId, request);
  }
}
