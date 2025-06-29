import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicMenuViewerComponent } from './public-menu-viewer.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MenuService } from '../../../user/services/menu/menu.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PublicMenuViewerComponent', () => {
  let component: PublicMenuViewerComponent;
  let fixture: ComponentFixture<PublicMenuViewerComponent>;

  const mockActivatedRoute = {
    paramMap: of({
      get: (key: string) => {
        if (key === 'menuId') {
          return 'testMenuId';
        }
        return null;
      },
    }),
  };

  // Mock MenuService
  const mockMenuService = {
    getPublicMenu: jasmine.createSpy('getPublicMenu').and.returnValue(
      of({
        currentDay: 'mon',
        menuCategories: [
          {
            id: 'cat1',
            categoryId: 'cat1',
            categoryName: 'Category One',
            icon: 'icon1',
            items: [
              {
                id: 'item1',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
                categoryId: 'cat1',
                subCategoryId: 'subcatA',
                categoryName: 'Category One',
                name: 'Item A',
                ingredients: 'Ing A, Ing B',
                price: 10,
                picUrl: 'picA.jpg',
                positionInItemsList: 1,
                positionInCategory: 1,
                orderCount: 0,
              },
            ],
          },
        ],
        mon: [
          {
            id: 'cat1',
            categoryId: 'cat1',
            categoryName: 'Category One',
            icon: 'icon1',
            items: [
              {
                id: 'item1',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
                categoryId: 'cat1',
                subCategoryId: 'subcatA',
                categoryName: 'Category One',
                name: 'Item A',
                ingredients: 'Ing A, Ing B',
                price: 10,
                picUrl: 'picA.jpg',
                positionInItemsList: 1,
                positionInCategory: 1,
                orderCount: 0,
              },
            ],
          },
        ],
      }),
    ),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicMenuViewerComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MenuService, useValue: mockMenuService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicMenuViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
