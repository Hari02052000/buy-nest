pipeline {
    agent any

    environment {
        BACKEND_IMAGE_NAME = "harisankar252000/buy-nest-backend"
        FRONTEND_IMAGE_NAME = "harisankar252000/buy-nest-frontend"
        VERSION = "v1.0.${env.BUILD_NUMBER}"
        IMAGE_TAG = "${VERSION}"
        DOCKERHUB_CREDENTIALS = 'DockerHubAuth'
        KUBECONFIG_CREDENTIALS = 'kubeConfig'     
    }

    stages {

        stage('Build & Push Backend Image') {
            steps {
                dir('backend') {
                    script {
                        docker.withRegistry('', DOCKERHUB_CREDENTIALS) {
                            sh """
                                docker build -t ${BACKEND_IMAGE_NAME}:${IMAGE_TAG} -t ${BACKEND_IMAGE_NAME}:latest .
                                docker push ${BACKEND_IMAGE_NAME}:${IMAGE_TAG}
                                docker push ${BACKEND_IMAGE_NAME}:latest
                            """
                        }
                    }
                }
            }
        }

        stage('Build & Push Frontend Image') {
            steps {
                dir('frontend') {
                    script {
                        docker.withRegistry('', DOCKERHUB_CREDENTIALS) {
                            sh """
                                docker build -t ${FRONTEND_IMAGE_NAME}:${IMAGE_TAG} -t ${FRONTEND_IMAGE_NAME}:latest .
                                docker push ${FRONTEND_IMAGE_NAME}:${IMAGE_TAG}
                                docker push ${FRONTEND_IMAGE_NAME}:latest
                            """
                        }
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: KUBECONFIG_CREDENTIALS, variable: 'KUBECONFIG')]) {
                    sh '''
                        export BACKEND_IMAGE_NAME=${BACKEND_IMAGE_NAME}
                        export BACKEND_IMAGE_TAG=${IMAGE_TAG}
                        export FRONTEND_IMAGE_NAME=${FRONTEND_IMAGE_NAME}
                        export FRONTEND_IMAGE_TAG=${IMAGE_TAG}

                        envsubst < k8s/backend-deployment.yaml > k8s/backend-deployment-processed.yaml
                        envsubst < k8s/frontend-deployment.yaml > k8s/frontend-deployment-processed.yaml

                        kubectl apply -f k8s/backend-deployment-processed.yaml
                        kubectl apply -f k8s/frontend-deployment-processed.yaml
                    '''
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
