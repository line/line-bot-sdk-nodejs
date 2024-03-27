import os
import subprocess
import sys


def run_command(command):
    print(command)
    proc = subprocess.run(command, shell=True, text=True, capture_output=True)

    if len(proc.stdout) != 0:
        print("\n\nSTDOUT:\n\n")
        print(proc.stdout)

    if len(proc.stderr) != 0:
        print("\n\nSTDERR:\n\n")
        print(proc.stderr)
        print("\n\n")

    if proc.returncode != 0:
        print(f"\n\nCommand '{command}' returned non-zero exit status {proc.returncode}.")
        sys.exit(1)

    return proc.stdout.strip()


def generate_clients():
    components = [
        "shop.yml",
        "channel-access-token.yml",
        "insight.yml",
        "liff.yml",
        "manage-audience.yml",
        "module-attach.yml",
        "module.yml",
        "messaging-api.yml",
    ]

    for sourceYaml in components:
        output_path = 'lib/' + sourceYaml.replace('.yml', '')

        run_command(f'rm -rf {output_path}/')

        command = f'''java \\
                    -cp ./generator/target/line-bot-sdk-nodejs-generator-openapi-generator-1.0.0.jar \\
                    org.openapitools.codegen.OpenAPIGenerator \\
                    generate \\
                    -e pebble \\
                    -g line-bot-sdk-nodejs-generator \\
                    --enable-post-process-file \\
                    -o {output_path} \\
                    -i line-openapi/{sourceYaml} \\
                  '''
        run_command(command)


def generate_webhook():
    source_yaml = "webhook.yml"
    output_path = 'lib/' + source_yaml.replace('.yml', '')

    run_command(f'rm -rf {output_path}/')

    command = f'''java \\
                    -cp ./generator/target/line-bot-sdk-nodejs-generator-openapi-generator-1.0.0.jar \\
                    org.openapitools.codegen.OpenAPIGenerator \\
                    generate \\
                    --global-property apiTest=false,modelDocs=false,apiDocs=false \\
                    -e pebble \\
                    --enable-post-process-file \\
                    -g line-bot-sdk-nodejs-generator \\
                    --template-dir ./generator/src/main/resources/line-bot-sdk-nodejs-generator \\
                    -o {output_path} \\
                    -i line-openapi/{source_yaml} \\
                  '''
    run_command(command)
    run_command(f'rm -rf lib/webhook/api/')
    run_command(f'rm -rf lib/webhook/tests/')

    with open('lib/webhook/api.ts', 'w') as wfp:
        wfp.write("""export * from './model/models.js';""")


def main():
    os.chdir("generator")
    run_command('mvn package -DskipTests=true')
    os.chdir("..")

    generate_clients()
    generate_webhook()

    run_command('npm run format')


if __name__ == "__main__":
    main()
