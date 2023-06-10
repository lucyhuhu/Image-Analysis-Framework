package edu.cmu.cs214.hw6.framework;

import java.util.HashMap;
import java.util.Map;

import fi.iki.elonen.NanoHTTPD.IHTTPSession;

import org.json.JSONArray;
import org.json.JSONObject;

public class DataFrameworkImpl {
    private Map<String, DataPluginBackEnd> registeredPlugins;
    private DataPluginBackEnd activePlugin;
    private String[] prevImages;

    public DataFrameworkImpl() {
        registeredPlugins = new HashMap<String, DataPluginBackEnd>();
    }

    /**
     * Register a backend data plugin with the framework, triggering
     * the plugin's onRegister call.
     * @param plugin The plugin to register.
     */
    public void registerPlugin(DataPluginBackEnd plugin) {
        registeredPlugins.put(plugin.getName(), plugin);
    }

    /**
     * Set the active backend data plugin to the one with the specified name.
     * @param name The name of the plugin to set active.
     * @return Whether or not the plugin was successfully switched to.
     */
    public boolean setActivePlugin(String name) {
        boolean hasPlugin = registeredPlugins.containsKey(name);
        if (hasPlugin) {
            activePlugin = registeredPlugins.get(name);
        }
        return hasPlugin;
    }

    /**
     * @return The active backend data plugin.
     */
    public DataPluginBackEnd getActivePlugin() {
        return this.activePlugin;
    }

    /**
     * Get the most recently parsed images.
     * @return The most recently parsed images.
     */
    public String[] getImageStrings() {
        return this.prevImages;
    }

    /**
     * Produce annotations for images based on the current active plugin and form data
     * passed from the front-end through the HTTP session. One set of annotations
     * are produced for each image.
     * @param session The HTTP session associated with the front-end call.
     * @return A JSON array, consisting of one set of annotations per image.
     */
    public JSONArray getImageAnnotations(IHTTPSession session) {
        this.prevImages = activePlugin.getImages(session);

        JSONArray annotationsJson = new JSONArray();
        int i = 0;
        for (String img : this.prevImages) {
            byte[] imageBytes = CloudVision.base64ToByteArray(img);
            JSONObject annotations = new JSONObject();
            try {
                annotations = CloudVision.getAnnotations(imageBytes);
                annotationsJson.put(annotations);
            } catch (Exception e) {
                annotations.put("image" + i, "Exception encountered");
                annotationsJson.put(annotations);
            }
            i++;
        }
        return annotationsJson;
    }
}
