package line.bot.generator.pebble;

import io.pebbletemplates.pebble.extension.AbstractExtension;
import io.pebbletemplates.pebble.extension.Function;
import line.bot.generator.pebble.EndpointFunction;

import java.util.HashMap;
import java.util.Map;

public class MyPebbleExtension extends AbstractExtension {
    @Override
    public Map<String, Function> getFunctions() {
        HashMap<String, Function> map = new HashMap<>();
        map.put("endpoint", new EndpointFunction());
        return map;
    }
}
