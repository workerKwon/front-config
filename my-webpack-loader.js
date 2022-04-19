// 로더는 함수 형태로 작성한다.
module.exports = function myWebpackLoader (content) {
        return content.replace('console.log(', 'alert(')
    }