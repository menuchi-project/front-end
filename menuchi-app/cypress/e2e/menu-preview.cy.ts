describe('Menu Preview Page E2E Tests', () => {
  const mockMenuId = 'menu-preview-1';

  const mockMenuPreviewData = {
    id: mockMenuId,
    name: 'منوی پیش‌نمایش',
    sat: [
      {
        categoryId: 'cat-1',
        categoryName: 'کباب‌ها',
        items: [
          {
            id: 'item-1',
            name: 'کباب کوبیده',
            categoryId: 'cat-1',
            categoryName: 'کباب‌ها',
          },
        ],
      },
      {
        categoryId: 'cat-2',
        categoryName: 'خورشت‌ها',
        items: [
          {
            id: 'item-3',
            name: 'قورمه سبزی',
            categoryId: 'cat-2',
            categoryName: 'خورشت‌ها',
          },
        ],
      },
    ],
    sun: [
      {
        categoryId: 'cat-1',
        categoryName: 'کباب‌ها',
        items: [
          {
            id: 'item-1',
            name: 'کباب کوبیده',
            categoryId: 'cat-1',
            categoryName: 'کباب‌ها',
          },
        ],
      },
    ],
    mon: [],
  };

  const mockCategoryNames = [
    { id: 'cat-name-1', categoryId: 'cat-1', name: 'کباب‌ها' },
    { id: 'cat-name-2', categoryId: 'cat-2', name: 'خورشت‌ها' },
  ];

  beforeEach(() => {
    cy.intercept('GET', `**/menus/${mockMenuId}/preview`, {
      body: mockMenuPreviewData,
    }).as('getMenuPreview');
    cy.intercept('GET', '**/backlog/*/category-names', {
      body: mockCategoryNames,
    }).as('getCatNames');
    cy.intercept('GET', '**/backlog/mock-backlog-123', {
      body: { categories: [] },
    }).as('getCategoriesWithItems');
    cy.intercept('GET', '**/users/profile', {
      body: {
        restaurants: [
          { branches: [{ id: 'branch-1', backlogId: 'mock-backlog-123' }] },
        ],
      },
    }).as('getUserProfile');

    cy.login('9331112233', 'jleU%*5kvn!t');
    cy.visit(`/dashboard/preview/${mockMenuId}`);

    cy.wait(['@getMenuPreview', '@getCatNames', '@getCategoriesWithItems']);
  });

  context('Page Rendering and Filtering', () => {
    it('باید در بارگذاری اولیه، آیتم‌های مربوط به روز پیش‌فرض را نمایش دهد', () => {
      cy.get('app-item-card').should('have.length', 2);
      cy.get('app-item-card').contains('کباب کوبیده').should('be.visible');
      cy.get('app-item-card').contains('قورمه سبزی').should('be.visible');
    });

    it('باید با کلیک روی یک روز دیگر، آیتم‌های آن روز را نمایش دهد', () => {
      cy.get('app-weekly-calendar').contains('یکشنبه').click();
      cy.get('app-item-card').should('have.length', 1);
      cy.get('app-item-card').contains('کباب کوبیده').should('be.visible');
      cy.get('app-item-card').contains('قورمه سبزی').should('not.exist');
    });

    it('باید با کلیک روی یک دسته‌بندی، آیتم‌ها را فیلتر کند', () => {
      cy.get('app-weekly-calendar').contains('شنبه').click();
      cy.get('app-item-card').should('have.length', 2);

      cy.get('app-horizontal-scroller .menu-item').contains('خورشت‌ها').click();

      cy.get('app-item-card').should('have.length', 1);
      cy.get('app-item-card').contains('قورمه سبزی').should('be.visible');
      cy.get('app-item-card').contains('کباب کوبیده').should('not.exist');
    });

    it('باید در صورتی که آیتمی برای نمایش وجود ندارد، پیام مناسب را نمایش دهد', () => {
      cy.get('app-weekly-calendar').contains('دوشنبه').click();
      cy.get('app-item-card').should('not.exist');
      cy.get('.no-items-message').should('be.visible');
    });
  });
});
