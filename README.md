# front-config

### 2022.04.23
css-loader를 거친 후의 backgound-image 경로를 file-loader가 읽지 못해서 file-loader가 정상적으로 적용되지 않는 버그가 있음.
- css-loader의 버전을 낮춰서 loader와 webpack이 호환되도록 함.