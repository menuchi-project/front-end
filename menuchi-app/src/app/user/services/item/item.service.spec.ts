import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { ItemService } from './item.service';
import { AuthService } from '../../../main/services/auth/auth.service';
import {
  CategoryWithItemsResponse,
  CreateItemRequest,
  Item,
  UpdateItemRequest,
} from '../../models/Item';
import { environment } from '../../../../../api-config/environment';

describe('ItemService', () => {
  let service: ItemService;
  let httpMock: HttpTestingController;
  let authServiceMock: any;
  let backlogApiUrl: string;
  const testBacklogId = 'test-backlog-123';

  beforeEach(() => {
    backlogApiUrl = `${environment.API_URL}/backlog/${testBacklogId}`;
    authServiceMock = jasmine.createSpyObj('AuthService', ['getBacklogId']);
    authServiceMock.getBacklogId.and.returnValue(testBacklogId);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ItemService,
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    service = TestBed.inject(ItemService);
    httpMock = TestBed.inject(HttpTestingController);

    const mockInitialResponse: CategoryWithItemsResponse = {
      id: testBacklogId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: '',
      branchId: 'test-branch',
      categories: [],
    };

    const initialReq = httpMock.expectOne(backlogApiUrl);
    expect(initialReq.request.method).toBe('GET');
    initialReq.flush(mockInitialResponse);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCategoriesWithItems', () => {
    it('should fetch categories and items and update categoriesData$', () => {
      const mockResponse: CategoryWithItemsResponse = {
        id: 'backlog-id',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: '',
        branchId: 'test-branch',
        categories: [
          {
            id: 'cat-1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: '',
            categoryNameId: 'cat-name-id-1',
            categoryName: 'Category 1',
            positionInBacklog: 1,
            items: [],
            icon: undefined,
          },
        ],
      };

      let actualResponse: CategoryWithItemsResponse | undefined;
      service.categoriesData$.subscribe((data) => {
        if (data.id && data.id !== testBacklogId) {
          actualResponse = data;
        }
      });

      service.getCategoriesWithItems().subscribe();

      const req = httpMock.expectOne(backlogApiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);

      expect(actualResponse).toEqual(mockResponse);
    });
  });

  describe('geAllItems', () => {
    it('should get all items and update itemsData$', (done) => {
      const mockItems: Item[] = [{ id: 'item1', name: 'Item 1' } as Item];

      service.itemsData$.subscribe((items) => {
        expect(items).toEqual(mockItems);
        done();
      });

      service.geAllItems();

      const req = httpMock.expectOne(`${backlogApiUrl}/items`);
      expect(req.request.method).toBe('GET');
      req.flush(mockItems);
    });
  });

  describe('createItem', () => {
    it('should create an item successfully', () => {
      const newItem: CreateItemRequest = {
        name: 'New Item',
        categoryNameId: 'cat-1',
        ingredients: 'stuff',
        price: 100,
        picKey: null,
      };
      const mockResponse = { id: 'new-item-id' };

      service.createItem(newItem).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${backlogApiUrl}/items`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newItem);
      req.flush(mockResponse);
    });
  });

  describe('deleteItems', () => {
    it('should delete items successfully', () => {
      const itemIds = ['item1', 'item2'];

      service.deleteItems(itemIds).subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${backlogApiUrl}/items`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.body).toEqual(itemIds);
      req.flush({});
    });
  });

  describe('updateItem', () => {
    it('should update an item successfully', () => {
      const itemId = 'item-to-update';
      const updateRequest: UpdateItemRequest = {
        name: 'Updated Name',
        categoryId: 'cat-1',
        subCategoryId: 'sub-cat-1',
        ingredients: 'updated ingredients',
        price: 150,
        picKey: null,
      };

      service.updateItem(itemId, updateRequest).subscribe();

      const req = httpMock.expectOne(`${backlogApiUrl}/items/${itemId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(updateRequest);
      req.flush({});
    });

    it('should handle error on update item', () => {
      const itemId = 'item-to-update';
      const updateRequest: UpdateItemRequest = {
        name: 'Updated Name',
        categoryId: 'cat-1',
        subCategoryId: 'sub-cat-1',
        ingredients: 'updated ingredients',
        price: 150,
        picKey: null,
      };

      service.updateItem(itemId, updateRequest).subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne(`${backlogApiUrl}/items/${itemId}`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('reorder methods', () => {
    it('should reorder categories', () => {
      const catIds = ['cat1', 'cat2'];
      service.reorderCategories(catIds).subscribe();

      const req = httpMock.expectOne(`${backlogApiUrl}/reorder-categories`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(catIds);
      req.flush({});
    });

    it('should reorder items in a category', () => {
      const itemIds = ['item1', 'item2'];
      service.reorderInCategory(itemIds).subscribe();

      const req = httpMock.expectOne(
        `${backlogApiUrl}/reorder-items/in-category`,
      );
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(itemIds);
      req.flush({});
    });
  });
});
