pipeline {
    agent any

    environment {
        REGISTRY_URL = '159.65.7.99:5000'
        IMAGE_NAME = 'tracking-hook'
        IMAGE_TAG = "${REGISTRY_URL}/${IMAGE_NAME}:${BUILD_NUMBER}"

        APP_PATH = 'tracking-manager/packages/hook'
        DOCKERFILE_PATH = "${APP_PATH}/Dockerfile"

        GIT_REPO = 'https://github.com/dxnghxn203/KLTN_2025.git'
        GIT_BRANCH = 'demo-deploy'

        VAULT_ADDR = 'http://localhost:8200'

        SERVICE_PORT = '10001'
        SERVICE_DNS = 'hook.medicaretech.io.vn'
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "Lấy mã nguồn từ ${GIT_REPO}, nhánh: ${GIT_BRANCH}"

                cleanWs()

                checkout([
                    $class: 'GitSCM',
                    branches: [[name: "*/${GIT_BRANCH}"]],
                    userRemoteConfigs: [[
                        credentialsId: 'github-pat-dxnghxn203',
                        url: GIT_REPO
                    ]]
                ])
            }
        }

        stage('Retrieve .env from Vault') {
            steps {
                echo "Đang lấy biến môi trường từ Vault tại ${VAULT_ADDR}"

                script {
                    withVault([
                        configuration: [
                            vaultUrl: VAULT_ADDR,
                            vaultCredentialId: 'vault-dev-secretid-for-dotenv',
                            engineVersion: 2
                        ],
                        vaultSecrets: [
                            [
                                path: 'secret/.env',
                                secretValues: [
                                    [vaultKey: 'RABBITMQ_USER', envVar: 'vault_RABBITMQ_USER'],
                                    [vaultKey: 'RABBITMQ_PW', envVar: 'vault_RABBITMQ_PW'],
                                    [vaultKey: 'RABBITMQ_HOST', envVar: 'vault_RABBITMQ_HOST'],
                                    [vaultKey: 'RABBITMQ_PORT', envVar: 'vault_RABBITMQ_PORT'],
                                    [vaultKey: 'MEDICARE_PRIVATE_KEY', envVar: 'vault_MEDICARE_PRIVATE_KEY'],
                                    [vaultKey: 'MEDICARE_PUBLIC_KEY', envVar: 'vault_MEDICARE_PUBLIC_KEY'],
                                    [vaultKey: 'MEDICARE_PUBLIC_KEY_X', envVar: 'vault_MEDICARE_PUBLIC_KEY_X'],
                                    [vaultKey: 'MEDICARE_PUBLIC_KEY_Y', envVar: 'vault_MEDICARE_PUBLIC_KEY_Y'],
                                    [vaultKey: 'PORT', envVar: 'vault_PORT'],
                                    [vaultKey: 'APP_ENV', envVar: 'vault_APP_ENV']
                                ]
                            ]
                        ]
                    ]) {
                        sh """
                            # Tạo thư mục nếu chưa tồn tại
                            mkdir -p ${APP_PATH}

                            # Tạo file .env
                            echo "# Automatically generated from Vault - \$(date)" > ${APP_PATH}/.env

                            # Thêm các biến từ Vault vào file .env
                            echo "RABBITMQ_USER=\${vault_RABBITMQ_USER}" >> ${APP_PATH}/.env
                            echo "RABBITMQ_PW=\${vault_RABBITMQ_PW}" >> ${APP_PATH}/.env
                            echo "RABBITMQ_HOST=\${vault_RABBITMQ_HOST}" >> ${APP_PATH}/.env
                            echo "RABBITMQ_PORT=\${vault_RABBITMQ_PORT}" >> ${APP_PATH}/.env
                            echo "MEDICARE_PRIVATE_KEY=\${vault_MEDICARE_PRIVATE_KEY}" >> ${APP_PATH}/.env
                            echo "MEDICARE_PUBLIC_KEY=\${vault_MEDICARE_PUBLIC_KEY}" >> ${APP_PATH}/.env
                            echo "MEDICARE_PUBLIC_KEY_X=\${vault_MEDICARE_PUBLIC_KEY_X}" >> ${APP_PATH}/.env
                            echo "MEDICARE_PUBLIC_KEY_Y=\${vault_MEDICARE_PUBLIC_KEY_Y}" >> ${APP_PATH}/.env
                            echo "PORT=\${vault_PORT}" >> ${APP_PATH}/.env
                            echo "APP_ENV=\${vault_APP_ENV}" >> ${APP_PATH}/.env

                            # Hiển thị thông tin về file .env
                            echo "===== File .env đã được tạo ====="
                            echo "Số lượng biến: \$(grep -v '^#' ${APP_PATH}/.env | wc -l)"
                            echo "Danh sách biến:"
                            grep -v '^#' ${APP_PATH}/.env | cut -d= -f1
                        """

                        def envCount = sh(script: "grep -v '^#' ${APP_PATH}/.env | wc -l", returnStdout: true).trim()

                        if (envCount == "0") {
                            echo "CẢNH BÁO: Không lấy được biến nào từ Vault. Tạo file .env mẫu để tiếp tục..."

                            sh """
                                # Tạo file .env mẫu
                                echo "# Generated .env file (SAMPLE) - \$(date)" > ${APP_PATH}/.env
                                echo "RABBITMQ_USER=guest" >> ${APP_PATH}/.env
                                echo "RABBITMQ_PW=guest" >> ${APP_PATH}/.env
                                echo "RABBITMQ_HOST=rabbitmq" >> ${APP_PATH}/.env
                                echo "RABBITMQ_PORT=5672" >> ${APP_PATH}/.env
                                echo "MEDICARE_PRIVATE_KEY=privatekey" >> ${APP_PATH}/.env
                                echo "MEDICARE_PUBLIC_KEY=publickey" >> ${APP_PATH}/.env
                                echo "MEDICARE_PUBLIC_KEY_X=pubkeyx" >> ${APP_PATH}/.env
                                echo "MEDICARE_PUBLIC_KEY_Y=pubkeyy" >> ${APP_PATH}/.env
                                echo "PORT=10001" >> ${APP_PATH}/.env
                                echo "APP_ENV=development" >> ${APP_PATH}/.env

                                echo "Đã tạo file .env mẫu với các giá trị mặc định"
                            """
                        }
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Đang build Docker image: ${IMAGE_TAG}"

                script {
                    sh "sudo chmod 666 /var/run/docker.sock || true"

                    sh """
                        # Kiểm tra Dockerfile
                        if [ ! -f "${DOCKERFILE_PATH}" ]; then
                            echo "Không tìm thấy Dockerfile tại ${DOCKERFILE_PATH}"
                            exit 1
                        fi

                        # Kiểm tra file .env tồn tại
                        if [ ! -f "${APP_PATH}/.env" ]; then
                            echo "Cảnh báo: Không tìm thấy file .env"
                            exit 1
                        fi

                        # Build Docker image với file .env
                        docker build -t ${IMAGE_TAG} -f ${DOCKERFILE_PATH} ${APP_PATH}
                    """
                }
            }
        }

        stage('Push to Registry') {
            steps {
                echo "Đang đẩy Docker image vào Registry: ${IMAGE_TAG}"

                sh """
                    # Push image vào Registry
                    docker push ${IMAGE_TAG}

                    # Tạo tag latest
                    docker tag ${IMAGE_TAG} ${REGISTRY_URL}/${IMAGE_NAME}:latest
                    docker push ${REGISTRY_URL}/${IMAGE_NAME}:latest
                """
            }
        }

        stage('Deploy with Docker') {
            steps {
                echo "Triển khai container bằng Docker CLI"

                script {
                    def containerName = "${IMAGE_NAME}-app"

                    sh """
                        # Tạo file env-file tạm thời
                        cp ${APP_PATH}/.env ./docker-env-file
                    """

                    sh """
                        # Đảm bảo quyền truy cập Docker
                        sudo chmod 666 /var/run/docker.sock || true

                        # Dừng và xóa container cũ nếu tồn tại
                        if docker ps -a | grep -q ${containerName}; then
                            docker stop ${containerName} || true
                            docker rm ${containerName} || true
                        fi
                    """

                    sh """
                        # Chạy container với các biến môi trường
                        docker run -d \
                            --name ${containerName} \
                            --restart unless-stopped \
                            -p ${SERVICE_PORT}:${SERVICE_PORT} \
                            --env-file ./docker-env-file \
                            ${IMAGE_TAG}

                        # Kiểm tra container đã chạy chưa
                        docker ps | grep ${containerName}

                        # Thông báo thành công
                        echo "Container đã được triển khai thành công!"
                    """

                    sh "rm -f ./docker-env-file"
                }
            }
        }
    }

    post {
        success {
            script {
                echo """
                ===========================================
                ✅ Triển khai thành công!

                - Image: ${IMAGE_TAG}
                - Application URL: http://${SERVICE_DNS}:${SERVICE_PORT}
                - Build ID: ${BUILD_NUMBER}
                - Thời gian: \$(date)
                - Người deploy: dxnghxn203
                ===========================================
                """
            }
        }

        failure {
            echo """
            ===========================================
            ❌ Triển khai thất bại!
            ===========================================
            """
        }

        always {
            sh "rm -f ${APP_PATH}/.env || true"
            sh "rm -f ./docker-env-file || true"
        }
    }
}