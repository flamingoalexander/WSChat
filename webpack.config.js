const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.jsx',           // Точка входа в приложение
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',            // Результирующий бандл
        clean: true,                      // Автоматическая очистка dist перед сборкой (в новых версиях Webpack)
    },
    mode: 'development',                // Режим сборки: development/production
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,         // Какие файлы обрабатывать
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',     // Babel для транскомпиляции
                    options: {
                        presets: [
                            '@babel/preset-env',    // Пресет для современных возможностей JavaScript
                            '@babel/preset-react',  // Пресет для JSX
                        ],
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],      // Чтобы при импортах можно было не указывать расширения
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html', // Шаблон для генерации HTML
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'), // Папка со статическими файлами
        },
        port: 3000,                         // Порт для локального сервера
        historyApiFallback: true,           // Чтобы работали роуты при обновлении страницы
    },
};
