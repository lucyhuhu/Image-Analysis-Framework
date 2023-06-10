/**
 * Unsplash Data Plugin
 * 
 * This data plugin will use the Unsplash API, found at
 * https://unsplash.com/developers, and will randomly return one image
 * from the dataset. The front-end will provide that one image.
 */

package edu.cmu.cs214.hw6.plugin;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import edu.cmu.cs214.hw6.framework.DataPluginBackEnd;
import fi.iki.elonen.NanoHTTPD.IHTTPSession;

public class Unsplash implements DataPluginBackEnd {
    private final String pluginName = "Unsplash";

    public String[] getImages(IHTTPSession session){
        Map<String, String> files = new HashMap<String, String>();
        try {
            session.parseBody(files);
            Map<String, String> params = session.getParms();
            String url = params.get("image");

            URL imageUrl = new URL(url);
            URLConnection ucon = imageUrl.openConnection();
            InputStream is = ucon.getInputStream();
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            byte[] buffer = new byte[1024];
            int read = 0;
            while ((read = is.read(buffer, 0, buffer.length)) != -1) {
                baos.write(buffer, 0, read);
            }
            baos.flush();
            String base64 = Base64.getEncoder().withoutPadding().encodeToString(baos.toByteArray());
            String[] res = {base64};
            return res;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public String getName(){
        return this.pluginName;
    }
}
