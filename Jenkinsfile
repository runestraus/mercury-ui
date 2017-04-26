node('javascript') {
    ENVIRONMENT = 'alpha'

    nodejs(nodeJSInstallationName: 'default') {
        stage('Checkout') {
            checkout scm
            sh 'yarn'
            sh "ng build -prod -aot"
        }
        stage('Lint') {
            sh 'yarn'
            sh 'ng lint'
        }
        stage('Test') {
            sh 'yarn'
            sauce('e75a1b30-bdd4-48f5-8947-acba29c8df9c') {
                sh 'ng test --watch=false'
            }
        }
        if (env.BRANCH_NAME == 'master') {
            stage('Deploy') {
                sh "ng build --environment=$ENVIRONMENT -aot"
                withCredentials([[$class: 'StringBinding',
                                credentialsId: 'fbdeb584-ea29-4614-9421-c2ec9c84a083',
                                variable: 'CREDENTIALS']]) {
                    sh "firebase deploy --project mercury-donuts-$ENVIRONMENT --only hosting --token $CREDENTIALS"
                }
            }
        }

        if (env.BRANCH_NAME == 'master') {
            stage('Smoke Test') {
              sh 'yarn'
              sh 'node_modules/webdriver-manager/bin/webdriver-manager update'
              withCredentials([[$class: 'UsernamePasswordMultiBinding',
                                          credentialsId: '307b5bf3-2937-4864-82eb-78c895ec885a',
                                          passwordVariable: 'SAUCE_ACCESS_KEY',
                                          usernameVariable: 'SAUCE_USERNAME']]) {
                sh 'ng e2e'
              }
            }
        }
    }
}
