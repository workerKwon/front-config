const path = require('path')
const webpack = require('webpack')
const childProcess = require('child_process')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    mode: 'development', // 웹팩 실행 모드
    entry: { // 시작점이 되는 파일 설정 객체
        main: './src/app.js' // 맨 앞에는 번들된 파일의 이름(아무렇게나)
    },
    output: { // 번들된 파일에 대한 설정
        path: path.resolve('./dist'), // 경로
        filename: '[name].js' // 파일 이름 [name] 으로하면 entry에 설정해놓은 이름으로 파일을 생성할 수 있음.
    },

    /**
     * Loader : 모든 파일을 자바스크립트의 모듈처럼 만들어준다. 예를 들면 css 같은 파일을 자바스크립트에 직접 로드해서 사용할 수 있게 해준다.
     * Loader는 모듈 객체의 rules라는 배열 안에 설정할 수 있다.
     */
    module: {
        rules: [
            {
                test: /\.js$/, // 로더가 처리해야될 파일들의 패턴(정규표현식). 이 패턴에 걸린 파일들은 use 배열에 명시된 로더함수를 돌리도록 한다.
                use: [ // 사용할 로더를 명시
                    path.resolve('./my-webpack-loader.js')
                ]
            },
            {
                test: /\.css$/, // .css로 끝나는 파일들은 아래의 로더들을 거친다.
                use: [
                    process.env.NODE_ENV === 'production' ?
                        MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.png$/,
                loader: 'url-loader',
                options: {
                    // publicPath: './dist', // HtmlWebpackPlugin으로 인해서 html이 dist 폴더 안으로 들어가게 되어서 필요없어지게 된다.
                    name: '[name].[ext]?[hash]'
                },
            }
        ]
    },

    /**
     * 번들괸 결과에 후처리를 하는 것이 플러그인의 역할이다.
     * 번들된 결과물 하나를 처리한다. 플러그인을 직접 만들어서 사용하는 경우는 거의 없다.
     * 번들된 자바스크립트를 난독화 한다거나 특정 텍스트를 추출하는 용도로 사용한다.
     */
    plugins: [
        new webpack.BannerPlugin({
            banner: `
                Build Date: ${new Date().toLocaleString()}
                Commit Version: ${childProcess.execSync('git rev-parse --short HEAD')}
                Author: ${childProcess.execSync('git config user.name')}
            `
        }),
        new webpack.DefinePlugin({
            TWO: JSON.stringify('1+1'),
            'api.domain': JSON.stringify('http://dev.api.domain.com')
        }),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            templateParameters: {
                env: process.env.NODE_ENV === 'development' ? '(개발용)' : ''
            },
            minify: process.env.NODE_ENV === 'production' ? {
                collapseWhitespace: true, // 빈칸 제거
                removeComments: true // 주석 제거
            } : false
        }),
        new CleanWebpackPlugin(), // 빌드 할 때마다 dist 폴더를 삭제해주는 플러그인(dist 폴더가 새로 생성될 수 있게 매번 삭제 해준다)

        /**
         * css 파일이 클 경우에는 js 하나에 번들할 경 로딩 시간이 오래걸리기 때문에 css파일, js 파일로 나누는 것이 좋다.
         * css 파일을 따로 빼주는 플러그인. 개발환경에서는 굳이 필요하지 않기 때문에 production 모드에서만 동작하도록 하는것이 좋다.
         */
        ...(process.env.NODE_ENV === 'production' ?
            [new MiniCssExtractPlugin({filename: '[name].css'})] : []
        )
    ]
}