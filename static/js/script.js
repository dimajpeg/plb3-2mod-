document.addEventListener('DOMContentLoaded', () => {
    const toggleHoursButton = document.getElementById('toggle-hours');
    const workingHours = document.getElementById('working-hours');

    const schedule = [
        { day: 'Понедельник', start: null, end: null },
        { day: 'Вторник', start: 10, end: 20 },
        { day: 'Среда', start: 10, end: 20 },
        { day: 'Четверг', start: 10, end: 20 },
        { day: 'Пятница', start: 10, end: 20 },
        { day: 'Суббота',  start: 10, end: 20 },
        { day: 'Воскресенье', start: null, end: null },
    ];

    const getKievTime = () => {
        const now = new Date();
        const utcOffset = now.getTimezoneOffset() / 60;
        const kievOffset = 2;
        const kievHours = now.getHours() + kievOffset - utcOffset;
        const adjustedHours = (kievHours + 24) % 24;
        return { hours: adjustedHours, day: now.getDay() };
    };

    const checkWorkStatus = () => {
        const { hours: currentHour, day: currentDayIndex } = getKievTime();
        const currentSchedule = schedule[currentDayIndex];

        const statusElement = document.getElementById('work-status');
        if (statusElement) {
            if (currentSchedule.start !== null && currentHour >= currentSchedule.start && currentHour < currentSchedule.end) {
                statusElement.textContent = 'Открыто';
                statusElement.style.color = 'green';
            } else {
                statusElement.textContent = 'Закрыто';
                statusElement.style.color = 'red';
            }
        }

        const scheduleList = document.getElementById('work-schedule');
        if (scheduleList) {
            scheduleList.innerHTML = '';
            schedule.forEach((item, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${item.day}: ${item.start === null ? 'Выходной' : `${item.start}:00 - ${item.end}:00`}`;

                // Подсветка пятницы
                if (item.day === 'Пятница') {
                    listItem.style.fontWeight = 'bold';
                    listItem.style.color = 'blue';
                }

                scheduleList.appendChild(listItem);
            });
        }
    };

    checkWorkStatus();

    if (toggleHoursButton && workingHours) {
        toggleHoursButton.addEventListener('click', () => {
            if (workingHours.style.display === 'none') {
                workingHours.style.display = 'block';
                toggleHoursButton.textContent = 'Скрыть часы работы';
            } else {
                workingHours.style.display = 'none';
                toggleHoursButton.textContent = 'Показать часы работы';
            }
        });
    }

    const detailButtons = document.querySelectorAll('.button-details');
    let currentlyOpenDescription = null;

    detailButtons.forEach(button => {
        button.addEventListener('click', () => {
            const descriptionContainer = button.nextElementSibling;

            if (currentlyOpenDescription && currentlyOpenDescription !== descriptionContainer) {
                currentlyOpenDescription.style.display = 'none';
            }

            if (descriptionContainer.style.display === 'none' || descriptionContainer.style.display === '') {
                descriptionContainer.style.display = 'block';
                descriptionContainer.textContent = button.dataset.description;
                currentlyOpenDescription = descriptionContainer;
            } else {
                descriptionContainer.style.display = 'none';
                currentlyOpenDescription = null;
            }
        });
    });
});