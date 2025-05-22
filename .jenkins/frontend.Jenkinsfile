pipeline {
    agent any

    environment {
        // Cấu hình Registry
        REGISTRY_URL = '159.65.7.99:5000'
        IMAGE_NAME = 'frontend'
        IMAGE_TAG = "${REGISTRY_URL}/${IMAGE_NAME}:${BUILD_NUMBER}"

        // Đường dẫn đến mã nguồn
        APP_PATH = 'frontend'  // Đường dẫn tới thư mục frontend
        DOCKERFILE_PATH = "${APP_PATH}/Dockerfile"

        // Thông tin Git repository
        GIT_REPO = 'https://github.com/dxnghxn203/KLTN_2025.git'
        GIT_BRANCH = 'demo-deploy'

        // Cấu hình Vault
        VAULT_ADDR = 'http://localhost:8200'
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "Lấy mã nguồn từ ${GIT_REPO}, nhánh: ${GIT_BRANCH}"

                // Xóa workspace cũ
                cleanWs()

                // Checkout code
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
                                    [vaultKey: 'NEXT_PUBLIC_API_URL', envVar: 'vault_NEXT_PUBLIC_API_URL'],
                                    [vaultKey: 'NEXT_PUBLIC_RECOMMENDATION_API', envVar: 'vault_NEXT_PUBLIC_RECOMMENDATION_API'],

                                    [vaultKey: 'NEXT_PUBLIC_WEBHOOK_TOKEN', envVar: 'vault_NEXT_PUBLIC_WEBHOOK_TOKEN'],
                                    [vaultKey: 'NEXT_PUBLIC_WEBSOCKET_URL', envVar: 'vault_NEXT_PUBLIC_WEBSOCKET_URL'],
                                    [vaultKey: 'NEXTAUTH_SECRET', envVar: 'vault_NEXTAUTH_SECRET'],
                                    [vaultKey: 'GOOGLE_CLIENT_SECRET', envVar: 'vault_GOOGLE_CLIENT_SECRET'],
                                    [vaultKey: 'GOOGLE_CLIENT_ID', envVar: 'vault_GOOGLE_CLIENT_ID']
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
                            echo "NEXT_PUBLIC_API_URL=\${vault_NEXT_PUBLIC_API_URL}" >> ${APP_PATH}/.env
                            echo "NEXT_PUBLIC_RECOMMENDATION_API=\${vault_NEXT_PUBLIC_RECOMMENDATION_API}" >> ${APP_PATH}/.env

                            # Thêm các biến môi trường mới
                            echo "NEXT_PUBLIC_WEBHOOK_TOKEN=\${vault_NEXT_PUBLIC_WEBHOOK_TOKEN}" >> ${APP_PATH}/.env
                            echo "NEXT_PUBLIC_WEBSOCKET_URL=\${vault_NEXT_PUBLIC_WEBSOCKET_URL}" >> ${APP_PATH}/.env
                            echo "NEXTAUTH_SECRET=\${vault_NEXTAUTH_SECRET}" >> ${APP_PATH}/.env
                            echo "GOOGLE_CLIENT_SECRET=\${vault_GOOGLE_CLIENT_SECRET}" >> ${APP_PATH}/.env
                            echo "GOOGLE_CLIENT_ID=\${vault_GOOGLE_CLIENT_ID}" >> ${APP_PATH}/.env

                            # Thêm NEXTAUTH_URL - quan trọng cho NextAuth.js
                            echo "NEXTAUTH_URL=http://159.65.7.99" >> ${APP_PATH}/.env

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
                                echo "NEXT_PUBLIC_API_URL=http://159.65.7.99" >> ${APP_PATH}/.env
                                echo "NEXT_PUBLIC_RECOMMENDATION_API=http://159.65.7.99/recommendation" >> ${APP_PATH}/.env

                                # Giá trị mẫu cho các biến môi trường mới
                                echo "NEXT_PUBLIC_WEBHOOK_TOKEN=sample_webhook_token_123" >> ${APP_PATH}/.env
                                echo "NEXT_PUBLIC_WEBSOCKET_URL=ws://159.65.7.99/ws" >> ${APP_PATH}/.env
                                echo "NEXTAUTH_SECRET=7d01f7f7f1afe3f9908b7d04eef337c5" >> ${APP_PATH}/.env
                                echo "GOOGLE_CLIENT_SECRET=GOCSPX-sample-secret" >> ${APP_PATH}/.env
                                echo "GOOGLE_CLIENT_ID=12345678-sample.apps.googleusercontent.com" >> ${APP_PATH}/.env
                                echo "NEXTAUTH_URL=http://159.65.7.99" >> ${APP_PATH}/.env

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

                        # Copy file .env.production từ .env cho NextJS
                        cp ${APP_PATH}/.env ${APP_PATH}/.env.production

                        # Build Docker image - NextJS multi-stage build
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
                        # Đảm bảo quyền truy cập Docker
                        sudo chmod 666 /var/run/docker.sock || true

                        # Dừng và xóa container cũ nếu tồn tại
                        if docker ps -a | grep -q ${containerName}; then
                            docker stop ${containerName} || true
                            docker rm ${containerName} || true
                        fi
                    """

                    sh """
                        # Chạy container
                        docker run -d \
                            --name ${containerName} \
                            --restart unless-stopped \
                            -p 3000:3000 \
                            ${IMAGE_TAG}

                        # Kiểm tra container đã chạy chưa
                        docker ps | grep ${containerName}

                        # Thông báo thành công
                        echo "Container đã được triển khai thành công!"
                    """
                }
            }
        }

        stage('Configure Nginx') {
            steps {
                echo "Cấu hình Nginx cho Frontend"

                sh '''
                    cat << 'EOF' | sudo tee /etc/nginx/sites-available/frontend
server {
    listen 80;
    server_name 159.65.7.99;

    # Cấu hình cho Frontend (NextJS)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Để API paths còn hoạt động
    location /tracking-api/ {
        proxy_pass http://localhost:8001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /payment/ {
        proxy_pass http://localhost:8002/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /recommendation/ {
        proxy_pass http://localhost:8003/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket path for real-time features
    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    # Cấu hình để serve static files (tối ưu hóa)
    location /_next/static/ {
        proxy_pass http://localhost:3000/_next/static/;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /static/ {
        proxy_pass http://localhost:3000/static/;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
EOF
                '''

                sh 'sudo ln -sf /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/'

                script {
                    def nginxCheckResult = sh(script: 'sudo nginx -t', returnStatus: true)
                    if (nginxCheckResult == 0) {
                        sh 'sudo systemctl reload nginx'
                        echo "Nginx đã được cấu hình thành công!"
                    } else {
                        error "Lỗi cấu hình Nginx. Vui lòng kiểm tra lại."
                    }
                }
            }
        }
    }

    post {
        success {
            script {
                // Tạo thông báo thành công với thông tin build
                echo """
                ===========================================
                ✅ Triển khai thành công!

                - Image: ${IMAGE_TAG}
                - Frontend URL: http://159.65.7.99
                - Build ID: ${BUILD_NUMBER}
                - Thời gian: \$(date)
                ===========================================
                """
            withCredentials([
                                string(credentialsId: 'telegram-bot-token', variable: 'BOT_TOKEN'),
                                string(credentialsId: 'telegram-chat-id', variable: 'CHAT_ID')
                            ]) {
                                sh '''
                                    curl -s -X POST https://api.telegram.org/bot${BOT_TOKEN}/sendMessage \
                                    -d chat_id=${CHAT_ID} \
                                    -d text="✅ DEPLOY THÀNH CÔNG! 🎉

                            🚀 Ứng dụng: ''' + "${IMAGE_NAME}" + '''
                            📦 Image: ''' + "${IMAGE_TAG}" + '''
                            🔢 Build: #''' + "${BUILD_NUMBER}" + '''
                            👨‍💻 Người deploy: dxnghxn203
                            ⏰ Thời gian: $(date)"
                                '''
                            }

                        }
                    }

                    failure {
                        echo """
                        ===========================================
                        ❌ Triển khai thất bại!
                        ===========================================
                        """
                        withCredentials([
                            string(credentialsId: 'telegram-bot-token', variable: 'BOT_TOKEN'),
                            string(credentialsId: 'telegram-chat-id', variable: 'CHAT_ID')
                        ]) {
                            sh '''
                                curl -s -X POST https://api.telegram.org/bot${BOT_TOKEN}/sendMessage \
                                -d chat_id=${CHAT_ID} \
                                -d text="❌ DEPLOY THẤT BẠI! 🚫

                        🚀 Ứng dụng: ''' + "${IMAGE_NAME}" + '''
                        🔢 Build: #''' + "${BUILD_NUMBER}" + '''
                        👨‍💻 Người deploy: dxnghxn203
                        ⏰ Thời gian: $(date)

                        🔍 Xem chi tiết lỗi tại: ''' + "${BUILD_URL}" + '''console"
                            '''
                        }
                    }

        always {
            // Dọn dẹp workspace - đặc biệt là xóa file .env
            sh "rm -f ${APP_PATH}/.env ${APP_PATH}/.env.production || true"
        }
    }
}