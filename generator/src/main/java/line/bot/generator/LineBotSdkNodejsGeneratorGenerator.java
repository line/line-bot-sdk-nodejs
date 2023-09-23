package line.bot.generator;

import com.google.common.collect.ImmutableMap;
import com.samskivert.mustache.Mustache;
import org.openapitools.codegen.*;
import org.openapitools.codegen.model.*;
import org.openapitools.codegen.languages.*;
import io.swagger.models.properties.*;

import java.util.*;
import java.io.File;
import java.util.stream.Collectors;

// https://github.com/OpenAPITools/openapi-generator/blob/master/modules/openapi-generator/src/main/java/org/openapitools/codegen/languages/AbstractTypeScriptClientCodegen.java
// https://github.com/OpenAPITools/openapi-generator/blob/master/modules/openapi-generator/src/main/java/org/openapitools/codegen/languages/TypeScriptNodeClientCodegen.java
public class LineBotSdkNodejsGeneratorGenerator extends TypeScriptNodeClientCodegen implements CodegenConfig {

  /**
   * Configures the type of generator.
   *
   * @return  the CodegenType for this generator
   * @see     org.openapitools.codegen.CodegenType
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
  public OperationsMap postProcessOperationsWithModels(OperationsMap objs, List<ModelMap> allModels) {
    return super.postProcessOperationsWithModels(objs, allModels);
  }

  public String getHelp() {
    return "Generates a line-bot-sdk-nodejs-generator client library.";
  }

  public LineBotSdkNodejsGeneratorGenerator() {
    super();
    apiSuffix = "Client";
    embeddedTemplateDir = templateDir = "line-bot-sdk-nodejs-generator";
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
  protected ImmutableMap.Builder<String, Mustache.Lambda> addMustacheLambdas() {
    return super.addMustacheLambdas()
      .put("endpoint", (fragment, writer) -> {
        String text = fragment.execute();
        writer.write(this.getEndpointFromClassName(text));
      });
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
}
