package line.bot.generator.pebble;

import io.pebbletemplates.pebble.extension.Function;
import io.pebbletemplates.pebble.template.EvaluationContext;
import io.pebbletemplates.pebble.template.PebbleTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Map;

public class EndpointFunction implements Function {
    @Override
    public List<String> getArgumentNames() {
        return Collections.singletonList("className");
    }

    @Override
    public Object execute(Map<String, Object> args, PebbleTemplate self, EvaluationContext context, int lineNumber) {
        String className = (String) args.get("className");
        if (className.equals("LineModuleAttachClient")) {
            return "https://manager.line.biz";
        } else if (className.contains("Blob")) {
            return "https://api-data.line.me";
        } else {
            return "https://api.line.me";
        }
    }
}
