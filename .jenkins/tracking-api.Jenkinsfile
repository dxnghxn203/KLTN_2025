pipeline {
    agent any

    environment {
        VAULT_CREDENTIAL_ID = 'vault-dev-secretid-for-dotenv'
        VAULT_URL = 'http://localhost:8200'
        VAULT_SECRET_PATH = 'secret/.env'
        WORKSPACE_DOTENV_FILENAME = 'tracking-manager/packages/tracking-api/.env.from.vault'

        REGISTRY_HOST = '159.65.7.99:5000'
        IMAGE_BASENAME = 'tracking-api'
        CONTAINER_NAME = "${IMAGE_BASENAME}-app"
        TRACKING_API_PATH = 'tracking-manager/packages/tracking-api'
        DOCKERFILE_PATH = "${TRACKING_API_PATH}/Dockerfile"
        HOST_PORT_FOR_APP = 8000
    }

    stages {
        stage('Initial Setup and Sanity Checks') {
            steps {
                script {
                    if (env.BRANCH_NAME == null || env.BRANCH_NAME.isEmpty() || env.BRANCH_NAME == "null" || env.BRANCH_NAME.contains('unknown')) {
                        error "FATAL: Không thể xác định tên nhánh hợp lệ (Branch: ${env.BRANCH_NAME}). Dừng pipeline."
                    }
                    echo "Đang làm việc trên nhánh: ${env.BRANCH_NAME}"
                    if (!fileExists(env.DOCKERFILE_PATH)) {
                        error "FATAL: Dockerfile không tồn tại tại ${env.DOCKERFILE_PATH}. Dừng pipeline."
                    }
                    echo "Dockerfile đã được tìm thấy tại: ${env.DOCKERFILE_PATH}"
                }
            }
        }

        stage('Retrieve .env from Vault and Create File') {
            steps {
                script {
                    echo "Đang lấy tất cả key-value từ Vault path: ${env.VAULT_SECRET_PATH}"
                    echo "Sẽ ghi vào file: ${env.WORKSPACE_DOTENV_FILENAME} với định dạng .env"
                    echo "Vault URL: ${env.VAULT_URL}"

                    try {
                        withVault(
                            configuration: [
                                url: env.VAULT_URL,
                                credentialsId: env.VAULT_CREDENTIAL_ID,
                                engineVersion: 2
                            ],
                            vaultSecrets: [
                                [
                                    path: env.VAULT_SECRET_PATH,
                                    secretValues: [],
                                    fileOutputPath: env.WORKSPACE_DOTENV_FILENAME,
                                    fileOutputFormat: '.env'
                                ]
                            ]
                        ) {
                            if (!fileExists(env.WORKSPACE_DOTENV_FILENAME)) {
                                error "Không thể tạo file ${env.WORKSPACE_DOTENV_FILENAME} từ Vault. Kiểm tra lại cấu hình Vault và permissions."
                            }
                            echo "Đã tạo thành công file ${env.WORKSPACE_DOTENV_FILENAME} từ Vault."
                            sh "ls -l ${env.WORKSPACE_DOTENV_FILENAME}"
                        }
                    } catch (e) {
                        error "Lỗi khi lấy secret từ Vault hoặc tạo file .env: ${e.getMessage()}"
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    if (!fileExists(env.WORKSPACE_DOTENV_FILENAME)) {
                        error "FATAL: File ${env.WORKSPACE_DOTENV_FILENAME} không tìm thấy. Bước lấy từ Vault có thể đã thất bại."
                    }
                    echo "Sử dụng file ${env.WORKSPACE_DOTENV_FILENAME} để build Docker image."

                    def safeBranchName = env.BRANCH_NAME.replaceAll('/', '-')
                    def fullImageNameWithTag = "${env.REGISTRY_HOST}/${env.IMAGE_BASENAME}:${env.BUILD_NUMBER}-${safeBranchName}"
                    def latestImageName = "${env.REGISTRY_HOST}/${env.IMAGE_BASENAME}:latest"

                    echo "Bắt đầu build Docker image: ${fullImageNameWithTag}"
                    echo "Build context: ${env.TRACKING_API_PATH}"

                    docker.build(fullImageNameWithTag, "${env.TRACKING_API_PATH}")
                    echo "Build thành công image: ${fullImageNameWithTag}"

                    docker.image(fullImageNameWithTag).tag(latestImageName)
                    echo "Đã tag image ${fullImageNameWithTag} thành ${latestImageName}"
                }
            }
        }

        stage('Push Docker Image to Registry') {
            steps {
                script {
                    def safeBranchName = env.BRANCH_NAME.replaceAll('/', '-')
                    def fullImageNameWithTag = "${env.REGISTRY_HOST}/${env.IMAGE_BASENAME}:${env.BUILD_NUMBER}-${safeBranchName}"
                    def latestImageName = "${env.REGISTRY_HOST}/${env.IMAGE_BASENAME}:latest"
                    docker.image(fullImageNameWithTag).push()
                    docker.image(latestImageName).push()
                }
            }
        }

        stage('Deploy Application') {
            steps {
                script {
                    def imageToDeploy = "${env.REGISTRY_HOST}/${env.IMAGE_BASENAME}:latest"
                    sh "docker pull ${imageToDeploy}"
                    sh "docker stop ${env.CONTAINER_NAME} || true"
                    sh "docker rm ${env.CONTAINER_NAME} || true"
                    sh """
                        docker run -d \\
                            --name ${env.CONTAINER_NAME} \\
                            --restart unless-stopped \\
                            -p ${env.HOST_PORT_FOR_APP}:80 \\
                            ${imageToDeploy}
                    """
                    sh "sleep 5"
                    sh "docker ps -f name=${env.CONTAINER_NAME}"
                }
            }
        }

        stage('Cleanup Workspace (Optional)') {
            steps {
                script {
                    if (fileExists(env.WORKSPACE_DOTENV_FILENAME)) {
                        sh "rm -f ${env.WORKSPACE_DOTENV_FILENAME}"
                    }
                }
            }
        }
    }
    post {
        always { echo "Pipeline đã kết thúc." }
        success { echo "Pipeline hoàn thành THÀNH CÔNG!" }
        failure { echo "Pipeline đã THẤT BẠI." }
        aborted { echo "Pipeline đã bị HỦY BỎ." }
    }
}