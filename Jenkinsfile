pipeline {
    agent any

    environment {
        BACKEND_IMAGE_NAME = "harisankar252000/buy-nest-backend"
        FRONTEND_IMAGE_NAME = "harisankar252000/buy-nest-frontend"
        VERSION = "v1.0.${env.BUILD_NUMBER}"
        IMAGE_TAG = "${VERSION}"
        DOCKERHUB_CREDENTIALS = 'DockerHubAuth'
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
                script {
                    echo "🔐 Creating fresh Kubernetes token using in-cluster service account"

                    def token = sh(
                        script: 'kubectl create token jenkins-serv -n default',
                        returnStdout: true
                    ).trim()

                    def server = sh(
                        script: "kubectl config view -o jsonpath='{.clusters[0].cluster.server}'",
                        returnStdout: true
                    ).trim()

                    def caData = sh(
                        script: "kubectl config view --raw -o jsonpath='{.clusters[0].cluster.certificate-authority-data}'",
                        returnStdout: true
                    ).trim()

                    def kubeconfig = """
apiVersion: v1
kind: Config
clusters:
- cluster:
    server: ${server}
    certificate-authority-data: ${caData}
  name: cluster
contexts:
- context:
    cluster: cluster
    user: jenkins-serv
  name: jenkins-serv-context
current-context: jenkins-serv-context
users:
- name: jenkins-serv
  user:
    token: ${token}
"""

                    writeFile file: 'kubeconfig-temp', text: kubeconfig

                    sh '''
                        echo "🚀 Deploying to Kubernetes..."

                        export BACKEND_IMAGE_NAME=${BACKEND_IMAGE_NAME}
                        export BACKEND_IMAGE_TAG=${IMAGE_TAG}
                        export FRONTEND_IMAGE_NAME=${FRONTEND_IMAGE_NAME}
                        export FRONTEND_IMAGE_TAG=${IMAGE_TAG}

                        envsubst < k8s/buy-nest-backend-deployment.yaml > k8s/backend-deployment-processed.yaml
                        envsubst < k8s/buy-nest-frontend-deployment.yaml > k8s/frontend-deployment-processed.yaml

                        kubectl --kubeconfig=kubeconfig-temp apply -f k8s/backend-deployment-processed.yaml
                        kubectl --kubeconfig=kubeconfig-temp apply -f k8s/frontend-deployment-processed.yaml
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
