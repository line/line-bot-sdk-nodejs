package line.bot.generator;

import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.responses.ApiResponse;
import org.openapitools.codegen.CliOption;
import org.openapitools.codegen.CodegenConfig;
import org.openapitools.codegen.CodegenDiscriminator;
import org.openapitools.codegen.CodegenModel;
import org.openapitools.codegen.CodegenOperation;
import org.openapitools.codegen.CodegenType;
import org.openapitools.codegen.SupportingFile;
import org.openapitools.codegen.languages.TypeScriptNodeClientCodegen;
import org.openapitools.codegen.model.ModelMap;
import org.openapitools.codegen.model.ModelsMap;
import org.openapitools.codegen.utils.ModelUtils;

import java.io.File;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

// https://github.com/OpenAPITools/openapi-generator/blob/master/modules/openapi-generator/src/main/java/org/openapitools/codegen/languages/AbstractTypeScriptClientCodegen.java
// https://github.com/OpenAPITools/openapi-generator/blob/master/modules/openapi-generator/src/main/java/org/openapitools/codegen/languages/TypeScriptNodeClientCodegen.java
public class LineBotSdkNodejsGeneratorGenerator extends TypeScriptNodeClientCodegen implements CodegenConfig {
    protected String outputTestFolder = "";
    public static final String TEST_OUTPUT = "testOutput";
    public static final String DEFAULT_TEST_FOLDER = "${project.build.directory}/generated-test-sources/openapi";
    protected String testFolder = "tests";

    /**
     * Configures the type of generator.
     *
     * @return the CodegenType for this generator
     * @see org.openapitools.codegen.CodegenType
     */
    public CodegenType getTag() {
        return CodegenType.OTHER;
    }

    /**
     * Configures a friendly name for the generator.  This will be used by the generator
     * to select the library with the -g flag.
     *
     * @return the friendly name for the generator
     */
    public String getName() {
        return "line-bot-sdk-nodejs-generator";
    }

    public String getHelp() {
        return "Generates a line-bot-sdk-nodejs-generator client library.";
    }

    public LineBotSdkNodejsGeneratorGenerator() {
        super();
        apiSuffix = "Client";
        embeddedTemplateDir = templateDir = "line-bot-sdk-nodejs-generator";
        typeMapping.put("file", "Blob");
        languageSpecificPrimitives.add("Blob");
        apiTestTemplateFiles.put("line-bot-sdk-nodejs-generator/api_test.pebble", ".spec.ts");
        cliOptions.add(CliOption.newString(TEST_OUTPUT, "Set output folder for models and APIs tests").defaultValue(DEFAULT_TEST_FOLDER));
        modelTemplateFiles.remove("model.mustache");
        modelTemplateFiles.put("line-bot-sdk-nodejs-generator/model.pebble", ".ts");
        apiTemplateFiles.remove("api-single.mustache");
        apiTemplateFiles.put("line-bot-sdk-nodejs-generator/api-single.pebble", ".ts");
    }

    @Override
    public void processOpts() {
        super.processOpts();
        supportingFiles.clear();

        if (additionalProperties.containsKey(TEST_OUTPUT)) {
            setOutputTestFolder(additionalProperties.get(TEST_OUTPUT).toString());
        }

        supportingFiles.add(new SupportingFile("line-bot-sdk-nodejs-generator/models.pebble", modelPackage().replace('.', File.separatorChar), "models.ts"));
        supportingFiles.add(new SupportingFile("line-bot-sdk-nodejs-generator/api-all.pebble", apiPackage().replace('.', File.separatorChar), "apis.ts"));
        supportingFiles.add(new SupportingFile("line-bot-sdk-nodejs-generator/api.pebble", getIndexDirectory(), "api.ts"));
    }


    @Override
    public String apiTestFileFolder() {
        return (outputTestFolder + File.separator + testFolder + File.separator + apiPackage().replace('.', File.separatorChar)).replace('/', File.separatorChar);
    }

    @Override
    public void setOutputDir(String dir) {
        super.setOutputDir(dir);
        if (this.outputTestFolder.isEmpty()) {
            setOutputTestFolder(dir);
        }
    }

    public void setOutputTestFolder(String outputTestFolder) {
        this.outputTestFolder = outputTestFolder;
    }

    @Override
    public Map<String, ModelsMap> postProcessAllModels(Map<String, ModelsMap> objs) {
        Map<String, ModelsMap> result = super.postProcessAllModels(objs);

        for (ModelsMap entry : result.values()) {
            for (ModelMap mo : entry.getModels()) {
                CodegenModel cm = mo.getModel();

                if (cm.getParentModel() != null) {
                    CodegenDiscriminator discriminator = cm.getParentModel().getDiscriminator();
                    Optional<String> mappingNameOptional = discriminator.getMappedModels().stream().filter(
                            it -> it.getModelName().equals(cm.name)
                    ).map(CodegenDiscriminator.MappedModel::getMappingName).findFirst();
                    mappingNameOptional.ifPresent(mappingName -> {
                        Map<String, Object> selector = new HashMap<>();
                        selector.put("propertyName", discriminator.getPropertyName());
                        selector.put("mappingName", mappingName);
                        cm.getVendorExtensions().put("x-selector", selector);
                    });
                }
            }
        }
        return result;
    }

    @Override
    protected void handleMethodResponse(Operation operation,
                                        Map<String, Schema> schemas,
                                        CodegenOperation op,
                                        ApiResponse methodResponse,
                                        Map<String, String> importMappings) {
        super.handleMethodResponse(operation, schemas, op, methodResponse, importMappings);

        // Compatibility with line-bot-sdk-nodejs's original implementation.
        if (op.isResponseFile) {
            op.returnType = "Readable";
        }
    }

    @Override
    public String getTypeDeclaration(Schema p) {
        if (ModelUtils.isFileSchema(p)) {
            // uploading
            return "Blob";
        } else if (ModelUtils.isBinarySchema(p)) {
            // downloading
            return "Buffer";
        }
        return super.getTypeDeclaration(p);
    }

    private String getIndexDirectory() {
        String indexPackage = modelPackage.substring(0, Math.max(0, modelPackage.lastIndexOf('.')));
        return indexPackage.replace('.', File.separatorChar);
    }
}
