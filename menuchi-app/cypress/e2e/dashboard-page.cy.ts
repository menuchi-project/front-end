// cypress/e2e/dashboard-page.cy.ts

describe('Main Dashboard Page E2E Tests', () => {
  // --- داده‌های شبیه‌سازی شده (Mock Data) ---
  const mockUser = {
    username: 'منوچی',
    restaurants: [
      {
        id: 'res-1',
        branches: [
          { id: 'branch-1', name: 'شعبه مرکزی', backlogId: 'backlog-1' },
        ],
      },
    ],
  };

  const mockMenus = [
    { id: 'menu-1', name: 'منوی تابستانه' },
    { id: 'menu-2', name: 'منوی زمستانه' },
    { id: 'menu-3', name: 'منوی ویژه' },
  ];

  const mockRestaurant = {
    id: 'res-1',
    name: 'رستوران نمونه',
    displayName: 'رستوران نمونه',
    avatarUrl: '/assets/placeholder.jpg',
    branches: [
      {
        id: 'branch-1',
        address: { city: 'تهران' },
        openingTimes: { sat: '10:00-22:00' },
      },
      {
        id: 'branch-2',
        address: { city: 'اصفهان' },
        openingTimes: { sat: '11:00-23:00' },
      },
    ],
  };

  const mockTodaysItems = [
    {
      id: 'item-1',
      name: 'کباب کوبیده',
      categoryName: 'کباب‌ها',
      price: 220000,
      ingredients: 'گوشت تازه',
      picUrl: '',
    },
    {
      id: 'item-2',
      name: 'جوجه کباب',
      categoryName: 'کباب‌ها',
      price: 250000,
      ingredients: 'سینه مرغ',
      picUrl: '',
    },
  ];

  beforeEach(() => {
    // رهگیری و شبیه‌سازی درخواست‌های API
    cy.intercept('GET', '**/menus/branch/*', { body: mockMenus }).as(
      'getMenus',
    );
    cy.intercept('GET', '**/restaurants/*', { body: mockRestaurant }).as(
      'getRestaurant',
    );
    cy.intercept('GET', '**/menus/**/day-items', { body: mockTodaysItems }).as(
      'getTodaysItems',
    );
    cy.intercept('GET', '**/users/profile', { body: mockUser }).as(
      'getUserProfile',
    );
    cy.intercept('POST', '**/auth/logout', { statusCode: 200 }).as('logout');

    cy.login('9331112233', 'jleU%*5kvn!t');
    // بازدید از صفحه اصلی داشبورد
    cy.visit('/dashboard');
    // منتظر می‌مانیم تا تمام درخواست‌های اولیه صفحه تمام شوند
    cy.wait(['@getMenus', '@getRestaurant', '@getTodaysItems']);
  });

  context('Initial Page Load and Content Display', () => {
    it('باید پیام خوش‌آمدگویی و اطلاعات اولیه را به درستی نمایش دهد', () => {
      cy.get('.username').should(
        'contain.text',
        `خوش آمدید، ${mockUser.username} عزیز.`,
      );
      cy.get('.menu-container').should('contain.text', 'منوهای ساخته شده');
      cy.get('.branch-container').should('contain.text', 'شعب');
      cy.get('.backlog-item').should('contain.text', 'غذای امروز');
    });

    it('باید کارت‌های منو، شعب و غذای روز را به درستی رندر کند', () => {
      // بررسی نمایش دو منوی اول در کاروسل
      cy.get('.menus-container .menu-card').should('have.length', 2);
      cy.contains('.menu-card', mockMenus[0].name).should('be.visible');
      cy.contains('.menu-card', mockMenus[1].name).should('be.visible');
      cy.contains('.menu-card', mockMenus[2].name).should('not.be.visible');

      // بررسی نمایش شعبه اول
      cy.get('.branches-container .branch-card').should('have.length', 1);
      cy.contains(
        '.branch-card',
        mockRestaurant.branches[0].address.city,
      ).should('be.visible');

      // بررسی نمایش آیتم اول در بخش غذای امروز
      cy.get('.item-info').should('contain.text', mockTodaysItems[0].name);
      cy.get('.item-info').should('not.contain.text', mockTodaysItems[1].name);
    });
  });

  context('User Interactions', () => {
    it('باید با کلیک روی فلش، کاروسل منوها را اسکرول کند', () => {
      // کلیک روی فلش راست برای دیدن منوی بعدی
      cy.get('.menu-container .arrow-icon').last().click();
      cy.contains('.menu-card', mockMenus[0].name).should('not.be.visible');
      cy.contains('.menu-card', mockMenus[2].name).should('be.visible');

      // کلیک روی فلش چپ برای برگشت
      cy.get('.menu-container .arrow-icon').first().click();
      cy.contains('.menu-card', mockMenus[0].name).should('be.visible');
      cy.contains('.menu-card', mockMenus[2].name).should('not.be.visible');
    });

    it('باید با کلیک روی فلش، آیتم "غذای امروز" را تغییر دهد', () => {
      // کلیک روی فلش بعدی
      cy.get('.item-name nz-icon').last().click();
      cy.get('.item-info').should('contain.text', mockTodaysItems[1].name);
      cy.get('.item-info').should('not.contain.text', mockTodaysItems[0].name);

      // کلیک روی فلش قبلی
      cy.get('.item-name nz-icon').first().click();
      cy.get('.item-info').should('contain.text', mockTodaysItems[0].name);
    });

    it('باید با کلیک روی "جزئیات بیشتر منو"، به صفحه پیش‌نمایش هدایت شود', () => {
      cy.contains('.menu-card', mockMenus[0].name)
        .find('button')
        .contains('جزئیات بیشتر منو')
        .click();
      cy.url().should('include', `/dashboard/preview/${mockMenus[0].id}`);
    });
  });

  context('Side Menu Navigation and Logout', () => {
    it('باید با کلیک روی آیتم‌های سایدبار، به مسیر صحیح هدایت شود', () => {
      // باز کردن سایدبار در صورت بسته بودن
      cy.get('body').then(($body) => {
        if ($body.find('.trigger span.anticon-double-left').length > 0) {
          cy.get('.trigger').click();
        }
      });

      cy.get('li.button[routerlink="/dashboard/cats"]').click();
      cy.url().should('include', '/dashboard/cats');
    });

    it('باید با کلیک روی خروج، کاربر را از سیستم خارج کند', () => {
      cy.get('body').then(($body) => {
        if ($body.find('.trigger span.anticon-double-left').length > 0) {
          cy.get('.trigger').click();
        }
      });

      cy.get('li.button').contains('خروج').click();
      cy.wait('@logout');
      cy.get('.ant-message-success').should(
        'contain.text',
        'با موفقیت خارج شدید.',
      );
      cy.url().should('include', '/login');
    });
  });
});
