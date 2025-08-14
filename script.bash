#!/usr/bin/env bash
set -euo pipefail

# =========================
# Nuxt 3 + Tailwind + Pinia + VueUse + Motion (Vue) in .
# =========================

echo ">>> 1) Проверка окружения"
command -v node >/dev/null 2>&1 || { echo "Node.js не найден"; exit 1; }
command -v npx  >/dev/null 2>&1 || { echo "npx не найден"; exit 1; }

# Разрешим инициализацию в пустой директории или если есть только этот скрипт и скрытые файлы
shopt -s nullglob dotglob
files=( * )
if (( ${#files[@]} > 1 )); then
  echo "Внимание: директория не пустая. nuxi init . может не сгенерировать файлы."
  echo "Продолжаю попытку (скрипт обновит/перезапишет часть конфигов)..."
fi

echo ">>> 2) Инициализация Nuxt проекта в текущей директории"
# --force: безопасно для пустых/почти пустых папок; игнорит вопросики в nuxi
npx --yes nuxi@latest init .

echo ">>> 3) Установка базовых зависимостей"
# Базовые пакеты проекта
npm install

echo ">>> 4) Установка модулей и библиотек"
# Модули Nuxt и утилиты
npm install -D @nuxtjs/tailwindcss tailwindcss postcss autoprefixer @types/node
npm install @pinia/nuxt @vueuse/nuxt @vueuse/motion nuxt-icon @nuxtjs/color-mode @nuxt/image

echo ">>> 5) Настройка TailwindCSS"
# Конфиги Tailwind + PostCSS (перезапишем минимально корректными)
cat > tailwind.config.js <<'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
EOF

cat > postcss.config.js <<'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
EOF

mkdir -p assets/css
cat > assets/css/tailwind.css <<'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

echo ">>> 6) Плагин Motion (@vueuse/motion)"
mkdir -p plugins
cat > plugins/motion.client.ts <<'EOF'
import { MotionPlugin } from '@vueuse/motion'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(MotionPlugin)
})
EOF

echo ">>> 7) Обновление nuxt.config.ts (модули, css, базовые настройки)"
# Полностью перезапишем nuxt.config.ts корректной конфигурацией
cat > nuxt.config.ts <<'EOF'
/* eslint-disable */
export default defineNuxtConfig({
  ssr: true,
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-icon',
    '@nuxtjs/color-mode',
    '@nuxt/image'
  ],
  css: ['@/assets/css/tailwind.css'],
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storageKey: 'color-mode'
  },
  image: {
    // оставить дефолт; при желании настроить прелоадеры/домены
  },
  typescript: {
    strict: true,
    typeCheck: true
  },
  devtools: { enabled: true }
})
EOF

echo ">>> 8) Быстрая проверка сборки"
npm run build >/dev/null 2>&1 || { echo "Сборка не прошла. Проверьте логи выше."; exit 1; }

echo "✅ Готово! Команды для старта:"
echo "   npm run dev   # режим разработки"
echo "   npm run build # прод-сборка"
echo "   npm run start # запуск прод-сборки"
