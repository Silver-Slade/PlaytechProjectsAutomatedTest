import java.text.Normalizer

@NonCPS
String slugify(String s) {
  def n = Normalizer.normalize(s, Normalizer.Form.NFD)
  n = n.replaceAll('\\p{InCombiningDiacriticalMarks}+', '') 
  n = n.replaceAll('[^A-Za-z0-9]+', '-').toLowerCase()
  n = n.replaceAll('^-+|-+$', '')
  return n
}

pipeline {
  agent any

  parameters {
    string(name: 'BRANCH',  defaultValue: 'main', description: 'Rama del repositorio a ejecutar')
    // Future implementation: choice(name: 'SUITE', choices: ['all','admin','seller'], description: 'Sub-suite opcional')
  }

  options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '20'))
    timeout(time: 30, unit: 'MINUTES')
  }

  tools { 
    nodejs 'node-22' 
  }

  stages {
     stage('Init project from job name') {
      steps {
        script {
          def jobName = env.JOB_BASE_NAME ?: 'unknown'
          def jobSlug = slugify(jobName)

          def JOB_TO_PROJECT = [
            'recargame-qa-automated-test' : 'recargame',
            'directory-qa-automated-test' : 'directory'
          ]

          def projectKey = JOB_TO_PROJECT[jobSlug]
          if (!projectKey) {
            error "Job '${jobName}' (slug '${jobSlug}') no está mapeado a un proyecto. Añádelo en JOB_TO_PROJECT."
          }

          env.PROJECT = projectKey
          echo "Resolved PROJECT = ${env.PROJECT} (from job '${jobName}')"
        }
      }
    }

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
              set -e
              echo "[1/7] node -v"
              node -v
              echo "[2/7] npm -v"
              npm -v

              echo "[3/7] npm ci"
              export NPM_CONFIG_PRODUCTION=false
              export NODE_ENV=development
              npm ci  --no-audit --fund=false

              echo "[4/7] Ensure TypeScript"
              if [ ! -f node_modules/typescript/bin/tsc ]; then
                echo "TypeScript no encontrado, instalando..."
                npm install --save-dev typescript
              else
                echo "TypeScript ya está instalado."
              fi
              npx -y -W tsc --version || true
              npm list typescript || echo "TypeScript no está instalado"

              echo "[5/7] Set Playwright browser cache path"
              export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
              mkdir -p "$PLAYWRIGHT_BROWSERS_PATH"

              echo "[6/7] Playwright CLI version"
              npx -y -W playwright@1.55.0 --version || true

              npx -W tsc --version
              npx -W typescript --version
              npx -W playwright install --with-deps
            '''
          } else {
            withEnv([
              'NPM_CONFIG_PRODUCTION=false',
              'NODE_ENV=development',
              'PLAYWRIGHT_BROWSERS_PATH=C:\\playwright-browsers'
            ]) {
              // [1] versiones
              bat 'echo [1/10] node -v'
              bat 'node -v'
              bat 'echo [1/10] npm -v'
              bat 'npm -v'

              // [2] npm ci (sin auditoría ni fund para evitar prompts/red extra)
              bat 'echo [2/10] npm ci'
              bat 'npm ci --no-audit --fund=false'

              // [3] asegurar TypeScript
              bat 'echo [3/10] Ensure TypeScript'
              bat 'IF EXIST node_modules\\typescript\\bin\\tsc.cmd ( echo TS OK ) ELSE ( npm install --save-dev typescript )'
              bat 'npx -y -W tsc --version'

              // [4] preparar cache de browsers (persistente entre builds)
              bat 'echo [4/10] Set Playwright browser cache path'
              bat 'if not exist "C:\\playwright-browsers" mkdir "C:\\playwright-browsers"'

              // [5] verificar versión de Playwright CLI
              bat 'echo [5/10] Playwright CLI version'
              bat 'npx -y -W playwright@1.55.0 --version'

              // [6] instalar browsers (solo chromium para rapidez; ajusta si necesitas más)
              bat 'echo [6/10] Install browsers (chromium only)'
              bat 'npx -y -W playwright@1.55.0 install chromium'

              // [7] done
              bat 'echo [7/10] Done install stage'
            }
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
          if (isUnix()) {
            switch (env.PROJECT) {
              case 'recargame':
              
                withCredentials([
                  usernamePassword(credentialsId: 'recargame-admin-creds',  usernameVariable: 'ADM_USER', passwordVariable: 'ADM_PASS'),
                  usernamePassword(credentialsId: 'recargame-seller-creds', usernameVariable: 'SEL_USER', passwordVariable: 'SEL_PASS')
                ]) {
                  sh """
                    test -d "packages/$PROJECT" || { echo "No existe packages/$PROJECT"; exit 1; }
                    rm -f packages/$PROJECT/.env
                    cat > packages/$PROJECT/.env <<EOF
                    BASE_URL_ADMIN=http://pruebas.recargameonline.co/Recargame/index.php
                    BASE_URL_SELLER=http://pruebas.recargameonline.co/RecargamePos/index.php
                    USERNAME_ADMIN=$ADM_USER
                    PASSWORD_ADMIN=$ADM_PASS
                    USERNAME_SELLER=$SEL_USER
                    PASSWORD_SELLER=$SEL_PASS
                    EOF
                  """
                }
                break
              case 'directory':
                withCredentials([
                  usernamePassword(credentialsId: 'directory-admin-creds',     usernameVariable: 'ADMIN_USER',  passwordVariable: 'ADMIN_PASS'),
                  usernamePassword(credentialsId: 'directory-leader-creds',    usernameVariable: 'LEADER_USER', passwordVariable: 'LEADER_PASS'),
                  usernamePassword(credentialsId: 'directory-dataentry-creds', usernameVariable: 'DATA_USER',   passwordVariable: 'DATA_PASS')
                ]) {
                  sh """
                    test -d "packages/$PROJECT" || { echo "No existe packages/$PROJECT"; exit 1; }
                    rm -f packages/$PROJECT/.env
                    cat > "packages/$PROJECT/.env" <<EOF
                    BASE_URL=https://qa-directory.playtechla.com.co/
                    USERNAME_ADMIN=$ADMIN_USER
                    PASSWORD_ADMIN=$ADMIN_PASS
                    USERNAME_LEADER=$LEADER_USER
                    PASSWORD_LEADER=$LEADER_PASS
                    USERNAME_DATAENTRY=$DATA_USER
                    PASSWORD_DATAENTRY=$DATA_PASS
                    EOF
                  """
                }
                break
              default:
                error "Proyecto no soportado: '${env.PROJECT}'"
            }
          } else {
            switch (env.PROJECT) {
              case 'recargame':
                withCredentials([
                  usernamePassword(credentialsId: 'recargame-admin-creds',  usernameVariable: 'ADM_USER', passwordVariable: 'ADM_PASS'),
                  usernamePassword(credentialsId: 'recargame-seller-creds', usernameVariable: 'SEL_USER', passwordVariable: 'SEL_PASS')
                ]) {
                  bat """
                    if not exist "packages\\%PROJECT%" (
                      echo No existe packages\\%PROJECT%
                      exit /b 1
                    )
                    if exist "packages\\%PROJECT%\\.env" del /q "packages\\%PROJECT%\\.env"

                    >  "packages\\%PROJECT%\\.env" echo BASE_URL_ADMIN=http://pruebas.recargameonline.co/Recargame/index.php
                    >> "packages\\%PROJECT%\\.env" echo BASE_URL_SELLER=http://pruebas.recargameonline.co/RecargamePos/index.php
                    >> "packages\\%PROJECT%\\.env" echo USERNAME_ADMIN=%ADM_USER%
                    >> "packages\\%PROJECT%\\.env" echo PASSWORD_ADMIN=%ADM_PASS%
                    >> "packages\\%PROJECT%\\.env" echo USERNAME_SELLER=%SELL_USER%
                    >> "packages\\%PROJECT%\\.env" echo PASSWORD_SELLER=%SELL_PASS%
                  """
                }
                break
              case 'directory':
                withCredentials([
                  usernamePassword(credentialsId: 'directory-admin-creds',     usernameVariable: 'ADMIN_USER',  passwordVariable: 'ADMIN_PASS'),
                  usernamePassword(credentialsId: 'directory-leader-creds',    usernameVariable: 'LEADER_USER', passwordVariable: 'LEADER_PASS'),
                  usernamePassword(credentialsId: 'directory-dataentry-creds', usernameVariable: 'DATA_USER',   passwordVariable: 'DATA_PASS')
                ]) {
                  bat """
                    if not exist "packages\\%PROJECT%" (
                      echo No existe packages\\%PROJECT%
                      exit /b 1
                    )
                    if exist "packages\\%PROJECT%\\.env" del /q "packages\\%PROJECT%\\.env"

                    >  "packages\\%PROJECT%\\.env" echo BASE_URL=https://qa-directory.playtechla.com.co/
                    >> "packages\\%PROJECT%\\.env" echo USERNAME_ADMIN=%ADMIN_USER%
                    >> "packages\\%PROJECT%\\.env" echo PASSWORD_ADMIN=%ADMIN_PASS%
                    >> "packages\\%PROJECT%\\.env" echo USERNAME_LEADER=%LEADER_USER%
                    >> "packages\\%PROJECT%\\.env" echo PASSWORD_LEADER=%LEADER_PASS%
                    >> "packages\\%PROJECT%\\.env" echo USERNAME_DATAENTRY=%DATA_USER%
                    >> "packages\\%PROJECT%\\.env" echo PASSWORD_DATAENTRY=%DATA_PASS%
                  """
                }
                break
              default:
                error "Proyecto no soportado: '${env.PROJECT}'"
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
                --config=packages/$PROJECT/playwright.config.ts \
                --reporter=junit,html \
                --output=packages/$PROJECT/test-results
            """
          } else {
            bat """
              npx -W playwright test ^
                --config=packages/%PROJECT%/playwright.config.ts ^
                --reporter=junit,html ^
                --output=packages/%PROJECT%/test-results
            """
          }
        }
      }
      post {
        always {
          junit allowEmptyResults: true, testResults: "packages/${params.PROJECT}/test-results/*.xml"
          publishHTML(target: [
            reportDir: "packages/${env.PROJECT}/playwright-report",
            reportFiles: 'index.html',
            reportName: "Playwright Report (${env.PROJECT})",
            keepAll: true,
            alwaysLinkToLastBuild: true,
            allowMissing: true
          ])
          archiveArtifacts artifacts: "packages/${env.PROJECT}/test-results/**, packages/${env.PROJECT}/playwright-report/**",
                           fingerprint: true, allowEmptyArchive: true
        }
      }
    }
  }

  post { always { cleanWs(deleteDirs: true, notFailBuild: true) } }
}
