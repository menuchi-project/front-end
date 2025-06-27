describe('Categories Page (Backlog) E2E Tests', () => {
  const mockCategoriesResponse = {
    id: 'backlog-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: '',
    branchId: 'branch-1',
    categories: [
      {
        id: 'cat-1',
        categoryName: 'کباب‌ها',
        categoryNameId: 'cat-name-1',
        items: [
          {
            id: 'item-1',
            name: 'کباب کوبیده',
            categoryId: 'cat-1',
            price: 220000,
            ingredients: 'گوشت، پیاز',
            picUrl: '/assets/placeholder.jpg',
            subCategoryId: 'sub-cat-1',
          },
          {
            id: 'item-2',
            name: 'جوجه کباب',
            categoryId: 'cat-1',
            price: 250000,
            ingredients: 'مرغ، زعفران',
            picUrl: '/assets/placeholder.jpg',
            subCategoryId: 'sub-cat-2',
          },
        ],
      },
      {
        id: 'cat-2',
        categoryName: 'خورشت‌ها',
        categoryNameId: 'cat-name-2',
        items: [
          {
            id: 'item-3',
            name: 'قورمه سبزی',
            categoryId: 'cat-2',
            price: 180000,
            ingredients: 'سبزی، لوبیا',
            picUrl: '/assets/placeholder.jpg',
            subCategoryId: 'sub-cat-3',
          },
        ],
      },
    ],
  };

  const mockCategoryNames = [
    { id: 'cat-name-1', name: 'کباب‌ها', categoryId: 'cat-1' },
    { id: 'cat-name-2', name: 'خورشت‌ها', categoryId: 'cat-2' },
    { id: 'cat-name-3', name: 'نوشیدنی', categoryId: 'cat-3' },
  ];

  beforeEach(() => {
    cy.intercept('GET', '**/backlog/*', mockCategoriesResponse).as(
      'getCategoriesWithItems',
    );
    cy.intercept('GET', '**/category-names', mockCategoryNames).as(
      'getCategoryNames',
    );
    cy.intercept('POST', '**/backlog/*/items', { statusCode: 201 }).as(
      'createItem',
    );
    cy.intercept('PATCH', '**/backlog/*/items/*', { statusCode: 200 }).as(
      'updateItem',
    );
    cy.intercept('DELETE', '**/backlog/*/items', { statusCode: 200 }).as(
      'deleteItems',
    );
    cy.intercept('GET', '**/dashboard/profile', {
      body: { restaurants: [{ branches: [{ backlogId: 'any-id' }] }] },
    }).as('getUserProfile');

    cy.login('9331112233', 'jleU%*5kvn!t');

    cy.visit('/dashboard/cats');
    cy.wait('@getCategoriesWithItems');
  });

  context('Page Rendering and Search', () => {
    it('باید دسته‌بندی‌ها و آیتم‌ها را به درستی نمایش دهد', () => {
      cy.contains('h3', 'کباب‌ها').should('be.visible');
      cy.contains('h4', 'کباب کوبیده').should('be.visible');
      cy.contains('h3', 'خورشت‌ها').should('be.visible');
      cy.contains('h4', 'قورمه سبزی').should('be.visible');
    });

    it('باید با جستجو، آیتم‌ها را فیلتر کند', () => {
      cy.get('#search').type('کوبیده');
      cy.wait(350);
      cy.contains('h4', 'کباب کوبیده').should('be.visible');
      cy.contains('h4', 'جوجه کباب').should('not.exist');
      cy.contains('h4', 'قورمه سبزی').should('not.exist');
    });
  });

  context('Add/Edit/Delete Item', () => {
    it('باید با کلیک روی دکمه اصلی، مودال افزودن آیتم را باز کند', () => {
      cy.get('button.add-item-btn').contains('افزودن آیتم جدید').click();
      cy.get('.ant-modal-title').should('contain.text', 'ایجاد آیتم جدید');
      cy.get('#category').should('not.have.class', 'ant-select-disabled');
      cy.get('.ant-modal-close').click();
    });

    it('باید با کلیک روی دکمه داخل یک دسته‌بندی، مودال افزودن آیتم را با دسته‌بندی انتخاب شده باز کند', () => {
      cy.contains('.cat-header', 'کباب‌ها').find('.add-item-icon').click();
      cy.get('.ant-modal-title').should('contain.text', 'ایجاد آیتم جدید');
      cy.get('#category')
        .find('.ant-select-selection-item')
        .should('contain.text', 'کباب‌ها');
      cy.get('#category').should('have.class', 'ant-select-disabled');
      cy.get('.ant-modal-close').click();
    });

    it('باید یک آیتم را ویرایش کند', () => {
      const itemToEdit = mockCategoriesResponse.categories[0].items[0];
      cy.contains('h4', itemToEdit.name)
        .closest('nz-card')
        .find('nz-icon[nztype="more"]')
        .click();
      cy.get('.ant-dropdown-menu-item').contains('ویرایش آیتم').click();

      cy.get('.ant-modal-title').should('contain.text', 'ویرایش آیتم');
      cy.get('#itemName').should('have.value', itemToEdit.name);
      cy.get('#price').should('have.value', itemToEdit.price);

      cy.get('#price').clear().type('230000');
      cy.get('.ant-modal-body button').contains('ذخیره تغییرات').click();

      cy.wait('@updateItem');
      cy.get('.ant-message-success').should('be.visible');
    });

    it('باید یک آیتم را از دسته‌بندی حذف کند', () => {
      const itemToDelete = mockCategoriesResponse.categories[1].items[0];
      const updatedResponse = JSON.parse(
        JSON.stringify(mockCategoriesResponse),
      );
      updatedResponse.categories[1].items = [];
      cy.intercept('GET', '**/backlog/*', updatedResponse).as(
        'getCategoriesAfterDelete',
      );
      cy.contains('h4', itemToDelete.name)
        .closest('nz-card')
        .find('nz-icon[nztype="more"]')
        .click();
      cy.get('.delete-item').contains('حذف از دسته‌بندی').click();
      cy.get('.ant-popover-buttons button').contains('تایید').click();

      cy.wait('@deleteItems');
      cy.wait('@getCategoriesAfterDelete');

      cy.get('.ant-message-info').should(
        'contain.text',
        'آیتم با موفقیت حذف شد.',
      );
      cy.contains('h4', itemToDelete.name).should('not.exist');
    });
  });
});
