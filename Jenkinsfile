pipeline {
  agent any

  parameters {
    string(name: 'BRANCH',  defaultValue: 'main', description: 'Rama del repositorio a ejecutar')
    choice(name: 'PROJECT', choices: ['recargame'], description: 'Paquete/proyecto (packages/<PROJECT>)')
    // Future implementation: choice(name: 'SUITE', choices: ['all','admin','seller'], description: 'Sub-suite opcional')
  }

  options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '20'))
    timeout(time: 30, unit: 'MINUTES')
  }

  tools { nodejs 'node-22' }

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
            # *** Asegura que se instalen devDependencies ***
            export NPM_CONFIG_PRODUCTION=false
            export NODE_ENV=development
            npm ci
            npx -W tsc --version

            # Verificación: debe imprimir versión de TypeScript
            npx -W typescript --version

            npx -W playwright install --with-deps
          '''
          } else {
            bat """
              node -v
              npm -v
              REM *** Asegura que se instalen devDependencies ***
              set NPM_CONFIG_PRODUCTION=false
              set NODE_ENV=development
              npm ci
              npx -W tsc --version

              REM Verificación: debe imprimir versión de TypeScript
              npx -W typescript --version

              npx -W playwright install
            """
          }
        }
      }
    }

    stage('Build framework') {
      steps {
        script {
          if (isUnix()) {
            sh 'npx tsc -p packages/framework/tsconfig.json'
          } else {
            bat 'npx tsc -p packages\\framework\\tsconfig.json'
          }
        }
      }
    }

    stage('Run tests (project via root)') {
      steps {
        script {
          if (isUnix()) {
            sh """
              npx -W playwright test \
                --config=packages/${params.PROJECT}/playwright.config.ts \
                --reporter=junit,html \
                --output=packages/${params.PROJECT}/test-results
            """
          } else {
            bat """
              npx -W playwright test ^
                --config=packages/${params.PROJECT}/playwright.config.ts ^
                --reporter=junit,html ^
                --output=packages/${params.PROJECT}/test-results
            """
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

  post { always { cleanWs(deleteDirs: true, notFailBuild: true) } }
}
