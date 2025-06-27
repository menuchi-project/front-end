describe('Create Menu Page E2E Tests', () => {
  const mockNewMenuId = 'new-menu-id-123';
  const mockBranchId = 'branch-1';

  const mockEmptyMenu = {
    id: mockNewMenuId,
    name: 'بدون نام',
    branchId: mockBranchId,
    cylinders: [],
    cylindersCount: 0,
    categoriesCount: 0,
    itemsCount: 0,
    favicon: '',
    isPublished: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    restaurantId: 'res-1',
  };

  const mockMenuAfterCylinder = {
    ...mockEmptyMenu,
    cylindersCount: 1,
    cylinders: [
      {
        id: 'cylinder-1',
        days: ['sat', 'sun'],
        menuCategories: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
        positionInMenu: '1',
        daysString: 'شنبه، یکشنبه',
      },
    ],
  };

  const mockBacklogCategories = {
    id: 'backlog-1',
    branchId: mockBranchId,
    categories: [
      {
        id: 'cat-1',
        categoryName: 'کباب‌ها',
        categoryNameId: 'cat-name-1',
        items: [
          {
            id: 'item-1',
            name: 'کباب کوبیده',
            price: 220000,
            ingredients: 'گوشت',
            categoryId: 'cat-1',
            subCategoryId: 'sub-cat-1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: null,
            categoryName: 'کباب‌ها',
            picUrl: '',
            positionInItemsList: 1,
            positionInCategory: 1,
            orderCount: 0,
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: '',
        positionInBacklog: 1,
        icon: '',
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: '',
  };

  beforeEach(() => {
    cy.clearLocalStorage('currentCreatingMenuId');

    cy.intercept('POST', '**/menus', {
      statusCode: 201,
      body: { id: mockNewMenuId, name: 'بدون نام', branchId: mockBranchId },
    }).as('createMenu');

    cy.intercept('GET', `**/menus/${mockNewMenuId}`, (req) => {
      if (Cypress.env('menu_has_cylinder')) {
        req.reply({ statusCode: 200, body: mockMenuAfterCylinder });
      } else {
        req.reply({ statusCode: 200, body: mockEmptyMenu });
      }
    }).as('getMenuById');

    cy.intercept('PATCH', `**/menus/${mockNewMenuId}`, { statusCode: 200 }).as(
      'updateMenuName',
    );
    cy.intercept('POST', `**/menus/${mockNewMenuId}/cylinders`, {
      statusCode: 201,
      body: { id: 'cylinder-1' },
    }).as('createCylinder');
    cy.intercept('POST', `**/menus/${mockNewMenuId}/categories`, {
      statusCode: 201,
    }).as('addCategoryToMenu');
    cy.intercept('GET', '**/backlog/*', {
      statusCode: 200,
      body: mockBacklogCategories,
    }).as('getBacklog');
    cy.intercept('GET', '**/users/profile', {
      body: { restaurants: [{ branches: [{ id: mockBranchId }] }] },
    }).as('getUserProfile');

    cy.login('your_real_username', 'your_real_password');

    Cypress.env('menu_has_cylinder', false);
  });

  it('باید در اولین بازدید، یک منوی جدید ایجاد کرده و شناسه آن را در localStorage ذخیره کند', () => {
    cy.visit('/dashboard/menu');
    cy.wait('@createMenu');
    cy.wait('@getMenuById');
    cy.get('.ant-message-success').should(
      'contain.text',
      'منوی جدید با موفقیت ایجاد شد!',
    );
    cy.window()
      .its('localStorage')
      .invoke('getItem', 'currentCreatingMenuId')
      .should('eq', mockNewMenuId);
  });

  it('باید نام منو را پس از تایپ کاربر و با تاخیر (debounce) ذخیره کند', () => {
    cy.visit('/dashboard/menu');
    cy.wait('@getMenuById');

    const newMenuName = 'منوی تست من';

    cy.get('input[placeholder="نام منو را وارد کنید"]')
      .clear()
      .type(newMenuName);

    cy.wait('@updateMenuName')
      .its('request.body')
      .should('deep.equal', { name: newMenuName });
    cy.get('.ant-message-success').should('contain.text', 'نام منو ذخیره شد');
  });
  context('Cylinder and Category Management', () => {
    beforeEach(() => {
      localStorage.setItem('currentCreatingMenuId', mockNewMenuId);
    });

    it('باید با انتخاب روزها، یک سیلندر (منوی روز) جدید ایجاد کند', () => {
      cy.visit('/dashboard/menu');
      cy.wait('@getMenuById');

      cy.get('.add-new-menu').click();
      cy.get('.ant-modal-title').should('contain.text', 'انتخاب روزهای هفته');

      cy.get('label.ant-checkbox-wrapper').contains('شنبه').click();
      cy.get('label.ant-checkbox-wrapper').contains('یکشنبه').click();

      Cypress.env('menu_has_cylinder', true);

      cy.get('.ant-modal-body button').contains('ثبت').click();
      cy.wait('@createCylinder')
        .its('request.body')
        .should('deep.include', { sat: true, sun: true, mon: false });
      cy.wait('@getMenuById');

      cy.get('app-cylinder').should('be.visible');
      cy.get('app-cylinder h4').should('contain.text', 'شنبه، یکشنبه');
    });

    it('باید کشوی افزودن دسته‌بندی را باز کرده و یک دسته‌بندی با آیتم‌هایش اضافه کند', () => {
      Cypress.env('menu_has_cylinder', true);
      cy.visit('/dashboard/menu');
      cy.wait('@getMenuById');

      cy.get('.add-cat-btn').click();

      cy.get('.ant-drawer-content-wrapper')
        .should('be.visible')
        .within(() => {
          cy.get('.ant-drawer-title').should(
            'contain.text',
            'انتخاب دسته بندی',
          );

          cy.get('nz-collapse-panel')
            .contains('کباب‌ها')
            .should('be.visible')
            .click();

          cy.get('nz-card')
            .contains('کباب کوبیده')
            .closest('nz-card')
            .find('label.ant-checkbox-wrapper')
            .click();

          cy.get('button').contains('ایجاد').click();
        });

      cy.wait('@addCategoryToMenu').then((interception) => {
        const { body } = interception.request;
        expect(body.categoryId).to.eq('cat-1');
        expect(body.cylinderId).to.eq('cylinder-1');
        expect(body.items).to.deep.eq(['item-1']);
      });
      cy.get('.ant-message-success').should(
        'contain.text',
        'دسته‌بندی با موفقیت اضافه شد',
      );
    });
  });
});
