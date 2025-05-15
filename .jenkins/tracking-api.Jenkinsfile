pipeline {
    agent any

    environment {
        PAYMENT_API_URL_FROM_VAULT = ""
    }

    stages {
        stage('Initialize & Fetch Secrets (for Tracking API)') {
            steps {
                script {
                    echo "Pipeline started for Tracking API (Branch: ${env.BRANCH_NAME})"
                }
                withVault(configuration: [
                    url: 'http://localhost:8200',
                    credentialsId: 'vault-dev-approle-for-dotenv',
                    engineVersion: 2
                  ],
                  vaultSecrets: [
                    [path: 'secret/.env', secretValues: [
                        [vaultKey: 'PAYMENT_API_URL', envVar: 'PAYMENT_API_URL_FROM_VAULT']
                    ]]
                  ]) {
                    sh 'echo "Fetched (example) Payment API URL from Vault: ${PAYMENT_API_URL_FROM_VAULT}"'
                }
            }
        }

        stage('Build Tracking API Docker Image') {
            steps {
                dir('tracking-manager/packages/tracking-api') {
                    script {
                        echo "Building Docker image for Tracking API service..."

                        def dockerNamespace = "dxnghxn203"
                        def serviceName = "tracking-api"
                        def imageName = "${dockerNamespace ? dockerNamespace + '/' : ''}${serviceName}:${env.BUILD_NUMBER}-${env.BRANCH_NAME}"

                        echo "Target Docker image name: ${imageName}"

                        sh "docker build -t ${imageName} ."

                        echo "Successfully built Docker image: ${imageName}"
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline for Tracking API (Branch: ${env.BRANCH_NAME}) finished."
        }
        success {
            echo "Tracking API build on branch ${env.BRANCH_NAME} succeeded!"
        }
        failure {
            echo "Tracking API build on branch ${env.BRANCH_NAME} failed!"
        }
    }
}