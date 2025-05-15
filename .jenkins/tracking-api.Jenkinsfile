pipeline {
    agent any

    environment {
        PAYMENT_API_URL_FROM_VAULT = "" // Biến cho secret từ Vault
        APP_VERSION = ""                // Biến cho phiên bản ứng dụng/image tag
        BRANCH_NAME_ENV = ""            // Biến cho tên nhánh
        DOCKER_NAMESPACE = "dxnghxn203" // Namespace Docker Hub của bạn
        SERVICE_NAME = "tracking-api"   // Tên service
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "Starting Checkout stage..."
                    checkout scm
                    echo "SCM checkout complete."

                    // Xác định tên nhánh
                    BRANCH_NAME_ENV = env.BRANCH_NAME ?: "unknown-branch"
                    if (BRANCH_NAME_ENV == "unknown-branch" && env.CHANGE_BRANCH) { // Thường dùng cho PRs
                        BRANCH_NAME_ENV = env.CHANGE_BRANCH
                    }
                    if (BRANCH_NAME_ENV == "unknown-branch" && env.TAG_NAME) { // Nếu build từ tag, nhánh có thể không rõ ràng
                        BRANCH_NAME_ENV = "tag-${env.TAG_NAME}"
                    }


                    // Xác định phiên bản ứng dụng (cho Docker tag)
                    if (env.TAG_NAME) {
                        APP_VERSION = env.TAG_NAME // Ưu tiên tag Git nếu có
                    } else {
                        // Sử dụng build number và tên nhánh đã được làm sạch (loại bỏ ký tự không hợp lệ cho tag Docker)
                        def cleanBranchName = BRANCH_NAME_ENV.replaceAll('[^a-zA-Z0-9_.-]', '-')
                        APP_VERSION = "${env.BUILD_NUMBER}-${cleanBranchName}"
                    }
                    echo "Branch: ${BRANCH_NAME_ENV}"
                    echo "App Version (for Docker tag): ${APP_VERSION}"

                    if (BRANCH_NAME_ENV == "unknown-branch") {
                        error "Critical: Branch name could not be determined. Halting."
                    }
                }
            }
        }

        stage('Setup Environment') {
            steps {
                script {
                    echo "Setting up environment..."
                    echo "Fetching secrets from Vault..."
                }
                withVault(
                    configuration: [
                        url: 'http://localhost:8200', // Hoặc IP Vault server
                        credentialsId: 'vault-dev-approle-for-dotenv', // ID Vault AppRole Credential
                        engineVersion: 2
                    ],
                    vaultSecrets: [
                        [
                            path: 'secret/.env', // Path của secret trong Vault
                            secretValues: [
                                [vaultKey: 'PAYMENT_API_URL', envVar: 'PAYMENT_API_URL_FROM_VAULT']
                                // Thêm các secret khác cần thiết cho service này ở đây
                            ]
                        ]
                    ]
                ) {
                    script {
                        echo "Fetched Payment API URL from Vault: ${PAYMENT_API_URL_FROM_VAULT ?: 'NOT FOUND'}"
                        // Kiểm tra các secret quan trọng khác nếu có
                    }
                }
                script {
                    // Các bước setup môi trường khác nếu có
                    // Ví dụ: cài đặt tools, kiểm tra dependencies, v.v.
                    echo "Environment setup complete."
                }
            }
        }

        stage('Build') {
            steps {
                dir("tracking-manager/packages/${SERVICE_NAME}") { // Sử dụng biến SERVICE_NAME
                    script {
                        echo "Building Docker image for ${SERVICE_NAME}..."
                        echo "Using App Version for tagging: ${APP_VERSION}"

                        def imageName = "${DOCKER_NAMESPACE ? DOCKER_NAMESPACE + '/' : ''}${SERVICE_NAME}:${APP_VERSION}"

                        echo "Target Docker image name: ${imageName}"

                        // Lệnh build Docker
                        sh "docker build -t ${imageName} ."

                        echo "Successfully built Docker image: ${imageName}"

                        // Tùy chọn: Hiển thị danh sách Docker images để kiểm tra
                        // sh "docker images ${DOCKER_NAMESPACE ? DOCKER_NAMESPACE + '/' : ''}${SERVICE_NAME}"
                    }
                }
            }
        }

        stage('Deploy') {
            // Stage này là placeholder, bạn cần điền logic deploy thực tế
            // Ví dụ: push image lên registry, cập nhật Kubernetes deployment, v.v.
            steps {
                script {
                    echo "Starting Deploy stage for ${SERVICE_NAME} version ${APP_VERSION}..."
                    echo "Deployment logic not yet implemented."
                    // Ví dụ:
                    // if (env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master' || env.TAG_NAME) {
                    //    echo "Pushing image ${imageName} to registry..."
                    //    withCredentials([string(credentialsId: 'YOUR_DOCKER_REGISTRY_CREDENTIALS_ID', variable: 'DOCKER_PASSWORD')]) {
                    //        sh "echo \"${DOCKER_PASSWORD}\" | docker login -u \"${YOUR_DOCKER_USERNAME}\" --password-stdin your.registry.com"
                    //        sh "docker push ${imageName}"
                    //    }
                    //    echo "Deploying to production/staging environment..."
                    //    sh "./scripts/deploy.sh ${imageName} production"
                    // } else {
                    //    echo "Skipping deployment for non-production branch: ${BRANCH_NAME_ENV}"
                    // }
                }
            }
        }
    }

    post {
        always {
            script {
                echo "Pipeline for ${SERVICE_NAME} (Branch: ${BRANCH_NAME_ENV}, Version: ${APP_VERSION}) finished."
                // cleanWs() // Tùy chọn: dọn dẹp workspace
            }
        }
        success {
            script {
                echo "${SERVICE_NAME} build & (placeholder) deploy on branch ${BRANCH_NAME_ENV} (Version: ${APP_VERSION}) succeeded!"
            }
        }
        failure {
            script {
                echo "${SERVICE_NAME} build or deploy on branch ${BRANCH_NAME_ENV} (Version: ${APP_VERSION}) failed!"
            }
        }
    }
}