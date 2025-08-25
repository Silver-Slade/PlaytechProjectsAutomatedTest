pipeline {
  agent any

  parameters {
    string(name: 'BRANCH',  defaultValue: 'main', description: 'Rama del repositorio a ejecutar')
    choice(name: 'PROJECT', choices: ['recargame'], description: 'Paquete/proyecto (packages/<PROJECT>)')
    // Future implementation: choice(name: 'SUITE', choices: ['all','admin','seller'], description: 'Sub-suite opcional')
    string(name: 'BASE_URL_ADMIN',  defaultValue: 'http://pruebas.recargameonline.co/Recargame/index.php',  description: 'URL admin')
    string(name: 'BASE_URL_SELLER', defaultValue: 'http://pruebas.recargameonline.co/RecargamePos/index.php', description: 'URL seller')
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
              export NPM_CONFIG_PRODUCTION=false
              export NODE_ENV=development
              npm ci

              if [ ! -f node_modules/typescript/bin/tsc ]; then
                echo "TypeScript no encontrado, instalando..."
                npm install --save-dev typescript
              else
                echo "TypeScript ya está instalado."
              fi

              npm list typescript || echo "TypeScript no está instalado"
              npx -W tsc --version
              npx -W typescript --version
              npx -W playwright install --with-deps
            '''
          } else {
            bat 'set NPM_CONFIG_PRODUCTION=false'
            bat 'set NODE_ENV=development'
            bat 'npm ci'

            bat '''
              IF EXIST node_modules\\typescript\\bin\\tsc.cmd (
                echo TypeScript ya está instalado.
              ) ELSE (
                echo Installing missing TypeScript...
                npm install --save-dev typescript
              )
            '''

            bat 'npm list typescript || echo "TypeScript no está instalado"'
            bat 'npx -W tsc --version'
            bat 'npx -W playwright install'
          }
        }
      }
    }

    stage('Debug TypeScript') {
      steps {
        script {
          if (isUnix()) {
            sh '''
              npm list typescript || echo "TS not found"
              npx tsc --version || echo "npx tsc failed"
            '''
          } else {
            bat '''
              npm list typescript || echo TS not found
              npx tsc --version || echo npx tsc failed
            '''
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

    stage('Prepare .env') {
      steps {
        script {
          withCredentials([
            usernamePassword(credentialsId: 'recargame-admin-creds',  usernameVariable: 'ADM_USER', passwordVariable: 'ADM_PASS'),
            usernamePassword(credentialsId: 'recargame-seller-creds', usernameVariable: 'SEL_USER', passwordVariable: 'SEL_PASS')
          ]) {
          if (isUnix()) {
            sh '''
              test -d "packages/$PROJECT" || { echo "No existe packages/$PROJECT"; exit 1; }
              rm -f packages/$PROJECT/.env
              cat > packages/$PROJECT/.env <<EOF
              BASE_URL_ADMIN=${params.BASE_URL_ADMIN}
              BASE_URL_SELLER=${params.BASE_URL_SELLER}
              USERNAME_ADMIN=$ADM_USER
              PASSWORD_ADMIN=$ADM_PASS
              USERNAME_SELLER=$SEL_USER
              PASSWORD_SELLER=$SEL_PASS
              EOF
            '''
          } else {
            bat '''
              if not exist "packages\\%PROJECT%" (
                echo No existe packages\\%PROJECT%
                exit /b 1
              )
              if exist "packages\\%PROJECT%\\.env" del /q "packages\\%PROJECT%\\.env"

                >  "packages\\%PROJECT%\\.env" echo BASE_URL_ADMIN=%BASE_URL_ADMIN%
                >> "packages\\%PROJECT%\\.env" echo BASE_URL_SELLER=%BASE_URL_SELLER%
                >> "packages\\%PROJECT%\\.env" echo USERNAME_ADMIN=%ADM_USER%
                >> "packages\\%PROJECT%\\.env" echo PASSWORD_ADMIN=%ADM_PASS%
                >> "packages\\%PROJECT%\\.env" echo USERNAME_SELLER=%SEL_USER%
                >> "packages\\%PROJECT%\\.env" echo PASSWORD_SELLER=%SEL_PASS%
            '''
          }
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
