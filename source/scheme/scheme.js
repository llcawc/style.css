/**
 * @файл scheme.js
 * @описание скрипт работы переключателя цветовых тем
 * @действие вставляет или убирает класс 'dark' в html элемент
 * или в атрибуте 'data-bs-theme' html элемента переключает 'light' и 'dark'
 */
function schemeSwitcher() {
    // записать тему в локальное хранилище
    const setStoredTheme = (theme) => localStorage.setItem('color-mode', theme);
    // считать тему из локального хранилища
    const getStoredTheme = () => localStorage.getItem('color-mode');
    // определяем функцию удаления записи ключа с темой
    const removeStoredTheme = () => localStorage.removeItem('color-mode');
    // константа содержит ответ медиа запроса по наличию цветовой схемы дарк
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    // Получить текущую цветовую тему: 'dark' | 'light'
    const getCurrentTheme = () => {
        const storedTheme = getStoredTheme() ?? 'system';
        return storedTheme === 'system' ? (darkModeMediaQuery.matches ? 'dark' : 'light') : storedTheme;
    };
    // Получить текущee представление системы
    const getPrefferedTheme = () => {
        const storedTheme = getStoredTheme() ?? 'system';
        return storedTheme === 'system' ? 'system' : getCurrentTheme();
    };
    // Установить цветовую тему в атрибуте тега 'html'
    const setTheme = (theme) => {
        theme = theme === 'system' ? (darkModeMediaQuery.matches ? 'dark' : 'light') : theme;
        // document.documentElement.classList.toggle('dark', theme === 'dark')
        document.documentElement.setAttribute('data-bs-theme', theme);
    };
    // Отобразить переключение на пульте управления цветовыми темами
    const showActiveTheme = (theme) => {
        const activeRadio = document.querySelector(`.ui-radio[data-ui-value=${theme}]`);
        document.querySelectorAll('.ui-radio').forEach((elem) => {
            elem.removeAttribute('data-checked');
            elem.setAttribute('aria-checked', 'false');
            elem.setAttribute('tabindex', '-1');
        });
        if (activeRadio) {
            activeRadio.setAttribute('data-checked', 'true');
            activeRadio.setAttribute('aria-checked', 'true');
            activeRadio.setAttribute('tabindex', '0');
        }
        else {
            console.log(`The node ".ui-radio[data-ui-value=${theme}]" is missing! `);
        }
    };
    // установить при первом запуске
    showActiveTheme(getPrefferedTheme());
    setTheme(getCurrentTheme());
    // взять все кнопки переключателя тем на странице
    const switcherRadios = document.querySelectorAll('.ui-radio');
    [...switcherRadios].forEach((radio) => {
        radio.addEventListener('click', () => {
            let theme = radio.getAttribute('data-ui-value');
            if (!theme) {
                theme = getPrefferedTheme();
            }
            showActiveTheme(theme);
            setTheme(theme);
            if (theme === 'system') {
                removeStoredTheme();
            }
            else {
                setStoredTheme(theme);
            }
        });
    });
    // установка обработчика смены тем в системе
    darkModeMediaQuery.addEventListener('change', () => {
        const theme = getCurrentTheme();
        setTheme(theme);
    });
}

export { schemeSwitcher };
