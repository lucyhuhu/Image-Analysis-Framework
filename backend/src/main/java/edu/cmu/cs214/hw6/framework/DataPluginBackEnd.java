package edu.cmu.cs214.hw6.framework;

import fi.iki.elonen.NanoHTTPD.IHTTPSession;

public interface DataPluginBackEnd {
    /**
     * Obtains the base64 strings of the images based on the corresponding front-end data plugin
     * with the same name, and the form data that was sent through the provided HTTP session.
     * @param session The HTTP session to obtain images from
     * @return A list of base64 strings, each string being one image.
     */
    String[] getImages(IHTTPSession session);

    /**
     * @return The name of the data plugin, which should match the name of the corresponding
     * front-end data plugin.
     */
    String getName();
}
