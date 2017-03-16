node('master') {
    nodejs(nodeJSInstallationName: 'default') {
        stage('Checkout') {
            checkout scm
            sh 'npm install'
            sh "ng build -prod -aot"
        }
        stage('Lint') {
            sh 'npm install'
            sh 'ng lint'
        }
        stage('Test') {
            sh 'npm install'
            sauce('e75a1b30-bdd4-48f5-8947-acba29c8df9c') {
                sh 'ng test --browsers SL_Chrome --watch=false'
            }
        }
        if (env.BRANCH_NAME == 'master') {
            stage('Deploy') {
                sh "ng build --environment=alpha -aot"
                withCredentials([[$class: 'StringBinding',
                                credentialsId: 'fbdeb584-ea29-4614-9421-c2ec9c84a083',
                                variable: 'CREDENTIALS']]) {
                    sh "firebase deploy --only hosting --token $CREDENTIALS"
                }
            }
        }
    }
}
