import os
import subprocess
import sys

def run_command(command):
    proc = subprocess.run(command, shell=True, text=True, capture_output=True)

    if len(proc.stderr) != 0:
        print("\n\nSTDERR:\n\n")
        print(proc.stderr)
        print("\n\n")

    if proc.returncode != 0:
        print("\n\nSTDOUT:\n\n")
        print(proc.stdout)
        print(f"\n\nCommand '{command}' returned non-zero exit status {proc.returncode}.")
        sys.exit(1)

    return proc.stdout.strip()


def main():
    components = [
        {"sourceYaml": "channel-access-token.yml", "modelPackage": "linebot.v3.oauth"},
        {"sourceYaml": "insight.yml", "modelPackage": "linebot.v3.insight"},
        {"sourceYaml": "liff.yml", "modelPackage": "linebot.v3.liff"},
        {"sourceYaml": "manage-audience.yml", "modelPackage": "linebot.v3.audience"},
        {"sourceYaml": "messaging-api.yml", "modelPackage": "linebot.v3.messaging"},
        {"sourceYaml": "module-attach.yml", "modelPackage": "linebot.v3.moduleattach"},
        {"sourceYaml": "module.yml", "modelPackage": "linebot.v3.module"},
        {"sourceYaml": "shop.yml", "modelPackage": "linebot.v3.shop"},
    ]

    for component in components:
        sourceYaml = component['sourceYaml']
        modelPackage = component['modelPackage']
        outputPath = 'lib/' + sourceYaml.replace('.yml', '')

        # run_command(f'rm -rf {modelPackagePath}/')

        command = f'''java \\
                    -cp ./tools/openapi-generator-cli.jar \\
                    org.openapitools.codegen.OpenAPIGenerator \\
                    generate \\
                    -g typescript-node \\
                    -o {outputPath} \\
                    -i line-openapi/{sourceYaml} \\
                  '''
        # --global-property modelDocs=false \ \
          # --additional-properties=packageVersion={package_version}
        run_command(command)

if __name__ == "__main__":
    main()
