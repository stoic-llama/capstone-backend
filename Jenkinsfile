def getCommitSha() {
    return sh(returnStdout: true, script: "git rev-parse HEAD | tr -d '\n'")
}

def getPrevCommitShaForRollback(int count) {
    return sh(returnStdout: true, script: "git rev-parse HEAD~$count | tr -d '\n'")
}

pipeline {
    agent any
    environment {
        version = getCommitSha() // '1.1'
        containerName = 'capstone-backend'

        // Get the SHA of the previous commit
        previousVersion = getPrevCommitShaForRollback(1)
    }

    stages {
        stage("build application") {
            steps {
                /******************************************
                 ********** Login to Digital Ocean ********
                 ******************************************/
                echo 'authenticating into Digital Ocean repository...'
                sh 'docker login registry.digitalocean.com'
                
                // note you need to manually add token for capstone-ccsu once 
                // in Jenkins conatiner that is in the droplet
                // Refer to "API" tab in Digital Ocean
                sh 'doctl auth init --context capstone-ccsu'  

                /******************************************
                 ************ Compile and Build ***********
                 ******************************************/
                echo 'building the application...'
                sh 'doctl registry repo list-v2'
                sh "docker build -t capstone-backend:${version} ."
                sh "docker tag capstone-backend:${version} registry.digitalocean.com/capstone-ccsu/capstone-backend:${version}"
                sh "docker push registry.digitalocean.com/capstone-ccsu/capstone-backend:${version}"
                sh 'doctl registry repo list-v2'
            }
        }

        stage("deploy to quality") {
            steps {
                echo 'deploying to quality environment...'    

                script {
                    // Check if the container exists 
                        // --> If yes, stop and remove it
                        // --> If no, display result true for both stop and rm command, no harm done 
                    // Then let Jenkins continue
                    def containerStopped = sh(script: 'docker stop ${containerName}', returnStatus: true) == 0

                    echo "docker stop command was finished successfully: $containerStopped"

                    def containerRemoved = sh(script: 'docker rm ${containerName}', returnStatus: true) == 0

                    echo "docker rm command was finished successfully: $containerRemoved"
                }

                // Use the withCredentials block to access the credentials
                // Note: need --rm when docker run.. so that docker stop can kill it cleanly
                withCredentials([
                    string(credentialsId: 'mongodb', variable: 'MONGODB'),
                ]) {
                    sh '''
                        docker run -d \
                        -p 5000:5000 \
                        -e DATABASE_URL=${MONGODB} \
                        --name capstone-backend \
                        --network helpmybabies \
                        registry.digitalocean.com/capstone-ccsu/capstone-backend:${version}

                        docker ps
                    '''                    
                }
            }
        }

        stage("test") {
            steps {
                // Code Review - Code Complexity
                // Source Lines of Code
                sh '''
                    echo "linting and testing..."

                    docker exec jenkins sh -c "
                        git clone https://github.com/stoic-llama/capstone-backend.git ~/Projects/capstone/
                        
                        ls ~/Projects/capstone/
                    "
                '''

                sh '''
                    docker exec jenkins sh -c "
                        docker run --rm -v ~/Projects/capstone-backend:/project aldanial/cloc \
                        --by-file \
                        --exclude-dir=node_modules,.vscode,.VSCodeCounter,Archive,coverage,tests \
                        --include-lang=JavaScript \
                        /project
                    "
                '''

                sh '''
                    docker exec jenkins sh -c "rm -r ~/Projects/capstone-backend"
                '''

                // Code Review - Code Complexity
                // McCabe's Cyclomatic Cycle
                sh '''
                    docker exec capstone-backend sh -c "npm run eslint"
                '''                


                // Unit Tests
                sh '''
                    docker exec capstone-backend sh -c "npm run test"
                '''

                // Integration Tests
                // TODO: Modify in test server to be Product API specific
                sh '''
                    #!/bin/bash

                    echo "Initiate end to end testing..."
                    
                    # Check if cURL command is available (required), abort if it does not exist
                    if ! type curl >/dev/null 2>&1; then
                        echo >&2 "Required curl but it's not installed. Aborting."
                        exit 1
                    fi
                    
                    # Perform GET Request
                    response=$(curl -s 'http://104.236.196.52:9000/api/v1/e2e')
                    echo ${response}

                    # Check if the response contains "Success"
                    if [ $response = "Success" ]; then
                        message="Success"
                    else
                        message="Failed"
                    fi

                    # Print Response in Jenkins Console
                    echo "Test Result: $message" 
                '''
            }
        }


        stage("production approval") {
            steps {
                echo 'getting approval to go to production...'
        
                emailext (
                    subject: "APPROVAL REQUIRED: ${JOB_NAME} build ${BUILD_DISPLAY_NAME}",
                    body:   '''     
                                    <html>
                                        <body>
                                            <a href="${BUILD_URL}console">Go to approval page</a>
                                        </body>
                                    </html>
                            ''',
                    to: 'infantformulafinder+approvers@gmail.com',
                    mimeType: 'text/html'
                )    

                input (
                    message: 'Approve to go to production?', 
                    ok: 'Approve'
                )
            }
        }

        stage("deploy to production") {
            steps {
                echo 'deploying to production environment...' 

                withCredentials([
                    string(credentialsId: 'website', variable: 'WEBSITE'),
                ]) {
                    script {
                        // Use SSH to check if the container exists 
                            // --> If yes, stop and remove it
                            // --> If no, display result true for both stop and rm command, no harm done 
                        // Then let Jenkins continue
                        def containerStopped = sh(script: 'ssh -i /var/jenkins_home/.ssh/website_deploy_rsa_key "${WEBSITE}" docker stop ${containerName}', returnStatus: true) == 0

                        echo "docker stop command was finished successfully: $containerStopped"

                        def containerRemoved = sh(script: 'ssh -i /var/jenkins_home/.ssh/website_deploy_rsa_key "${WEBSITE}" docker rm ${containerName}', returnStatus: true) == 0

                        echo "docker rm command was finished successfully: $containerRemoved"
                    }
                }

                // Use the withCredentials block to access the credentials
                // Note: need --rm when docker run.. so that docker stop can kill it cleanly
                withCredentials([
                    string(credentialsId: 'website', variable: 'WEBSITE'),
                    string(credentialsId: 'mongodb', variable: 'MONGODB'),
                ]) {
                    sh '''
                        ssh -i /var/jenkins_home/.ssh/website_deploy_rsa_key ${WEBSITE} "docker run -d \
                        -p 5000:5000 \
                        -e DATABASE_URL=${MONGODB} \
                        --name capstone-backend \
                        --network helpmybabies \
                        registry.digitalocean.com/capstone-ccsu/capstone-backend:${version}

                        docker ps
                        "
                    '''                    
                }
            }
        }
    }

    post {
        always {
            echo "Release finished and start clean up"
            deleteDir() // the actual folder with the downloaded project code is deleted from build server
        }
        success {
            echo "Release Success"
        }
        failure {
            script {
                echo "Release Failed, rolling back to the version of container prior to this release"
                
                // Check if the container exists 
                    // --> If yes, stop and remove it
                    // --> If no, display result true for both stop and rm command, no harm done 
                // Then let Jenkins continue
                def containerStopped = sh(script: 'docker stop ${containerName}', returnStatus: true) == 0
                echo "docker stop command was finished successfully: $containerStopped"
                def containerRemoved = sh(script: 'docker rm ${containerName}', returnStatus: true) == 0
                echo "docker rm command was finished successfully: $containerRemoved"
            
                // Use the withCredentials block to access the credentials
                // Note: need --rm when docker run.. so that docker stop can kill it cleanly
                withCredentials([
                    string(credentialsId: 'website', variable: 'WEBSITE'),
                    string(credentialsId: 'mongodb', variable: 'MONGODB'),
                ]) {
                    sh '''
                        docker run -d \
                        -p 5000:5000 \
                        -e DATABASE_URL=${MONGODB} \
                        --name capstone-backend \
                        --network helpmybabies \
                        registry.digitalocean.com/capstone-ccsu/capstone-backend:${previousVersion}

                        docker ps
                    '''                    
                }
            }        
        }
        cleanup {
            echo "Clean up in post workspace" 
            cleanWs() // any reference this particular build is deleted from the agent
        }
    }

}