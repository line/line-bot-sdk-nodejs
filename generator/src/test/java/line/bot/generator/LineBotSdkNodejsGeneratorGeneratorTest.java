package line.bot.generator;

import org.junit.jupiter.api.Test;
import org.openapitools.codegen.ClientOptInput;
import org.openapitools.codegen.DefaultGenerator;
import org.openapitools.codegen.config.CodegenConfigurator;

import static org.junit.jupiter.api.Assertions.assertEquals;


/***
 * This test allows you to easily launch your code generation software under a debugger.
 * Then run this test under debug mode.  You will be able to step through your java code
 * and then see the results in the out directory.
 */
public class LineBotSdkNodejsGeneratorGeneratorTest {
    @Test
    public void launchCodeGenerator() {
        // to understand how the 'openapi-generator-cli' module is using 'CodegenConfigurator', have a look at the 'Generate' class:
        // https://github.com/OpenAPITools/openapi-generator/blob/master/modules/openapi-generator-cli/src/main/java/org/openapitools/codegen/cmd/Generate.java
        final CodegenConfigurator configurator = new CodegenConfigurator()
                .setGeneratorName("line-bot-sdk-nodejs-generator") // use this codegen library
                .setInputSpec("../line-openapi/shop.yml") // sample OpenAPI file
                .setOutputDir("out/line-bot-sdk-nodejs-generator"); // output directory

        final ClientOptInput clientOptInput = configurator.toClientOptInput();
        DefaultGenerator generator = new DefaultGenerator();
        generator.opts(clientOptInput).generate();
    }

    @Test
    public void pathReplacer() {
        String s = LineBotSdkNodejsGeneratorGenerator.pathReplacer("/foo/{bar}/baz/{boz}");
        assertEquals(".replace(\"{bar}\", String(bar)).replace(\"{boz}\", String(boz))", s);
    }
}
