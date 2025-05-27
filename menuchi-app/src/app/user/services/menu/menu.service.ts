import { Injectable, OnInit } from '@angular/core';
import { forkJoin, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../main/services/auth/auth.service';
import { environment } from '../../../../../api-config/environment';
import {
  CreateCylinder,
  CreateCylinderResponse,
  CreateMenuRequest,
  CreateMenuResponse,
  Menu,
  MenuPreview,
  UpdateMenuRequest,
} from '../../models/Menu';

@Injectable({
  providedIn: 'root',
})
export class MenuService implements OnInit {
  private readonly apiUrl = environment.API_URL + '/menus';
  private backlogId: string | null;
  private branchIds: string[] = [];

  private menusData = new Subject<Menu[]>();
  menusData$ = this.menusData.asObservable();

  private currentMenuData = new Subject<Menu>();
  currentMenuData$ = this.currentMenuData.asObservable();

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
  ) {
    this.backlogId = this.authService.getBacklogId();
    this.branchIds = this.authService.getAllBranchIds();
  }

  ngOnInit() {}

  getAllMenusForBranches() {
    const branchIds = this.authService.getAllBranchIds();
    const requests = branchIds.map((branchId) =>
      this.httpClient.get<Menu[]>(`${this.apiUrl}/branch/${branchId}`),
    );

    return forkJoin(requests).subscribe({
      next: (menusArray) => {
        const allMenus = menusArray.flat();
        this.menusData.next(allMenus);
      },
      error: (error) => {
        console.error('Error fetching menus for all branches:', error);
      },
    });
  }

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

  addCategoryToMenu(
    menuId: string,
    data: { categoryId: string; cylinderId: string; items: string[] },
  ) {
    return this.httpClient.post(this.apiUrl + `/${menuId}/categories`, data);
  }

  getMenuById(menuId: string) {
    return this.httpClient
      .get<Menu>(this.apiUrl + '/' + menuId)
      .subscribe((menu) => {
        this.currentMenuData.next(menu);
      });
  }

  updateMenu(menuId: string, request: UpdateMenuRequest) {
    return this.httpClient.patch(this.apiUrl + '/' + menuId, request);
  }

  getMenuPreview(menuId: string): Observable<MenuPreview> {
    return this.httpClient.get<MenuPreview>(`${this.apiUrl}/${menuId}/preview`);
  }
}
