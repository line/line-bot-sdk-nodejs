package line.bot.generator;

import com.google.common.collect.ImmutableMap;
import com.samskivert.mustache.Mustache;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.responses.ApiResponse;
import org.openapitools.codegen.CliOption;
import org.openapitools.codegen.CodegenConfig;
import org.openapitools.codegen.CodegenDiscriminator;
import org.openapitools.codegen.CodegenModel;
import org.openapitools.codegen.CodegenOperation;
import org.openapitools.codegen.CodegenParameter;
import org.openapitools.codegen.CodegenType;
import org.openapitools.codegen.languages.TypeScriptNodeClientCodegen;
import org.openapitools.codegen.model.ModelMap;
import org.openapitools.codegen.model.ModelsMap;
import org.openapitools.codegen.model.OperationsMap;
import org.openapitools.codegen.utils.ModelUtils;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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

    /**
     * Provides an opportunity to inspect and modify operation data before the code is generated.
     */
    @Override
    public OperationsMap postProcessOperationsWithModels(OperationsMap operations, List<ModelMap> allModels) {
        OperationsMap objs = super.postProcessOperationsWithModels(operations, allModels);

        for (CodegenOperation op : objs.getOperations().getOperation()) {
            if (op.getHasBodyParam() && op.bodyParam.isFile) {
                op.vendorExtensions.put("isBinary", true);
            }
            if (op.isResponseFile) {
                op.vendorExtensions.put("isStream", true);
            }
//      for (CodegenParameter headerParam : op.headerParams) {
//        headerParam.;
//      }
//      op.getHasQueryParams()
//      op.getHasFormParams()
//      op.getHasBodyParam()
//      for (CodegenParameter formParam : op.formParams) {
//        formParam.isFile
//      }
//      if (op.getHasFormParams())
            for (CodegenParameter allParam : op.allParams) {
//                allParam.isModel
//                allParam.isNumber
//                allParam.isLong
//                allParam.isEnum
            }
        }

        return operations;
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
        apiTestTemplateFiles.put("api_test.mustache", ".spec.ts");
        cliOptions.add(CliOption.newString(TEST_OUTPUT, "Set output folder for models and APIs tests").defaultValue(DEFAULT_TEST_FOLDER));
    }

    @Override
    public void processOpts() {
        super.processOpts();
        if (additionalProperties.containsKey(TEST_OUTPUT)) {
            setOutputTestFolder(additionalProperties.get(TEST_OUTPUT).toString());
        }
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
    protected ImmutableMap.Builder<String, Mustache.Lambda> addMustacheLambdas() {
        return super.addMustacheLambdas()
                .put("endpoint", (fragment, writer) -> {
                    String text = fragment.execute();
                    writer.write(this.getEndpointFromClassName(text));
                })
                .put("lower", (fragment, writer) -> {
                    String text = fragment.execute();
                    writer.write(text.toLowerCase());
                })
                .put("pathReplace", ((fragment, writer) -> {
                    String text = fragment.execute();
                    writer.write(pathReplacer(text, true));
                }))
                .put("pathReplaceDUMMY", ((fragment, writer) -> {
                    String text = fragment.execute();
                    writer.write(pathReplacer(text, false));
                }));
    }

    private String getEndpointFromClassName(String className) {
        if (className.equals("LineModuleAttachClient")) {
            return "https://manager.line.biz";
        } else if (className.contains("Blob")) {
            return "https://api-data.line.me";
        } else {
            return "https://api.line.me";
        }
    }

    public static String pathReplacer(String template, boolean useVariable) {
        Pattern pattern = Pattern.compile("\\{(\\w+)\\}");
        Matcher matcher = pattern.matcher(template);

        StringBuilder codeBuilder = new StringBuilder();
        while (matcher.find()) {
            String key = matcher.group(1);
            codeBuilder.append(".replace(\"{").append(key).append("}\", String(");
            if (useVariable) {
                codeBuilder.append(key);
            } else {
                codeBuilder.append("\"DUMMY\"");
            }
            codeBuilder.append("))");
        }

        return codeBuilder.toString();
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
}
