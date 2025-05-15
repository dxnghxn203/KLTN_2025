pipeline {
    agent any

    environment {
        VAULT_CREDENTIAL_ID = 'vault-dev-secretid-for-dotenv'
        VAULT_URL = 'http://localhost:8200'
        VAULT_SECRET_PATH = 'secret/.env'
    }

    stages {
        stage('Read and Print .env from Vault') {
            steps {
                script {
                    echo "Attempting to read all key-values from Vault path: ${env.VAULT_SECRET_PATH}"
                    echo "Vault URL: ${env.VAULT_URL}"
                    echo "Using Credential ID: ${env.VAULT_CREDENTIAL_ID}"

                    try {
                        def secretData = readVault(
                            secretPath: env.VAULT_SECRET_PATH,
                            vaultUrl: env.VAULT_URL,
                            vaultCredentialId: env.VAULT_CREDENTIAL_ID,
                            engineVersion: 2
                        )

                        if (secretData == null || secretData.isEmpty()) {
                            error "No data retrieved from Vault at path ${env.VAULT_SECRET_PATH} or data is empty."
                        }

                        echo "Successfully retrieved ${secretData.size()} key-value pairs from Vault."

                        def envFileContent = secretData.collect { key, value ->
                            def formattedValue = value.toString()
                            if (formattedValue.contains(' ') || formattedValue.contains('#') || formattedValue.contains('=')) {
                                formattedValue = "\"${formattedValue.replaceAll('"', '\\\\"')}\""
                            }
                            "${key}=${formattedValue}"
                        }.join('\n')

                        echo "--- Start of .env content ---"
                        echo envFileContent
                        echo "--- End of .env content ---"

                    } catch (e) {
                        error "Error reading from Vault or formatting .env content: ${e.getMessage()}"
                    }
                }
            }
        }
    }
    post {
        always {
            echo "Vault read test finished."
        }
    }
}