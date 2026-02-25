describe('Тестирование конструктора бургера и модальных окон', () => {
  // Константы для селекторов
  const SELECTORS = {
    ingredientBun: '[data-cy="643d69a5c3f7b9001cfa093c"]',
    ingredientMeat: '[data-cy="643d69a5c3f7b9001cfa0941"]',
    burgerConstructor: '[data-cy="burgerConstructor"]',
    orderButton: '[data-cy="order-button"]',
    modal: '[data-cy="modal"]',
    modalClose: '[data-cy="modalClose"]',
    modalOverlay: '[data-cy="modalCloseOverlay"]',
    orderNumber: '[data-cy="order-number"]'
  };

  beforeEach(() => {
    // Подгружаем моковые данные ингредиентов
    cy.fixture('ingredients').then((fixture) => {
      cy.intercept('GET', 'api/ingredients', {
        statusCode: 200,
        body: fixture
      });
    });

    // Мокируем запрос на получение пользователя
    cy.fixture('user').then((userFixture) => {
      cy.intercept('GET', 'api/auth/user', {
        statusCode: 200,
        body: userFixture
      });
    });

    // Добавляем токен в localStorage
    window.localStorage.setItem('accessToken', 'mockedAccessToken');
    window.localStorage.setItem('refreshToken', 'mockedRefreshToken');

    // Открываем главную страницу
    cy.visit('/');
  });

  // Проверяем, что ингредиенты загружены
  it('Должны отобразиться ингредиенты', () => {
    cy.get('[data-cy]').should('have.length.gte', 5);
  });

  // Проверяем добавление булки
  it('Можно добавить булку по кнопке "Добавить"', () => {
    cy.get(`${SELECTORS.ingredientBun} button`).click();
    cy.get(SELECTORS.burgerConstructor).contains('Краторная булка N-200i');
  });

  // Проверяем добавление начинки
  it('Можно добавить начинку по кнопке "Добавить"', () => {
    cy.get(`${SELECTORS.ingredientMeat} button`).click();
    cy.get(SELECTORS.burgerConstructor).contains(
      'Биокотлета из марсианской Магнолии'
    );
  });

  // Проверяем оформление заказа
  it('Можно оформить заказ, проверить модальное окно и очистку конструктора', () => {
    // Перехватываем POST /orders
    cy.fixture('order').then((orderFixture) => {
      cy.intercept('POST', 'api/orders', {
        statusCode: 200,
        body: orderFixture
      }).as('createOrder');
    });

    // Добавляем булку и мясо
    cy.get(`${SELECTORS.ingredientBun} button`).click();
    cy.get(`${SELECTORS.ingredientMeat} button`).click();

    // Нажимаем на кнопку "Оформить заказ"
    cy.get(SELECTORS.orderButton).click();

    // Ждём ответа от API
    cy.wait('@createOrder');

    // Проверяем, что модальное окно открылось
    cy.get(SELECTORS.modal).should('be.visible');

    // Проверяем, что номер заказа отображается
    cy.get(SELECTORS.orderNumber).contains('114452');

    // Закрываем модальное окно по крестику
    cy.get(SELECTORS.modalClose).click();

    // Проверяем, что модальное окно закрылось
    cy.get(SELECTORS.modal).should('not.exist');

    // Проверяем, что все элементы конструктора исчезли
    cy.get('.constructor-element').should('not.exist');
  });

  // Проверяем открытие модального окна ингредиента
  it('Можно открыть модальное окно ингредиента по клику', () => {
    cy.get(SELECTORS.ingredientBun).click();
    cy.get(SELECTORS.modal).should('be.visible');
    cy.get(SELECTORS.modal).contains('Краторная булка N-200i');
  });

  // Проверяем закрытие по крестику
  it('Можно закрыть модальное окно по кнопке "крестик"', () => {
    cy.get(SELECTORS.ingredientBun).click();
    cy.get(SELECTORS.modal).should('be.visible');
    cy.get(SELECTORS.modalClose).click();
    cy.get(SELECTORS.modal).should('not.exist');
  });

  // Проверяем закрытие по оверлею
  it('Можно закрыть модальное окно по клику на оверлей', () => {
    cy.get(SELECTORS.ingredientBun).click();
    cy.get(SELECTORS.modal).should('be.visible');
    cy.get(SELECTORS.modalOverlay).click({ force: true });
    cy.get(SELECTORS.modal).should('not.exist');
  });
});
