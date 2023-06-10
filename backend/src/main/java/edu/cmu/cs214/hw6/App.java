package edu.cmu.cs214.hw6;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.ServiceLoader;

import org.json.JSONArray;
import org.json.JSONObject;

import edu.cmu.cs214.hw6.framework.DataFrameworkImpl;
import edu.cmu.cs214.hw6.framework.DataPluginBackEnd;
import fi.iki.elonen.NanoHTTPD;

public class App extends NanoHTTPD {
    private static final int PORT = 8080;
    private Map<String, DataPluginBackEnd> dataPlugins;
    private DataFrameworkImpl framework;

    public static void main(String[] args) throws Exception {
        try {
            new App();
        } catch (IOException ioe) {
            System.err.println("Couldn't start server:\n" + ioe);
        }
    }

    public App() throws IOException {
        super(PORT);
        this.framework = new DataFrameworkImpl();
        this.dataPlugins = loadPlugins();
        for (DataPluginBackEnd p : dataPlugins.values()) {
            framework.registerPlugin(p);
        }

        start(NanoHTTPD.SOCKET_READ_TIMEOUT, false);
        System.out.println("\nRunning!\n");
    }

    @Override
    public Response serve(IHTTPSession session) {
        String uri = session.getUri();
        JSONObject response = new JSONObject();

        try {
            if (uri.equals("/plugin")) {
                Map<String, String> files = new HashMap<String, String>();
                session.parseBody(files);
                String requestBody = files.get("postData");
                JSONObject requestBodyJson = new JSONObject(requestBody);
                String pluginName = requestBodyJson.getString("name");
                boolean success = this.framework.setActivePlugin(pluginName);
                response.put("success", success);
            } else if (uri.equals("/image")) {
                JSONArray annotationsJson = this.framework.getImageAnnotations(session);
                String[] imagesBase64 = this.framework.getImageStrings();

                response.put("annotations", annotationsJson);
                response.put("imagesources", imagesBase64);
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("An exception has occurred");
        }

        return newFixedLengthResponse(response.toString());
    }

    private static Map<String, DataPluginBackEnd> loadPlugins() {
        ServiceLoader<DataPluginBackEnd> plugins = ServiceLoader.load(DataPluginBackEnd.class);
        Map<String, DataPluginBackEnd> result = new HashMap<String, DataPluginBackEnd>();
        for (DataPluginBackEnd plugin : plugins) {
            System.out.println("Loaded plugin " + plugin.getName());
            result.put(plugin.getName(), plugin);
        }
        return result;
    }
}
