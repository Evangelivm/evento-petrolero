pipeline {
    agent any
    environment {
        CLOUDINARY_CLOUD_NAME = credentials('cloudinary-cloud-name')
        CLOUDINARY_API_KEY = credentials('cloudinary-api-key')
        CLOUDINARY_API_SECRET = credentials('cloudinary-api-secret')
        CLOUDINARY_URL = credentials('cloudinary-url')
        NEXT_PUBLIC_API_URL = credentials('next-public-api-url')
    }
    stages {
        stage('Preparar entorno') {
            steps {
                echo '🔹 STAGE 1: Deteniendo contenedores anteriores y limpiando'
                sh '''
                cd /var/jenkins_home/workspace/front/evento-petrolero
                docker compose down || echo "No había contenedores corriendo"
                '''
            }
        }
        
        stage('Obtener código') {
            steps {
                echo '🔹 STAGE 2: Obteniendo última versión del código'
                sh '''
                cd /var/jenkins_home/workspace/front/evento-petrolero
                git pull origin master
                echo "✅ Código actualizado"
                '''
            }
        }
        
        stage('Construir imagen') {
            steps {
                echo '🔹 STAGE 3: Construyendo imagen Docker con variables de entorno'
                sh '''
                cd /var/jenkins_home/workspace/front/evento-petrolero
                docker compose build --no-cache \
                    --build-arg CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME} \
                    --build-arg CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY} \
                    --build-arg CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET} \
                    --build-arg CLOUDINARY_URL=${CLOUDINARY_URL} \
                    --build-arg NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
                echo "✅ Imagen construida exitosamente"
                '''
            }
        }
        
        stage('Desplegar') {
            steps {
                echo '🔹 STAGE 4: Iniciando contenedores'
                sh '''
                cd /var/jenkins_home/workspace/front/evento-petrolero
                docker compose up -d
                echo "🚀 Aplicación desplegada en http://<tu-servidor>:3001"
                '''
            }
        }
        
        stage('Verificación') {
            steps {
                echo '🔹 STAGE 5: Comprobando estado del contenedor'
                sh '''
                cd /var/jenkins_home/workspace/front/evento-petrolero
                docker ps --filter "name=app" --format "{{.Status}}"
                '''
                echo "✔️ Pipeline completado"
            }
        }
    }
    
    post {
        failure {
            echo '❌ Pipeline fallido - Revisar logs'
            slackSend channel: '#alertas', message: "Falló el deploy de evento-petrolero: ${BUILD_URL}"
        }
        success {
            echo '🎉 ¡Despliegue exitoso!'
        }
    }
}