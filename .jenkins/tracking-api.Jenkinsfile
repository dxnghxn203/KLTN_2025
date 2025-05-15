// CHỈ ĐỂ TEST LẤY MỘT KEY - KHÔNG GIẢI QUYẾT YÊU CẦU LẤY TẤT CẢ
pipeline {
    agent any

    environment {
        VAULT_CREDENTIAL_ID = 'vault-dev-secretid-for-dotenv'
        VAULT_URL = 'http://localhost:8200'
        VAULT_SECRET_PATH = 'secret/.env'
        VAULT_KEY_TO_TEST = 'API_MONGO_DB'
    }

    stages {
        stage('Test Retrieve Single Key from Vault') {
            steps {
                script {
                    echo "Attempting to read SINGLE key '${env.VAULT_KEY_TO_TEST}' from Vault path: ${env.VAULT_SECRET_PATH}"
                    echo "Vault URL: ${env.VAULT_URL}"
                    echo "Using Credential ID: ${env.VAULT_CREDENTIAL_ID}"

                    try {
                        withVault(
                            url: env.VAULT_URL,
                            credentialsId: env.VAULT_CREDENTIAL_ID,
                            engineVersion: 2,
                            vaultSecrets: [
                                [
                                    path: env.VAULT_SECRET_PATH,
                                    secretValues: [
                                        [envVar: 'TEST_SECRET_VALUE', vaultKey: env.VAULT_KEY_TO_TEST]
                                    ]
                                ]
                            ]
                        ) {
                            if (env.TEST_SECRET_VALUE != null && !env.TEST_SECRET_VALUE.isEmpty()) {
                                echo "Successfully retrieved value for '${env.VAULT_KEY_TO_TEST}': ${env.TEST_SECRET_VALUE}"
                            } else {
                                echo "Value for '${env.VAULT_KEY_TO_TEST}' is null or empty after Vault call."
                                error "Failed to retrieve a value for ${env.VAULT_KEY_TO_TEST}."
                            }
                        }
                    } catch (e) {
                        error "Error during withVault call: ${e.getMessage()}"
                    }
                }
            }
        }
    }
    post {
        always {
            echo "Vault single key read test finished."
        }
    }
}