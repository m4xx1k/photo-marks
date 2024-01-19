class ApiError extends Error{
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status
        this.message = message
    }

    static badRequest(message, errors = []){
        return new ApiError(400, message, errors)// Відповідь означає, що сервер не розуміє запиту через невірний синтаксис
    }

    static unauthorized(message, errors = []){
        return new ApiError(401, message, errors)// Для отримання запитуваної відповіді потрібна аутентифікація. Статус схожий на статус 403, але в цьому випадку, аутентифікація можлива
    }

    static forbidden(message, errors = []){
        return new ApiError(403, message, errors)// У відвідувача недостатньо прав для перегляду контенту
    }

    static notFound(message, errors = []){
        return new ApiError(404, message, errors)// Сервер не може знайти запитуваний ресурс
    }

    static preconditionFailed(message, errors = []){
        return new ApiError(412, message, errors)// Клієнт вказав в своїх заголовках умови, які сервер не може виконати
    }

    static internal(message, errors = []){
        return new ApiError(500, message, errors)// Сервер не зміг виконати запит через непередбачену помилку
    }
}

module.exports = ApiError