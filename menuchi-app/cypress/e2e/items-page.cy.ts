describe('Items Page E2E Tests', () => {
  const mockCategories = [
    {id: 'cat-1', name: 'کباب‌ها', categoryId: 'cat-1'},
    {id: 'cat-2', name: 'خورشت‌ها', categoryId: 'cat-2'},
  ];

  const mockItems = [
    {
      id: 'item-1',
      name: 'کباب کوبیده',
      categoryId: 'cat-1',
      categoryName: 'کباب‌ها',
      subCategoryId: 'sub-cat-1',
      price: 220000,
      ingredients: 'گوشت، پیاز، زعفران',
      picUrl: 'http://example.com/pic1.jpg',
    },
    {
      id: 'item-2',
      name: 'قورمه سبزی',
      categoryId: 'cat-2',
      categoryName: 'خورشت‌ها',
      subCategoryId: 'sub-cat-2',
      price: 180000,
      ingredients: 'سبزی، لوبیا، گوشت',
      picUrl: 'http://example.com/pic2.jpg',
    },
  ];

  beforeEach(() => {
    cy.intercept('GET', '**/backlog/*/items', {body: mockItems}).as('getAllItems');
    cy.intercept('GET', '**/backlog/*/category-names', {body: mockCategories}).as('getBacklogCatNames');
    cy.intercept('GET', '**/category-names', {body: mockCategories}).as('getCategoryNames');
    cy.intercept('POST', '**/backlog/*/items', {statusCode: 201}).as('createItem');
    cy.intercept('PATCH', '**/backlog/*/items/*', {statusCode: 200}).as('updateItem');
    cy.intercept('DELETE', '**/backlog/*/items', {statusCode: 200}).as('deleteItems');
    cy.intercept('GET', '**/backlog/*', {body: {categories: []}}).as('getCategoriesWithItems');
    cy.intercept('GET', '**/users/profile', {
      body: {
        username: 'test-user',
        restaurants: [{branches: [{backlogId: 'any-id-works-now'}]}],
      },
    }).as('getUserProfile');

    cy.login('9331112233', 'jleU%*5kvn!t');

    cy.visit('/dashboard/items');
    cy.wait('@getAllItems');
  });

  context('Add Item Modal', () => {
    it('باید مودال را باز کرده، خطاهای اعتبارسنجی را نمایش دهد و با موفقیت یک آیتم جدید ایجاد کند', () => {
      cy.get('button').contains('افزودن آیتم جدید').click();
      cy.get('.ant-modal-title').should('contain.text', 'ایجاد آیتم جدید');

      cy.get('.ant-modal-body button').contains('ایجاد').click();
      cy.get('.ant-message-error').should('contain.text', 'لطفاً فرم را به درستی پر کنید!');

      cy.get('#itemName').type('جوجه کباب');
      cy.get('#category').click();
      cy.get('.ant-select-item-option-content').contains('کباب‌ها').click();
      cy.get('#price').type('250000');
      cy.get('#ingredients').type('سینه مرغ، زعفران، پیاز، فلفل');

      cy.get('.ant-modal-body button').contains('ایجاد').click();

      cy.wait('@createItem');
      cy.get('.ant-message-success').should('contain.text', 'آیتم با موفقیت ایجاد شد.');
      cy.get('app-add-item nz-modal').should('not.be.visible');
    });
  });

  context('Items Table Operations', () => {
    it('باید جدول را بر اساس ورودی جست‌وجو فیلتر کند', () => {
      const searchText = 'قورمه';
      cy.get('input[placeholder="جست‌و‌جو کنید"]').type(searchText);
      cy.wait(550);
      cy.get('app-items-table tbody tr').should('have.length', 1);
      cy.get('app-items-table tbody tr').first().should('contain.text', searchText);
    });

    it('باید یک آیتم را به صورت خطی (inline) با موفقیت ویرایش کند', () => {
      const itemToEdit = mockItems[0];
      const newPrice = '235000';
      const itemRowSelector = `[data-testid="item-row-${itemToEdit.id}"]`;

      cy.get(itemRowSelector).find('nz-icon[nztype="edit"]').click();

      cy.get(itemRowSelector).find('input[nz-input]').should('be.visible');
      cy.get(itemRowSelector).find('td:nth-child(4) input').clear().type(newPrice);
      cy.get(itemRowSelector).find('nz-icon[nztype="check"]').click();

      cy.wait('@updateItem').its('request.body').should('deep.include', {price: newPrice});
      cy.get('.ant-message-success').should('contain.text', 'آیتم با موفقیت ویرایش شد.');
    });

    it('باید یک آیتم را از جدول حذف کند', () => {
      const itemToDelete = mockItems[1];
      const itemRowSelector = `[data-testid="item-row-${itemToDelete.id}"]`;
      const itemsAfterDelete = mockItems.filter(item => item.id !== itemToDelete.id);

      cy.get(itemRowSelector).find('nz-icon[nztype="delete"]').click();

      cy.intercept('GET', '**/backlog/*/items', {body: itemsAfterDelete}).as('getItemsAfterDelete');

      cy.get('.ant-popover-buttons button').contains('تایید').click();

      cy.wait('@deleteItems');
      cy.wait('@getItemsAfterDelete');

      cy.get('.ant-message-info').should('contain.text', 'آیتم با موفقیت حذف شد.');
      cy.get(itemRowSelector).should('not.exist');
    });

    it('باید آیتم‌های انتخاب شده را به صورت گروهی حذف کند', () => {
      cy.get('thead th input[type="checkbox"]').check();
      cy.get('button').contains('حذف موارد انتخاب شده').first().click();
      cy.get('.ant-popover-buttons button').contains('تایید').click();

      cy.wait('@deleteItems');
      cy.get('.ant-message-info').should('contain.text', 'آیتم‌های انتخاب شده با موفقیت حذف شدند.');
    });
  });
});
