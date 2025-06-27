import {TestBed} from '@angular/core/testing';
import {HttpErrorResponse, provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting,} from '@angular/common/http/testing';

import {MenuService} from './menu.service';
import {AuthService} from '../../../main/services/auth/auth.service';
import {CreateMenuRequest, CreateMenuResponse, Menu, MenuPreview, UpdateMenuRequest,} from '../../models/Menu';
import {environment} from '../../../../../api-config/environment';

describe('MenuService', () => {
  let service: MenuService;
  let httpMock: HttpTestingController;
  let authServiceMock: any;
  const apiUrl = environment.API_URL + '/menus';

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', [
      'getBacklogId',
      'getAllBranchIds',
    ]);
    authServiceMock.getBacklogId.and.returnValue('test-backlog-id');
    authServiceMock.getAllBranchIds.and.returnValue(['branch-1', 'branch-2']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MenuService,
        {provide: AuthService, useValue: authServiceMock},
      ],
    });

    service = TestBed.inject(MenuService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllMenusForBranches', () => {
    it('should fetch menus for all branches and update menusData$', (done) => {
      const mockMenusBranch1: Menu[] = [
        {id: 'menu1', name: 'Menu 1'} as Menu,
      ];
      const mockMenusBranch2: Menu[] = [
        {id: 'menu2', name: 'Menu 2'} as Menu,
      ];

      // Subscribe first
      service.menusData$.subscribe((menus) => {
        expect(menus.length).toBe(2);
        expect(menus).toEqual([...mockMenusBranch1, ...mockMenusBranch2]);
        done();
      });

      // Then call the method
      service.getAllMenusForBranches();

      const reqBranch1 = httpMock.expectOne(`${apiUrl}/branch/branch-1`);
      expect(reqBranch1.request.method).toBe('GET');
      reqBranch1.flush(mockMenusBranch1);

      const reqBranch2 = httpMock.expectOne(`${apiUrl}/branch/branch-2`);
      expect(reqBranch2.request.method).toBe('GET');
      reqBranch2.flush(mockMenusBranch2);
    });
  });

  describe('createMenu', () => {
    it('should create a menu successfully', () => {
      const newMenu: CreateMenuRequest = {
        name: 'New Menu',
        branchId: 'branch-1',
        favicon: 'ico',
        isPublished: true,
      };
      const mockResponse: CreateMenuResponse = {
        id: 'new-id',
        name: 'New Menu',
        isPublished: true,
        favicon: 'ico',
        branchId: 'branch-1'
      };

      service.createMenu(newMenu).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle error on create menu', () => {
      const newMenu: CreateMenuRequest = {
        name: 'New Menu',
        branchId: 'branch-1',
        favicon: 'ico',
        isPublished: true,
      };

      service.createMenu(newMenu).subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Error', {status: 500, statusText: 'Internal Server Error'});
    });
  });

  describe('getMenuById', () => {
    it('should fetch a single menu and update currentMenuData$', (done) => {
      const testMenuId = 'menu-1';
      const mockMenu: Menu = {id: testMenuId, name: 'Test Menu'} as Menu;

      // Subscribe first
      service.currentMenuData$.subscribe((menu) => {
        expect(menu).toEqual(mockMenu);
        done();
      });

      // Then call the method
      service.getMenuById(testMenuId);

      const req = httpMock.expectOne(`${apiUrl}/${testMenuId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockMenu);
    });
  });

  describe('updateMenu', () => {
    it('should update a menu successfully', () => {
      const testMenuId = 'menu-to-update';
      const updateRequest: UpdateMenuRequest = {
        name: 'Updated Name',
        isPublished: true,
        favicon: 'new.ico',
      };
      const mockResponse = {}; // Assuming the backend returns an empty object on success

      service.updateMenu(testMenuId, updateRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse); // Check against the mocked response
      });

      const req = httpMock.expectOne(`${apiUrl}/${testMenuId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(updateRequest);
      req.flush(mockResponse); // Flush the mock response
    });
  });

  describe('getMenuPreview', () => {
    it('should fetch menu preview successfully', () => {
      const testMenuId = 'testMenuId';
      const mockPreview: MenuPreview = {
        id: 'preview-id',
        name: 'Test Preview',
      } as MenuPreview;

      service.getMenuPreview(testMenuId).subscribe((preview) => {
        expect(preview).toEqual(mockPreview);
      });

      const req = httpMock.expectOne(`${apiUrl}/${testMenuId}/preview`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPreview);
    });

    it('should handle error on fetching menu preview', () => {
      const testMenuId = 'testMenuId';

      service.getMenuPreview(testMenuId).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/${testMenuId}/preview`);
      req.flush('Not Found', {status: 404, statusText: 'Not Found'});
    });
  });
});
