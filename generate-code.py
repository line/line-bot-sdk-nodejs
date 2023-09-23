import os
import subprocess
import sys

def run_command(command):
    print(command)
    proc = subprocess.run(command, shell=True, text=True, capture_output=True)

    if len(proc.stderr) != 0:
        print("\n\nSTDERR:\n\n")
        print(proc.stderr)
        print("\n\n")

    if len(proc.stdout) != 0:
        print("\n\nSTDOUT:\n\n")
        print(proc.stdout)

    if proc.returncode != 0:
        print(f"\n\nCommand '{command}' returned non-zero exit status {proc.returncode}.")
        sys.exit(1)

    return proc.stdout.strip()


def main():
    os.chdir("generator")
    run_command('mvn package -DskipTests=true')
    os.chdir("..")

    components = [
        {"sourceYaml": "messaging-api.yml"},
        {"sourceYaml": "channel-access-token.yml"},
        {"sourceYaml": "insight.yml"},
        {"sourceYaml": "liff.yml"},
        {"sourceYaml": "manage-audience.yml"},
        {"sourceYaml": "module-attach.yml"},
        {"sourceYaml": "module.yml"},
        {"sourceYaml": "shop.yml"},
    ]

    for component in components:
        sourceYaml = component['sourceYaml']
        outputPath = 'lib/' + sourceYaml.replace('.yml', '')

        run_command(f'rm -rf {outputPath}/')

        command = f'''java \\
                    -cp ./tools/openapi-generator-cli.jar:./generator/target/line-bot-sdk-nodejs-generator-openapi-generator-1.0.0.jar \\
                    org.openapitools.codegen.OpenAPIGenerator \\
                    generate \\
                    -g line-bot-sdk-nodejs-generator \\
                    -o {outputPath} \\
                    -i line-openapi/{sourceYaml} \\
                  '''
        # --global-property modelDocs=false \ \
          # --additional-properties=packageVersion={package_version}
        run_command(command)

if __name__ == "__main__":
    main()
