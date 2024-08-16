function generateAndPickRandomNumber(num1: number, num2: number): number {

    const result: number[] = [];

    // Добавляем числа от 0 до num1 - 1
    for (let i = 0; i < num1; i++) {
        for (let j = 0; j < i + 1; j++) {
            result.push(i);
        }
    }

    // Добавляем второе число num2, количество раз равное num1 + 1
    for (let k = 0; k < num1 + 1; k++) {
        result.push(num2);
    }

    // Определяем количество повторений для последнего числа в массиве
    const lastNumberCount = num1 + 1; // Количество раз, которое num2 повторяется

    // Добавляем числа по убыванию от num2 - 1 до num1 с увеличением количества повторений
    for (let i = num2 - 1; i >= num1; i--) {
        const repeatCount = lastNumberCount + (num2 - i); // Увеличиваем количество повторений
        for (let j = 0; j < repeatCount; j++) {
            result.push(i);
        }
    }

    // Перемешиваем массив с помощью алгоритма Фишера-Йейтса
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]]; // Swap elements
    }

    // Выбираем случайное число из перемешанного массива
    const randomIndex = Math.floor(Math.random() * result.length);

    return result[randomIndex];
}

export default generateAndPickRandomNumber
