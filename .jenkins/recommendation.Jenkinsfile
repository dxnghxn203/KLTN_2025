pipeline {
    agent any

    environment {
        REGISTRY_URL = '159.65.7.99:5000'
        IMAGE_NAME = 'recommendation-api'
        IMAGE_TAG = "${REGISTRY_URL}/${IMAGE_NAME}:${BUILD_NUMBER}"

        APP_PATH = 'tracking-manager/packages/recommendation'
        DOCKERFILE_PATH = "${APP_PATH}/Dockerfile"

        GIT_REPO = 'https://github.com/dxnghxn203/KLTN_2025.git'
        GIT_BRANCH = 'demo-deploy'

        VAULT_ADDR = 'http://localhost:8200'
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
                                    [vaultKey: 'ALGORITHM', envVar: 'vault_ALGORITHM'],
                                    [vaultKey: 'API_MONGO_DB', envVar: 'vault_API_MONGO_DB'],
                                    [vaultKey: 'API_MONGO_PWS', envVar: 'vault_API_MONGO_PWS'],
                                    [vaultKey: 'API_MONGO_USER', envVar: 'vault_API_MONGO_USER'],
                                    [vaultKey: 'ES_HOST', envVar: 'vault_ES_HOST'],
                                    [vaultKey: 'ES_PORT', envVar: 'vault_ES_PORT'],
                                    [vaultKey: 'ES_PW', envVar: 'vault_ES_PW'],
                                    [vaultKey: 'ES_USER', envVar: 'vault_ES_USER'],
                                    [vaultKey: 'GMAIL_PASS', envVar: 'vault_GMAIL_PASS'],
                                    [vaultKey: 'GMAIL_USER', envVar: 'vault_GMAIL_USER'],
                                    [vaultKey: 'JWT_PRIVATE_KEY', envVar: 'vault_JWT_PRIVATE_KEY'],
                                    [vaultKey: 'JWT_PUBLIC_KEY', envVar: 'vault_JWT_PUBLIC_KEY'],
                                    [vaultKey: 'MONGO_HOST', envVar: 'vault_MONGO_HOST'],
                                    [vaultKey: 'PAYMENT_API_URL', envVar: 'vault_PAYMENT_API_URL'],
                                    [vaultKey: 'RABBITMQ_HOST', envVar: 'vault_RABBITMQ_HOST'],
                                    [vaultKey: 'RABBITMQ_PORT', envVar: 'vault_RABBITMQ_PORT'],
                                    [vaultKey: 'RABBITMQ_PW', envVar: 'vault_RABBITMQ_PW'],
                                    [vaultKey: 'RABBITMQ_USER', envVar: 'vault_RABBITMQ_USER'],
                                    [vaultKey: 'RABBITMQ_VHOST', envVar: 'vault_RABBITMQ_VHOST'],
                                    [vaultKey: 'REDIS_HOST', envVar: 'vault_REDIS_HOST'],
                                    [vaultKey: 'REDIS_PASSWORD', envVar: 'vault_REDIS_PASSWORD'],
                                    [vaultKey: 'REDIS_PORT', envVar: 'vault_REDIS_PORT'],
                                    [vaultKey: 'SUPABASE_PASS', envVar: 'vault_SUPABASE_PASS'],
                                    [vaultKey: 'SUPABASE_key', envVar: 'vault_SUPABASE_key'],
                                    [vaultKey: 'SUPABSE_URL', envVar: 'vault_SUPABSE_URL']
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
                            echo "ALGORITHM=\${vault_ALGORITHM}" >> ${APP_PATH}/.env
                            echo "API_MONGO_DB=\${vault_API_MONGO_DB}" >> ${APP_PATH}/.env
                            echo "API_MONGO_PWS=\${vault_API_MONGO_PWS}" >> ${APP_PATH}/.env
                            echo "API_MONGO_USER=\${vault_API_MONGO_USER}" >> ${APP_PATH}/.env
                            echo "ES_HOST=\${vault_ES_HOST}" >> ${APP_PATH}/.env
                            echo "ES_PORT=\${vault_ES_PORT}" >> ${APP_PATH}/.env
                            echo "ES_PW=\${vault_ES_PW}" >> ${APP_PATH}/.env
                            echo "ES_USER=\${vault_ES_USER}" >> ${APP_PATH}/.env
                            echo "GMAIL_PASS=\${vault_GMAIL_PASS}" >> ${APP_PATH}/.env
                            echo "GMAIL_USER=\${vault_GMAIL_USER}" >> ${APP_PATH}/.env
                            echo "JWT_PRIVATE_KEY=\${vault_JWT_PRIVATE_KEY}" >> ${APP_PATH}/.env
                            echo "JWT_PUBLIC_KEY=\${vault_JWT_PUBLIC_KEY}" >> ${APP_PATH}/.env
                            echo "MONGO_HOST=\${vault_MONGO_HOST}" >> ${APP_PATH}/.env
                            echo "PAYMENT_API_URL=\${vault_PAYMENT_API_URL}" >> ${APP_PATH}/.env
                            echo "RABBITMQ_HOST=\${vault_RABBITMQ_HOST}" >> ${APP_PATH}/.env
                            echo "RABBITMQ_PORT=\${vault_RABBITMQ_PORT}" >> ${APP_PATH}/.env
                            echo "RABBITMQ_PW=\${vault_RABBITMQ_PW}" >> ${APP_PATH}/.env
                            echo "RABBITMQ_USER=\${vault_RABBITMQ_USER}" >> ${APP_PATH}/.env
                            echo "RABBITMQ_VHOST=\${vault_RABBITMQ_VHOST}" >> ${APP_PATH}/.env
                            echo "REDIS_HOST=\${vault_REDIS_HOST}" >> ${APP_PATH}/.env
                            echo "REDIS_PASSWORD=\${vault_REDIS_PASSWORD}" >> ${APP_PATH}/.env
                            echo "REDIS_PORT=\${vault_REDIS_PORT}" >> ${APP_PATH}/.env
                            echo "SUPABASE_PASS=\${vault_SUPABASE_PASS}" >> ${APP_PATH}/.env
                            echo "SUPABASE_key=\${vault_SUPABASE_key}" >> ${APP_PATH}/.env
                            echo "SUPABSE_URL=\${vault_SUPABSE_URL}" >> ${APP_PATH}/.env

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
                                echo "ALGORITHM=HS256" >> ${APP_PATH}/.env
                                echo "API_MONGO_DB=recommendation_api" >> ${APP_PATH}/.env
                                echo "API_MONGO_PWS=admin123" >> ${APP_PATH}/.env
                                echo "API_MONGO_USER=admin" >> ${APP_PATH}/.env
                                echo "ES_HOST=elasticsearch" >> ${APP_PATH}/.env
                                echo "ES_PORT=9200" >> ${APP_PATH}/.env
                                echo "ES_PW=elastic123" >> ${APP_PATH}/.env
                                echo "ES_USER=elastic" >> ${APP_PATH}/.env
                                echo "GMAIL_PASS=apppassword" >> ${APP_PATH}/.env
                                echo "GMAIL_USER=example@gmail.com" >> ${APP_PATH}/.env
                                echo "JWT_PRIVATE_KEY=privatekey" >> ${APP_PATH}/.env
                                echo "JWT_PUBLIC_KEY=publickey" >> ${APP_PATH}/.env
                                echo "MONGO_HOST=mongodb" >> ${APP_PATH}/.env
                                echo "PAYMENT_API_URL=https://api.payment.com" >> ${APP_PATH}/.env
                                echo "RABBITMQ_HOST=rabbitmq" >> ${APP_PATH}/.env
                                echo "RABBITMQ_PORT=5672" >> ${APP_PATH}/.env
                                echo "RABBITMQ_PW=guest" >> ${APP_PATH}/.env
                                echo "RABBITMQ_USER=guest" >> ${APP_PATH}/.env
                                echo "RABBITMQ_VHOST=/" >> ${APP_PATH}/.env
                                echo "REDIS_HOST=redis" >> ${APP_PATH}/.env
                                echo "REDIS_PASSWORD=" >> ${APP_PATH}/.env
                                echo "REDIS_PORT=6379" >> ${APP_PATH}/.env
                                echo "SUPABASE_PASS=password" >> ${APP_PATH}/.env
                                echo "SUPABASE_key=key" >> ${APP_PATH}/.env
                                echo "SUPABSE_URL=https://yourproject.supabase.co" >> ${APP_PATH}/.env

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
                            -p 8003:80 \
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
                - Application URL: http://159.65.7.99:8003
                - Build ID: ${BUILD_NUMBER}
                - Thời gian: \$(date)
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