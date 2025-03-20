/**
 * @файл colormode.js
 * @описание функция установки цветовой схемы сайта "dark-light" с двойным переключением,
 * при первом запуске тема устанавливается автоматически по системной настройке
 */

function colorSwitcher() {
  // html код кнопки и svg картинок переключателя цветовой темы с атрибутом "data-mode"
  // у кнопки две svg дочки - dark и light, и показывать будем только одну из них

  const htmlButt =
    '<button><svg data-mode="light" class="bi bi-sun-fill" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/></svg><svg data-mode="dark" class="hidden bi bi-moon-stars-fill" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/><path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"/></svg></button>'

  // создать и установить переключатель в DOM с базовым классом обёртки 'color-switcher'
  const colorSwicher = document.createElement('div')
  colorSwicher.classList.add('color-switcher')
  colorSwicher.innerHTML = htmlButt
  document.body.append(colorSwicher)

  // берем кнопку переключателя
  const buttonSwicher = document.querySelector('.color-switcher button')
  if (!buttonSwicher) {
    console.error('Кнопка "button" внутри элемента с классом ".color-switcher" не найдена!')
    return
  }
  // берем код svg картинки в кнопке
  const [light, dark] = Array.from(buttonSwicher.children)

  // определяем тип цветовой темы
  type Tmode = 'dark' | 'light'

  // определяем функцию записи темы в local storage по ключу 'theme'
  const setStoredTheme = (theme: Tmode) => localStorage.setItem('theme', theme)
  // определяем функцию чтения темы из local storage по ключу 'theme'
  const getStoredTheme = () => localStorage.getItem('theme')
  // определяем функцию удаления записи ключа с темой
  const removeStoredTheme = () => localStorage.removeItem('theme')

  // константа содержит ответ медиа запроса по наличию цветовой схемы дарк
  const list = window.matchMedia('(prefers-color-scheme: dark)')

  // определяем функцию получения текущей цветовой темы из local storage или из preferred color scheme
  const getPreferredTheme = (): Tmode => {
    const storedTheme = getStoredTheme()
    return storedTheme ? (storedTheme as Tmode) : list.matches ? 'dark' : 'light'
  }

  // взять корень документа один раз
  const html = document.documentElement

  // определяем функцию установки темы в корне документа
  const setTheme = (theme: Tmode) => {
    // для bootstrap
    // html.setAttribute('data-bs-theme', theme === 'dark' ? 'dark' : 'light')
    // для tailwind
    html.classList.toggle('dark', theme === 'dark')
  }

  // определяем функцию показа нужной svg картинки в кнопке переключателя тем
  function showThemeIcon(theme: Tmode) {
    light.classList.toggle('hidden', theme === 'dark')
    dark.classList.toggle('hidden', theme === 'light')
  }

  // сперва настроим тему при первом запуске
  const usedTheme = getPreferredTheme() // смотрим в систему
  setTheme(usedTheme) // определяем и устанавливаем тему на странице
  showThemeIcon(usedTheme) // отображаем картинку текущей темы

  // вешаем на кнопку переключателя слушатель событий и ждем клика - затем меняем тему
  buttonSwicher.addEventListener('click', (event) => {
    event.preventDefault()

    // определяем какая кнопка не скрыта и считывам значение атрибута "data-mode"
    const currentMode: string | undefined = [...Array.from(buttonSwicher.children)]
      .find((el) => !el.classList.contains('hidden'))
      ?.attributes.getNamedItem('data-mode')?.value

    if (!currentMode) {
      console.error('НЕ найден атрибут "data-mode" или тег "svg" в кнопке переключателя тем!')
      return
    }

    // меняем тему
    const theme: Tmode = currentMode === 'light' ? 'dark' : 'light'
    setTheme(theme)
    showThemeIcon(theme)
    setStoredTheme(theme)
  })

  // вешаем слушатель событий на медиа цветовой схемы системы
  list.addEventListener('change', () => {
    removeStoredTheme()
    const theme = getPreferredTheme()
    setTheme(theme)
    showThemeIcon(theme)
  })
}

// как вариант без экспорта: запускам здесь скрипт функции colorSwitcher
window.addEventListener('DOMContentLoaded', colorSwitcher)

// вариант экспорт функции colorSwitcher
// export default { colorSwitcher }
