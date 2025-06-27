describe('Created Menus Page E2E Tests', () => {
  const mockMenus = [
    {
      id: 'menu-1',
      name: 'منوی تابستانه',
      branchId: 'branch-1',
      cylindersCount: 5,
      categoriesCount: 10,
      itemsCount: 50,
    },
    {
      id: 'menu-2',
      name: 'منوی زمستانه',
      branchId: 'branch-1',
      cylindersCount: 3,
      categoriesCount: 8,
      itemsCount: 40,
    },
    {
      id: 'menu-3',
      name: 'منوی افطار',
      branchId: 'branch-2',
      cylindersCount: 4,
      categoriesCount: 9,
      itemsCount: 45,
    },
  ];

  beforeEach(() => {
    cy.intercept('GET', '**/menus/branch/*', {
      body: mockMenus.filter((m) => m.branchId === 'branch-1'),
    }).as('getAllMenus');

    cy.intercept('DELETE', '**/menus/*', { statusCode: 200 }).as('deleteMenu');
    cy.intercept('GET', '**/dashboard/profile', {
      body: {
        restaurants: [{ branches: [{ id: 'branch-1' }] }],
      },
    }).as('getUserProfile');

    cy.login('9331112233', 'jleU%*5kvn!t');

    cy.visit('/dashboard/created-menus');

    cy.wait('@getAllMenus');
  });

  context('Page Rendering and Search', () => {
    it('باید فقط منوهای مربوط به شعبه کاربر را نمایش دهد', () => {
      cy.get('.menu-card').should('have.length', 2);
      cy.contains('.menu-name', 'منوی تابستانه').should('be.visible');
      cy.contains('.menu-name', 'منوی زمستانه').should('be.visible');
      cy.contains('.menu-name', 'منوی افطار').should('not.exist');
    });

    it('باید با جستجو، لیست منوها را فیلتر کند', () => {
      cy.get('.search-input').type('تابستانه');
      cy.get('.menu-card').should('have.length', 1);
      cy.contains('.menu-name', 'منوی تابستانه').should('be.visible');
      cy.contains('.menu-name', 'منوی زمستانه').should('not.exist');
    });

    it('باید با پاک کردن جستجو، لیست کامل را نمایش دهد', () => {
      cy.get('.search-input').type('تابستانه');
      cy.get('.menu-card').should('have.length', 1);
      cy.get('.search-input').clear();
      cy.get('.menu-card').should('have.length', 2);
    });
  });

  context('Menu Actions (Create, Edit, Preview, Delete)', () => {
    it('باید با کلیک روی دکمه "ایجاد منوی جدید"، به صفحه ساخت منو هدایت شود', () => {
      cy.get('.create-menu-label').click();
      cy.url().should('include', '/dashboard/menu');
    });

    it('باید با کلیک روی دکمه ویرایش، به صفحه ساخت منو برای ویرایش هدایت شود', () => {
      const menuToEdit = mockMenus[0];
      cy.contains('.menu-name', menuToEdit.name)
        .closest('.menu-container')
        .find('.edit-menu-btn')
        .click()
        .then(() => {
          expect(localStorage.getItem('currentCreatingMenuId')).to.eq(
            menuToEdit.id,
          );
        });
      cy.url().should('include', '/dashboard/menu');
    });

    it('باید با کلیک روی دکمه "پیش‌نمایش منو"، به صفحه پیش‌نمایش هدایت شود', () => {
      const menuToPreview = mockMenus[1];
      cy.contains('.menu-name', menuToPreview.name)
        .closest('.menu-container')
        .find('.viewMenuDetails')
        .click();
      cy.url().should('include', `/dashboard/preview/${menuToPreview.id}`);
    });

    it('باید یک منو را پس از تایید در مودال، با موفقیت حذف کند', () => {
      const menuToDelete = mockMenus[0];
      cy.contains('.menu-name', menuToDelete.name)
        .closest('.menu-container')
        .find('.deleteMenu')
        .click();

      cy.get('.ant-modal-confirm-title').should('contain.text', 'حذف منو');
      cy.get('.ant-modal-confirm-btns button').contains('تأیید').click();

      cy.wait('@deleteMenu');
      cy.get('.ant-message-success').should(
        'contain.text',
        'منو با موفقیت حذف شد',
      );
      cy.contains('.menu-name', menuToDelete.name).should('not.exist');
      cy.get('.menu-card').should('have.length', 1);
    });

    it('باید با کلیک روی لغو، عملیات حذف را متوقف کند', () => {
      const menuToCancelDelete = mockMenus[0];
      cy.contains('.menu-name', menuToCancelDelete.name)
        .closest('.menu-container')
        .find('.deleteMenu')
        .click();

      cy.get('.ant-modal-confirm-btns button').contains('لغو').click();
      cy.get('.ant-message-info').should('contain.text', 'عملیات حذف لغو شد');
      cy.contains('.menu-name', menuToCancelDelete.name).should('be.visible');
      cy.get('.menu-card').should('have.length', 2);
    });
  });
});
