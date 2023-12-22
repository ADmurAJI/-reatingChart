// Массив данных
const data = [
    {surname: "Цветаева С. А.", load: 40},
    {surname: "Летова С. А.", load: 3},
    {surname: "Цветкова С. А.", load: 80},
    {surname: "Солнцева С. А.", load: 22},
    {surname: "Бабаджанян С. А.", load: 20},
];

// Функция для определения цвета в зависимости от количества часов
function getColor(load) {
    if (load < 40) {
        return '#213D9D'
    } else if (load >= 40 && load <= 79) {
        return '#3F6FFA'
    } else {
        return '#152247'
    }
}

// Находим контейнер для диаграммы
const chartContainer = d3.select('#chart-teachers-workload-container')

// Добавляем стили к контейнеру
chartContainer.style('width', '849px')
    .style('height', '648px')
    .style('border-radius', '20px')
    .style('background', '#F5F9FF')

// Размеры диаграммы и отступы
const width = 849;
const height = 690;
const marginTop = 45;
const marginLeft = 50;
const marginRight = 100;
const marginBottom = 0;

// Создаем SVG элемент внутри контейнера с viewBox
const svg = chartContainer.append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `${-marginLeft} ${-marginTop} ${width + marginLeft + marginRight} ${height + marginTop + marginBottom}`)

// Создание шкалы для оси Y
const yScale = d3.scaleBand()
    .domain(data.map(d => d.surname))
    .range([0, height])
    .padding(0.4);

// Создание оси Y
const yAxis = d3.axisLeft(yScale);

// Добавление оси Y
// svg.append('g')
//     .attr('class', 'y-axis')
//     .call(yAxis);

// Создание шкалы для оси X
const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.load)])
    .range([0, width]);

// Определение максимального значения для шкалы X
const maxX = Math.max(60, d3.max(data, d => d.load));

// Обновление домена шкалы X
xScale.domain([0, maxX]);

// Создание оси X
const xAxis = d3.axisBottom(xScale);

// Добавление оси X
// svg.append('g')
//     .attr('class', 'x-axis')
//     .call(xAxis);


// Создаём вертикальные линии
const verticalLines = svg.selectAll('.vertical-line')
    .data(d3.range(10, 81, 10)) // Генерируем числа от 10 до 80 с шагом 10
    .enter()
    .append('line') // Создаём элементы (линии)
    .attr('class', 'vertical-line')
    .attr('x1', d => xScale(d)) // Начальная точка X
    .attr('x2', d => xScale(d)) // Конечная точка X
    .attr('y1', 0) // Начальная точка Y
    .attr('y2', height) // Конечная точка Y
    .style('stroke', '#152247')
    .style('stroke-width', 1)
    .style('stroke-dasharray', d => (d === 40 || d === 60 || d === 80) ? 'none' : '5,5')
    .attr("opacity", 0.2);

// Создание столбцов диаграмм с присвоением цвета
svg.selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', 0)
    .attr('y', d => yScale(d.surname))
    .attr('width', d => xScale(d.load))
    .attr('height', yScale.bandwidth())
    .attr('fill', d => getColor(d.load))
    .on('mouseover', function (d) {
        d3.select(this).attr('fill', '#6e92f3');
    })
    .on('mouseout', function (d) {
        d3.select(this).attr('fill', getColor(d.load))
    })
    .attr('rx', '6');

// Создание текстовых элементов с фамилиями над столбцами
svg.selectAll('.surname-label')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'surname-label')
    .attr('x', 0)
    .attr('y', d => yScale(d.surname) - 10)
    .text(d => d.surname)
    .style('fill', '#152247')
    .style('font-size', '18px')
    .style('font-weight', '600');

// Функция для скланения слова "час"
function formatHours(hours) {
    const lastDigit = hours % 10;
    const lastTwoDigits = hours % 100;

    if (lastDigit === 1 && lastTwoDigits !== 11) {
        return hours + " час";
    } else if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwoDigits)) {
        return hours + " часа";
    } else {
        return hours + " часов";
    }
}

// Создание текстовых элементов с часами в конце столбцов
svg.selectAll('.watch-label')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'watch-label')
    .attr('x', d => xScale(d.load) + 10)
    .attr('y', d => yScale(d.surname) + 40)
    .text(d => formatHours(d.load))
    .style('fill', '#828282')
    .style('font-size', '18px')
    .style('font-weight', '400');

// Создание текстовых элементов с числами по оси X сверху
svg.selectAll('.x-label')
    .data(d3.range(0, 81, 10)) // Генерируем числа от 0 до 80 с шагом 10
    .enter()
    .append('text')
    .attr('class', 'x-label')
    .attr('x', d => xScale(d)) // Расположение текста на соответствующей позиции шкалы X
    .attr('y', -10) // Отступ текста над графиком
    .attr('text-anchor', 'middle') // Выравнивание текста по центру
    .text(d => d) // Используем значение для текста
    .style('fill', '#828282')
    .style('font-size', '16px')
    .style('font-weight', '400');

// Обработчик события при наведении мыши на цифру 40, 60 или 80
svg.selectAll('.x-label')
    .filter(d => d === 40 || d === 60 || d === 80)
    .on('mouseover', function (d) {
        d3.select(this)
            .style('fill', '#152247')
            .style('font-weight', 'bold')
            .style('cursor', 'pointer')
            .style('font-size', '24px')

        // Отображение текста при наведении
        let labelText;
        if (d === 40) {
            labelText = 'Желаемая нагрузка';
        } else if (d === 60) {
            labelText = 'Желаемая нагрузка школы';
        } else if (d === 80) {
            labelText = 'Критическая нагрузка школы';
        }

        svg.append('text')
            .attr('class', 'label-text')
            .attr('x', xScale(d))
            .attr('y', 30)
            .attr('text-anchor', 'end')
            .text(labelText)
            .style('fill', '#152247')
            .style('font-size', '18px')
            .style('font-weight', '400');
        // Установка opacity равной 1 для соответствующих линий
        verticalLines.filter(line => line === d)
            .attr("opacity", 1);
    })
    .on('mouseout', function (d) {
        d3.select(this)
            .style('fill', '#828282')
            .style('font-weight', 'normal')
            .style('font-size', '18px')

        // Удаление текста при убирании мыши
        svg.selectAll('.label-text').remove();

        verticalLines.filter(line => line === d)
            .attr("opacity", 0.1);
    });
