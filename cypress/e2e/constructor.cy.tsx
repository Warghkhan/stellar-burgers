describe('Тестирование конструктора бургера и модальных окон', () => {
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
    window.localStorage.setItem(
      'refreshToken',
      'mockedRefreshToken'
    );

    // Открываем главную страницу
    cy.visit('/');
  });

  // Проверяем, что ингредиенты загружены
  it('Должны отобразиться ингредиенты', () => {
    cy.get('[data-cy]').should('have.length.gte', 5);
  });

  // Проверяем добавление булки
  it('Можно добавить булку по кнопке "Добавить"', () => {
    const bunId = '643d69a5c3f7b9001cfa093c';

    cy.get(`[data-cy="${bunId}"] button`).click();
    cy.get('[data-cy="burgerConstructor"]').contains('Краторная булка N-200i');
  });

  // Проверяем добавление начинки
  it('Можно добавить начинку по кнопке "Добавить"', () => {
    const meatId = '643d69a5c3f7b9001cfa0941';

    cy.get(`[data-cy="${meatId}"] button`).click();
    cy.get('[data-cy="burgerConstructor"]').contains(
      'Биокотлета из марсианской Магнолии'
    );
  });

  // Проверяем оформление заказа
it('Можно оформить заказ, проверить модальное окно и очистку конструктора', () => {
  const bunId = '643d69a5c3f7b9001cfa093c';
  const meatId = '643d69a5c3f7b9001cfa0941';

  // Перехватываем POST /orders
  cy.fixture('order').then((orderFixture) => {
    cy.intercept('POST', 'api/orders', {
      statusCode: 200,
      body: orderFixture
    }).as('createOrder');
  });

  // Добавляем булку и мясо
  cy.get(`[data-cy="${bunId}"] button`).click();
  cy.get(`[data-cy="${meatId}"] button`).click();

  // Нажимаем на кнопку "Оформить заказ"
  cy.get('[data-cy="order-button"]').click();

  // Ждём ответа от API
  cy.wait('@createOrder');

  // Проверяем, что модальное окно открылось
  cy.get('[data-cy="modal"]').should('be.visible');

  // Проверяем, что номер заказа отображается
  cy.get('[data-cy="order-number"]').contains('114452');

  // Закрываем модальное окно по крестику
  cy.get('[data-cy="modalClose"]').click();

  // Проверяем, что модальное окно закрылось
  cy.get('[data-cy="modal"]').should('not.exist');

  // Проверяем, что все элементы конструктора исчезли
  cy.get('.constructor-element').should('not.exist');
});

  // Проверяем открытие модального окна ингредиента
  it('Можно открыть модальное окно ингредиента по клику', () => {
    const bunId = '643d69a5c3f7b9001cfa093c';

    cy.get(`[data-cy="${bunId}"]`).click();
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="modal"]').contains('Краторная булка N-200i');
  });

  // Проверяем закрытие по крестику
  it('Можно закрыть модальное окно по кнопке "крестик"', () => {
    const bunId = '643d69a5c3f7b9001cfa093c';

    cy.get(`[data-cy="${bunId}"]`).click();
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="modalClose"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  // Проверяем закрытие по оверлею
  it('Можно закрыть модальное окно по клику на оверлей', () => {
    const bunId = '643d69a5c3f7b9001cfa093c';

    cy.get(`[data-cy="${bunId}"]`).click();
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="modalCloseOverlay"]').click({ force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
  });
});
