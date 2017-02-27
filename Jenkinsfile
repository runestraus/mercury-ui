node('master') {
    nodejs(nodeJSInstallationName: 'default') {
        stage('Checkout') {
            checkout scm
            sh 'npm install'
        }
        stage('Lint') {
            sh 'npm install'
            sh 'ng lint'
        }
        stage('Test') {
            sh 'npm install'
            sauce('e75a1b30-bdd4-48f5-8947-acba29c8df9c') {
                sh 'ng test --build --browsers SL_Chrome --watch=false'
            }
        }
    }
}
