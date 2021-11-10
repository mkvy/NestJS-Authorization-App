# US test project

Тестовое задание Backend developer.
Выполнено с использованием фреймворка Nest JS.
# Маршруты
Контроллер принимает следующие запросы:
- POST /auth/signup

По данному маршруту производится регистрация пользователя.
Данные передаются POST запросом, тело запроса содержит JSON с полями "email": string, "password": string.

В ответ возвращается JWT token в виде jwtHeader.jwtPayload.jwtSignature с кодом HTTP 200.
Если данные не валидны, возвращается код HTTP 400.

- POST /auth/signin

По данному маршруту производится авторизация пользователя.
Данные передаются POST запросом, тело запроса содержит JSON с полями "email": string, "password": string.

В ответ возвращается JWT token в виде jwtHeader.jwtPayload.jwtSignature с кодом HTTP 200.
Если данные не валидны, возвращается код HTTP 400.

- POST /auth/tokenAuth

По данному маршруту производится поиск пользователя в БД.
На вход передается токен доступа в виде HTTP заголовка: "Authorization: Bearer jwtHeader.jwtPayload.jwtSignature".

В зависимости от наличия пользователя в БД возвращается код 200 или 403.
#
Пользователи хранятся в СУБД PostgreSQL. Сущность пользователя описана с помощью TypeORM и состоит из трех полей:

- id: number; (автогенерирующийся)

- email: string;

- password: string;
