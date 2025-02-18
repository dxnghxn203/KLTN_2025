properties([
    buildDiscarder(logRotator(numToKeepStr: '5')),
    pipelineTriggers([pollSCM('H/15 * * * *')])
])

pipeline {
    agent any

    tools {
        python 'Python3.11'
        nodejs 'Node18'
    }

    options {
        timestamps()
        ansiColor('xterm')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }

    stages {
        stage('SCM Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Environments') {
            parallel {
                stage('Frontend Environment') {
                    steps {
                        dir('frontend') {
                            sh '''
                                yarn install
                                yarn cache clean
                            '''
                        }
                    }
                }
                stage('Tracking API Environment') {
                    steps {
                        dir('tracking-manager/packages/tracking-api') {
                            sh '''
                                python -m venv venv
                                . venv/bin/activate
                                pip install -r requirements.txt
                            '''
                        }
                    }
                }
                stage('Payment Service Environment') {
                    steps {
                        dir('tracking-manager/packages/payment') {
                            sh '''
                                python -m venv venv
                                . venv/bin/activate
                                pip install -r requirements.txt
                            '''
                        }
                    }
                }
            }
        }

        stage('Code Quality') {
            parallel {
                stage('Lint Frontend') {
                    steps {
                        dir('frontend') {
                            sh '''
                                yarn lint
                                yarn format:check
                            '''
                        }
                    }
                }
                stage('Lint Tracking API') {
                    steps {
                        dir('tracking-manager/packages/tracking-api') {
                            sh '''
                                . venv/bin/activate
                                pylint *.py || true
                                black --check . || true
                            '''
                        }
                    }
                }
                stage('Lint Payment Service') {
                    steps {
                        dir('tracking-manager/packages/payment') {
                            sh '''
                                . venv/bin/activate
                                pylint *.py || true
                                black --check . || true
                            '''
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            parallel {
                stage('Build Frontend') {
                    steps {
                        dir('frontend') {
                            script {
                                docker.build("frontend:${BUILD_NUMBER}")
                            }
                        }
                    }
                }
                stage('Build Tracking API') {
                    steps {
                        dir('tracking-manager/packages/tracking-api') {
                            script {
                                docker.build("tracking-api:${BUILD_NUMBER}")
                            }
                        }
                    }
                }
                stage('Build Payment Service') {
                    steps {
                        dir('tracking-manager/packages/payment') {
                            script {
                                docker.build("payment-service:${BUILD_NUMBER}")
                            }
                        }
                    }
                }
            }
        }

        stage('Run Tests') {
            parallel {
                stage('Test Frontend') {
                    steps {
                        dir('frontend') {
                            sh '''
                                yarn test --ci --coverage --passWithNoTests
                                yarn build
                            '''
                        }
                    }
                }
                stage('Test Tracking API') {
                    steps {
                        dir('tracking-manager/packages/tracking-api') {
                            sh '''
                                . venv/bin/activate
                                python -m pytest --junitxml=test-results/junit.xml || true
                            '''
                        }
                    }
                }
                stage('Test Payment Service') {
                    steps {
                        dir('tracking-manager/packages/payment') {
                            sh '''
                                . venv/bin/activate
                                python -m pytest --junitxml=test-results/junit.xml || true
                            '''
                        }
                    }
                }
            }
        }

        stage('Deploy to Staging') {
            when { branch 'develop' }
            steps {
                script {
                    sshagent(['ec2-ssh-key']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ec2-user@46.137.203.192 '\
                                cd ~/app && \
                                echo "FRONTEND_IMAGE=frontend:${BUILD_NUMBER}" > .env && \
                                echo "TRACKING_API_IMAGE=tracking-api:${BUILD_NUMBER}" >> .env && \
                                echo "PAYMENT_IMAGE=payment-service:${BUILD_NUMBER}" >> .env && \
                                docker-compose -f docker-compose.staging.yml pull && \
                                docker-compose -f docker-compose.staging.yml up -d'
                        """
                    }
                }
            }
        }

        stage('Deploy to Production') {
            when { branch 'main' }
            input {
                message "Deploy to production?"
                ok "Yes"
            }
            steps {
                script {
                    sshagent(['ec2-ssh-key']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ec2-user@46.137.203.192 '\
                                cd ~/app && \
                                docker-compose -f docker-compose.prod.yml pull && \
                                docker-compose -f docker-compose.prod.yml up -d'
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            junit '**/test-results/junit.xml'
            junit '**/junit.xml'
            publishHTML([
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'frontend/coverage',
                reportFiles: 'index.html',
                reportName: 'Frontend Coverage Report'
            ])
            cleanWs()
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
