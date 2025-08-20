pipeline {
  agent any

  parameters {
    string(name: 'BRANCH',  defaultValue: 'main', description: 'Rama del repositorio a ejecutar')
    choice(name: 'PROJECT', choices: ['recargame'], description: 'Paquete/proyecto a probar (packages/<PROJECT>)')
    // Future implementation -> choice(name: 'SUITE', choices: ['all','admin','seller'], description: 'Sub-suite del proyecto')
  }

  options {
    timestamps()
    ansiColor('xterm')
    buildDiscarder(logRotator(numToKeepStr: '20'))
    timeout(time: 30, unit: 'MINUTES')
  }

  tools {
    nodejs 'node-22'
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: "${params.BRANCH}", url: 'https://github.com/Silver-Slade/PlaytechProjectsAutomatedTest.git'
      }
    }

    stage('Install deps (root) & browsers') {
      steps {
        script {
          if (isUnix()) {
            sh '''
              node -v
              npm -v
              npm ci
              npx -W playwright install --with-deps
            '''
          } else {
            bat """
              node -v
              npm -v
              npm ci
              npx -W playwright install
            """
          }
        }
      }
    }

    stage('Run tests (workspace)') {
      steps {
        script {
          dir("packages/${params.PROJECT}") {
            if (isUnix()) {
              sh 'npm run test -- --reporter=junit,html'
            } else {
              bat 'npm run test -- --reporter=junit,html'
            }
          }
        }
      }
      post {
        always {
          junit allowEmptyResults: true, testResults: "packages/${params.PROJECT}/test-results/*.xml"

          publishHTML(target: [
            reportDir: "packages/${params.PROJECT}/playwright-report",
            reportFiles: 'index.html',
            reportName: "Playwright Report (${params.PROJECT})",
            keepAll: true,
            alwaysLinkToLastBuild: true,
            allowMissing: true
          ])

          archiveArtifacts artifacts: "packages/${params.PROJECT}/test-results/**, packages/${params.PROJECT}/playwright-report/**",
                           fingerprint: true, allowEmptyArchive: true
        }
      }
    }
  }

  post {
    always {
      cleanWs(deleteDirs: true, notFailBuild: true)
    }
  }
}
