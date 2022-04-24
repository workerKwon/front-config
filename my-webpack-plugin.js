/**
 * apply 함수를 만들면 웹팩이 compiler를 주입해준다.
 */
class MyWebpackPlugin {
    apply(compiler) {
        compiler.hooks.done.tap('My Plugin', stats => {
            console.log('MyPlugin: done')
        })

        compiler.plugin('emit', (compilation, callback) => {
            const source = compilation.assets['main.js'].source();

            compilation.assets['main.js'].source = () => {
                const banner = [
                    '/**',
                    ' * 번들된 결과물에 plugin을 통해 주석을 추가한 결과',
                    ' */'
                ].join('\n');
                return banner + '\n\n' + source;
            }
            callback();
        })
    }
}

module.exports = MyWebpackPlugin;