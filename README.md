# x0_support

web3 폴더의 대부분의 기능은 완성되지 않았습니다.   
ethers.js 먼저 개발하고 역으로 web3.js 로 만들고 있었기 때문입니다.   

scripts/ethers 안의 파일은 잘 작동합니다.   
test/ethers 안의 파일도 작동하나 람다에 올릴경우 hardhat 라이브러리를 ethers.js로 변경해야 합니다.   
hardhat 은 이더리움 빌딩 환경으로 ethers.js 를 비롯한 여러 라이브러리와 네트워크를 포함하는 더 큰 개념입니다.